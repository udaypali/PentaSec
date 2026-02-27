"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowRight, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
    const [copied, setCopied] = useState(false)
    const email = "udaypali134@gmail.com"

    const handleCopy = () => {
        navigator.clipboard.writeText(email)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

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
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none z-0 opacity-20 blur-[120px]"
                style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
            />

            <Navbar />

            <div className="flex-1 container mx-auto px-4 md:px-8 pt-32 pb-20 z-10 flex flex-col items-center justify-center min-h-[80vh] space-y-12">

                {/* Header */}
                <div className="text-center space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Badge variant="secondary" className="px-3 py-1 text-sm border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default">
                        Contact Us
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                        Let's Talk <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-purple-400">Security.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Have questions about Pentasec? Need a custom enterprise integration? Or just want to say hi? We're here.
                    </p>
                </div>

                {/* Email Card */}
                <Card className="w-full max-w-md border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 shadow-2xl animate-in fade-in zoom-in-95 duration-700 delay-200 group">
                    <CardHeader className="text-center pb-2">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                            <Mail className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-2xl">Email Us</CardTitle>
                        <CardDescription>Direct line to our team.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 p-1 pl-4 rounded-xl border border-border bg-background/50">
                            <code className="flex-1 font-mono text-sm text-foreground overflow-hidden text-ellipsis">
                                {email}
                            </code>
                            <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0" onClick={handleCopy}>
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                        <Button className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20" asChild>
                            <a href={`mailto:${email}`}>
                                Send Message
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

            </div>

            <Footer />
        </main>
    )
}
