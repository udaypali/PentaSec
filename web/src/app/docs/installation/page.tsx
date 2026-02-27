import { Metadata } from "next"
import { Download, Play, CheckCircle2, Settings } from "lucide-react"

export const metadata: Metadata = {
    title: "Installation Guide - Pentasec Documentation",
    description: "Step-by-step installation instructions for Pentasec.",
}

export default function InstallationPage() {
    return (
        <div className="space-y-10 max-w-4xl pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    Installation Guide
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    The Pentasec desktop application is available as a one-click installer for Windows. Follow these steps to get started.
                </p>
            </div>

            <div className="relative border-l border-primary/20 ml-3 md:ml-6 space-y-12 pb-12">

                {/* Step 1 */}
                <div className="relative pl-8 md:pl-12">
                    <div className="absolute -left-3 md:-left-4 top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                        <span className="text-xs md:text-sm font-bold text-primary">1</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-md hidden md:block">
                                <Download className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Download the Installer</h2>
                        </div>
                        <p className="text-muted-foreground leading-7">
                            Navigate to the <a href="/download" className="text-primary font-medium hover:underline underline-offset-4">Download Page</a> on our official website.
                            Click the "Download for Windows" button to get the latest <code>Pentasec-Setup.exe</code> file (approx. 145 MB).
                        </p>
                        <div className="text-sm bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 p-3 rounded-lg inline-block">
                            <strong>Note:</strong> You can verify the download integrity using the SHA-256 checksum provided on the download page.
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 md:pl-12">
                    <div className="absolute -left-3 md:-left-4 top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                        <span className="text-xs md:text-sm font-bold text-primary">2</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-md hidden md:block">
                                <Play className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Run the Installation Wizard</h2>
                        </div>
                        <p className="text-muted-foreground leading-7">
                            Double-click the downloaded <code>Pentasec-Setup.exe</code> file to launch the installer.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                            <li>If Windows SmartScreen appears, click "More info" and then "Run anyway".</li>
                            <li>The installer will automatically check for and set up necessary dependencies.</li>
                        </ul>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 md:pl-12">
                    <div className="absolute -left-3 md:-left-4 top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                        <span className="text-xs md:text-sm font-bold text-primary">3</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-md hidden md:block">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Launch Pentasec</h2>
                        </div>
                        <p className="text-muted-foreground leading-7">
                            Once the installation is complete, you can launch Pentasec from the Start menu or the desktop shortcut.
                            The application will initialize its local encrypted database on the first run.
                        </p>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 md:pl-12">
                    <div className="absolute -left-3 md:-left-4 top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                        <span className="text-xs md:text-sm font-bold text-primary">4</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-md hidden md:block">
                                <Settings className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Initial Configuration</h2>
                        </div>
                        <p className="text-muted-foreground leading-7">
                            Navigate to the <strong>Settings</strong> tab to configure your experience:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                            <li>Set up your Google Gemini API key for AI features.</li>
                            <li>Choose your preferred theme (Dracula, Emerald, or Fiery).</li>
                            <li>Verify your user profile information.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}
