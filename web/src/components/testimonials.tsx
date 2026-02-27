"use client"

import { Shield, CheckCircle2, Zap, Terminal, Activity } from "lucide-react"

const testimonials = [
    {
        id: "SEC-001",
        name: "Sarah Chen",
        role: "Senior Pentester",
        company: "CyberGuard",
        content: "PentaSec has cut our reporting time by 60%. The AI understands context better than any template tool I've used.",
        initials: "SC",
        validation: "VERIFIED",
        perfIndex: "Efficiency +60%",
        perfColor: "text-primary"
    },
    {
        id: "SEC-002",
        name: "Marcus Rodriguez",
        role: "Security Consultant",
        company: "Freelance",
        content: "The automated CVSS scoring is a lifesaver. I can focus on finding bugs instead of calculating scores.",
        initials: "MR",
        validation: "AUTHORIZED",
        perfIndex: "Bugs found x2.4",
        perfColor: "text-primary"
    },
    {
        id: "SEC-003",
        name: "Emily Watson",
        role: "CISO",
        company: "TechFlow",
        content: "Finally, a reporting tool that produces documents I'm proud to send to the board. Clean, professional, and accurate.",
        initials: "EW",
        validation: "CERTIFIED",
        perfIndex: "Board Approval 100%",
        perfColor: "text-primary"
    },
]

export function Testimonials() {
    return (
        <section className="py-48 bg-black relative overflow-hidden flex flex-col justify-center min-h-[800px]">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">

                    <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl text-white">
                        Trusted by Pros
                    </h2>
                    <p className="max-w-[800px] text-zinc-400 md:text-xl/relaxed">
                        Hear from the security professionals who rely on PentaSec's AI-driven intelligence every day.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500"
                        >
                            {/* Card Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px]" />

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Window Header */}
                            <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 flex-none">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <div className="font-mono text-[10px] text-zinc-500 tracking-widest">
                                    {testimonial.id}
                                </div>
                            </div>

                            <div className="relative p-6 flex flex-col flex-1 gap-6">
                                {/* Profile Header */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded flex items-center justify-center text-primary font-bold text-lg">
                                            {testimonial.initials}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white tracking-wide text-sm uppercase">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-xs text-zinc-500 font-mono mt-0.5">
                                            {testimonial.role} @ <span className="text-zinc-400">{testimonial.company}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Quote */}
                                <blockquote className="text-zinc-300 text-sm italic leading-relaxed border-l-2 border-primary/20 pl-4">
                                    "{testimonial.content}"
                                </blockquote>

                                {/* Footer Metrics */}
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-auto">
                                    <div className="space-y-1">
                                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-mono">
                                            Validation
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
                                            <Shield className="w-3 h-3" />
                                            {testimonial.validation}
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-mono">
                                            Perf_Index
                                        </div>
                                        <div className={`text-xs font-bold font-mono ${testimonial.perfColor}`}>
                                            {testimonial.perfIndex}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
