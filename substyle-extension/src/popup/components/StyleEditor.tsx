

interface StyleEditorProps {
    style: any;
    onChange: (key: string, value: any) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ style, onChange }) => {
    return (
        <div className="glass-panel p-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Customization</h2>

            <div className="space-y-4">
                {/* Font Family */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Font Family</label>
                    <select
                        className="glass-input w-full text-sm"
                        value={style.fontFamily}
                        onChange={(e) => onChange('fontFamily', e.target.value)}
                    >
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Inter">Inter</option>
                        <option value="Bebas Neue">Bebas Neue</option>
                    </select>
                </div>

                {/* Font Size */}
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-400">Size</label>
                        <span className="text-xs text-gray-400">{style.fontSize}px</span>
                    </div>
                    <input
                        type="range"
                        min="12"
                        max="72"
                        value={style.fontSize}
                        onChange={(e) => onChange('fontSize', parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>

                {/* Colors */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Text Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={style.color}
                                onChange={(e) => onChange('color', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="text-xs font-mono text-gray-500">{style.color}</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Outline</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={style.outlineColor}
                                onChange={(e) => onChange('outlineColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="text-xs font-mono text-gray-500">{style.outlineColor}</span>
                        </div>
                    </div>
                </div>

                {/* Animation */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Animation</label>
                    <select
                        className="glass-input w-full text-sm"
                        value={style.animation}
                        onChange={(e) => onChange('animation', e.target.value)}
                    >
                        <option value="none">None</option>
                        <option value="pop">Pop</option>
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default StyleEditor;
