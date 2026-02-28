'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, FolderOpen, FileText, Image as ImageIcon, FileCode, Hash, CheckCircle, AlertTriangle, Plus, ArrowLeft, Download, Eye, Folder, ChevronRight, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FileItem {
    id: string;
    name: string;
    size: string;
    hash: string;
    dateAdded: string;
}

interface VulnerabilityFolder {
    logs: FileItem[];
    images: FileItem[];
    reports: FileItem[];
}

interface Vulnerability {
    id: string;
    name: string;
    status: 'active' | 'frozen' | 'compromised';
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
    createdDate: string;
    frozenDate?: string;
    vulnerabilityHash?: string;
    folders: VulnerabilityFolder;
    description: string;
}

interface Project {
    id: string;
    name: string;
    createdDate: string;
    description: string;
    vulnerabilities: Vulnerability[];
}

// Mock data
const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Project Ares',
        createdDate: '2026-01-15',
        description: 'Critical security assessment for financial systems',
        vulnerabilities: [
            {
                id: 'v1',
                name: 'SQL Injection in Login Form',
                status: 'frozen',
                severity: 'Critical',
                createdDate: '2026-01-15',
                frozenDate: '2026-01-18',
                vulnerabilityHash: 'a3f9c8e1b2d4567890abcdef1234567890abcdef1234567890abcdef12345678',
                description: 'Critical SQL injection vulnerability discovered in authentication module',
                folders: {
                    logs: [
                        { id: 'l1', name: 'sqlmap_scan.log', size: '2.4 MB', hash: 'b4e7...932f', dateAdded: '2026-01-15' },
                        { id: 'l2', name: 'burp_results.xml', size: '1.8 MB', hash: 'd2a1...4f3e', dateAdded: '2026-01-15' },
                    ],
                    images: [
                        { id: 'i1', name: 'sql_injection_proof.png', size: '1.2 MB', hash: 'c8d2...4a1e', dateAdded: '2026-01-16' },
                        { id: 'i2', name: 'database_dump.png', size: '890 KB', hash: 'e3f1...9b2c', dateAdded: '2026-01-16' },
                    ],
                    reports: [
                        { id: 'r1', name: 'vulnerability_report.pdf', size: '5.8 MB', hash: 'e1f3...7b9c', dateAdded: '2026-01-18' },
                    ],
                },
            },
            {
                id: 'v2',
                name: 'XSS in Comment Section',
                status: 'frozen',
                severity: 'Medium',
                createdDate: '2026-01-16',
                frozenDate: '2026-01-19',
                vulnerabilityHash: 'b8e2d9f3c1a4567890fedcba9876543210fedcba9876543210fedcba98765432',
                description: 'Stored XSS vulnerability in user comments',
                folders: {
                    logs: [
                        { id: 'l3', name: 'xss_payload_tests.txt', size: '156 KB', hash: 'f4d2...1a8e', dateAdded: '2026-01-16' },
                    ],
                    images: [
                        { id: 'i3', name: 'xss_alert_demo.png', size: '745 KB', hash: 'a1b2...c3d4', dateAdded: '2026-01-17' },
                    ],
                    reports: [
                        { id: 'r2', name: 'xss_analysis.pdf', size: '3.2 MB', hash: 'c9d8...e7f6', dateAdded: '2026-01-19' },
                    ],
                },
            },
        ],
    },
    {
        id: '2',
        name: 'Project Phoenix',
        createdDate: '2026-01-25',
        description: 'Web application penetration testing',
        vulnerabilities: [
            {
                id: 'v3',
                name: 'CSRF in Profile Update',
                status: 'active',
                severity: 'High',
                createdDate: '2026-01-25',
                description: 'Cross-site request forgery in user profile',
                folders: {
                    logs: [
                        { id: 'l4', name: 'csrf_test_log.txt', size: '89 KB', hash: 'd3c2...b1a0', dateAdded: '2026-01-25' },
                    ],
                    images: [
                        { id: 'i4', name: 'csrf_poc.png', size: '512 KB', hash: 'e4f5...a6b7', dateAdded: '2026-01-26' },
                    ],
                    reports: [],
                },
            },
        ],
    },
];

export function EvidenceVault() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    // New Project State
    const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [newProjectError, setNewProjectError] = useState('');

    // New Vulnerability State
    const [isNewVulnDialogOpen, setIsNewVulnDialogOpen] = useState(false);
    const [newVulnName, setNewVulnName] = useState('');
    const [newVulnSeverity, setNewVulnSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low' | 'Info'>('Medium');
    const [newVulnDescription, setNewVulnDescription] = useState('');
    const [newVulnError, setNewVulnError] = useState('');

    // Add Evidence State
    const [isAddEvidenceDialogOpen, setIsAddEvidenceDialogOpen] = useState(false);
    const [newEvidenceName, setNewEvidenceName] = useState('');
    const [newEvidenceType, setNewEvidenceType] = useState<'log' | 'image' | 'report'>('log');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // View Evidence State
    const [viewingEvidence, setViewingEvidence] = useState<any | null>(null);

    const [viewingContent, setViewingContent] = useState<string | null>(null);
    const [showFrozenSuccessDialog, setShowFrozenSuccessDialog] = useState(false);
    const [showEmptyFreezeWarning, setShowEmptyFreezeWarning] = useState(false);
    const [showFreezeErrorDialog, setShowFreezeErrorDialog] = useState(false);

    useEffect(() => {
        if (viewingEvidence && selectedProject && selectedVulnerability) {
            const fetchContent = async () => {
                try {
                    const res = await fetch(`http://127.0.0.1:5000/api/projects/${selectedProject.id}/vulnerabilities/${selectedVulnerability.id}/evidence/${viewingEvidence.id}/file?type=${viewingEvidence.type}`);
                    if (res.ok) {
                        if (viewingEvidence.type === 'image') {
                            const blob = await res.blob();
                            setViewingContent(URL.createObjectURL(blob));
                        } else {
                            const text = await res.text();
                            setViewingContent(text);
                        }
                    } else {
                        setViewingContent("Error loading file content.");
                    }
                } catch (e) {
                    console.error("Error fetching file:", e);
                    setViewingContent("Error fetching file content.");
                }
            };
            fetchContent();
        } else {
            setViewingContent(null);
        }
    }, [viewingEvidence, selectedProject, selectedVulnerability]);

    // Fetch projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Try fetching from backend
                const res = await fetch('http://127.0.0.1:5000/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setProjects(data);
                        return;
                    }
                }
                // Fallback (prioritize backend, but keep logic simple)
                if (res.ok) {
                    // setProjects(data); // Already done above
                } else {
                    setProjects(mockProjects);
                }
            } catch (error) {
                console.error("Backend fetch failed, using mock data", error);
                setProjects(mockProjects);
            }
        };
        fetchProjects();
    }, []);

    const handleFreezeVulnerability = async (projectId: string, vuln_id: string) => {
        // Validate evidence existence
        const vuln = projects.find(p => p.id === projectId)?.vulnerabilities.find(v => v.id === vuln_id);
        if (!vuln) return;

        const totalEvidence = vuln.folders.logs.length + vuln.folders.images.length + vuln.folders.reports.length;
        if (totalEvidence === 0) {
            setShowEmptyFreezeWarning(true);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/projects/${projectId}/vulnerabilities/${vuln_id}/freeze`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to freeze vulnerability');
            }

            // Refresh data
            const data = await response.json();

            // Update local state to reflect frozen status immediately
            const updatedProjects = projects.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        vulnerabilities: p.vulnerabilities.map(v => {
                            if (v.id === vuln_id) {
                                return data; // Replace with updated vuln from server
                            }
                            return v;
                        })
                    };
                }
                return p;
            });
            setProjects(updatedProjects);

            // Update selected states to reflect changes immediately
            if (selectedProject && selectedProject.id === projectId) {
                const updatedProject = updatedProjects.find(p => p.id === projectId);
                if (updatedProject) {
                    setSelectedProject(updatedProject);

                    if (selectedVulnerability && selectedVulnerability.id === vuln_id) {
                        const updatedVuln = updatedProject.vulnerabilities.find(v => v.id === vuln_id);
                        if (updatedVuln) {
                            setSelectedVulnerability(updatedVuln);
                        }
                    }
                }
            }

            // Show success dialog
            setShowFrozenSuccessDialog(true);

        } catch (error) {
            console.error("Error freezing vulnerability:", error);
            setShowFreezeErrorDialog(true);
        }
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        const newProject = {
            name: newProjectName,
            description: newProjectDescription
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            });

            if (res.ok) {
                const createdProject = await res.json();
                setProjects([...projects, createdProject]);
                setNewProjectName('');
                setNewProjectDescription('');
                setNewProjectError('');
                setIsNewProjectDialogOpen(false);
            } else {
                const errorData = await res.json();
                setNewProjectError(errorData.error || "Failed to save project");
                console.error("Failed to save project:", errorData);
            }
        } catch (e) {
            console.error("Error saving project:", e);
            // Only fallback if the error is a network error (not a validation error that we already handled)
            if (!newProjectError) {
                const fallbackProject: Project = {
                    id: Date.now().toString(),
                    name: newProjectName,
                    description: newProjectDescription,
                    createdDate: new Date().toISOString().split('T')[0],
                    vulnerabilities: []
                };
                setProjects([...projects, fallbackProject]);
                setIsNewProjectDialogOpen(false);
            }
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/projects/${projectId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setProjects(projects.filter(p => p.id !== projectId));
            } else {
                console.error("Failed to delete project");
            }
        } catch (err) {
            console.error("Error deleting project:", err);
            // Fallback for UI if backend is down (mock delete)
            setProjects(projects.filter(p => p.id !== projectId));
        }
    };

    const handleCreateVulnerability = async () => {
        if (!selectedProject || !newVulnName.trim()) return;

        const newVuln = {
            name: newVulnName,
            severity: newVulnSeverity,
            description: newVulnDescription
        };

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/projects/${selectedProject.id}/vulnerabilities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVuln)
            });

            if (res.ok) {
                const createdVuln = await res.json();

                // Update local state
                const updatedProject = {
                    ...selectedProject,
                    vulnerabilities: [...selectedProject.vulnerabilities, createdVuln]
                };

                // Update selected project view
                setSelectedProject(updatedProject);

                // Update projects list
                setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));

                setNewVulnName('');
                setNewVulnSeverity('Medium');
                setNewVulnDescription('');
                setNewVulnError('');
                setIsNewVulnDialogOpen(false);
            } else {
                const errorData = await res.json();
                setNewVulnError(errorData.error || "Failed to save vulnerability");
                console.error("Failed to save vulnerability:", errorData);
            }
        } catch (e) {
            console.error("Error saving vulnerability:", e);
            if (!newVulnError) {
                // local fallback code if preferred, or simply do nothing
            }
        }
    };

    const handleDeleteVulnerability = async (vulnId: string) => {
        if (!selectedProject) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/projects/${selectedProject.id}/vulnerabilities/${vulnId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Update local state
                const updatedProject = {
                    ...selectedProject,
                    vulnerabilities: selectedProject.vulnerabilities.filter(v => v.id !== vulnId)
                };

                setSelectedProject(updatedProject);
                setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
            } else {
                console.error("Failed to delete vulnerability");
            }
        } catch (e) {
            console.error("Error deleting vulnerability:", e);
        }
    }


    const handleAddEvidence = async () => {
        if (!selectedProject || !selectedVulnerability || !newEvidenceName.trim() || !selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', newEvidenceName);
        formData.append('type', newEvidenceType);

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/projects/${selectedProject.id}/vulnerabilities/${selectedVulnerability.id}/evidence`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const createdEvidence = await res.json();
                const folderName = newEvidenceType === 'log' ? 'logs' : newEvidenceType === 'image' ? 'images' : 'reports';

                // Update local state
                const updatedVuln = {
                    ...selectedVulnerability,
                    folders: {
                        ...selectedVulnerability.folders,
                        [folderName]: [...selectedVulnerability.folders[folderName], createdEvidence]
                    }
                };

                const updatedProject = {
                    ...selectedProject,
                    vulnerabilities: selectedProject.vulnerabilities.map(v => v.id === selectedVulnerability.id ? updatedVuln : v)
                };

                setSelectedVulnerability(updatedVuln);
                setSelectedProject(updatedProject);
                setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));

                setNewEvidenceName('');
                setNewEvidenceType('log');
                setSelectedFile(null);
                setIsAddEvidenceDialogOpen(false);
            } else {
                console.error("Failed to add evidence");
            }
        } catch (e) {
            console.error("Error adding evidence:", e);
        }
    };

    const handleDeleteEvidence = async (evidenceId: string, type: 'log' | 'image' | 'report') => {
        if (!selectedProject || !selectedVulnerability) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/projects/${selectedProject.id}/vulnerabilities/${selectedVulnerability.id}/evidence/${evidenceId}?type=${type}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                const folderName = type === 'log' ? 'logs' : type === 'image' ? 'images' : 'reports';

                // Update local state
                const updatedVuln = {
                    ...selectedVulnerability,
                    folders: {
                        ...selectedVulnerability.folders,
                        [folderName]: selectedVulnerability.folders[folderName].filter(f => f.id !== evidenceId)
                    }
                };

                const updatedProject = {
                    ...selectedProject,
                    vulnerabilities: selectedProject.vulnerabilities.map(v => v.id === selectedVulnerability.id ? updatedVuln : v)
                };

                setSelectedVulnerability(updatedVuln);
                setSelectedProject(updatedProject);
                setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
            } else {
                console.error("Failed to delete evidence");
            }
        } catch (e) {
            console.error("Error deleting evidence:", e);
        }
    };

    const getStatusColor = (status: Vulnerability['status']) => {
        switch (status) {
            case 'frozen':
                return 'text-blue-500 bg-blue-500/10';
            case 'active':
                return 'text-green-500 bg-green-500/10';
            case 'compromised':
                return 'text-red-500 bg-red-500/10';
        }
    };

    const getStatusIcon = (status: Vulnerability['status']) => {
        switch (status) {
            case 'frozen':
                return <Lock className="w-4 h-4" />;
            case 'active':
                return <FolderOpen className="w-4 h-4" />;
            case 'compromised':
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const getFileIcon = (type: 'log' | 'image' | 'report') => {
        switch (type) {
            case 'image':
                return <ImageIcon className="w-4 h-4 text-purple-500" />;
            case 'log':
                return <FileCode className="w-4 h-4 text-blue-500" />;
            case 'report':
                return <FileText className="w-4 h-4 text-green-500" />;
        }
    };

    // Vulnerability Detail View
    if (selectedVulnerability && selectedProject) {
        return (
            <div className="flex-1 flex flex-col bg-background overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-card/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedVulnerability(null)}
                                className="btn-ghost p-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-2 text-sm text-muted">
                                <span>{selectedProject.name}</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-semibold text-foreground">{selectedVulnerability.name}</h1>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${selectedVulnerability.severity === 'Critical' ? 'text-red-500 bg-red-500/10 border-red-500/20' :
                                        selectedVulnerability.severity === 'High' ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' :
                                            selectedVulnerability.severity === 'Medium' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' :
                                                selectedVulnerability.severity === 'Low' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                                                    'text-gray-500 bg-gray-500/10 border-gray-500/20'
                                        }`}>
                                        {selectedVulnerability.severity}
                                    </span>
                                </div>
                                <p className="text-xs text-muted">{selectedVulnerability.description}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${getStatusColor(selectedVulnerability.status)}`}>
                            {getStatusIcon(selectedVulnerability.status)}
                            {selectedVulnerability.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Hash Section */}
                        {selectedVulnerability.status === 'frozen' && selectedVulnerability.vulnerabilityHash && (
                            <div className="bg-card border border-border rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <Hash className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-semibold text-foreground">Vulnerability Package Hash</h3>
                                            <span className="flex items-center gap-2 text-xs text-green-500 font-medium">
                                                <CheckCircle className="w-4 h-4" />
                                                Verified
                                            </span>
                                        </div>
                                        <div className="bg-background border border-border rounded-md p-3 mb-3">
                                            <code className="text-xs font-mono text-foreground break-all">{selectedVulnerability.vulnerabilityHash}</code>
                                        </div>
                                        <p className="text-xs text-muted">
                                            This hash represents all evidence folders (logs/scans, images, reports) frozen as one package. Any modification breaks the integrity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Folder Structure */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Logs/Scans Folder */}
                            <div className="bg-card border border-border rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-card/50 border-b border-border flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-sm font-semibold text-foreground">logs/scans</h3>
                                    <span className="text-xs text-muted ml-auto">{selectedVulnerability.folders.logs.length} files</span>
                                </div>
                                <div className="divide-y divide-border">
                                    {selectedVulnerability.folders.logs.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-sm text-muted">No files yet</div>
                                    ) : (
                                        selectedVulnerability.folders.logs.map((file) => (
                                            <div key={file.id} className="px-4 py-3 hover:bg-card/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        {getFileIcon('log')}
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                                                            <p className="text-xs text-muted">{file.size} • Added {file.dateAdded}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-muted italic">Stored locally</span>
                                                        <div className="flex gap-1">
                                                            <button className="btn-ghost p-2" onClick={() => setViewingEvidence(file)}><Eye className="w-4 h-4" /></button>
                                                            <button className="btn-ghost p-2"><Download className="w-4 h-4" /></button>
                                                            {selectedVulnerability.status === 'active' && (
                                                                <div onClick={(e) => e.stopPropagation()}>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <button className="btn-ghost p-2 text-destructive hover:bg-destructive/10">
                                                                                <Trash className="w-4 h-4" />
                                                                            </button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Delete Evidence?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Permanently delete "{file.name}"? This cannot be undone.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                    onClick={() => handleDeleteEvidence(file.id, 'log')}
                                                                                >
                                                                                    Delete
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Images Folder */}
                            <div className="bg-card border border-border rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-card/50 border-b border-border flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-purple-500" />
                                    <h3 className="text-sm font-semibold text-foreground">images</h3>
                                    <span className="text-xs text-muted ml-auto">{selectedVulnerability.folders.images.length} files</span>
                                </div>
                                <div className="divide-y divide-border">
                                    {selectedVulnerability.folders.images.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-sm text-muted">No files yet</div>
                                    ) : (
                                        selectedVulnerability.folders.images.map((file) => (
                                            <div key={file.id} className="px-4 py-3 hover:bg-card/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        {getFileIcon('image')}
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                                                            <p className="text-xs text-muted">{file.size} • Added {file.dateAdded}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-muted italic">Stored locally</span>
                                                        <div className="flex gap-1">
                                                            <button className="btn-ghost p-2" onClick={() => setViewingEvidence(file)}><Eye className="w-4 h-4" /></button>
                                                            <button className="btn-ghost p-2"><Download className="w-4 h-4" /></button>
                                                            {selectedVulnerability.status === 'active' && (
                                                                <div onClick={(e) => e.stopPropagation()}>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <button className="btn-ghost p-2 text-destructive hover:bg-destructive/10">
                                                                                <Trash className="w-4 h-4" />
                                                                            </button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Delete Evidence?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Permanently delete "{file.name}"? This cannot be undone.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                    onClick={() => handleDeleteEvidence(file.id, 'image')}
                                                                                >
                                                                                    Delete
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Reports Folder */}
                            <div className="bg-card border border-border rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-card/50 border-b border-border flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-green-500" />
                                    <h3 className="text-sm font-semibold text-foreground">reports</h3>
                                    <span className="text-xs text-muted ml-auto">{selectedVulnerability.folders.reports.length} files</span>
                                </div>
                                <div className="divide-y divide-border">
                                    {selectedVulnerability.folders.reports.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-sm text-muted">No files yet</div>
                                    ) : (
                                        selectedVulnerability.folders.reports.map((file) => (
                                            <div key={file.id} className="px-4 py-3 hover:bg-card/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        {getFileIcon('report')}
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                                                            <p className="text-xs text-muted">{file.size} • Added {file.dateAdded}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-muted italic">Stored locally</span>
                                                        <div className="flex gap-1">
                                                            <button className="btn-ghost p-2" onClick={() => setViewingEvidence(file)}><Eye className="w-4 h-4" /></button>
                                                            <button className="btn-ghost p-2"><Download className="w-4 h-4" /></button>
                                                            {selectedVulnerability.status === 'active' && (
                                                                <div onClick={(e) => e.stopPropagation()}>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <button className="btn-ghost p-2 text-destructive hover:bg-destructive/10">
                                                                                <Trash className="w-4 h-4" />
                                                                            </button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Delete Evidence?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Permanently delete "{file.name}"? This cannot be undone.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                    onClick={() => handleDeleteEvidence(file.id, 'report')}
                                                                                >
                                                                                    Delete
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedVulnerability.status === 'active' ? (
                            <div className="flex gap-3">
                                <Dialog open={isAddEvidenceDialogOpen} onOpenChange={setIsAddEvidenceDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add Evidence Files
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Evidence</DialogTitle>
                                            <DialogDescription>
                                                Upload logs, images, or reports for this vulnerability.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="ev-file">Select File</Label>
                                                <Input
                                                    id="ev-file"
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setSelectedFile(file);
                                                            // Auto-fill name if empty
                                                            if (!newEvidenceName) {
                                                                setNewEvidenceName(file.name);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="ev-name">File Name</Label>
                                                <Input
                                                    id="ev-name"
                                                    placeholder="e.g. error_log.txt"
                                                    value={newEvidenceName}
                                                    onChange={(e) => setNewEvidenceName(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="ev-type">Evidence Type</Label>
                                                <select
                                                    id="ev-type"
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={newEvidenceType}
                                                    onChange={(e) => setNewEvidenceType(e.target.value as 'log' | 'image' | 'report')}
                                                >
                                                    <option value="log">Log / Scan</option>
                                                    <option value="image">Image / Screenshot</option>
                                                    <option value="report">Report / Document</option>
                                                </select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAddEvidenceDialogOpen(false)}>Cancel</Button>
                                            <Button onClick={handleAddEvidence}>Add Evidence</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <button
                                    onClick={() => handleFreezeVulnerability(selectedProject.id, selectedVulnerability.id)}
                                    className="px-6 py-3 bg-card border border-border text-foreground rounded-md font-medium text-sm hover:bg-card/80 transition-colors flex items-center gap-2"
                                >
                                    <Lock className="w-4 h-4" />
                                    Freeze Vulnerability
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-md flex items-center gap-3">
                                <Lock className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Vulnerability Frozen</p>
                                    <p className="text-xs text-muted-foreground">This vulnerability package is locked and cannot be modified.</p>
                                </div>
                            </div>
                        )}
                    </div >
                </div >

                <Dialog open={!!viewingEvidence} onOpenChange={(open) => !open && setViewingEvidence(null)}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{viewingEvidence?.name}</DialogTitle>
                            <DialogDescription>
                                Viewing evidence content.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto p-4 bg-muted/50 rounded-md">
                            {viewingContent ? (
                                viewingEvidence?.type === 'image' ? (
                                    <img src={viewingContent} alt="Evidence" className="max-w-full h-auto mx-auto rounded-md shadow-sm" />
                                ) : (
                                    <pre className="whitespace-pre-wrap text-xs font-mono text-foreground p-4 bg-background rounded border">{viewingContent}</pre>
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <AlertDialog open={showEmptyFreezeWarning} onOpenChange={setShowEmptyFreezeWarning}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-yellow-500">
                                <AlertTriangle className="w-5 h-5" />
                                Cannot Freeze Vulnerability
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This vulnerability cannot be frozen because it contains <strong>no evidence material</strong>.
                                <br /><br />
                                Please add at least one log, image, or report before freezing to ensure there is meaningful data to secure.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setShowEmptyFreezeWarning(false)}>
                                Understood
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showFreezeErrorDialog} onOpenChange={setShowFreezeErrorDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="w-5 h-5" />
                                Freeze Failed
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                An error occurred while attempting to freeze this vulnerability.
                                <br /><br />
                                Please try again or contact support if the issue persists.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setShowFreezeErrorDialog(false)}>
                                Close
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showFrozenSuccessDialog} onOpenChange={setShowFrozenSuccessDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" />
                                Vulnerability Frozen Successfully
                            </AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                                <p>
                                    This vulnerability package has been securely hashed and locked.
                                </p>
                                <div className="bg-muted p-3 rounded-md border border-border">
                                    <p className="text-xs font-semibold mb-1">Package Hash:</p>
                                    <code className="text-xs font-mono break-all text-foreground">
                                        {projects.find(p => p.id === selectedProject?.id)?.vulnerabilities.find(v => v.id === selectedVulnerability?.id)?.vulnerabilityHash || "Hash not available"}
                                    </code>
                                </div>
                                <p className="text-sm text-yellow-500 font-medium">
                                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                                    No further evidence can be added or removed from this package.
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setShowFrozenSuccessDialog(false)}>
                                Acknowledge & Close
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div >
        );
    }

    // Project Vulnerabilities List View
    if (selectedProject) {
        return (
            <div className="flex-1 flex flex-col bg-background overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-card/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="btn-ghost p-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground">{selectedProject.name}</h1>
                                <p className="text-xs text-muted">{selectedProject.description}</p>
                            </div>
                        </div>
                        <Dialog open={isNewVulnDialogOpen} onOpenChange={setIsNewVulnDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    New Vulnerability
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Vulnerability</DialogTitle>
                                    <DialogDescription>
                                        Record a new vulnerability for this project.
                                    </DialogDescription>
                                </DialogHeader>
                                {newVulnError && (
                                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-2">
                                        {newVulnError}
                                    </div>
                                )}
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="vuln-name">Vulnerability Name</Label>
                                        <Input
                                            id="vuln-name"
                                            placeholder="e.g. SQL Injection in Search"
                                            value={newVulnName}
                                            onChange={(e) => setNewVulnName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="vuln-severity">Severity</Label>
                                        <select
                                            id="vuln-severity"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newVulnSeverity}
                                            onChange={(e) => setNewVulnSeverity(e.target.value as any)}
                                        >
                                            <option value="Critical">Critical</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                            <option value="Info">Info</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="vuln-desc">Description</Label>
                                        <Textarea
                                            id="vuln-desc"
                                            placeholder="Brief description of the vulnerability."
                                            value={newVulnDescription}
                                            onChange={(e) => setNewVulnDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsNewVulnDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreateVulnerability}>Add Vulnerability</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
                    <div className="max-w-6xl mx-auto space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
                                Total Vulnerabilities ({selectedProject.vulnerabilities.length})
                                <span className="ml-2 lowercase font-normal italic">
                                    ({selectedProject.vulnerabilities.filter(v => v.status === 'active').length} active, {selectedProject.vulnerabilities.filter(v => v.status === 'frozen').length} frozen)
                                </span>
                            </h2>
                        </div>

                        {selectedProject.vulnerabilities.map((vuln) => {
                            const totalFiles = vuln.folders.logs.length + vuln.folders.images.length + vuln.folders.reports.length;
                            return (
                                <div
                                    key={vuln.id}
                                    onClick={() => setSelectedVulnerability(vuln)}
                                    className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{vuln.name}</h3>
                                            <p className="text-xs text-muted mt-1">{vuln.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(vuln.status)}`}>
                                                {getStatusIcon(vuln.status)}
                                                {vuln.status}
                                            </span>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                {/* Empty Freeze Warning Dialog */}
                                                <AlertDialog open={showEmptyFreezeWarning} onOpenChange={setShowEmptyFreezeWarning}>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="flex items-center gap-2 text-yellow-500">
                                                                <AlertTriangle className="w-5 h-5" />
                                                                Cannot Freeze Vulnerability
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This vulnerability cannot be frozen because it contains <strong>no evidence material</strong>.
                                                                <br /><br />
                                                                Please add at least one log, image, or report before freezing to ensure there is meaningful data to secure.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction onClick={() => setShowEmptyFreezeWarning(false)}>
                                                                Understood
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                {/* Freeze Error Dialog */}
                                                <AlertDialog open={showFreezeErrorDialog} onOpenChange={setShowFreezeErrorDialog}>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                                                <AlertTriangle className="w-5 h-5" />
                                                                Freeze Failed
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                An error occurred while attempting to freeze this vulnerability.
                                                                <br /><br />
                                                                Please try again or contact support if the issue persists.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction onClick={() => setShowFreezeErrorDialog(false)}>
                                                                Close
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash className="w-3 h-3" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Vulnerability?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete "{vuln.name}" and all its evidence files.
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                onClick={() => handleDeleteVulnerability(vuln.id)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-xs text-muted">
                                        <span>Created: {vuln.createdDate}</span>
                                        {vuln.frozenDate && (
                                            <>
                                                <span>•</span>
                                                <span>Frozen: {vuln.frozenDate}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1.5">
                                                <Folder className="w-3 h-3 text-blue-500" />
                                                {vuln.folders.logs.length} logs
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Folder className="w-3 h-3 text-purple-500" />
                                                {vuln.folders.images.length} images
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Folder className="w-3 h-3 text-green-500" />
                                                {vuln.folders.reports.length} reports
                                            </span>
                                        </div>
                                        {vuln.vulnerabilityHash && (
                                            <div className="flex items-center gap-2 text-xs text-green-500">
                                                <CheckCircle className="w-3 h-3" />
                                                <span>Hash Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Projects List View
    return (
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-card/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Evidence Vault</h1>
                            <p className="text-xs text-muted">Tamper-proof evidence storage with cryptographic verification</p>
                        </div>
                    </div>

                    <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                                <DialogDescription>
                                    Initialise a new security engagement project.
                                </DialogDescription>
                            </DialogHeader>
                            {newProjectError && (
                                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-2">
                                    {newProjectError}
                                </div>
                            )}
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Project Zeus"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description of the engagement scope and goals."
                                        value={newProjectDescription}
                                        onChange={(e) => setNewProjectDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateProject}>Create Project</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
                <div className="w-full space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Hierarchical Evidence Storage</h3>
                                <p className="text-sm text-gray-800">
                                    Projects contain multiple vulnerabilities. Each vulnerability has organized folders (logs/scans, images, reports). When frozen, the entire vulnerability package is hashed for tamper-proof integrity.
                                </p>
                            </div>
                        </div>
                    </div>

                    {projects.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="w-12 h-12 text-muted mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-foreground mb-1">No projects found</h3>
                            <p className="text-sm text-muted">
                                Create your first project to start organizing vulnerability evidence.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                                            <p className="text-xs text-muted mt-1">{project.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the project
                                                            and all associated vulnerabilities and evidence files.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            onClick={() => handleDeleteProject(project.id)}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted mb-3">
                                        <span>Created: {project.createdDate}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="text-muted">
                                                {project.vulnerabilities.filter(v => v.status === 'active').length} active
                                            </span>
                                            <span className="text-muted">
                                                {project.vulnerabilities.filter(v => v.status === 'frozen').length} frozen
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
