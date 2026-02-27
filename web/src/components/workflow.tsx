"use client"

import { Upload, Sparkles, FileCheck, ArrowRight, CheckCircle, GitBranch, Terminal, Code2 } from "lucide-react"
import { motion } from "framer-motion"

// Animated visual components for each card
function UploadAnimation() {
    return (
        <div className="w-full h-48 flex items-center justify-center relative overflow-hidden rounded-t-xl bg-gradient-to-b from-blue-500/5 to-transparent">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 flex items-center gap-8">
                {/* Node 1 */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-8 rounded border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-400 font-mono">
                        RAW
                    </div>
                </div>

                {/* Connection */}
                <div className="w-16 h-[1px] bg-gradient-to-r from-blue-500/50 to-purple-500/50 relative">
                    <motion.div
                        className="absolute top-1/2 left-0 w-2 h-2 bg-blue-400 rounded-full -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        animate={{
                            x: [0, 64],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Node 2 */}
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        className="w-10 h-10 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center"
                        animate={{
                            boxShadow: [
                                "0 0 15px rgba(168,85,247,0.3)",
                                "0 0 30px rgba(168,85,247,0.6)",
                                "0 0 15px rgba(168,85,247,0.3)"
                            ],
                            borderColor: [
                                "rgba(168,85,247,0.3)",
                                "rgba(168,85,247,0.6)",
                                "rgba(168,85,247,0.3)"
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.5, 1] // Sync with particle arrival roughly
                        }}
                    >
                        <Upload className="w-5 h-5 text-purple-400" />
                    </motion.div>
                </div>
            </div>

            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/20 blur-[50px] rounded-full" />
        </div>
    )
}

function AIProcessingAnimation() {
    return (
        <div className="w-full h-48 flex items-center justify-center relative overflow-hidden rounded-t-xl bg-gradient-to-b from-purple-500/5 to-transparent">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 w-48 space-y-2">
                {/* Scanning Beam */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent z-20 pointer-events-none"
                    animate={{
                        y: [-100, 200],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Code Lines */}
                <motion.div
                    initial={{ x: 16 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-2 p-2 rounded border border-white/5 bg-black/40 backdrop-blur-sm"
                >
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <div className="h-1.5 w-20 bg-white/10 rounded-full" />
                    <motion.div
                        className="w-2 h-2 rounded-full bg-green-500 ml-auto"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -8 }}
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="flex items-center gap-2 p-2 rounded border border-white/5 bg-black/40 backdrop-blur-sm"
                >
                    <Code2 className="w-4 h-4 text-pink-400" />
                    <div className="h-1.5 w-24 bg-white/10 rounded-full" />
                </motion.div>

                <motion.div
                    initial={{ x: 8 }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="flex items-center gap-2 p-2 rounded border border-white/5 bg-black/40 backdrop-blur-sm"
                >
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                </motion.div>
            </div>

            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-purple-500/20 blur-[50px] rounded-full" />
        </div>
    )
}

function ReportGenerationAnimation() {
    return (
        <div className="w-full h-48 flex items-center justify-center relative overflow-hidden rounded-t-xl bg-gradient-to-b from-green-500/5 to-transparent">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10">
                <div className="w-24 h-32 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md flex flex-col items-center justify-center relative group">
                    <div className="absolute inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <FileCheck className="w-10 h-10 text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 animate-progress" />
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-6 top-4 p-1.5 rounded-md bg-black/50 border border-white/10 backdrop-blur-md animate-bounce delay-100">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
            </div>

            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-green-500/20 blur-[50px] rounded-full" />
        </div>
    )
}

const steps = [
    {
        title: "Upload Findings",
        description: "Simple integrations with real-time data access and protections power critical notifications.",
        icon: Upload,
        animation: UploadAnimation,
        glow: "group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]",
        borderGlow: "group-hover:border-blue-500/30"
    },
    {
        title: "AI Analyzes & Enhances",
        description: "Build workflows in the UI, extend with code, and embed customizable components.",
        icon: Sparkles,
        animation: AIProcessingAnimation,
        glow: "group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]",
        borderGlow: "group-hover:border-purple-500/30"
    },
    {
        title: "Generate Final Report",
        description: "Community driven and commercially-backed notifications innovation that never locks you in.",
        icon: FileCheck,
        animation: ReportGenerationAnimation,
        glow: "group-hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]",
        borderGlow: "group-hover:border-green-500/30"
    },
]

export function Workflow() {
    return (
        <section className="py-24 relative overflow-hidden bg-black">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        How It Works
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl">
                        From raw data to client-ready report in three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative group rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all duration-500 ${step.glow} ${step.borderGlow}`}
                        >
                            {/* Visual Area */}
                            <step.animation />

                            {/* Content Area */}
                            <div className="p-8 relative z-10">
                                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{step.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
