"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { signOut, useSession } from "next-auth/react"
import { Loader2, User, Mail, Shield, LogOut, Trash2, Edit2, Save, X, AlertTriangle, Image, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    // State for editing
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: ""
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // State for statistics
    const [imageCount, setImageCount] = useState<number>(0)
    const [reportCount, setReportCount] = useState<number>(0)
    const [statsLoading, setStatsLoading] = useState(true)

    // Initialize form data when session loads
    useEffect(() => {
        if (session?.user?.name) {
            const [first, ...last] = session.user.name.split(" ")
            setFormData({
                firstName: first || "",
                lastName: last.join(" ") || ""
            })
        }
    }, [session])

    // Fetch profile statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true)
                const res = await fetch("/api/profile")
                if (res.ok) {
                    const data = await res.json()
                    setImageCount(data.imageCount || 0)
                    setReportCount(data.reportCount || 0)
                }
            } catch (error) {
                console.error("Failed to fetch statistics:", error)
            } finally {
                setStatsLoading(false)
            }
        }

        if (session?.user?.email) {
            fetchStats()
        }
    }, [session])

    const handleUpdateProfile = async () => {
        setLoading(true)
        setMessage("")
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setIsEditing(false)
                setMessage("Profile updated successfully!")
                // Trigger session refresh to fetch new data from database
                await update()
            } else {
                setMessage("Failed to update profile.")
            }
        } catch (error) {
            setMessage("An error occurred.")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setLoading(true)
        setShowDeleteDialog(false)

        try {
            const res = await fetch("/api/profile", { method: "DELETE" })
            if (res.ok) {
                await signOut({ callbackUrl: "/" })
            } else {
                setMessage("Failed to delete account.")
                setLoading(false)
            }
        } catch (error) {
            setMessage("An error occurred.")
            setLoading(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background flex flex-col relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                    animation: 'grid-move 20s linear infinite',
                }}
            />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0 opacity-10 blur-[100px]"
                style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
            />

            {/* Custom Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteDialog(false)} />
                    <div className="relative bg-card border-2 border-destructive/20 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-destructive" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-destructive">Delete Account</h3>
                                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-muted-foreground">
                            Are you sure you want to delete your account? All your data will be permanently removed from our servers forever.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleDeleteAccount}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Navbar />

            <div className="flex-1 container mx-auto px-4 pt-24 pb-16 z-10">
                <div className="max-w-4xl mx-auto space-y-5">

                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <img
                                src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (session?.user?.email || "User")}
                                alt="Profile"
                                className="relative w-20 h-20 rounded-full border-2 border-primary/50 shadow-lg object-cover bg-background"
                            />
                        </div>
                        <div className="text-center md:text-left space-y-1 flex-1 relative">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                Welcome, {session?.user?.name || "User"}
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your profile and view your security reports
                            </p>
                        </div>
                        <Button variant="outline" className="group relative bg-background/50 hover:bg-destructive/10 hover:text-destructive border-destructive/20 hover:border-destructive" onClick={() => signOut({ callbackUrl: "/" })}>
                            <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </Button>
                    </div>

                    {message && (
                        <div className="p-3 rounded-lg bg-muted text-center animate-in fade-in slide-in-from-top-2">
                            {message}
                        </div>
                    )}

                    {/* Profile Details */}
                    <div className="grid md:grid-cols-2 gap-5 items-start">
                        {/* Left Column */}
                        <div className="flex flex-col space-y-5 h-full">
                            <Card className="bg-card/40 backdrop-blur-sm border-border/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        Personal Information
                                    </CardTitle>
                                    {!isEditing ? (
                                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={loading}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" onClick={handleUpdateProfile} disabled={loading}>
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4 pt-3">
                                    {isEditing ? (
                                        <div className="grid gap-4 animate-in fade-in slide-in-from-left-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">First Name</label>
                                                <Input
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Last Name</label>
                                                <Input
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 animate-in fade-in">
                                            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                            <div className="p-3 rounded-lg bg-background/50 border border-border font-medium">
                                                {session?.user?.name || "Not set"}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border opacity-70 cursor-not-allowed">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            {session?.user?.email}
                                        </div>
                                        <p className="text-xs text-muted-foreground ml-1">Email cannot be changed directly</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-destructive/5 backdrop-blur-sm border-destructive/20 flex-1 flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-destructive">
                                        <Trash2 className="w-5 h-5" />
                                        Danger Zone
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={loading}
                                    >
                                        Delete My Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col space-y-5 h-full">
                            <Card className="bg-card/40 backdrop-blur-sm border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        Account Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="font-medium text-primary">Active Member</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        You have full access to all Pentasec features and reports.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/40 backdrop-blur-sm border-border/50 flex-1 flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 flex-1 flex flex-col justify-center">
                                    {statsLoading ? (
                                        <div className="flex items-center justify-center py-6">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-3 rounded-lg bg-background/50 border border-border flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Image className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Images Uploaded</p>
                                                        <p className="text-2xl font-bold text-foreground">{imageCount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-background/50 border border-border flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Reports Generated</p>
                                                        <p className="text-2xl font-bold text-foreground">{reportCount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
