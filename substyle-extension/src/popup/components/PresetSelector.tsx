

interface PresetSelectorProps {
    currentPreset: string;
    onSelect: (preset: string) => void;
}

const PRESETS = [
    { id: 'submagic', name: 'SubMagic', color: 'from-yellow-400 to-orange-500' },
    { id: 'neon', name: 'Neon', color: 'from-cyan-400 to-blue-500' },
    { id: 'bold', name: 'Bold', color: 'from-red-500 to-pink-500' },
    { id: 'minimal', name: 'Minimal', color: 'from-gray-200 to-white' },
];

const PresetSelector: React.FC<PresetSelectorProps> = ({ currentPreset, onSelect }) => {
    return (
        <div className="glass-panel p-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Style Presets</h2>
            <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => onSelect(preset.id)}
                        className={`
              relative p-3 rounded-lg border transition-all duration-200 text-left overflow-hidden group
              ${currentPreset === preset.id
                                ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
            `}
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${preset.color} transition-opacity`} />
                        <span className="font-medium text-sm relative z-10">{preset.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PresetSelector;
