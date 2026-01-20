"use client";

import { useState } from "react";
import { updateSettings } from "@/actions/settings";
import { Settings, Shield, Database, Palette, Bell, Menu, Loader2, Save } from "lucide-react";
import NavbarManager from "@/components/admin/NavbarManager";
import { toast } from "sonner";

interface SettingsFormProps {
    initialSettings: Record<string, string>;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await updateSettings(formData);
            if (result.success) {
                toast.success("Settings saved successfully");
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setSaving(false);
        }
    };

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-4 space-y-2 lg:sticky lg:top-24">
                    <h3 className="font-semibold text-text-primary mb-4 hidden lg:block">Settings Categories</h3>
                    <nav className="flex overflow-x-auto gap-2 pb-2 lg:block lg:space-y-1 lg:pb-0 hide-scrollbar">
                        {[
                            { id: "general", icon: Settings, label: "General" },
                            { id: "appearance", icon: Palette, label: "Appearance" },
                            { id: "security", icon: Shield, label: "Security" },
                            { id: "notifications", icon: Bell, label: "Notifications" },
                            { id: "navigation", icon: Menu, label: "Navigation" },
                            { id: "integrations", icon: Database, label: "Integrations" }
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => scrollToSection(item.id)}
                                className={`flex items-center gap-2 lg:gap-3 px-3 py-2 w-full text-left rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === item.id
                                        ? "text-text-primary bg-accent-primary/10"
                                        : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-8">
                {/* General Settings */}
                <div id="general" className="bg-bg-secondary rounded-xl border border-border-primary p-6 scroll-mt-24">
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
                                    name="siteName"
                                    defaultValue={initialSettings.siteName || "Wisdomia"}
                                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Site Tagline</label>
                                <input
                                    type="text"
                                    name="siteTagline"
                                    defaultValue={initialSettings.siteTagline || "Your Digital Magazine"}
                                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Site Description</label>
                            <textarea
                                rows={3}
                                name="siteDescription"
                                defaultValue={initialSettings.siteDescription || "A platform dedicated to storytelling and editorial content across politics, mystery, crime, history, news, and science."}
                                className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Default Language</label>
                                <select
                                    name="defaultLanguage"
                                    defaultValue={initialSettings.defaultLanguage || "en"}
                                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                >
                                    <option value="en">English</option>
                                    <option value="bn">Bengali</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Timezone</label>
                                <select
                                    name="timezone"
                                    defaultValue={initialSettings.timezone || "UTC"}
                                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Asia/Dhaka">Dhaka</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div id="appearance" className="bg-bg-secondary rounded-xl border border-border-primary p-6 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <Palette className="w-5 h-5 text-accent-primary" />
                        <h2 className="text-xl font-semibold text-text-primary">Appearance</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Theme</label>
                            <div className="grid grid-cols-3 gap-4">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="light"
                                        className="sr-only peer"
                                        defaultChecked={initialSettings.theme === "light"}
                                    />
                                    <div className="p-4 border-2 border-border-primary rounded-lg peer-checked:border-accent-primary peer-checked:bg-accent-primary/5 transition-all">
                                        <div className="w-full h-16 bg-white rounded mb-2 border border-gray-200"></div>
                                        <p className="text-sm text-text-primary text-center">Light</p>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="dark"
                                        className="sr-only peer"
                                        defaultChecked={initialSettings.theme === "dark" || !initialSettings.theme}
                                    />
                                    <div className="p-4 border-2 border-border-primary rounded-lg peer-checked:border-accent-primary peer-checked:bg-accent-primary/5 transition-all">
                                        <div className="w-full h-16 bg-gray-900 rounded mb-2 border border-gray-700"></div>
                                        <p className="text-sm text-text-primary text-center">Dark</p>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="auto"
                                        className="sr-only peer"
                                        defaultChecked={initialSettings.theme === "auto"}
                                    />
                                    <div className="p-4 border-2 border-border-primary rounded-lg peer-checked:border-accent-primary peer-checked:bg-accent-primary/5 transition-all">
                                        <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 rounded mb-2 border border-gray-400"></div>
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
                                        <input
                                            type="radio"
                                            name="primaryColor"
                                            value={color}
                                            className="sr-only peer"
                                            defaultChecked={initialSettings.primaryColor === color}
                                        />
                                        <div className={`w-8 h-8 ${color} rounded-full ring-2 ring-transparent peer-checked:ring-white peer-checked:ring-offset-2 peer-checked:ring-offset-bg-secondary transition-all`}></div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Settings */}
                <div id="navigation" className="bg-bg-secondary rounded-xl border border-border-primary p-6 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <Menu className="w-5 h-5 text-accent-primary" />
                        <h2 className="text-xl font-semibold text-text-primary">Navigation</h2>
                    </div>
                    <NavbarManager />
                </div>

                {/* Security Settings */}
                <div id="security" className="bg-bg-secondary rounded-xl border border-border-primary p-6 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-5 h-5 text-accent-primary" />
                        <h2 className="text-xl font-semibold text-text-primary">Security</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Note: In a real app, 2FA enabling would involve a more complex flow */}
                        <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                            <div>
                                <h4 className="font-medium text-text-primary">Two-Factor Authentication</h4>
                                <p className="text-sm text-text-secondary">Add an extra layer of security to your account</p>
                            </div>
                            <button type="button" className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors">
                                Enable
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                            <div>
                                <h4 className="font-medium text-text-primary">Login Notifications</h4>
                                <p className="text-sm text-text-secondary">Get notified of new login attempts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="loginNotifications"
                                    className="sr-only peer"
                                    defaultChecked={initialSettings.loginNotifications === "on"}
                                />
                                <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                            <div>
                                <h4 className="font-medium text-text-primary">Session Timeout</h4>
                                <p className="text-sm text-text-secondary">Automatically log out inactive users</p>
                            </div>
                            <select
                                name="sessionTimeout"
                                defaultValue={initialSettings.sessionTimeout || "60"}
                                className="px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            >
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="240">4 hours</option>
                                <option value="480">8 hours</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="sticky bottom-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-accent-primary text-white rounded-xl hover:bg-accent-primary/90 transition-all shadow-lg hover:shadow-accent-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
