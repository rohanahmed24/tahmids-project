import NavbarManager from "@/components/admin/NavbarManager";

export const metadata = {
    title: "Navbar Management | Admin Dashboard",
};

export default function NavbarSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold text-text-primary">Navbar Management</h1>
                <p className="text-text-muted">Manage the links displayed in the main navigation bar.</p>
            </div>

            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6">
                <NavbarManager />
            </div>
        </div>
    );
}
