"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    Terminal,
    Info,
    Laptop
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
                                <a href="#downloads">
                                    <Download className="mr-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                    Download Pentasec
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-background/50 backdrop-blur-sm hover:bg-accent/50" asChild>
                                <a href="/docs">
                                    View Documentation
                                </a>
                            </Button>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-primary/5 border border-primary/20 px-5 py-4 rounded-xl mt-4 w-full max-w-lg shadow-sm">
                            <Info className="w-5 h-5 text-primary shrink-0" />
                            <p>Please <a href="/signup" className="text-primary hover:underline font-medium">create an account</a> on the web platform before logging into the desktop application.</p>
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

                {/* 2. DOWNLOADS SECTION */}
                <section id="downloads" className="space-y-8 pt-8 scroll-mt-24">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Choose Your Platform</h2>
                        <p className="text-muted-foreground flex items-center justify-center gap-2">
                            Download the right version for your operating system.
                        </p>
                    </div>

                    <Tabs defaultValue="windows" className="w-full flex flex-col items-center mt-2">
                        <TabsList className="grid w-full max-w-md grid-cols-3 h-14 mb-8 bg-muted/40 border border-border/50 rounded-xl p-1 shadow-sm">
                            <TabsTrigger value="windows" className="flex items-center gap-2 text-sm sm:text-base h-full rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                <Monitor className="w-4 h-4 hidden sm:block" /> Windows
                            </TabsTrigger>
                            <TabsTrigger value="linux" className="flex items-center gap-2 text-sm sm:text-base h-full rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                <Terminal className="w-4 h-4 hidden sm:block" /> Linux
                            </TabsTrigger>
                            <TabsTrigger value="macos" className="flex items-center gap-2 text-sm sm:text-base h-full rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                <Laptop className="w-4 h-4 hidden sm:block" /> macOS
                            </TabsTrigger>
                        </TabsList>

                        <div className="w-full max-w-4xl relative min-h-[220px]">
                            {/* Windows */}
                            <TabsContent value="windows" className="mt-0 outline-none focus-visible:ring-0">
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row gap-6 items-center justify-between p-6 md:p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-[0_4px_30px_-5px_rgba(59,130,246,0.15)] ring-1 ring-inset ring-blue-500/10 hover:bg-blue-500/10 transition-colors">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shrink-0 hidden sm:flex">
                                            <Monitor className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                                Windows
                                                <Badge variant="secondary" className="px-2 py-0.5 text-xs text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-sm">Win 10 & 11</Badge>
                                            </h3>
                                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <p><strong className="text-foreground/80">Size:</strong> 207 MB</p>
                                                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 group cursor-text">
                                                    <strong className="text-foreground/80 shrink-0">SHA-256:</strong>
                                                    <span className="font-mono text-[10px] sm:text-xs opacity-80 group-hover:opacity-100 transition-opacity break-all selection:bg-blue-500/30">3de9e0caab12f984586ca68d0a8b048479899a3bacb51ea04677bf9d8db0fd69</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="lg" className="w-full sm:w-[260px] h-14 rounded-xl text-lg font-semibold shadow-[0_8px_30px_-4px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(59,130,246,0.6)] bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border border-blue-400/20 text-white transition-all group shrink-0" asChild>
                                        <a href="https://github.com/udaypali/PentaSec/releases/download/v1.1.0/Pentasec-Setup-v1.1.0.exe">
                                            <Download className="mr-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                            Download .exe
                                        </a>
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Linux */}
                            <TabsContent value="linux" className="mt-0 outline-none focus-visible:ring-0">
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row gap-6 items-center justify-between p-6 md:p-8 rounded-2xl border border-orange-500/20 bg-orange-500/5 shadow-[0_4px_30px_-5px_rgba(249,115,22,0.15)] ring-1 ring-inset ring-orange-500/10 hover:bg-orange-500/10 transition-colors">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 shrink-0 hidden sm:flex">
                                            <Terminal className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                                Linux
                                                <Badge variant="secondary" className="px-2 py-0.5 text-xs text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-sm">Any Distro</Badge>
                                            </h3>
                                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <p><strong className="text-foreground/80">Size:</strong> 310 MB</p>
                                                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 group cursor-text">
                                                    <strong className="text-foreground/80 shrink-0">SHA-256:</strong>
                                                    <span className="font-mono text-[10px] sm:text-xs opacity-80 group-hover:opacity-100 transition-opacity break-all selection:bg-orange-500/30">e9e6716c666da6840e4c1c5cb119839bdc02cf40c0e23afd8493718326226b35</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="lg" className="w-full sm:w-[260px] h-14 rounded-xl text-lg font-semibold shadow-[0_8px_30px_-4px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(249,115,22,0.6)] bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 border border-orange-400/20 text-white transition-all group shrink-0" asChild>
                                        <a href="https://github.com/udaypali/PentaSec/releases/download/v1.1.0/Pentasec-v1.1.0.AppImage">
                                            <Download className="mr-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                            Download .AppImage
                                        </a>
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* macOS */}
                            <TabsContent value="macos" className="mt-0 outline-none focus-visible:ring-0">
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row gap-6 items-center justify-between p-6 md:p-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 shadow-[0_4px_30px_-5px_rgba(168,85,247,0.15)] ring-1 ring-inset ring-purple-500/10 hover:bg-purple-500/10 transition-colors opacity-95">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 shrink-0 hidden sm:flex">
                                            <Laptop className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                                macOS
                                                <Badge variant="secondary" className="px-2 py-0.5 text-xs text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-sm">Coming Soon</Badge>
                                            </h3>
                                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <p>Support for macOS via DMG installer is in progress.</p>
                                                <p>Stay tuned for updates!</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="lg" variant="outline" className="w-full sm:w-[260px] h-14 rounded-xl text-lg font-semibold border-purple-500/30 text-purple-600/60 cursor-not-allowed shrink-0 bg-purple-500/5" disabled>
                                        <Zap className="mr-2 w-5 h-5 opacity-50" />
                                        Coming Soon
                                    </Button>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
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
                            <a href="#downloads">
                                <Download className="mr-2 w-5 h-5" />
                                Choose Platform
                            </a>
                        </Button>
                        <Button variant="ghost" className="h-12 px-8 text-lg hover:bg-muted/50" asChild>
                            <a href="#changelog">
                                View Full Changelog
                            </a>
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-primary/5 border border-primary/20 px-5 py-4 rounded-xl max-w-lg shadow-sm mt-4 text-left">
                        <Info className="w-5 h-5 text-primary shrink-0" />
                        <p>Please <a href="/signup" className="text-primary hover:underline font-medium">create an account</a> on the web platform before logging into the desktop application.</p>
                    </div>

                </section>

            </div>

            <Footer />

        </main>
    )
}
