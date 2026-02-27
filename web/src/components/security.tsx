"use client"

import { Shield, Lock, Server, Globe, Activity, Zap, Cpu, Hexagon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Security() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">

                    {/* Left Column - Header & Status */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs tracking-widest uppercase mb-6">
                                <Activity className="w-3 h-3" />
                                SECURITY_INFRASTRUCTURE
                            </div>
                            <h2 className="text-5xl font-bold tracking-tighter text-white mb-6">
                                Enterprise Security Hub
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Deploying multi-layer defense architectures to ensure absolute data sovereignty.
                            </p>
                        </div>

                        {/* Status Widget */}
                        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">GLOBAL_STATUS</span>
                                <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span>OPERATIONAL</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-zinc-400">Firewall_Uptime</span>
                                        <span className="text-primary">99.99%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[99.99%]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-zinc-400">Encryption_Load</span>
                                        <span className="text-blue-400">12.4ms</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[45%]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-zinc-400">Threat_Level</span>
                                        <span className="text-green-400">ALPHA</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[15%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1 */}
                        <div className="group bg-zinc-900/30 border border-white/10 hover:border-primary/50 transition-all duration-300 rounded-xl p-6 flex flex-col justify-between min-h-[240px]">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono text-zinc-600 uppercase">SEC-01</div>
                                        <div className="text-xs font-mono text-primary">ENCRYPTED</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">END-TO-END ENCRYPTION</h3>
                                <p className="text-sm text-zinc-400">AES-256 at rest and TLS 1.3 in transit.</p>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                                <span className="text-[10px] font-mono text-zinc-600">SEC_STAT</span>
                                <span className="text-sm font-mono text-white">256-bit</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-zinc-900/30 border border-white/10 hover:border-primary/50 transition-all duration-300 rounded-xl p-6 flex flex-col justify-between min-h-[240px]">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Server className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono text-zinc-600 uppercase">SEC-02</div>
                                        <div className="text-xs font-mono text-primary">LOCAL</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">LOCAL PROCESSING</h3>
                                <p className="text-sm text-zinc-400">Data stays on your machine, air-gapped from our servers.</p>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                                <span className="text-[10px] font-mono text-zinc-600">SEC_STAT</span>
                                <span className="text-sm font-mono text-white">0ms Latency</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-zinc-900/30 border border-white/10 hover:border-green-500/50 transition-all duration-300 rounded-xl p-6 flex flex-col justify-between min-h-[240px]">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                        <Globe className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono text-zinc-600 uppercase">SEC-03</div>
                                        <div className="text-xs font-mono text-green-500">CERTIFIED</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">GDPR COMPLIANT</h3>
                                <p className="text-sm text-zinc-400">Full compliance with global privacy regulations.</p>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                                <span className="text-[10px] font-mono text-zinc-600">SEC_STAT</span>
                                <span className="text-sm font-mono text-white">ISO-27001</span>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="group bg-zinc-900/30 border border-white/10 hover:border-orange-500/50 transition-all duration-300 rounded-xl p-6 flex flex-col justify-between min-h-[240px]">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                        <Lock className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono text-zinc-600 uppercase">SEC-04</div>
                                        <div className="text-xs font-mono text-orange-500">PRIVATE</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">ZERO RETENTION</h3>
                                <p className="text-sm text-zinc-400">No data logs or model training on your sensitive inputs.</p>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                                <span className="text-[10px] font-mono text-zinc-600">SEC_STAT</span>
                                <span className="text-sm font-mono text-white">No Logs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-white/5 pt-12">
                    {[
                        { icon: Zap, label: "QUANTUM_READY" },
                        { icon: Activity, label: "REALTIME_AUDIT" },
                        { icon: Cpu, label: "CORE_ISOLATION" },
                        { icon: Hexagon, label: "HEX_VALIDATION" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-zinc-500 font-mono text-xs tracking-wider">
                            <item.icon className="w-4 h-4 text-primary/50" />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
