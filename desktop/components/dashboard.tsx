'use client';

import { useState, useEffect } from 'react';
import {
    Shield,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle,
    Activity,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    FileText,
    Clock
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

interface Vulnerability {
    id: string;
    name: string;
    status: 'active' | 'frozen' | 'compromised';
    severity?: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
    createdDate: string;
    description: string;
}

interface Project {
    id: string;
    name: string;
    createdDate: string;
    description: string;
    vulnerabilities: Vulnerability[];
}

export function Dashboard({ isActive }: { isActive: boolean }) {
    const [timeRange, setTimeRange] = useState('week');
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isActive) return;
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://127.0.0.1:5000/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, [isActive]);

    // Calculate Stats
    const allVulns = projects.flatMap(p => p.vulnerabilities.map(v => ({ ...v, projectName: p.name })));
    const totalVulns = allVulns.length;

    const statsData = {
        total: totalVulns,
        critical: allVulns.filter(v => v.severity === 'Critical').length,
        high: allVulns.filter(v => v.severity === 'High').length,
        medium: allVulns.filter(v => v.severity === 'Medium' || !v.severity).length, // Default to Medium if undefined
        low: allVulns.filter(v => v.severity === 'Low').length,
        info: allVulns.filter(v => v.severity === 'Info').length
    };

    const severityDistribution = [
        { name: 'Critical', value: statsData.critical, color: '#ef4444' },
        { name: 'High', value: statsData.high, color: '#f97316' },
        { name: 'Medium', value: statsData.medium, color: '#eab308' },
        { name: 'Low', value: statsData.low, color: '#3b82f6' },
        { name: 'Info', value: statsData.info, color: '#6b7280' },
    ].filter(item => item.value > 0);

    // Recent Activity (Last 5 added)
    const recentActivity = [...allVulns]
        .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
        .slice(0, 5);

    // Activity Data (Mock for now, but seeded with real count if possible or just randomized based on total)
    // To make it real, we'd need to aggregate by date.
    // Let's do a simple aggregation by day of week for the current week if possible, or just last 7 days.
    const activityData = [
        { name: 'Mon', count: 0 },
        { name: 'Tue', count: 0 },
        { name: 'Wed', count: 0 },
        { name: 'Thu', count: 0 },
        { name: 'Fri', count: 0 },
        { name: 'Sat', count: 0 },
        { name: 'Sun', count: 0 },
    ];
    // Simple fill based on createdDate (assuming YYYY-MM-DD)
    allVulns.forEach(v => {
        const date = new Date(v.createdDate);
        const day = date.getDay(); // 0 = Sun, 1 = Mon...
        // Map to our array (Mon=0 in array, but 1 in getDay)
        const mapIdx = day === 0 ? 6 : day - 1;
        if (activityData[mapIdx]) {
            activityData[mapIdx].count++;
        }
    });


    const getSeverityColor = (severity?: string) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'info': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
            default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'; // Default Medium
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-background overflow-hidden h-full">
            {/* Header */}
            <div className="px-6 py-3 border-b border-border bg-card/50 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Security Dashboard</h1>
                            <p className="text-xs text-muted">Overview of vulnerability reports and evidence vault activity</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 shrink-0">
                    <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Total Reports</p>
                                <h3 className="text-xl font-bold text-foreground mt-0.5">{statsData.total}</h3>
                            </div>
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <FileText className="w-3.5 h-3.5 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between hover:border-red-500/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Critical</p>
                                <h3 className="text-xl font-bold text-red-500 mt-0.5">{statsData.critical}</h3>
                            </div>
                            <div className="p-1.5 bg-red-500/10 rounded-lg">
                                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-secondary h-1 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full rounded-full" style={{ width: `${totalVulns ? (statsData.critical / totalVulns) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between hover:border-orange-500/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">High</p>
                                <h3 className="text-xl font-bold text-orange-500 mt-0.5">{statsData.high}</h3>
                            </div>
                            <div className="p-1.5 bg-orange-500/10 rounded-lg">
                                <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-secondary h-1 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${totalVulns ? (statsData.high / totalVulns) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between hover:border-yellow-500/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Medium</p>
                                <h3 className="text-xl font-bold text-yellow-500 mt-0.5">{statsData.medium}</h3>
                            </div>
                            <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                                <Shield className="w-3.5 h-3.5 text-yellow-500" />
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-secondary h-1 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${totalVulns ? (statsData.medium / totalVulns) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Low</p>
                                <h3 className="text-xl font-bold text-blue-500 mt-0.5">{statsData.low}</h3>
                            </div>
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                <Info className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-secondary h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${totalVulns ? (statsData.low / totalVulns) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between hover:border-gray-500/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Info</p>
                                <h3 className="text-xl font-bold text-gray-500 mt-0.5">{statsData.info}</h3>
                            </div>
                            <div className="p-1.5 bg-gray-500/10 rounded-lg">
                                <CheckCircle className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-secondary h-1 rounded-full overflow-hidden">
                            <div className="bg-gray-500 h-full rounded-full" style={{ width: `${totalVulns ? (statsData.info / totalVulns) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Left Column: Activity + Recent */}
                    <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">

                        {/* Activity Chart */}
                        <div className="flex-1 min-h-0 bg-card border border-border rounded-xl p-4 flex flex-col">
                            <div className="flex items-center justify-between mb-2 shrink-0">
                                <div>
                                    <h3 className="text-base font-semibold text-foreground">Report Activity</h3>
                                    <p className="text-xs text-muted">Recent findings added to the Evidence Vault</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                            contentStyle={{
                                                backgroundColor: '#0f172a', color: '#f8fafc',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="hsl(var(--primary))"
                                            radius={[4, 4, 0, 0]}
                                            barSize={30}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity List */}
                        <div className="flex-1 min-h-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
                            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0 bg-card">
                                <div>
                                    <h3 className="text-base font-semibold text-foreground">Recent Vulnerabilities</h3>
                                    <p className="text-xs text-muted">Latest vulnerabilities added</p>
                                </div>
                            </div>
                            <div className="overflow-y-auto flex-1 p-0 scrollbar-custom">
                                <div className="divide-y divide-border">
                                    {recentActivity.length === 0 ? (
                                        <div className="px-6 py-8 text-center text-sm text-muted">No recent activity</div>
                                    ) : (
                                        recentActivity.map((activity) => (
                                            <div key={activity.id} className="px-4 py-3 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSeverityColor(activity.severity)} bg-opacity-20 shrink-0`}>
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{activity.name}</h4>
                                                        <div className="flex items-center gap-2 text-[10px] text-muted mt-0.5">
                                                            <span className="truncate max-w-[120px]">{activity.projectName}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {activity.createdDate}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getSeverityColor(activity.severity)}`}>
                                                        {activity.severity || 'Medium'}
                                                    </span>
                                                    <button className="btn-ghost p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Severity Distribution */}
                    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full min-h-0">
                        <div className="shrink-0 mb-2">
                            <h3 className="text-base font-semibold text-foreground mb-0.5">Severity Distribution</h3>
                            <p className="text-xs text-muted">Breakdown by risk level</p>
                        </div>

                        <div className="flex-1 w-full relative min-h-0">
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-3xl font-bold text-foreground">{statsData.total}</span>
                                <span className="text-xs text-muted uppercase tracking-wider">Total</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={severityDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {severityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0f172a', color: '#f8fafc',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '8px',
                                            zIndex: 100 // Ensure tooltip is on top if portal isn't used
                                        }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 space-y-2 shrink-0 overflow-y-auto max-h-[40%]">
                            {severityDistribution.map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-muted-foreground">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground">{item.value}</span>
                                        <span className="text-[10px] text-muted">({Math.round((item.value / statsData.total) * 100)}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
