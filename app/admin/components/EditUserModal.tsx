"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import { updateUserRole, updateUserImage } from "@/actions/users";
import { uploadImage } from "@/actions/media";
import { useState, useRef } from "react";
import { User } from "@/lib/users";
import Image from "next/image";
import { toast } from "sonner";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onUserUpdated: (userId: number, newRole: 'user' | 'admin', newImage?: string) => void;
}

export function EditUserModal({ isOpen, onClose, user, onUserUpdated }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [newImagePath, setNewImagePath] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadImage(formData);
            if (result.success && result.url) {
                setPreviewImage(result.url);
                setNewImagePath(result.url);
                toast.success("Image uploaded!");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const saveUserChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            const form = e.target as HTMLFormElement;
            const newRole = (form.elements.namedItem("role") as HTMLSelectElement).value as 'user' | 'admin';

            await updateUserRole(user.id, newRole);
            
            if (newImagePath) {
                await updateUserImage(user.id, newImagePath);
            }

            onUserUpdated(user.id, newRole, newImagePath || undefined);
            toast.success("User updated successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to update user", error);
            toast.error("Failed to update user");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPreviewImage(null);
        setNewImagePath(null);
        onClose();
    };

    const currentImage = previewImage || user?.image;

    return (
        <AnimatePresence>
            {isOpen && user && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-bg-secondary border border-border-primary rounded-2xl p-8 max-w-md w-full"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-text-primary">Edit User</h3>
                            <button onClick={handleClose} className="text-text-secondary hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={saveUserChanges} className="space-y-4">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-bg-tertiary border-2 border-border-primary">
                                    {currentImage ? (
                                        <Image
                                            src={currentImage}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-text-tertiary text-2xl font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg hover:bg-bg-primary transition-colors text-sm text-text-secondary disabled:opacity-50"
                                    data-testid="button-upload-author-image"
                                >
                                    <Upload className="w-4 h-4" />
                                    {isUploading ? "Uploading..." : "Upload Image"}
                                </button>
                            </div>

                            <div>
                                <label className="text-sm text-text-secondary block mb-2">Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    disabled
                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border-primary rounded-xl text-text-tertiary cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary block mb-2">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border-primary rounded-xl text-text-tertiary cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary block mb-2">Role</label>
                                <select
                                    name="role"
                                    defaultValue={user.role}
                                    className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl focus:border-accent-primary focus:outline-none transition-colors text-text-primary"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-accent-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent-primary/90 transition-colors mt-4 disabled:opacity-50"
                                data-testid="button-save-user"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
