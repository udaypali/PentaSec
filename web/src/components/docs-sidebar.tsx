"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DocsSidebar({ className, ...props }: DocsSidebarProps) {
    const pathname = usePathname()

    const items = [
        {
            title: "Getting Started",
            items: [
                {
                    title: "Introduction",
                    href: "/docs",
                },
                {
                    title: "System Requirements",
                    href: "/docs/requirements",
                },
                {
                    title: "Installation Guide",
                    href: "/docs/installation",
                },
                {
                    title: "Getting Started",
                    href: "/docs/getting-started",
                }
            ],
        },
        {
            title: "Module Guides",
            items: [
                {
                    title: "Dashboard",
                    href: "/docs/modules/dashboard",
                },
                {
                    title: "Report Builder",
                    href: "/docs/modules/report-builder",
                },
                {
                    title: "AI Redaction",
                    href: "/docs/modules/ai-redaction",
                },
                {
                    title: "Evidence Vault",
                    href: "/docs/modules/evidence-vault",
                },
                {
                    title: "Report Archive",
                    href: "/docs/modules/report-archive",
                },
                {
                    title: "Settings",
                    href: "/docs/modules/settings",
                },
            ],
        },
        {
            title: "Reference",
            items: [
                {
                    title: "Security Features",
                    href: "/docs/security",
                },
                {
                    title: "Technical Specs",
                    href: "/docs/technical",
                },
                {
                    title: "Troubleshooting",
                    href: "/docs/troubleshooting",
                },
            ],
        },
    ]

    return (
        <div className={cn("pb-12", className)} {...props}>
            <div className="space-y-4 py-4">
                {items.map((group, i) => (
                    <div key={i} className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight text-muted-foreground">
                            {group.title}
                        </h2>
                        <div className="space-y-1">
                            {group.items.map((item, j) => (
                                <Button
                                    key={j}
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className="w-full justify-start font-normal h-8"
                                    asChild
                                >
                                    <Link href={item.href}>
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
