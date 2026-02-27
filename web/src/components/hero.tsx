"use client"

import { useUnicornStudio } from "@/hooks/use-unicorn-studio"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export function Hero() {
    useUnicornStudio("N5E11DYDK03bIVWPgqV9")

    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            <Navbar />
            {/* AI Grid Background - Unicorn Studio */}
            <div className="absolute inset-0 z-0 bg-background overflow-hidden">
                <div
                    data-us-project="N5E11DYDK03bIVWPgqV9"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                ></div>
            </div>

            <div className="container px-4 md:px-6 z-10 w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Left Side - Heading */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Pentest Reporting Made Effortless.
                        </h1>
                    </div>

                    {/* Center Gap for Animation Stream */}
                    <div className="hidden lg:block"></div>

                    {/* Right Side - Subtext & Buttons */}
                    <div className="flex flex-col items-center text-center lg:items-end lg:text-right gap-6 pt-8 lg:pt-0">
                        <p className="hidden md:block text-xl text-muted-foreground max-w-md">
                            Streamline your security assessments with our AI-powered platform. Generate comprehensive reports in minutes, not days.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link href="/download" className="w-full sm:w-auto">
                                <Button size="default" className="w-full sm:w-auto px-6 py-5 rounded-lg text-lg">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/about" className="w-full sm:w-auto">
                                <Button size="default" variant="outline" className="w-full sm:w-auto px-6 py-5 rounded-lg text-lg">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
