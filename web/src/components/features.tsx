"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { FileText, ShieldCheck, Zap, Users, ArrowRight, CheckCircle2, AlertCircle, Terminal } from "lucide-react"

// --- Visual Components ---

function CodeWindow() {
    return (
        <div className="w-full h-full bg-[#0a0a0a] rounded-lg border border-white/10 overflow-hidden font-mono text-xs relative group">
            {/* Window Controls */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <div className="ml-auto text-[10px] text-muted-foreground">scan_config.yaml</div>
            </div>
            {/* Code Content */}
            <div className="p-3 space-y-1 text-muted-foreground opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                    <span className="text-white/30">1</span>
                    <span><span className="text-purple-400">target</span>: <span className="text-green-400">"production-api"</span></span>
                </div>
                <div className="flex gap-2">
                    <span className="text-white/30">2</span>
                    <span><span className="text-purple-400">scanners</span>:</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-white/30">3</span>
                    <span className="pl-4">- <span className="text-blue-400">nmap</span>: <span className="text-orange-400">enabled</span></span>
                </div>
                <div className="flex gap-2">
                    <span className="text-white/30">4</span>
                    <span className="pl-4">- <span className="text-blue-400">burp</span>: <span className="text-orange-400">enabled</span></span>
                </div>
                <div className="flex gap-2">
                    <span className="text-white/30">5</span>
                    <span><span className="text-purple-400">output</span>: <span className="text-green-400">"json"</span></span>
                </div>
                <div className="flex gap-2 mt-2">
                    <span className="text-white/30">6</span>
                    <span className="text-primary animate-pulse">_</span>
                </div>
            </div>
            {/* Glow Effect */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
        </div>
    )
}

function CvssShield() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Shield & Score */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                    <ShieldCheck className="w-20 h-20 text-primary/80 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    <div className="absolute inset-0 flex items-center justify-center pt-1">
                        <span className="text-xl font-bold text-white">9.8</span>
                    </div>
                </div>
                <div className="mt-2 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                    Critical
                </div>
            </div>
        </div>
    )
}

function PipelineGraph() {
    return (
        <div className="w-full h-full flex items-center justify-center px-4">
            <div className="relative w-full flex justify-between items-center">
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-white/10 top-1/2 -translate-y-1/2">
                    <div className="absolute left-0 h-full bg-gradient-to-r from-primary to-blue-500 w-2/3 animate-[shimmer_2s_infinite]" />
                </div>

                {/* Nodes */}
                {[
                    { icon: Terminal, color: "text-white" },
                    { icon: Zap, color: "text-blue-400" },
                    { icon: ShieldCheck, color: "text-primary" },
                    { icon: CheckCircle2, color: "text-green-400" }
                ].map((Node, i) => (
                    <div key={i} className="relative z-10 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/20 flex items-center justify-center shadow-lg">
                        <Node.icon className={`w-4 h-4 ${Node.color}`} />
                        {i === 2 && (
                            <div className="absolute -inset-1 bg-primary/30 rounded-full blur-sm animate-pulse" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function MiniDashboard() {
    return (
        <div className="w-full h-full p-4 flex flex-col gap-3">
            {[
                { name: "SQL Injection", severity: "High", time: "2m ago" },
                { name: "XSS Vulnerability", severity: "Medium", time: "15m ago" },
                { name: "Open Port 22", severity: "Low", time: "1h ago" },
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                        <AlertCircle className={`w-4 h-4 ${item.severity === "High" ? "text-red-400" :
                            item.severity === "Medium" ? "text-orange-400" : "text-blue-400"
                            }`} />
                        <span className="text-xs font-medium text-white/80">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
            ))}
        </div>
    )
}

// --- Main Component ---

function SpotlightCard({ children, className = "", spotlightColor = "rgba(168, 85, 247, 0.25)" }: { children: React.ReactNode; className?: string; spotlightColor?: string }) {
    const divRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return
        const div = divRef.current
        const rect = div.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const handleMouseEnter = () => {
        setOpacity(1)
    }

    const handleMouseLeave = () => {
        setOpacity(0)
    }

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-black/40 text-card-foreground shadow-2xl backdrop-blur-md transition-all duration-300",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            <div className="relative h-full flex flex-col">{children}</div>
        </div>
    )
}

export function Features() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Powerful Features
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl">
                        Everything you need to streamline your pentest reporting workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: AI Analysis (Large) */}
                    <SpotlightCard className="md:col-span-2 min-h-[300px] group">
                        <div className="p-8 pb-0 flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Analysis</h3>
                            <p className="text-muted-foreground">Context-aware vulnerability detection using advanced LLMs.</p>
                        </div>
                        <div className="mt-6 ml-8 h-full rounded-tl-xl border-t border-l border-white/10 bg-black/50 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                            <div className="p-6">
                                <CodeWindow />
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Card 2: CVSS Scoring (Square) */}
                    <SpotlightCard className="min-h-[300px] group">
                        <div className="p-8 pb-0">
                            <h3 className="text-xl font-bold text-white mb-2">Auto CVSS</h3>
                            <p className="text-sm text-muted-foreground">Instant severity scoring.</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-6">
                            <CvssShield />
                        </div>
                    </SpotlightCard>

                    {/* Card 3: Pipeline (Square) */}
                    <SpotlightCard className="min-h-[300px] group">
                        <div className="p-8 pb-0">
                            <h3 className="text-xl font-bold text-white mb-2">CI/CD Ready</h3>
                            <p className="text-sm text-muted-foreground">Seamless pipeline integration.</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-6">
                            <PipelineGraph />
                        </div>
                    </SpotlightCard>

                    {/* Card 4: Reporting (Large) */}
                    <SpotlightCard className="md:col-span-2 min-h-[300px] group">
                        <div className="p-8 pb-0 flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">Real-time Reporting</h3>
                            <p className="text-muted-foreground">Live dashboard of security findings and remediation status.</p>
                        </div>
                        <div className="mt-6 mr-8 h-full rounded-tr-xl border-t border-r border-white/10 bg-black/50 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent" />
                            <div className="p-6">
                                <MiniDashboard />
                            </div>
                        </div>
                    </SpotlightCard>
                </div>
            </div>
        </section>
    )
}
