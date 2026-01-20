import { redirect } from "next/navigation";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { getSettings } from "@/actions/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    const settings = await getSettings();

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1200px] mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                        <p className="text-text-secondary mt-2">Configure your platform settings and preferences</p>
                    </div>
                </div>

                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}