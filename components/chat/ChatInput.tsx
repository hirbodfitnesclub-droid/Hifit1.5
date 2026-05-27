
import React, { useRef } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  selectedImage: { data: string; mimeType: string } | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input, setInput, onSend, isLoading, selectedImage, onImageSelect, onClearImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
    }
  };

  return (
    <div className="flex-none p-4 pb-24 z-30 pointer-events-none"> {/* Added pointer-events-none to allow clicking through empty space if needed, children need pointer-events-auto */}
      
      {/* Container - Floating Island */}
      <div className="relative pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-2">
        
        {/* Image Preview Area */}
        <AnimatePresence>
            {selectedImage && (
                <motion.div 
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 8 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    className="relative px-2 pt-2 overflow-hidden"
                >
                    <div className="relative inline-block">
                        <img 
                            src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                            alt="Preview" 
                            className="h-20 w-auto rounded-xl border border-gold-500/30 shadow-lg object-cover"
                        />
                        <button 
                            onClick={onClearImage}
                            className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 border border-zinc-600 shadow-lg hover:bg-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex items-end gap-2">
            {/* Attachment Button */}
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={onImageSelect}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-gold-500 hover:border-gold-500/50 hover:bg-zinc-800 transition-all shrink-0 mb-0.5"
            >
                <ImageIcon className="w-5 h-5" />
            </button>

            {/* Input Field */}
            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] flex items-center px-4 py-1 transition-colors focus-within:border-gold-500/50 focus-within:bg-black">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedImage ? "توضیح عکس..." : "پیام خود را بنویسید..."}
                    className="w-full bg-transparent text-white text-sm placeholder:text-zinc-600 resize-none py-3.5 focus:outline-none max-h-32 scrollbar-hide"
                    rows={1}
                    style={{ minHeight: '48px' }}
                />
            </div>

            {/* Send Button */}
            <button 
                onClick={onSend}
                disabled={(!input.trim() && !selectedImage) || isLoading} 
                className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 mb-0.5
                    ${isLoading 
                        ? 'bg-zinc-800 cursor-wait' 
                        : 'bg-gold-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)] text-black'
                    }
                    disabled:opacity-50 disabled:shadow-none disabled:bg-zinc-800 disabled:text-zinc-500
                `}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                ) : (
                    <Send className="w-5 h-5 ml-0.5" />
                )}
            </button>
        </div>
      </div>
    </div>
  );
};
