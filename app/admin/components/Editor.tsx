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
    AlignLeft,
    Music,
    Youtube
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { uploadImage } from "@/actions/media";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface EditorProps {
    initialData?: {
        title: string;
        slug: string;
        category: string;
        content: string;
        coverImage?: string;
        videoUrl?: string;
        audioUrl?: string;
        subtitle?: string;
        topic_slug?: string;
        accent_color?: string;
        featured?: boolean;
        published?: boolean;
        authorName?: string;
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
    const [topicSlug, setTopicSlug] = useState(initialData?.topic_slug || "");
    const [published, setPublished] = useState(initialData?.published ?? true);
    const [authorName, setAuthorName] = useState(initialData?.authorName || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(initialData?.coverImage || null);
    const [audioUrl, setAudioUrl] = useState(initialData?.audioUrl || "");
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);

    // Premium Features State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [wordCount, setWordCount] = useState(0);
    const [readTime, setReadTime] = useState(0);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioFileInputRef = useRef<HTMLInputElement>(null);

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

    const handleAudioUpload = async (file: File) => {
        const id = toast.loading("Uploading audio...");
        const placeholder = `\n![Audio Uploading...]()\n`;
        insertAtCursor(placeholder);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadImage(formData);
            if (result.success && result.url) {
                // Use a custom syntax or HTML audio tag that our markdown renderer can handle or just a link for now.
                // Better approach: Use HTML 5 audio tag which standard markdown often allows, or a custom component syntax.
                // Let's use a custom syntax that we will parse: [audio](url)
                // Actually, standard markdown image syntax `![audio](url)` might be confused with images. 
                // Let's use <audio controls src="..." /> which remark-gfm/rehype-raw can support if configured, 
                // or just a custom code block?
                // Simplest for now: HTML tag.
                setContent(prev => prev.replace(placeholder, `\n<audio controls src="${result.url}"></audio>\n`));
                toast.success("Audio uploaded", { id });
            } else {
                setContent(prev => prev.replace(placeholder, ""));
                toast.error("Upload failed", { id });
            }
        } catch {
            setContent(prev => prev.replace(placeholder, ""));
            toast.error("Upload failed", { id });
        }
    };

    const getYouTubeEmbedUrl = (url: string): string | null => {
        if (!url) return null;

        let videoId = null;

        // Handle various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/ // Just the video ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                videoId = match[1];
                break;
            }
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const handleYoutubeInsert = () => {
        const url = prompt("Enter YouTube URL (e.g., youtube.com/watch?v=... or youtu.be/...):");
        if (url) {
            const embedUrl = getYouTubeEmbedUrl(url.trim());
            if (embedUrl) {
                const embed = `\n<iframe width="100%" height="400" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n`;
                insertAtCursor(embed);
                toast.success("YouTube video added!");
            } else {
                toast.error("Invalid YouTube URL. Please use a valid YouTube link.");
            }
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
                e.preventDefault(); // Only prevent default if we're handling the file
                const file = item.getAsFile();
                if (file) {
                    await handleUploadFile(file);
                }
                return;
            }
        }
        // Do not block text paste!
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith("image/")) {
            await handleUploadFile(files[0]);
        }
    };

    const handleDocImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const id = toast.loading("Importing document...");

        try {
            let text = "";

            if (file.name.endsWith(".docx")) {
                const arrayBuffer = await file.arrayBuffer();
                // We need to dynamically import mammoth to avoid SSR issues if any, though it's client comp
                const mammoth = (await import("mammoth")).default;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                const html = result.value;

                // Convert HTML to Markdown
                const TurndownService = (await import("turndown")).default;
                const turndownService = new TurndownService();
                text = turndownService.turndown(html);

                if (result.messages.length > 0) {

                }
            } else {
                // markdown or text
                text = await file.text();
            }

            if (text) {
                // If content is empty, just set it. If not, maybe append or ask? 
                // For now, let's append if not empty, or replace? 
                // Let's replace for "Import", maybe confirmation would be nice but let's stick to simple first.
                // Actually, plan said "populating". I'll insert at cursor or replace if empty.
                if (!content) {
                    setContent(text);
                } else {
                    insertAtCursor(text);
                }
                toast.success("Document imported!", { id });
            } else {
                toast.error("No text found in document", { id });
            }

        } catch (error) {
            console.error("Import failed:", error);
            toast.error("Failed to import document", { id });
        }

        // Reset input
        if (e.target) e.target.value = "";
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
        } catch (error: unknown) {
            // Check if this is a Next.js redirect (which throws NEXT_REDIRECT)
            if (isRedirectError(error)) {
                // This is a redirect, not an error - clear the toast
                toast.dismiss(id);
                if (!initialData) {
                    localStorage.removeItem("draft_new_post");
                }
                return;
            }
            console.error("Submission failed", error);
            toast.error("Failed to save article", { id });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add published status to form data before submitting
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("published", String(published));
        if (authorName) formData.set("authorName", authorName);
        // Ensure other states are set if not controlled inputs (they are mostly named inputs)
        handleSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit} className={`transition-all duration-500 ${isFocusMode ? 'fixed inset-0 z-[100] bg-bg-primary p-8 overflow-y-auto' : 'space-y-8'}`}>
            {/* Header Actions */}
            <div className={`flex items-center justify-between sticky top-4 z-50 bg-bg-primary/80 backdrop-blur-md p-4 rounded-2xl border border-border-primary shadow-xl transition-transform ${isFocusMode ? 'max-w-4xl mx-auto w-full' : ''}`}>
                <div className="flex items-center gap-4">
                    {!isFocusMode && (
                        <a href="/admin/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
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
                        className={`p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors ${isFocusMode ? 'bg-accent-main/20 text-accent-main' : ''}`}
                        title="Toggle Focus Mode"
                    >
                        {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    <div className="flex bg-bg-card rounded-lg p-1 border border-border-primary">
                        <button
                            type="button"
                            onClick={() => setActiveTab("write")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "write" ? "bg-bg-tertiary text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            <Edit3 className="w-4 h-4" /> Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "preview" ? "bg-bg-tertiary text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            <Eye className="w-4 h-4" /> Preview
                        </button>
                    </div>
                    <div className="flex bg-bg-card rounded-lg p-1 border border-border-primary">
                        <button
                            type="button"
                            onClick={() => setPublished(false)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!published ? "bg-yellow-500/20 text-yellow-400" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            Draft
                        </button>
                        <button
                            type="button"
                            onClick={() => setPublished(true)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${published ? "bg-green-500/20 text-green-400" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            Publish
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : <><Save className="w-4 h-4" /> {published ? "Publish" : "Save Draft"}</>}
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isFocusMode ? 'max-w-4xl mx-auto pt-8' : ''}`}>
                {/* Main Editor Area */}
                <div className={`lg:col-span-2 space-y-6 transition-all`}>
                    {/* Title & Slug */}
                    <div className="space-y-4 bg-bg-card border border-border-primary rounded-2xl p-6">
                        <div>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Article Title"
                                className="w-full bg-transparent text-4xl font-serif font-bold placeholder:text-text-muted focus:outline-none text-text-primary"
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
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-text-secondary font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Editor / Preview */}
                    <div className="min-h-[70vh] bg-bg-card border border-border-primary rounded-2xl overflow-hidden flex flex-col relative group">
                        {/* Toolbar */}
                        {activeTab === "write" && (
                            <div className="flex items-center gap-1 p-3 border-b border-border-primary bg-bg-card/50 sticky top-0 z-10 backdrop-blur-sm overflow-x-auto hide-scrollbar whitespace-nowrap">
                                <button type="button" onClick={() => handleFormat('bold')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('italic')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-border-primary mx-2" />
                                <button type="button" onClick={() => handleFormat('list')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors" title="List"><List className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('quote')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors" title="Quote"><Quote className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('code')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors" title="Code"><Code className="w-4 h-4" /></button>
                                <button type="button" onClick={() => handleFormat('link')} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-border-primary mx-2" />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('docImport')?.click()}
                                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
                                    title="Import Document (.docx, .md, .txt)"
                                >
                                    <UploadCloud className="w-4 h-4" />
                                    <span className="text-xs font-bold hidden xl:block">Import</span>
                                </button>
                                <input
                                    type="file"
                                    id="docImport"
                                    className="hidden"
                                    accept=".docx,.md,.txt"
                                    onChange={handleDocImport}
                                />
                                <div className="w-px h-4 bg-border-primary mx-2" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg flex items-center gap-2 transition-colors flex-shrink-0"
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
                                <div className="w-px h-4 bg-border-primary mx-2" />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('audioUpload')?.click()}
                                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                                    title="Add Audio"
                                >
                                    <Music className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    id="audioUpload"
                                    className="hidden"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleAudioUpload(file);
                                        e.target.value = "";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleYoutubeInsert}
                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Add YouTube Video"
                                >
                                    <Youtube className="w-4 h-4" />
                                </button>
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
                                    className="w-full min-h-[70vh] bg-transparent p-6 resize-y focus:outline-none font-mono text-base leading-relaxed text-text-primary placeholder:text-text-muted"
                                    spellCheck={false}
                                />
                                {/* Bottom Status Bar */}
                                <div className="absolute bottom-4 right-4 flex items-center gap-4 text-xs text-text-muted bg-bg-primary/80 backdrop-blur px-3 py-1.5 rounded-full border border-border-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="flex items-center gap-1"><AlignLeft className="w-3 h-3" /> {wordCount} words</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime} min read</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-8 prose prose-invert max-w-none prose-headings:font-serif prose-a:text-purple-400 prose-img:rounded-xl">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        iframe: ({ node, ...props }) => (
                                            <iframe
                                                {...props}
                                                className="w-full aspect-video rounded-xl my-4"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        ),
                                    }}
                                >
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
                        <div className="bg-bg-card border border-border-primary rounded-2xl p-6 space-y-6">
                            <h3 className="font-bold text-text-muted uppercase tracking-widest text-xs">Publishing</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Category</label>
                                <select
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg focus:border-accent-main focus:outline-none transition-colors text-sm text-text-primary"
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
                                    <option value="Business">Business</option>
                                    <option value="Health">Health</option>
                                    <option value="Entertainment">Entertainment</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Topic Slug</label>
                                <input
                                    type="text"
                                    name="topic_slug"
                                    value={topicSlug}
                                    onChange={(e) => setTopicSlug(e.target.value)}
                                    placeholder="e.g. artificial-intelligence"
                                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg focus:border-accent-main focus:outline-none transition-colors text-sm text-text-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Subtitle</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    defaultValue={initialData?.subtitle}
                                    placeholder="Brief tagline..."
                                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg focus:border-accent-main focus:outline-none transition-colors text-text-primary text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Accent Color</label>
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
                                    className="w-4 h-4 rounded border-border-primary bg-bg-tertiary text-accent-main focus:ring-accent-main"
                                />
                                <label className="text-sm font-medium text-text-secondary">Featured Article</label>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-800">
                                <label className="text-sm font-medium text-text-secondary">Author Name</label>
                                <input
                                    type="text"
                                    name="authorName"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder="e.g. Guest Writer"
                                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg focus:border-accent-main focus:outline-none transition-colors text-text-primary text-sm"
                                />
                                <p className="text-[10px] text-text-muted">Leave empty to use your profile name.</p>
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="bg-bg-card border border-border-primary rounded-2xl p-6 space-y-6">
                            <h3 className="font-bold text-text-muted uppercase tracking-widest text-xs">Media</h3>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-secondary">Cover Image</label>

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
                                    className="relative aspect-video rounded-xl overflow-hidden bg-bg-primary border-2 border-dashed border-border-primary hover:border-accent-main/50 hover:bg-bg-primary/50 transition-all cursor-pointer group"
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
                                        className="w-full pl-9 pr-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-xs placeholder:text-text-muted focus:border-accent-main focus:outline-none text-text-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-secondary">Video Link</label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type="text"
                                        name="videoUrl"
                                        defaultValue={initialData?.videoUrl}
                                        placeholder="YouTube URL (optional)"
                                        className="w-full pl-9 pr-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-xs placeholder:text-text-muted focus:border-accent-main focus:outline-none text-text-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-secondary">Audio File</label>

                                {/* Hidden Audio File Input */}
                                <input
                                    type="file"
                                    ref={audioFileInputRef}
                                    id="audioFileUpload"
                                    accept="audio/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsUploadingAudio(true);
                                        const id = toast.loading("Uploading audio...");
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        try {
                                            const result = await uploadImage(formData);
                                            if (result.success && result.url) {
                                                setAudioUrl(result.url);
                                                toast.success("Audio uploaded!", { id });
                                            } else {
                                                toast.error(result.error || "Upload failed", { id });
                                            }
                                        } catch {
                                            toast.error("Upload failed", { id });
                                        } finally {
                                            setIsUploadingAudio(false);
                                            if (audioFileInputRef.current) audioFileInputRef.current.value = "";
                                        }
                                    }}
                                    className="hidden"
                                />

                                {/* Audio Upload Button / Preview */}
                                {audioUrl ? (
                                    <div className="space-y-2">
                                        <audio controls className="w-full" src={audioUrl}>
                                            Your browser does not support the audio element.
                                        </audio>
                                        <button
                                            type="button"
                                            onClick={() => setAudioUrl("")}
                                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Remove Audio
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => audioFileInputRef.current?.click()}
                                        disabled={isUploadingAudio}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-bg-tertiary border border-dashed border-border-primary rounded-lg hover:border-accent-main/50 transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50"
                                    >
                                        {isUploadingAudio ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                        ) : (
                                            <><Music className="w-4 h-4" /> Upload Audio File</>
                                        )}
                                    </button>
                                )}

                                {/* Audio URL Fallback */}
                                <div className="relative">
                                    <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type="text"
                                        name="audioUrl"
                                        value={audioUrl}
                                        onChange={(e) => setAudioUrl(e.target.value)}
                                        placeholder="Or paste audio URL"
                                        className="w-full pl-9 pr-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-xs placeholder:text-text-muted focus:border-accent-main focus:outline-none text-text-primary"
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
