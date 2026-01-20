"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, GripVertical, X, Edit2, Save, Power } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { getAllNavbarLinksAdmin, createNavbarLink, updateNavbarLink, deleteNavbarLink, reorderNavbarLinks } from "@/actions/navbar";
import { toast } from "sonner";

interface NavbarLink {
    id: number;
    label: string;
    href: string;
    order: number;
    isActive: boolean;
}

export default function NavbarManager() {
    const [links, setLinks] = useState<NavbarLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newLink, setNewLink] = useState({ label: "", href: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState({ label: "", href: "" });

    const fetchLinks = useCallback(async () => {
        setIsLoading(true);
        const result = await getAllNavbarLinksAdmin();
        if (result.success && result.links) {
            setLinks(result.links);
        } else {
            toast.error(result.error || "Failed to load links");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const handleCreate = async () => {
        if (!newLink.label || !newLink.href) return;
        const result = await createNavbarLink({ ...newLink, order: links.length + 1 });
        if (result.success) {
            toast.success("Link added successfully");
            setNewLink({ label: "", href: "" });
            setIsAdding(false);
            fetchLinks();
        } else {
            toast.error(result.error);
        }
    };

    const handleUpdate = async (id: number) => {
        const result = await updateNavbarLink(id, editValues);
        if (result.success) {
            toast.success("Link updated");
            setEditingId(null);
            fetchLinks();
        } else {
            toast.error(result.error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this link?")) return;
        const result = await deleteNavbarLink(id);
        if (result.success) {
            toast.success("Link deleted");
            fetchLinks();
        } else {
            toast.error(result.error);
        }
    };

    const toggleStatus = async (id: number, currentStatus: boolean) => {
        const result = await updateNavbarLink(id, { isActive: !currentStatus });
        if (result.success) {
            fetchLinks();
        } else {
            toast.error(result.error);
        }
    };

    const handleReorder = async (newOrder: NavbarLink[]) => {
        setLinks(newOrder);
        const updates = newOrder.map((link, index) => ({ id: link.id, order: index + 1 }));
        const result = await reorderNavbarLinks(updates);
        if (!result.success) {
            toast.error("Failed to save new order");
            fetchLinks();
        }
    };

    if (isLoading) return <div className="text-text-muted text-sm py-4">Loading links...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif font-bold text-text-primary">Navbar Links</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-main/10 text-accent-main rounded-lg hover:bg-accent-main/20 transition-colors text-sm font-bold"
                >
                    {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isAdding ? "Cancel" : "Add Link"}
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-bg-card border border-border-primary rounded-xl flex gap-4 items-end"
                >
                    <div className="flex-1 space-y-2">
                        <label className="text-xs text-text-muted font-bold uppercase tracking-wider">Label</label>
                        <input
                            value={newLink.label}
                            onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                            className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-main"
                            placeholder="e.g. Topics"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs text-text-muted font-bold uppercase tracking-wider">HREF</label>
                        <input
                            value={newLink.href}
                            onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
                            className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-main"
                            placeholder="e.g. /topics"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-accent-main text-white rounded-lg font-bold text-sm shadow-sm"
                    >
                        Create
                    </button>
                </motion.div>
            )}

            <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-3">
                {links.map((link) => (
                    <Reorder.Item
                        key={link.id}
                        value={link}
                        className="p-4 bg-bg-card border border-border-primary rounded-xl flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-primary p-1">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            {editingId === link.id ? (
                                <div className="flex flex-1 gap-2 items-end">
                                    <div className="flex-1">
                                        <input
                                            value={editValues.label}
                                            onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
                                            className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-1 text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            value={editValues.href}
                                            onChange={(e) => setEditValues({ ...editValues, href: e.target.value })}
                                            className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-1 text-sm"
                                        />
                                    </div>
                                    <button onClick={() => handleUpdate(link.id)} className="p-1 text-green-500 hover:bg-green-500/10 rounded">
                                        <Save className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-text-primary">{link.label}</h4>
                                        <p className="text-xs text-text-muted">{link.href}</p>
                                    </div>
                                    {!link.isActive && (
                                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] rounded uppercase font-bold">Inactive</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setEditingId(link.id);
                                    setEditValues({ label: link.label, href: link.href });
                                }}
                                className="p-2 text-text-muted hover:text-accent-main hover:bg-accent-main/10 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => toggleStatus(link.id, link.isActive)}
                                className={`p-2 transition-colors rounded-lg ${link.isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-text-muted hover:text-text-primary hover:bg-gray-500/10'}`}
                                title={link.isActive ? "Deactivate" : "Activate"}
                            >
                                <Power className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(link.id)}
                                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {links.length === 0 && !isLoading && (
                <div className="text-center py-12 border-2 border-dashed border-border-primary rounded-2xl">
                    <p className="text-text-muted italic">No navbar links found. Create one to get started.</p>
                </div>
            )}
        </div>
    );
}
