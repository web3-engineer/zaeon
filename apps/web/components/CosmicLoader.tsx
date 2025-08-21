"use client";
export default function CosmicLoader({ progress = 0 }: { progress?: number }) {
    return (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                <div className="text-xs text-purple-300 tracking-widest">
                    ⟡⟠⟊⟐⧫⟟ {progress}%
                </div>
            </div>
        </div>
    );
}