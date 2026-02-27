"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, Terminal, Activity, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
    {
        id: "QRY-01",
        question: "Is my data secure?",
        answer: (
            <div className="flex flex-col space-y-3">
                <span>Yes. The platform is designed to ensure that your data remains under your control at all times.</span>
                <ul className="space-y-3 pl-4 border-l border-white/10 ml-2 my-2">
                    <li className="pl-2">
                        <strong className="text-zinc-200 font-semibold block mb-1">Bring Your Own LLM (BYO-LLM):</strong>
                        You can choose your own large language model for AI-based report generation and redaction. This allows you to operate entirely within your own infrastructure.
                    </li>
                    <li className="pl-2">
                        <strong className="text-zinc-200 font-semibold block mb-1">Local Deployment Option:</strong>
                        You may deploy and run a local LLM within your own environment, ensuring that sensitive data never leaves your system.
                    </li>
                    <li className="pl-2">
                        <strong className="text-zinc-200 font-semibold block mb-1">On-Device Encryption:</strong>
                        All generated reports, redacted images, and stored keys are encrypted locally using AES-256-GCM encryption.
                    </li>
                    <li className="pl-2">
                        <strong className="text-zinc-200 font-semibold block mb-1">No External Data Exposure:</strong>
                        Since processing can be fully self-hosted, your data does not need to be transmitted to third-party servers.
                    </li>
                </ul>
            </div>
        ),
    },
    {
        id: "QRY-02",
        question: "Can I import data from my existing tools?",
        answer: "Yes! We support direct imports from Burp Suite, Nmap, Nessus, Acunetix, and many other standard security tools.",
    },
    {
        id: "QRY-03",
        question: "Do you provide desktop apps?",
        answer: "Yes, we provide fully native desktop applications for Windows, macOS, and Linux, ensuring maximum performance and local data processing.",
    },
    {
        id: "QRY-04",
        question: "How does the AI model work?",
        answer: "The AI model analyzes the input data you provide—such as findings, screenshots, or notes—and processes it using a large language model (LLM) to generate structured security reports and perform intelligent redaction. It understands context, categorizes vulnerabilities, refines technical descriptions, and formats output according to reporting standards. If deployed locally, the model operates entirely within your environment, ensuring that all analysis and report generation occur securely without transmitting sensitive data externally.",
    },
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="py-40 min-h-[800px] bg-background text-foreground overflow-hidden relative flex flex-col justify-center">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />



            <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column - Header & Status */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>

                            <h2 className="text-4xl font-bold tracking-tighter md:text-6xl mb-6">FAQ'S</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Got questions? Our system has processed thousands of queries to provide the most accurate technical documentation.
                            </p>
                        </div>

                        {/* System Status Box */}
                        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">SYSTEM_STATUS</span>
                                <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                                    <Activity className="w-3 h-3" />
                                    <span>OPTIMAL</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-primary w-[99%] shadow-[0_0_10px_var(--primary)]" />
                            </div>

                            <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                                <span>UPTIME: 99.998%</span>
                                <span>LATENCY: 14MS</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Accordion */}
                    <div className="lg:col-span-7 space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={cn(
                                    "group border rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
                                    openIndex === index
                                        ? "bg-zinc-900/80 border-primary/50 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]"
                                        : "bg-zinc-900/30 border-white/5 hover:border-white/10 hover:bg-zinc-900/50"
                                )}
                            >
                                <div className="p-6 flex items-start gap-4">
                                    <span className={cn(
                                        "text-xs font-mono mt-1 transition-colors shrink-0",
                                        openIndex === index ? "text-primary" : "text-zinc-600 group-hover:text-zinc-500"
                                    )}>
                                        {faq.id}
                                    </span>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className={cn(
                                                "text-lg font-medium transition-colors",
                                                openIndex === index ? "text-foreground" : "text-zinc-300"
                                            )}>
                                                {faq.question}
                                            </h3>
                                            <ChevronRight className={cn(
                                                "w-5 h-5 shrink-0 transition-transform duration-300 text-zinc-500",
                                                openIndex === index ? "rotate-90 text-primary" : "group-hover:text-zinc-400"
                                            )} />
                                        </div>

                                        <div className={cn(
                                            "grid transition-[grid-template-rows] duration-300 ease-out",
                                            openIndex === index ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
                                        )}>
                                            <div className="overflow-hidden">
                                                <div className="pl-4 border-l-2 border-primary/20 flex items-start gap-2 text-zinc-400 leading-relaxed">
                                                    <span className="shrink-0 mt-0.5">{">"}</span>
                                                    <div className="flex flex-col sm:flex-row sm:items-end">
                                                        <div className="inline-block">{faq.answer}</div>
                                                        <span className="inline-block w-1.5 h-4 bg-primary/50 ml-2 animate-pulse align-middle" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </section>
    )
}
