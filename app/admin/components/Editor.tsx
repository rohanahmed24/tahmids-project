"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    Image as ImageIcon,
    Link as LinkIcon,
    Eye,
    Edit3,
    Save,
    ArrowLeft,
    Video,
    UploadCloud,
    Bold,
    Italic,
    List,
    Quote,
    Code,
    Maximize2,
    Minimize2,
    Loader2,
    Clock,
    AlignLeft
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { uploadImage } from "@/actions/media";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface EditorProps {
    initialData?: {
        title: string;
        slug: string;
        category: string;
        content: string;
        coverImage?: string;
        videoUrl?: string;
        subtitle?: string;
        topic_slug?: string;
        accent_color?: string;
        featured?: boolean;
    };
    action: (formData: FormData) => Promise<void>;
}

export default function Editor({ initialData, action }: EditorProps) {
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
    const [category, setCategory] = useState(initialData?.category || "Technology");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(initialData?.coverImage || null);

    // Premium Features State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [wordCount, setWordCount] = useState(0);
    const [readTime, setReadTime] = useState(0);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Auto-save Recovery
    useEffect(() => {
        if (!initialData) { // Only checking for new posts to avoid overwriting edits
            const savedDraft = localStorage.getItem("draft_new_post");
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    // Ask user? Or just restore? Let's notify.
                    toast.info("Restored unpublish draft", {
                        action: {
                            label: "Undo",
                            onClick: () => {
                                setTitle("");
                                setContent("");
                            }
                        }
                    });
                    setTitle(parsed.title || "");
                    setContent(parsed.content || "");
                } catch (e) {
                    console.error("Failed to parse draft", e);
                }
            }
        }
    }, [initialData]);

    // Live Stats & Auto-Save Debouncer
    useEffect(() => {
        const words = content.trim().split(/\s+/).length;
        setWordCount(content ? words : 0);
        setReadTime(Math.ceil(words / 200));

        const timeoutId = setTimeout(() => {
            if (!initialData) { // Only auto-save new posts for now to be safe
                localStorage.setItem("draft_new_post", JSON.stringify({ title, content }));
                setLastSaved(new Date());
                setIsAutoSaving(true);
                setTimeout(() => setIsAutoSaving(false), 1000);
            }
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [content, title, initialData]);

    // Auto-generate slug
    useEffect(() => {
        if (!initialData && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setSlug(generatedSlug);
        }
    }, [title, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCoverImage(e.target.value);
        setPreviewImage(e.target.value);
    };

    const insertAtCursor = (textToInsert: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousContent = content;

        const newContent = previousContent.substring(0, start) + textToInsert + previousContent.substring(end);
        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        }, 0);
    };

    const handleFormat = (type: string) => {
        const formats: Record<string, string> = {
            bold: "**Bold Text**",
            italic: "*Italic Text*",
            list: "\n- List Item",
            quote: "\n> Quote",
            code: "\n```\nCode Block\n```",
            link: "[Link Title](url)"
        };
        insertAtCursor(formats[type]);
    };

    const handleUploadFile = async (file: File) => {
        const id = toast.loading("Uploading image...");

        const placeholder = `![Uploading ${file.name}...]()`;
        insertAtCursor(placeholder);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadImage(formData);
            if (result.success && result.url) {
                setContent(prev => prev.replace(placeholder, `![Image](${result.url})`));
                toast.success("Image uploaded", { id });
            } else {
                setContent(prev => prev.replace(placeholder, ""));
                toast.error("Upload failed", { id });
            }
        } catch {
            setContent(prev => prev.replace(placeholder, ""));
            toast.error("Upload failed", { id });
        }
    };

    const handleBodyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUploadFile(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith("image/")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    await handleUploadFile(file);
                }
                return;
            }
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith("image/")) {
            await handleUploadFile(files[0]);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        const id = toast.loading("Publishing article...");
        try {
            await action(formData);
            toast.success("Published successfully!", { id });
            if (!initialData) {
                localStorage.removeItem("draft_new_post");
            }
        } catch (error) {
            console.error("Submission failed", error);
            toast.error("Failed to save article", { id });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className={`transition-all duration-500 ${isFocusMode ? 'fixed inset-0 z-[100] bg-gray-950 p-8 overflow-y-auto' : 'space-y-8'}`}>
            {/* Header Actions */}
            <div className={`flex items-center justify-between sticky top-4 z-50 bg-gray-950/80 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-xl transition-transform ${isFocusMode ? 'max-w-4xl mx-auto w-full' : ''}`}>
                <div className="flex items-center gap-4">
                    {!isFocusMode && (
                        <a href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </a>
                    )}
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        {isAutoSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                        {lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Unsaved"}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${isFocusMode ? 'bg-purple-500/20 text-purple-400' : ''}`}
                        title="Toggle Focus Mode"
                    >
                        {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                        <button
                            type="button"
                            onClick={() => setActiveTab("write")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "write" ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            <Edit3 className="w-4 h-4" /> Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "preview" ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            <Eye className="w-4 h-4" /> Preview
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isFocusMode ? 'max-w-4xl mx-auto pt-8' : ''}`}>
                {/* Main Editor Area */}
                <div className={`lg:col-span-2 space-y-6 transition-all`}>
                    {/* Title & Slug */}
                    <div className="space-y-4 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Article Title"
                                className="w-full bg-transparent text-4xl font-serif font-bold placeholder:text-gray-700 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-mono text-purple-500">/article/</span>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-400 font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Editor / Preview */}
                    <div className="min-h-[70vh] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col relative group">
                        {/* Toolbar */}
                        {activeTab === "write" && (
                            <div className="flex items-center gap-1 p-3 border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
                                <button type="button" onClick={() => handleFormat('bold')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('italic')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-gray-800 mx-2" />
                                <button type="button" onClick={() => handleFormat('list')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="List"><List className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('quote')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Quote"><Quote className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('code')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Code"><Code className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('link')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-gray-800 mx-2" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg flex items-center gap-2 transition-colors"
                                    title="Insert Image"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="text-xs font-bold">Add Image</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleBodyImageUpload}
                                />
                            </div>
                        )}

                        {activeTab === "write" ? (
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    name="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onPaste={handlePaste}
                                    onDrop={handleDrop}
                                    placeholder="Tell your story... (Drag & Drop images enabled)"
                                    className="w-full h-full bg-transparent p-6 resize-none focus:outline-none font-mono text-base leading-relaxed text-gray-300 placeholder:text-gray-700"
                                    spellCheck={false}
                                />
                                {/* Bottom Status Bar */}
                                <div className="absolute bottom-4 right-4 flex items-center gap-4 text-xs text-gray-500 bg-gray-950/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="flex items-center gap-1"><AlignLeft className="w-3 h-3" /> {wordCount} words</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime} min read</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-8 prose prose-invert max-w-none prose-headings:font-serif prose-a:text-purple-400 prose-img:rounded-xl">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Settings (Hidden in Focus Mode) */}
                {!isFocusMode && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        {/* Metadata Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
                            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Publishing</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Category</label>
                                <select
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm"
                                >
                                    <option value="Technology">Technology</option>
                                    <option value="Philosophy">Philosophy</option>
                                    <option value="History">History</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Science">Science</option>
                                    <option value="Art">Art</option>
                                    <option value="Politics">Politics</option>
                                    <option value="Mystery">Mystery</option>
                                    <option value="Crime">Crime</option>
                                    <option value="News">News</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Subtitle</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    defaultValue={initialData?.subtitle}
                                    placeholder="Brief tagline..."
                                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Accent Color</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {['from-blue-600 to-cyan-600', 'from-purple-600 to-pink-600', 'from-red-600 to-orange-600', 'from-green-600 to-emerald-600', 'from-amber-600 to-yellow-600'].map((color) => (
                                        <label key={color} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="accent_color"
                                                value={color}
                                                defaultChecked={initialData?.accent_color === color}
                                                className="peer sr-only"
                                            />
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} ring-2 ring-transparent peer-checked:ring-white transition-all`} />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    value="true"
                                    defaultChecked={initialData?.featured}
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-950 text-purple-600 focus:ring-purple-500"
                                />
                                <label className="text-sm font-medium text-gray-300">Featured Article</label>
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
                            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Media</h3>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300">Cover Image</label>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    id="coverUpload"
                                    name="coverImageFile"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                {/* Image Preview & Drop Zone */}
                                <div
                                    onClick={() => document.getElementById("coverUpload")?.click()}
                                    className="relative aspect-video rounded-xl overflow-hidden bg-gray-950 border-2 border-dashed border-gray-800 hover:border-purple-500/50 hover:bg-gray-950/50 transition-all cursor-pointer group"
                                >
                                    {previewImage ? (
                                        <>
                                            <Image src={previewImage} alt="Cover" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <p className="text-white text-sm font-medium flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4" /> Change Image
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                            <UploadCloud className="w-8 h-8 mb-2 group-hover:text-purple-500 transition-colors" />
                                            <p className="text-xs">Click to upload</p>
                                        </div>
                                    )}
                                </div>

                                {/* URL Fallback */}
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type="text"
                                        name="coverImage"
                                        value={coverImage}
                                        onChange={handleUrlChange}
                                        placeholder="Or paste image URL"
                                        className="w-full pl-9 pr-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs placeholder:text-gray-700 focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300">Video Link</label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type="text"
                                        name="videoUrl"
                                        defaultValue={initialData?.videoUrl}
                                        placeholder="YouTube URL (optional)"
                                        className="w-full pl-9 pr-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs placeholder:text-gray-700 focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </form>
    );
}
