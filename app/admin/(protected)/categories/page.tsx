import { redirect } from "next/navigation";
import { FolderTree } from "lucide-react";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { getAdminCategories } from "@/actions/categories";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    const categoriesResult = await getAdminCategories();
    const initialCategories = categoriesResult.success ? categoriesResult.categories : [];

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1200px] mx-auto p-6 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                        <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Category Management</h1>
                        <p className="text-text-secondary mt-1">
                            Add, edit, or delete categories used by the article editor.
                        </p>
                    </div>
                </div>

                <div className="bg-bg-card border border-border-primary rounded-2xl p-6">
                    <CategoryManager initialCategories={initialCategories} />
                </div>
            </div>
        </div>
    );
}
