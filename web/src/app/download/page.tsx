"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Download,
    ShieldCheck,
    Monitor,
    HardDrive,
    Zap,
    Lock,
    CheckCircle2,
    ArrowRight,
    FileText,
    Terminal
} from "lucide-react"

export default function DownloadPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                }}
            />
            {/* Hero Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none z-0 opacity-20 blur-[120px]"
                style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
            />

            <Navbar />

            <div className="flex-1 container mx-auto px-4 md:px-8 pt-32 pb-20 z-10 flex flex-col space-y-24 md:space-y-32">

                {/* 1. HERO SECTION */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-start space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Badge variant="secondary" className="px-3 py-1 text-sm border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default">
                            v1.1.0 • Latest Release
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                            Secure. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-purple-400">Fast. Local-First.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                            Get the most powerful pentest reporting tool directly on your machine. No cloud dependencies, zero external connections, pure performance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                            <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group" asChild>
                                <a href="https://github.com/udaypali/PentaSecWeb/releases/download/Pentasec/Pentasec-Setup.exe">
                                    <Download className="mr-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                    Download for Windows
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-background/50 backdrop-blur-sm hover:bg-accent/50" asChild>
                                <a href="/docs">
                                    View Documentation
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side Feature Stack */}
                    <div className="relative hidden lg:flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        {/* Card 1 */}
                        <div className="rounded-xl border border-muted/60 bg-card/60 backdrop-blur-md p-6 flex items-start gap-4 shadow-lg hover:border-primary/30 transition-colors">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary"><Zap className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-semibold text-lg">Lightning Fast</h3>
                                <p className="text-sm text-muted-foreground">Generate massive pentest reports in milliseconds.</p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="rounded-xl border border-muted/60 bg-card/60 backdrop-blur-md p-6 flex items-start gap-4 shadow-lg hover:border-primary/30 transition-colors translate-x-4">
                            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500"><Lock className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-semibold text-lg">Complete Privacy</h3>
                                <p className="text-sm text-muted-foreground">Everything stays on your machine, always.</p>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="rounded-xl border border-muted/60 bg-card/60 backdrop-blur-md p-6 flex items-start gap-4 shadow-lg hover:border-primary/30 transition-colors translate-x-8">
                            <div className="p-3 rounded-lg bg-green-500/10 text-green-500"><CheckCircle2 className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-semibold text-lg">Ready to Use</h3>
                                <p className="text-sm text-muted-foreground">One-click installer, fully configured.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. SYSTEM REQUIREMENTS */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-bold text-center">System Requirements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex flex-col gap-2 hover:bg-card/50 transition-colors">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Monitor className="w-5 h-5" />
                                <span className="font-medium">OS Support</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Windows 10 & 11 (64-bit)</p>
                        </div>

                        <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex flex-col gap-2 hover:bg-card/50 transition-colors">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <HardDrive className="w-5 h-5" />
                                <span className="font-medium">File Size</span>
                            </div>
                            <p className="text-sm text-muted-foreground">270 MB</p>
                        </div>

                        <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex flex-col gap-2 hover:bg-card/50 transition-colors relative group overflow-hidden">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="font-medium">Verification (SHA-256)</span>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground break-all opacity-70 group-hover:opacity-100 transition-opacity">
                                2376f5e52dee354dda3b10c44323c0852241d22638a60d0c80365568690966dd
                            </p>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </section>

                {/* 3. WHY CHOOSE PENTASEC (Grid) */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Why Choose Pentasec?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Built by pentesters, for pentesters. We focused on the features that actually matter.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: Lock,
                                title: "Zero-Knowledge Architecture",
                                desc: "Your vulnerabilities never leave your hard drive. Complete data privacy guaranteed.",
                                color: "text-purple-500"
                            },
                            {
                                icon: Zap,
                                title: "Optimized Performance",
                                desc: "Generate massive pentest reports in milliseconds. Built for speed and efficiency.",
                                color: "text-blue-500"
                            },
                            {
                                icon: Download,
                                title: "Instant Installation",
                                desc: "Setup in seconds with bundled installer. Python and dependencies verified automatically.",
                                color: "text-pink-500"
                            },
                            {
                                icon: CheckCircle2,
                                title: "Production Ready",
                                desc: "Used by security teams worldwide. Trusted enterprise-grade pentest reporting.",
                                color: "text-green-500"
                            }
                        ].map((item, i) => (
                            <Card key={i} className="border-border/50 bg-card/20 hover:bg-card/40 transition-all duration-300 group">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl">{item.title}</CardTitle>
                                    <CardDescription className="text-base mt-2">{item.desc}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 4. WHAT'S NEW SECTION */}
                <section id="changelog" className="space-y-8 pt-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-3xl font-bold">What's New</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">See what has changed in the latest version.</p>
                    </div>

                    <Card className="border-border/50 bg-card/20 hover:bg-card/30 transition-all duration-300 max-w-4xl mx-auto">
                        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Terminal className="w-5 h-5 text-primary" />
                                        Version 1.1.0
                                    </CardTitle>
                                    <CardDescription className="mt-1">Latest Release</CardDescription>
                                </div>
                                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">Latest</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-green-500" />
                                    Changes & Improvements
                                </h4>
                                <ul className="space-y-2 ms-6 text-muted-foreground list-disc marker:text-primary/50 text-base">
                                    <li><strong className="text-foreground/90">Backend Auth Migration:</strong> Backend Auth has been shifted to the Render backend server.</li>
                                    <li><strong className="text-foreground/90">App Versioning System:</strong> New App versioning system has been added and migrated to the Render backend server.</li>
                                    <li><strong className="text-foreground/90">Environment Variables Update:</strong> There is no longer a <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-sm">.env</code> file in the backend folder.</li>
                                    <li><strong className="text-foreground/90">Security Cleanup:</strong> All older secrets and credentials have been deleted or are out of use in the new app.</li>
                                    <li><strong className="text-foreground/90">Version Deprecation:</strong> Version 1.0.0 is now discontinued.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 4. BOTTOM CPA */}
                <section className="py-12 flex flex-col items-center text-center space-y-8 relative">
                    {/* Background glow for CTA */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none rounded-3xl" />

                    <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
                    <p className="text-xl text-muted-foreground max-w-xl">
                        Download Pentasec now and experience the future of local-first pentest reporting.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="h-12 px-8 text-lg font-semibold shadow-lg shadow-primary/25" asChild>
                            <a href="https://github.com/udaypali/PentaSecWeb/releases/download/Pentasec/Pentasec-Setup.exe">
                                <Download className="mr-2 w-5 h-5" />
                                Download (.exe)
                            </a>
                        </Button>
                        <Button variant="ghost" className="h-12 px-8 text-lg hover:bg-muted/50" asChild>
                            <a href="#changelog">
                                View Full Changelog
                            </a>
                        </Button>
                    </div>

                </section>

            </div>

            <Footer />

        </main>
    )
}
