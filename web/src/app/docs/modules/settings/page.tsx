import { Metadata } from "next"
import { Settings, User, Cpu, Palette } from "lucide-react"

export const metadata: Metadata = {
    title: "Settings - Pentasec Documentation",
    description: "Configuration options for Pentasec.",
}

export default function SettingsPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Settings
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Manage your account, tune AI performance, and customize the application appearance.
                </p>
            </div>

            <div className="grid gap-8">

                {/* Account */}
                <div className="flex gap-6 items-start p-6 border rounded-xl bg-card/30">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Account Profile</h3>
                        <p className="text-muted-foreground">
                            Update your personal information and view usage statistics.
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                            <li>Manage display name and email</li>
                            <li>View total reports genreated</li>
                            <li>Sign out of active sessions</li>
                        </ul>
                    </div>
                </div>

                {/* AI Config */}
                <div className="flex gap-6 items-start p-6 border rounded-xl bg-card/30">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">AI Configuration</h3>
                        <p className="text-muted-foreground">
                            Connect your own AI models for report generation.
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                            <li><strong>Model Selection:</strong> Default is Gemini 2.5 Flash.</li>
                            <li><strong>API Keys:</strong> Keys are stored locally using AES-256 encryption.</li>
                            <li><strong>Test Connection:</strong> Verify API validity instantly.</li>
                        </ul>
                    </div>
                </div>

                {/* Appearance */}
                <div className="flex gap-6 items-start p-6 border rounded-xl bg-card/30">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-lg">
                        <Palette className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Appearance</h3>
                        <p className="text-muted-foreground">
                            Choose a theme that fits your aesthetic.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <div className="h-8 w-8 rounded-full bg-[#bd93f9] border-2 border-white/20" title="Dracula (Default)" />
                            <div className="h-8 w-8 rounded-full bg-[#50fa7b] border-2 border-white/20" title="Emerald Green" />
                            <div className="h-8 w-8 rounded-full bg-[#ff5555] border-2 border-white/20" title="Fiery Red" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
