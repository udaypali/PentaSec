"use client"

import Link from "next/link"
import { Github, Instagram, Linkedin, Hexagon, Globe, Lock, Zap } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-background py-10 border-t border-white/5 relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

            {/* Background Watermark */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.01]">
                <h1 className="text-[17vw] font-black text-foreground leading-none tracking-tighter text-center whitespace-nowrap">
                    PENTASEC
                </h1>
            </div>

            <div className="w-full px-4 md:px-[50px] relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/40">
                                <Hexagon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wider italic">PENTASEC</span>
                        </div>
                        <p className="text-zinc-500 max-w-sm leading-relaxed">
                            Automating pentest reporting for the modern security professional. Built by researchers, for researchers.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Github, href: "https://github.com/udaypali" },
                                { Icon: Instagram, href: "https://www.instagram.com/officer007uday" },
                                { Icon: Linkedin, href: "https://www.linkedin.com/in/udaypali" }
                            ].map(({ Icon, href }, i) => (
                                <Link key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-primary hover:border-primary/30 transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-7 flex flex-row gap-12 sm:gap-24 lg:gap-40 md:justify-end flex-wrap">
                        <div>
                            <h4 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-zinc-500 font-mono">
                                {[
                                    { name: 'Home', href: '/' },
                                    { name: 'About', href: '/about' },
                                    { name: 'Download', href: '/download' },
                                    { name: 'Contact', href: '/contact' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="hover:text-white transition-colors block w-fit">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm text-zinc-500 font-mono">
                                {[
                                    { name: 'Dashboard', href: '/dashboard' },
                                    { name: 'Documentation', href: '/docs' },
                                    { name: 'Login', href: '/login' },
                                    { name: 'Sign Up', href: '/signup' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="hover:text-white transition-colors block w-fit">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-wider text-center lg:text-left">
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-primary" />
                            <span>NODE: GLOBAL_ACTIVE_01</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-green-500" />
                            <span>UPTIME: 99.998%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-3 h-3 text-primary" />
                            <span>AUTH: LEVEL_3_ENC</span>
                        </div>
                    </div>
                    <div>
                        © 2025 PENTASEC_SYSTEMS // ALL RIGHTS RESERVED
                    </div>
                </div>
            </div>
        </footer>
    )
}
