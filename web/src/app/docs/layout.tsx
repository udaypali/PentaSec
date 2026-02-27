import { DocsSidebar } from "@/components/docs-sidebar"
import { Footer } from "@/components/footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { ArrowLeft, Menu, Hexagon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col relative">
            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-4 justify-between">
                    <Link href="/download" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0">
                            <SheetTitle className="flex items-center gap-2 px-2 pb-6 pt-8">
                                <Hexagon className="w-5 h-5 text-primary" />
                                <span>PENTASEC DOCS</span>
                            </SheetTitle>
                            <ScrollArea className="h-full pl-2 pr-6 pb-12">
                                <DocsSidebar />
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Desktop Back Link */}
            <Link href="/download" className="hidden md:flex absolute top-8 left-8 items-center gap-2 text-muted-foreground hover:text-foreground transition-colors z-20">
                <ArrowLeft className="w-4 h-4" />
                Back to Download
            </Link>

            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 pt-6 md:pt-20 md:pl-20">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r pr-6">
                    <ScrollArea className="h-full py-6 pr-6 lg:py-8">
                        <DocsSidebar />
                    </ScrollArea>
                </aside>
                <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
                    <div className="mx-auto w-full min-w-0 px-4 md:px-0">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}
