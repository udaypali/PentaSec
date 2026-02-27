"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Globe, Lock, Target, Zap, Terminal } from "lucide-react"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                    animation: 'grid-move 20s linear infinite',
                }}
            />
            {/* Hero Glow */}
            <div className="fixed top-0 right-0 w-[800px] h-[600px] pointer-events-none z-0 opacity-20 blur-[120px]"
                style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
            />



            <Navbar />

            <div className="flex-1 container mx-auto px-4 md:px-8 pt-32 pb-20 z-10 flex flex-col space-y-24 md:space-y-32">

                {/* 1. HERO SECTION */}
                <section className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Badge variant="secondary" className="px-3 py-1 text-sm border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default">
                        About Pentasec
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                        We are building the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-purple-400">Future of Security Reporting.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Pentasec was born from a simple frustration: valuable time wasted on manual reporting. We empower security professionals to focus on what they do best—finding vulnerabilities—while we handle the paperwork.
                    </p>
                </section>

                {/* 2. MISSION & VALUES */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <Target className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl">Our Mission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                To democratize enterprise-grade security reporting tools, making them accessible, fast, and local-first for every pentester.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl">Security First</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                We believe in privacy by design. That's why Pentasec is built to be local-first, ensuring your sensitive data never leaves your control.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl">Innovation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                We constantly push the boundaries of what's possible in automated reporting, using AI to assist, not replace, human expertise.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* 3. TEAM / STORY SECTION */}
                {/* 3. TEAM / STORY SECTION */}
                <section className="relative">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Origin Story</h2>
                        <p className="text-muted-foreground">From frustration to innovation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Narrative Cards */}
                        <div className="space-y-8">
                            {/* Card 1: The Pain */}
                            <div className="relative pl-8 border-l-2 border-primary/20 hover:border-primary transition-colors duration-500 group">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary/20 group-hover:border-primary group-hover:scale-125 transition-all" />
                                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-purple-400" />
                                    The Spark
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/90 transition-colors">
                                    PentaSec was born during long nights spent on <span className="text-purple-400 font-medium">bug bounties and CTFs</span>. Finding the vulnerability was exciting—but writing the report afterward felt like punishment.
                                </p>
                            </div>

                            {/* Card 2: The Idea */}
                            <div className="relative pl-8 border-l-2 border-primary/20 hover:border-primary transition-colors duration-500 group">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary/20 group-hover:border-primary group-hover:scale-125 transition-all" />
                                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    The Realization
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/90 transition-colors">
                                    After hours of proper exploitation, spending another 2 hours formatting documents was draining. <span className="text-yellow-400 italic font-medium">That frustration became the idea.</span>
                                </p>
                            </div>

                            {/* Card 3: The Solution */}
                            <div className="relative pl-8 border-l-2 border-primary/20 hover:border-primary transition-colors duration-500 group">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary/20 group-hover:border-primary group-hover:scale-125 transition-all" />
                                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-green-400" />
                                    The Solution
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/90 transition-colors">
                                    We built an AI-powered platform that turns raw notes into professional reports in <span className="text-green-400 font-bold">minutes, not hours</span>. Built by hackers, for hackers—so you can stay in the terminal longer.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Visual Abstract Representation */}
                        <div className="relative h-full min-h-[400px] flex items-center justify-center">
                            {/* Glowing Backdrops */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent blur-[80px] rounded-full animate-pulse" />

                            {/* Floating Glass Cards Composition */}
                            <div className="relative w-full max-w-md aspect-square">
                                {/* Back Card */}
                                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 shadow-2xl rotate-6 opacity-60 scale-90">
                                    <div className="w-12 h-2 bg-white/10 rounded mb-4" />
                                    <div className="space-y-2">
                                        <div className="w-full h-2 bg-white/5 rounded" />
                                        <div className="w-5/6 h-2 bg-white/5 rounded" />
                                        <div className="w-4/6 h-2 bg-white/5 rounded" />
                                    </div>
                                </div>

                                {/* Middle Card */}
                                <div className="absolute bottom-8 left-8 w-3/4 h-3/4 bg-card border border-white/10 rounded-2xl p-6 shadow-2xl -rotate-3 z-10 backdrop-blur-xl bg-opacity-80">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <div className="w-24 h-2.5 bg-foreground/20 rounded mb-1.5" />
                                            <div className="w-16 h-2 bg-foreground/10 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-full h-20 bg-muted/50 rounded-lg border border-white/5 p-3 flex flex-col gap-2">
                                            <div className="w-full h-1.5 bg-foreground/20 rounded" />
                                            <div className="w-3/4 h-1.5 bg-foreground/20 rounded" />
                                            <div className="w-1/2 h-1.5 bg-foreground/20 rounded" />
                                        </div>
                                    </div>
                                </div>

                                {/* Front Floating Icon */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] z-20 animate-bounce duration-[3000ms]">
                                    <Zap className="w-10 h-10 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



            </div>

            <Footer />

        </main >
    )
}
