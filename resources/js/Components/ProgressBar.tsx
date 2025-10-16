interface ProgressBarProps {
    progress: number;
    currentIndex: number;
    total: number;
}

export default function ProgressBar({ progress, currentIndex, total }: ProgressBarProps) {
    return (
        <div className="rounded-xl bg-primary p-4">
            <div className="mb-2 flex flex-col justify-between text-sm text-white">
                <div className="flex items-center justify-between">
                    <span className="text-lg">
                        Pertanyaan {currentIndex + 1} dari {total}
                    </span>
                    <span>{progress}%</span>
                </div>
            </div>

            <div className="h-3 w-full rounded-full bg-white">
                <div className="h-3 rounded-full bg-secondary transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}
