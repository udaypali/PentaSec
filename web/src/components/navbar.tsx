"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
    Home,
    Info,
    Mail,
    LogIn,
    UserPlus,
    Download,
    User,
    Menu,
    X
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface NavItemProps {
    href: string
    icon: React.ElementType
    label: string
    isActive?: boolean
    onClick?: () => void
}

function NavItem({ href, icon: Icon, label, isActive, onClick }: NavItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "relative group flex shrink-0 items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110",
                isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Icon className="w-5 h-5" />

            {/* Tooltip */}
            <span className="absolute left-14 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-md opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-md border border-border whitespace-nowrap z-50">
                {label}
            </span>
        </Link>
    )
}

export function Navbar({ className }: { className?: string }) {
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = React.useState(false)

    const closeMenu = () => setIsOpen(false)

    return (
        <>
            {/* Mobile Hamburger Button */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden absolute top-6 left-4 z-50 h-10 w-10 rounded-full border-border/40 bg-background/80 backdrop-blur-md shadow-lg text-foreground transition-all duration-300 focus:outline-none"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            <div className={cn(
                // Base styles
                "absolute p-2 md:p-3 bg-background/80 backdrop-blur-md shadow-xl z-50 transition-all duration-300 border-border/40",
                // Mobile styles
                "top-4 left-[76px] w-max max-w-[calc(100vw-5rem)] rounded-2xl border flex flex-row items-center gap-1 sm:gap-2",
                // Overflow handling for small devices
                "overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                // Desktop styles
                "md:absolute md:top-1/2 md:left-0 md:-translate-y-1/2 md:mt-0 md:rounded-r-2xl md:rounded-l-none md:border-y md:border-r md:border-l-0 md:flex-col md:overflow-visible md:w-auto md:h-auto",
                // Visibility transition
                isOpen ? "translate-x-0 opacity-100 scale-100" : "-translate-x-4 opacity-0 scale-95 md:translate-x-0 md:opacity-100 md:scale-100",
                className
            )}>
                {/* Main Navigation */}
                <div className="flex flex-row md:flex-col gap-2 md:gap-2">
                    <NavItem href="/" icon={Home} label="Home" isActive={pathname === "/"} onClick={closeMenu} />
                    <NavItem href="/download" icon={Download} label="Download" isActive={pathname === "/download"} onClick={closeMenu} />
                    <NavItem href="/about" icon={Info} label="About" isActive={pathname === "/about"} onClick={closeMenu} />
                    <NavItem href="/contact" icon={Mail} label="Contact" isActive={pathname === "/contact"} onClick={closeMenu} />
                </div>

                {/* Separator */}
                <div className="w-px h-6 md:h-px md:w-full bg-border/50 mx-1 md:my-3 md:mx-0" />

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 md:gap-4 items-center">
                    {status === "loading" ? (
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-muted animate-pulse" />
                    ) : session ? (
                        <Link href="/dashboard" onClick={closeMenu} className="relative shrink-0 group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110">
                            <Avatar className="h-10 w-10 border-2 border-border hover:border-primary transition-colors">
                                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                                    {session.user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute left-14 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-md opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-md border border-border whitespace-nowrap z-50">
                                Profile
                            </span>
                        </Link>
                    ) : (
                        <Link href="/login" onClick={closeMenu} className="relative shrink-0 group flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-110 transition-all duration-300">
                            <LogIn className="w-5 h-5" />
                            <span className="absolute left-14 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-md opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-md border border-border whitespace-nowrap z-50">
                                Login / Join
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}
