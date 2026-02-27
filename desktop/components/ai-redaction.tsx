'use client';

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Download, Sparkles, X, FileImage } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AIRedactionProps {
    onNavigate?: () => void
}

export function AIRedaction({ onNavigate }: AIRedactionProps) {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [redactedImage, setRedactedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState({ title: '', description: '' })

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
                setRedactedImage(null);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
                setRedactedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRedact = async () => {
        if (!uploadedImage) return;

        setIsProcessing(true);
        try {
            // Convert data URL to Blob
            const response = await fetch(uploadedImage);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('file', blob, 'image.png');

            const apiResponse = await fetch('http://127.0.0.1:5000/api/redact-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData,
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json()
                if (errorData.error && errorData.error.includes("API Key not found")) {
                    setAlertMessage({
                        title: "AI Configuration Missing",
                        description: "You first need to add the API Key and the Model.\n\nSteps:\n1. Go to Settings\n2. Select 'AI & Model' tab\n3. Enter API Key and Model Name\n4. Click Save\n5. Test Connection\n6. Proceed"
                    })
                    setAlertOpen(true)
                    return
                }
                throw new Error('Failed to redact image');
            }

            const redactedBlob = await apiResponse.blob();
            const redactedUrl = URL.createObjectURL(redactedBlob);
            setRedactedImage(redactedUrl);
        } catch (error) {
            console.error('Redaction failed:', error);
            // You might want to add a toast notification here
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (redactedImage) {
            const link = document.createElement('a');
            link.href = redactedImage;
            link.download = 'redacted-image.png';
            link.click();
        }
    };

    const handleReset = () => {
        setUploadedImage(null);
        setRedactedImage(null);
        setIsProcessing(false);
    };

    return (
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-4 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">AI-Powered Image Redaction</h1>
                        <p className="text-xs text-muted">Automatically detect and redact sensitive information from images</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upload Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Upload Image</h2>
                                {uploadedImage && (
                                    <button
                                        onClick={handleReset}
                                        className="text-xs text-muted hover:text-foreground flex items-center gap-1"
                                    >
                                        <X className="w-3 h-3" />
                                        Clear
                                    </button>
                                )}
                            </div>

                            {!uploadedImage ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-all ${isDragging
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50 hover:bg-card/50'
                                        }`}
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-2">Drop your image here</h3>
                                    <p className="text-sm text-muted mb-4">or click to browse</p>
                                    <label className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm cursor-pointer hover:bg-primary/90 transition-colors">
                                        Choose File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-muted mt-4">Supports PNG, JPG, JPEG up to 10MB</p>
                                </div>
                            ) : (
                                <div className="bg-card border border-border rounded-lg overflow-hidden">
                                    <div className="p-3 bg-card/50 border-b border-border flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileImage className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium text-foreground">Original Image</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-100">
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded"
                                            className="w-full h-auto rounded-md shadow-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            {uploadedImage && !redactedImage && (
                                <button
                                    onClick={handleRedact}
                                    disabled={isProcessing}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Redact Image
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Redacted Result Section */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Redacted Result</h2>

                            {!redactedImage ? (
                                <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center bg-card/30">
                                    <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                                        <ImageIcon className="w-8 h-8 text-muted" />
                                    </div>
                                    <h3 className="text-lg font-medium text-muted mb-2">No redacted image yet</h3>
                                    <p className="text-sm text-muted text-center">
                                        Upload an image and click "Redact Image" to<br />see the AI-processed result
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                                        <div className="p-3 bg-card/50 border-b border-border flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-medium text-foreground">Redacted Image</span>
                                            </div>
                                            <span className="text-xs text-green-500 font-medium">✓ Complete</span>
                                        </div>
                                        <div className="p-4 bg-gray-100">
                                            <img
                                                src={redactedImage}
                                                alt="Redacted"
                                                className="w-full h-auto rounded-md shadow-lg"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleDownload}
                                        className="w-full py-3 bg-green-600 text-white rounded-md font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Redacted Image
                                    </button>

                                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                                        <p className="text-sm text-gray-800">
                                            <strong className="font-semibold">AI Redaction Complete:</strong> Sensitive information has been automatically detected and redacted from your image.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
                        <AlertDialogDescription className="whitespace-pre-line">
                            {alertMessage.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => {
                            setAlertOpen(false)
                            if (onNavigate) onNavigate()
                        }}>
                            Go to Settings
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
