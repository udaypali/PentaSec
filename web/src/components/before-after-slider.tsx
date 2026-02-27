"use client"

import * as React from "react"

interface BeforeAfterSliderProps {
    before: React.ReactNode
    after: React.ReactNode
}

export function BeforeAfterSlider({ before, after }: BeforeAfterSliderProps) {
    const [hovered, setHovered] = React.useState<'before' | 'after' | null>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Check if we are in the top-left triangle (Before) or bottom-right triangle (After)
        // The diagonal line is defined by x/width + y/height = 1
        // If sum < 1, we are in top-left (Before)
        // If sum > 1, we are in bottom-right (After)
        const normalizedX = x / rect.width
        const normalizedY = y / rect.height

        if (normalizedX + normalizedY < 1) {
            setHovered('before')
        } else {
            setHovered('after')
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[700px] overflow-hidden rounded-2xl border border-white/10 bg-black select-none shadow-2xl group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
        >
            {/* Before (Left/Top) - Raw Input */}
            <div
                className="absolute inset-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                    clipPath: hovered === 'before'
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
                        : 'polygon(0 0, 100% 0, 100% 0, 0% 100%)',
                    zIndex: hovered === 'before' ? 20 : 10,
                    opacity: hovered === 'after' ? 0.3 : 1,
                }}
            >
                {before}
            </div>

            {/* After (Right/Bottom) - AI Generated Report */}
            {/* Creates a triangle from top-left corner to bottom-right corner */}
            <div
                className="absolute inset-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                    // Use 4 points for smooth interpolation
                    // Default: Top-Right, Bottom-Right, Bottom-Left (Triangle)
                    // Hovered: Top-Left, Top-Right, Bottom-Right, Bottom-Left (Full)
                    clipPath: hovered === 'after'
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
                        : 'polygon(100% 0, 100% 0, 100% 100%, 0% 100%)',
                    zIndex: hovered === 'after' ? 20 : 10,
                    opacity: hovered === 'before' ? 0.3 : 1,
                }}
            >
                {after}
            </div>
        </div>
    )
}
