interface ProgressBarProps {
    progress: number;
    currentIndex: number;
    total: number;
}

export default function ProgressBarPanas({ progress, currentIndex, total }: ProgressBarProps) {
    return (
        <div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-6 md:p-8 shadow-sm mb-8">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm md:text-base font-bold text-slate-500">
                    Pernyataan <span className="text-primary">{currentIndex + 1}</span> dari {total}
                </span>
                <span className="text-sm md:text-base font-black text-primary bg-primary/10 px-3 py-1 rounded-xl">{progress}%</span>
            </div>

            <div className="h-3 md:h-4 w-full rounded-full bg-slate-200 overflow-hidden shadow-inner">
                <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
