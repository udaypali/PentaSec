import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
// import { useSession, signOut } from 'next-auth/react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { User, Cpu, Palette, Save, Settings, Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react'

import { useRouter } from 'next/navigation'

export function SettingsPage() {
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    // const { data: session } = useSession()
    const [pendingTheme, setPendingTheme] = useState<string | undefined>(undefined)
    const [activeTab, setActiveTab] = useState("account")
    const [selectedModel, setSelectedModel] = useState("custom")
    const [modelName, setModelName] = useState("gemini-1.5-flash")
    const [apiKey, setApiKey] = useState("")
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
    const [isSaving, setIsSaving] = useState(false)

    interface UserProfile {
        name: string;
        email: string;
        report_count: number;
        image_count: number;
        picture?: string;
    }

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

    const [profileName, setProfileName] = useState("")
    const [profileEmail, setProfileEmail] = useState("")
    const [isSavingProfile, setIsSavingProfile] = useState(false)

    useEffect(() => {
        if (theme && !pendingTheme) {
            setPendingTheme(theme)
        }
    }, [theme])

    useEffect(() => {
        // Load settings and profile
        fetch('http://localhost:5000/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.ai) {
                    setApiKey(data.ai.apiKey || "")
                    setModelName(data.ai.model || "models/gemini-2.5-flash")
                }
                if (data.user) {
                    setUserProfile(data.user)
                }
            })
            .catch(err => console.error("Failed to load settings", err))

        // Fetch real user profile
        const token = localStorage.getItem('token')
        if (token) {
            fetch('http://localhost:5000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        // Invalid token, sign out
                        handleSignOut()
                        return null
                    }
                    if (res.ok) return res.json()
                    throw new Error("Failed to fetch profile")
                })
                .then(data => {
                    if (data) {
                        setProfileName(data.name || "")
                        setProfileEmail(data.email || "")
                        setUserProfile(data) // Update the full profile state including counts
                    }
                })
                .catch(err => console.error("Failed to load profile", err))
        }
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/auth/signin')
    }

    const handleUpdateProfile = async () => {
        setIsSavingProfile(true)
        const token = localStorage.getItem('token')
        try {
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profileName,
                    email: profileEmail
                })
            })

            if (!res.ok) throw new Error("Failed to update profile")

            // Optionally update the local userProfile state if needed for other parts
            // For now, we just rely on the inputs being improved

        } catch (e) {
            console.error("Failed to update profile", e)
        } finally {
            setIsSavingProfile(false)
        }
    }

    const handleApplyTheme = () => {
        if (pendingTheme) {
            setTheme(pendingTheme)
        }
    }

    const handleTestConnection = async () => {
        setTestStatus('testing')
        try {
            const res = await fetch('http://localhost:5000/api/ai/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    model: modelName
                })
            })

            if (res.ok) {
                setTestStatus('success')
                setTimeout(() => setTestStatus('idle'), 3000)
            } else {
                setTestStatus('error')
            }
        } catch (e) {
            console.error(e)
            setTestStatus('error')
        }
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        try {
            // First get current settings to merge? Or just save what we know. 
            // Ideally we fetch-modify-save or backend handles merge. 
            // Our backend replace entire file content in save_settings, so we should really fetch first or ensure we have full state.
            // For now let's assume we want to update AI settings.
            // A better backend `update_settings` implementation would merge.
            // Let's first fetch current settings again to be safe
            const currentRes = await fetch('http://localhost:5000/api/settings')
            const currentSettings = await currentRes.json()

            const newSettings = {
                ...currentSettings,
                ai: {
                    ...currentSettings.ai,
                    provider: 'gemini',
                    model: modelName,
                    apiKey
                }
            }

            const res = await fetch('http://localhost:5000/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            })

            if (!res.ok) throw new Error("Failed to save")

            // Maybe show success state on button

        } catch (e) {
            console.error("Failed to save", e)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-background overflow-hidden section-divider">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
                        <p className="text-xs text-muted">Manage your account and application preferences</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-row overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-64 border-r border-border bg-muted/30 py-6 flex flex-col gap-1 px-3">
                    <TabsList className="bg-transparent flex flex-col h-auto p-0 gap-1 w-full justify-start">
                        <TabsTrigger
                            value="account"
                            className="w-full justify-start px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary mb-1 text-sm font-medium"
                        >
                            <User className="w-4 h-4 mr-3" />
                            Account Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="ai"
                            className="w-full justify-start px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary mb-1 text-sm font-medium"
                        >
                            <Cpu className="w-4 h-4 mr-3" />
                            AI & Model
                        </TabsTrigger>
                        <TabsTrigger
                            value="appearance"
                            className="w-full justify-start px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-sm font-medium"
                        >
                            <Palette className="w-4 h-4 mr-3" />
                            Appearance
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-background scrollbar-custom">
                    <div className="max-w-2xl">
                        <TabsContent value="account" className="mt-0 space-y-8 animate-in fade-in-50 duration-300">
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Account Profile</h3>
                                <p className="text-sm text-muted-foreground mb-6">Manage your account and view usage statistics.</p>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Profile Card */}
                                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col space-y-4">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20">
                                                {userProfile?.picture ? (
                                                    <img
                                                        src={userProfile.picture}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <User className={`w-8 h-8 text-primary ${userProfile?.picture ? 'hidden' : ''}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold">Profile Details</h4>
                                                <p className="text-sm text-muted-foreground">Update your personal information</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={profileName}
                                                    onChange={(e) => setProfileName(e.target.value)}
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileEmail}
                                                    onChange={(e) => setProfileEmail(e.target.value)}
                                                    placeholder="email@example.com"
                                                    disabled
                                                />
                                            </div>
                                            <Button onClick={handleUpdateProfile} disabled={isSavingProfile} className="w-full mt-2">
                                                {isSavingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                                Update Profile
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-200 dark:border-red-900"
                                                onClick={handleSignOut}
                                            >
                                                Sign Out
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Usage Stats */}
                                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-6">
                                        <h4 className="text-lg font-medium mb-4">Usage Statistics</h4>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <span className="text-sm text-muted-foreground">Reports Generated</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-primary">{userProfile?.report_count || 0}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">/ Unlimited</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <span className="text-sm text-muted-foreground">Images Redacted</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-primary">{userProfile?.image_count || 0}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">/ Unlimited</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            <span>You are on the Pro plan with unlimited usage.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="ai" className="mt-0 space-y-8 animate-in fade-in-50 duration-300">
                            <div>
                                <h3 className="text-xl font-semibold mb-1">AI Configuration</h3>
                                <p className="text-sm text-muted-foreground mb-6">Configure AI models and API keys for report generation.</p>
                                <div className="space-y-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="model" className="text-base">AI Model</Label>
                                        <Select defaultValue="custom" value={selectedModel} onValueChange={setSelectedModel}>
                                            <SelectTrigger id="model" className="max-w-md">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="custom">Custom Model</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {selectedModel === 'custom' && (
                                        <div className="grid gap-3 animate-in fade-in-50 zoom-in-95 duration-200">
                                            <Label htmlFor="customModelName" className="text-base">Custom Model Name</Label>
                                            <Input
                                                id="customModelName"
                                                placeholder="Enter your Model Name"
                                                className="max-w-md"
                                                value={modelName}
                                                onChange={(e) => setModelName(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">Enter the exact model identifier expected by the API.</p>
                                        </div>
                                    )}
                                    <div className="grid gap-3">
                                        <Label htmlFor="apiKey" className="text-base">API Key</Label>
                                        <Input
                                            id="apiKey"
                                            type="password"
                                            placeholder="Enter your API Key"
                                            className="max-w-md"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">Your key is stored locally and never sent to our servers.</p>
                                    </div>

                                    {/* Test Connection Area */}
                                    <div className="flex items-center justify-between border p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-base font-medium">Test Configuration</Label>
                                                {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                {testStatus === 'error' && <XCircle className="w-4 h-4 text-destructive" />}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {testStatus === 'idle' && "Verify your API key and model settings"}
                                                {testStatus === 'testing' && "Connecting to AI provider..."}
                                                {testStatus === 'success' && "Connection verified successfully"}
                                                {testStatus === 'error' && "Connection failed. Check your API key."}
                                            </p>
                                        </div>
                                        <Button
                                            variant={testStatus === 'success' ? "outline" : "secondary"}
                                            size="sm"
                                            onClick={handleTestConnection}
                                            disabled={testStatus === 'testing'}
                                            className={testStatus === 'success' ? "border-green-500 text-green-500 hover:text-green-600 hover:bg-green-50" : ""}
                                        >
                                            {testStatus === 'testing' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Testing
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 mr-2" />
                                                    Test Connection
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <Button onClick={handleSaveSettings} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Settings
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="appearance" className="mt-0 space-y-8 animate-in fade-in-50 duration-300">
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Appearance</h3>
                                <p className="text-sm text-muted-foreground mb-6">Customize the look and feel of the application.</p>
                                <div className="space-y-6">
                                    <div className="grid gap-4">
                                        <Label className="text-base">Theme Preference</Label>
                                        <div className="grid grid-cols-3 gap-4 max-w-xl">
                                            {/* Dracula Purple Card */}
                                            <div
                                                onClick={() => setPendingTheme('dracula')}
                                                className={`border-2 rounded-lg p-3 bg-[#1e1e2e] cursor-pointer transition-all ${pendingTheme === 'dracula' ? 'border-[#bd93f9]' : 'border-border hover:border-[#bd93f9]'}`}
                                            >
                                                <div className="h-4 w-full bg-[#bd93f9]/20 rounded-sm mb-3"></div>
                                                <div className="h-2 w-2/3 bg-[#bd93f9] rounded-sm mb-1"></div>
                                                <div className="h-2 w-1/2 bg-[#44475a] rounded-sm"></div>
                                                <p className="text-sm font-medium mt-3 text-center text-[#f8f8f2]">Dracula Purple</p>
                                            </div>

                                            {/* Emerald Green Card */}
                                            <div
                                                onClick={() => setPendingTheme('emerald')}
                                                className={`border-2 rounded-lg p-3 bg-[#022c22] cursor-pointer transition-all ${pendingTheme === 'emerald' ? 'border-[#10b981]' : 'border-border hover:border-[#10b981]'}`}
                                            >
                                                <div className="h-4 w-full bg-[#10b981]/20 rounded-sm mb-3"></div>
                                                <div className="h-2 w-2/3 bg-[#10b981] rounded-sm mb-1"></div>
                                                <div className="h-2 w-1/2 bg-[#064e3b] rounded-sm"></div>
                                                <p className="text-sm font-medium mt-3 text-center text-[#ecfdf5]">Emerald Green</p>
                                            </div>

                                            {/* Fiery Red Card */}
                                            <div
                                                onClick={() => setPendingTheme('fiery')}
                                                className={`border-2 rounded-lg p-3 bg-[#450a0a] cursor-pointer transition-all ${pendingTheme === 'fiery' ? 'border-[#ef4444]' : 'border-border hover:border-[#ef4444]'}`}
                                            >
                                                <div className="h-4 w-full bg-[#ef4444]/20 rounded-sm mb-3"></div>
                                                <div className="h-2 w-2/3 bg-[#ef4444] rounded-sm mb-1"></div>
                                                <div className="h-2 w-1/2 bg-[#7f1d1d] rounded-sm"></div>
                                                <p className="text-sm font-medium mt-3 text-center text-[#fef2f2]">Fiery Red</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <Button onClick={handleApplyTheme}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Apply Changes
                                </Button>
                            </div>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
