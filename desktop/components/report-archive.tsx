'use client';

import { useState, useEffect } from 'react';
import { FileText, Clock, Edit, Trash2, Download, Archive, Plus, Search, Calendar, Tag } from 'lucide-react';
import type { GeneratedReport } from '@/app/page';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DraftReport {
    id: string;
    title: string;
    status: 'draft' | 'in-progress' | 'ready';
    createdDate: string;
    lastModified: string;
    project?: string;
    tags: string[];
    report: GeneratedReport;
}

interface ReportArchiveProps {
    onEdit: (draft: DraftReport) => void;
}

export function ReportArchive({ onEdit }: ReportArchiveProps) {
    const [drafts, setDrafts] = useState<DraftReport[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch drafts on load
    const fetchDrafts = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/report-drafts');
            if (res.ok) {
                const data = await res.json();
                setDrafts(data);
            }
        } catch (error) {
            console.error("Failed to fetch drafts", error);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    const [deleteDraftId, setDeleteDraftId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setDeleteDraftId(id);
    };

    const confirmDelete = async () => {
        if (!deleteDraftId) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/report-drafts/${deleteDraftId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchDrafts(); // Refresh list
            } else {
                alert('Failed to delete draft');
            }
        } catch (error) {
            console.error("Error deleting draft", error);
        } finally {
            setDeleteDraftId(null);
        }
    };

    const getStatusColor = (status: DraftReport['status']) => {
        switch (status) {
            case 'ready':
                return 'text-green-500 bg-green-500/10';
            case 'in-progress':
                return 'text-yellow-500 bg-yellow-500/10';
            case 'draft':
                return 'text-gray-500 bg-gray-500/10';
            default:
                return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getStatusIcon = (status: DraftReport['status']) => {
        switch (status) {
            case 'ready':
                return '✓';
            case 'in-progress':
                return '⚡';
            case 'draft':
                return '✎';
            default:
                return '✎';
        }
    };

    const filteredDrafts = drafts.filter(draft =>
        (draft.title && draft.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (draft.tags && draft.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const handleExport = (draft: DraftReport) => {
        // This will trigger the export and automatic addition to Evidence Vault
        alert(`Exporting "${draft.title}" to Evidence Vault...\n\nThis will:\n1. Create a new vulnerability entry\n2. Organize all evidence into folders\n3. Add to selected project`);
    };

    return (
        <div className="flex-1 flex flex-col bg-background overflow-hidden section-divider">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Archive className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Report Archive</h1>
                        <p className="text-xs text-muted">Draft reports workspace - export to add to Evidence Vault</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
                <div className="w-full space-y-6">
                    {/* Info Banner */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Work In Progress Area</h3>
                                <p className="text-sm text-gray-800">
                                    Draft reports stay here until you export them. When you export a report, it automatically creates a vulnerability entry in the Evidence Vault with all evidence organized into folders.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search drafts by title or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-xs text-muted mb-1">Total Drafts</p>
                            <p className="text-2xl font-bold text-foreground">{drafts.length}</p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-xs text-muted mb-1">Ready to Export</p>
                            <p className="text-2xl font-bold text-green-500">{drafts.filter(d => d.status === 'ready').length}</p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-xs text-muted mb-1">In Progress</p>
                            <p className="text-2xl font-bold text-yellow-500">{drafts.filter(d => d.status === 'in-progress').length}</p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-xs text-muted mb-1">Just Started</p>
                            <p className="text-2xl font-bold text-gray-500">{drafts.filter(d => d.status === 'draft').length}</p>
                        </div>
                    </div>

                    {/* Drafts List */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Draft Reports ({filteredDrafts.length})</h2>

                        {filteredDrafts.map((draft) => (
                            <div
                                key={draft.id}
                                className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-semibold text-foreground">{draft.title}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(draft.status)}`}>
                                                {getStatusIcon(draft.status)} {draft.status}
                                            </span>
                                        </div>
                                        {draft.project && (
                                            <p className="text-xs text-muted mb-2">Project: {draft.project}</p>
                                        )}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {draft.tags && draft.tags.map((tag, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex items-center gap-4 text-xs text-muted">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Created: {draft.createdDate}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Modified: {draft.lastModified}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(draft)}
                                            className="btn-ghost p-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {draft.status === 'ready' && (
                                            <button
                                                onClick={() => handleExport(draft)}
                                                className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                                            >
                                                <Download className="w-3 h-3" />
                                                Export to Vault
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteClick(draft.id)}
                                            className="btn-ghost p-2 text-red-500 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredDrafts.length === 0 && (
                            <div className="text-center py-12">
                                <Archive className="w-12 h-12 text-muted mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-foreground mb-1">No drafts found</h3>
                                <p className="text-sm text-muted">
                                    {searchQuery ? 'Try a different search term' : 'Create your first draft report to get started'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* AlertDialog for Delete Confirmation */}
            <AlertDialog open={!!deleteDraftId} onOpenChange={(open) => !open && setDeleteDraftId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the draft and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
