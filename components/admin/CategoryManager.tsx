"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
    addAdminCategory,
    deleteAdminCategory,
    updateAdminCategory,
    type ManagedCategory,
} from "@/actions/categories";
import { toast } from "sonner";

type EditableCategory = {
    originalName: string;
    name: string;
    nameBn: string;
};

function toEditable(categories: ManagedCategory[]): EditableCategory[] {
    return categories.map((category) => ({
        originalName: category.name,
        name: category.name,
        nameBn: category.nameBn || "",
    }));
}

interface CategoryManagerProps {
    initialCategories: ManagedCategory[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
    const [categories, setCategories] = useState<EditableCategory[]>(toEditable(initialCategories));
    const [newName, setNewName] = useState("");
    const [newNameBn, setNewNameBn] = useState("");
    const [isPending, startTransition] = useTransition();

    const hasCategories = categories.length > 0;
    const pendingClass = isPending ? "opacity-70 pointer-events-none" : "";

    const summary = useMemo(() => `${categories.length} categories configured`, [categories.length]);

    const replaceFromServer = (nextCategories: ManagedCategory[]) => {
        setCategories(toEditable(nextCategories));
    };

    const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newName.trim()) return;

        startTransition(async () => {
            const result = await addAdminCategory({ name: newName, nameBn: newNameBn });
            if (!result.success) {
                toast.error(result.error || "Failed to add category");
                return;
            }

            replaceFromServer(result.categories);
            setNewName("");
            setNewNameBn("");
            toast.success("Category added");
        });
    };

    const handleSave = (category: EditableCategory) => {
        startTransition(async () => {
            const result = await updateAdminCategory({
                previousName: category.originalName,
                name: category.name,
                nameBn: category.nameBn,
            });

            if (!result.success) {
                toast.error(result.error || "Failed to update category");
                return;
            }

            replaceFromServer(result.categories);
            toast.success("Category updated");
        });
    };

    const handleDelete = (name: string) => {
        startTransition(async () => {
            const result = await deleteAdminCategory({ name });
            if (!result.success) {
                toast.error(result.error || "Failed to delete category");
                return;
            }

            replaceFromServer(result.categories);
            toast.success("Category deleted");
        });
    };

    return (
        <div className={`space-y-6 ${pendingClass}`}>
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-text-secondary">{summary}</p>
            </div>

            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Category name (e.g. Technology)"
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
                    required
                />
                <input
                    type="text"
                    value={newNameBn}
                    onChange={(e) => setNewNameBn(e.target.value)}
                    placeholder="বাংলা নাম (optional)"
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </form>

            {hasCategories ? (
                <div className="space-y-3">
                    {categories.map((category, index) => (
                        <div
                            key={`${category.originalName}-${index}`}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 p-3 border border-border-primary rounded-xl bg-bg-secondary"
                        >
                            <input
                                type="text"
                                value={category.name}
                                onChange={(e) =>
                                    setCategories((prev) =>
                                        prev.map((item, itemIndex) =>
                                            itemIndex === index ? { ...item, name: e.target.value } : item
                                        )
                                    )
                                }
                                className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
                            />
                            <input
                                type="text"
                                value={category.nameBn}
                                onChange={(e) =>
                                    setCategories((prev) =>
                                        prev.map((item, itemIndex) =>
                                            itemIndex === index ? { ...item, nameBn: e.target.value } : item
                                        )
                                    )
                                }
                                placeholder="বাংলা নাম (optional)"
                                className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
                            />
                            <button
                                type="button"
                                onClick={() => handleSave(category)}
                                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(category.originalName)}
                                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 border border-dashed border-border-primary rounded-xl text-sm text-text-secondary">
                    No custom categories yet. Add one above.
                </div>
            )}
        </div>
    );
}
