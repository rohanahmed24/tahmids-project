import { redirect } from "next/navigation";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { Upload, FileText, FileCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function ImportPage() {
    const session = await getAdminSession();
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
                        <h1 className="text-3xl font-bold text-text-primary">Import Content</h1>
                        <p className="text-text-secondary mt-2">Bulk import articles and content</p>
                    </div>
                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Import Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* JSON Import */}
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary">JSON Import</h3>
                                <p className="text-text-secondary text-sm">Import from JSON file</p>
                            </div>
                        </div>
                        <p className="text-text-tertiary text-sm mb-4">
                            Upload a JSON file containing an array of articles with title, content, category, and other metadata.
                        </p>
                        <button className="w-full px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors text-text-primary">
                            Select JSON File
                        </button>
                    </div>

                    {/* CSV Import */}
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <FileCheck className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary">CSV Import</h3>
                                <p className="text-text-secondary text-sm">Import from CSV spreadsheet</p>
                            </div>
                        </div>
                        <p className="text-text-tertiary text-sm mb-4">
                            Upload a CSV file with columns for title, content, category, slug, etc. for bulk article creation.
                        </p>
                        <button className="w-full px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors text-text-primary">
                            Select CSV File
                        </button>
                    </div>
                </div>

                {/* Upload Zone */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-8">
                    <div className="border-2 border-dashed border-border-primary rounded-xl p-12 text-center hover:border-accent-primary/50 transition-colors">
                        <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                            Drag and drop files here
                        </h3>
                        <p className="text-text-secondary mb-4">
                            or click to browse from your computer
                        </p>
                        <p className="text-text-tertiary text-sm">
                            Supported formats: JSON, CSV (max 10MB)
                        </p>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-text-primary mb-2">Import Guidelines</h4>
                            <ul className="space-y-1 text-text-secondary text-sm">
                                <li>• Each article must have a title and content field</li>
                                <li>• Slugs will be auto-generated if not provided</li>
                                <li>• Categories must match existing categories in the system</li>
                                <li>• HTML content is supported in the content field</li>
                                <li>• Images should be URLs to externally hosted files</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Sample Template */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Sample JSON Format</h3>
                    <pre className="bg-bg-primary rounded-lg p-4 overflow-x-auto text-sm text-text-secondary">
                        {`[
  {
    "title": "Article Title",
    "slug": "article-slug",
    "category": "Politics",
    "content": "<p>Article content here...</p>",
    "subtitle": "Optional subtitle",
    "coverImage": "https://example.com/image.jpg",
    "featured": false
  }
]`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
