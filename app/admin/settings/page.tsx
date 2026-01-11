import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { verifyAdmin } from "@/actions/admin-auth";
import { Settings, Shield, Database, Palette, Bell } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Settings Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-2">
                            <h3 className="font-semibold text-text-primary mb-4">Settings Categories</h3>
                            <nav className="space-y-1">
                                <a href="#general" className="flex items-center gap-3 px-3 py-2 text-text-primary bg-accent-primary/10 rounded-lg">
                                    <Settings className="w-4 h-4" />
                                    General
                                </a>
                                <a href="#appearance" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
                                    <Palette className="w-4 h-4" />
                                    Appearance
                                </a>
                                <a href="#security" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
                                    <Shield className="w-4 h-4" />
                                    Security
                                </a>
                                <a href="#notifications" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
                                    <Bell className="w-4 h-4" />
                                    Notifications
                                </a>
                                <a href="#integrations" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
                                    <Database className="w-4 h-4" />
                                    Integrations
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* General Settings */}
                        <div id="general" className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Settings className="w-5 h-5 text-accent-primary" />
                                <h2 className="text-xl font-semibold text-text-primary">General Settings</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">Site Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Wisdomia"
                                            className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">Site Tagline</label>
                                        <input
                                            type="text"
                                            defaultValue="Your Digital Magazine"
                                            className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Site Description</label>
                                    <textarea
                                        rows={3}
                                        defaultValue="A platform dedicated to storytelling and editorial content across politics, mystery, crime, history, news, and science."
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">Default Language</label>
                                        <select className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                                            <option value="en">English</option>
                                            <option value="bn">Bengali</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">Timezone</label>
                                        <select className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                            <option value="Europe/London">London</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appearance Settings */}
                        <div id="appearance" className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Palette className="w-5 h-5 text-accent-primary" />
                                <h2 className="text-xl font-semibold text-text-primary">Appearance</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Theme</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <label className="cursor-pointer">
                                            <input type="radio" name="theme" value="light" className="sr-only peer" />
                                            <div className="p-4 border-2 border-border-primary rounded-lg peer-checked:border-accent-primary peer-checked:bg-accent-primary/5">
                                                <div className="w-full h-16 bg-white rounded mb-2"></div>
                                                <p className="text-sm text-text-primary text-center">Light</p>
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input type="radio" name="theme" value="dark" className="sr-only peer" defaultChecked />
                                            <div className="p-4 border-2 border-border-primary rounded-lg peer-checked:border-accent-primary peer-checked:bg-accent-primary/5">
                                                <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                                                <p className="text-sm text-text-primary text-center">Dark</p>
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input type="radio" name="theme" value="auto" className="sr-only peer" />
                                            <div className="p-4 border-2 border-border-primary rounded-lg peer-checked:border-accent-primary peer-checked:bg-accent-primary/5">
                                                <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 rounded mb-2"></div>
                                                <p className="text-sm text-text-primary text-center">Auto</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Primary Color</label>
                                    <div className="flex gap-3">
                                        {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-orange-500', 'bg-pink-500'].map((color) => (
                                            <label key={color} className="cursor-pointer">
                                                <input type="radio" name="primaryColor" className="sr-only peer" />
                                                <div className={`w-8 h-8 ${color} rounded-full ring-2 ring-transparent peer-checked:ring-white peer-checked:ring-offset-2 peer-checked:ring-offset-bg-secondary`}></div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div id="security" className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-5 h-5 text-accent-primary" />
                                <h2 className="text-xl font-semibold text-text-primary">Security</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-text-primary">Two-Factor Authentication</h4>
                                        <p className="text-sm text-text-secondary">Add an extra layer of security to your account</p>
                                    </div>
                                    <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors">
                                        Enable
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-text-primary">Login Notifications</h4>
                                        <p className="text-sm text-text-secondary">Get notified of new login attempts</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-text-primary">Session Timeout</h4>
                                        <p className="text-sm text-text-secondary">Automatically log out inactive users</p>
                                    </div>
                                    <select className="px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 hour</option>
                                        <option value="240">4 hours</option>
                                        <option value="480">8 hours</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}