"use client"

import { BeforeAfterSlider } from "@/components/before-after-slider"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Shield, Terminal, Sparkles, FileCheck, Zap } from "lucide-react"

export function AIDemo() {
    // Before content - Raw Input
    const beforeContent = (
        <div className="w-full h-full bg-gradient-to-br from-red-950/40 via-zinc-950 to-black p-4 md:p-8 relative flex items-center justify-center cursor-pointer">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Centered card that will be split by diagonal */}
            <div className="relative z-0 max-w-[550px] w-full">
                {/* Raw Data Card */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-red-500/40 transition-all duration-500">
                    {/* Top glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-red-500/10 blur-[50px] rounded-full" />

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-red-500/20 relative">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-400">Raw Finding</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Unprocessed Data</p>
                        </div>
                        <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 text-sm px-3 py-1">
                            RAW
                        </Badge>
                    </div>

                    {/* Terminal code with Typing Animation */}
                    <div className="relative mb-6">
                        <div className="font-mono text-sm space-y-2 bg-black/60 p-6 rounded-xl border border-white/5 relative overflow-hidden min-h-[140px]">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent h-8 animate-scan" />

                            <div className="typing-container">
                                <div className="text-zinc-500">{"{"}</div>
                                <div className="pl-4 text-zinc-400 animate-type-1 overflow-hidden whitespace-nowrap w-0">"vuln": <span className="text-amber-400">"SQLi"</span>,</div>
                                <div className="pl-4 text-zinc-400 animate-type-2 overflow-hidden whitespace-nowrap w-0">"severity": <span className="text-red-400">"High"</span>,</div>
                                <div className="pl-4 text-zinc-400 animate-type-3 overflow-hidden whitespace-nowrap w-0">"url": <span className="text-blue-400">"/login?id=1"</span></div>
                                <div className="text-zinc-500">{"}"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Missing elements */}
                    <div className="grid grid-cols-2 gap-3">
                        {['Missing CVSS Score', 'No Impact Analysis', 'No Remediation Steps', 'No References'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    // After content - AI Report
    const afterContent = (
        <div className="w-full h-full bg-gradient-to-br from-blue-950/40 via-zinc-900 to-black p-4 sm:p-12 md:p-24 lg:p-32 relative flex items-start justify-center cursor-pointer">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Centered card that will be split by diagonal */}
            <div className="relative z-10 max-w-[550px] w-full">
                {/* AI Report Card */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl relative group hover:border-blue-500/40 transition-all duration-500">
                    {/* Top glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/10 blur-[50px] rounded-full" />

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-blue-500/20 p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        SQL Injection
                                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                                    </h3>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wider">AI Enhanced Analysis</p>
                                </div>
                            </div>
                            <Badge variant="destructive" className="text-xl px-3 py-1 font-bold shadow-lg shadow-red-500/20">
                                9.8
                            </Badge>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Critical</Badge>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Auth</Badge>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">DB</Badge>
                        </div>
                    </div>

                    {/* Content with Typing Animation */}
                    <div className="p-6 space-y-4">
                        <div className="bg-zinc-800/40 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-blue-400" />
                                <h4 className="text-sm font-semibold text-white">Impact Analysis</h4>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed animate-type-4 overflow-hidden whitespace-nowrap w-0">
                                Critical database compromise risk detected.
                            </p>
                        </div>

                        <div className="bg-zinc-800/40 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <FileCheck className="w-4 h-4 text-green-400" />
                                <h4 className="text-sm font-semibold text-white">Remediation</h4>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed animate-type-5 overflow-hidden whitespace-nowrap w-0">
                                Use parameterized queries immediately.
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-2">
                            {['CVSS', 'Impact', 'Fix', 'Refs'].map((item, i) => (
                                <div key={i} className="flex items-center justify-center gap-1.5 text-xs text-green-400 bg-green-500/10 rounded-lg p-2 border border-green-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

            <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        See the Magic
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                        Transform raw data into client-ready reports instantly.
                    </p>
                </div>

                <BeforeAfterSlider before={beforeContent} after={afterContent} />
            </div>
        </section>
    )
}
