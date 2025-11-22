
interface VideoStatusProps {
    title: string;
    currentTime: string;
    duration: string;
    status: 'ready' | 'no-video' | 'processing';
}

const VideoStatus: React.FC<VideoStatusProps> = ({ title, currentTime, duration, status }) => {
    return (
        <div className="glass-panel p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Current Video</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${status === 'ready' ? 'bg-green-500/20 text-green-400' :
                    status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                    }`}>
                    {status === 'ready' ? 'Ready ✓' : status === 'processing' ? 'Processing...' : 'No Video'}
                </span>
            </div>

            <div className="mb-3">
                <h3 className="text-lg font-medium truncate text-white" title={title}>
                    {title || 'No video detected'}
                </h3>
            </div>

            <div className="flex items-center text-sm text-gray-400">
                <span className="mr-2">⏱️</span>
                <span>{currentTime} / {duration}</span>
            </div>
        </div>
    );
};

export default VideoStatus;
