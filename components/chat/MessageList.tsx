
import React from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatEmptyState } from './ChatEmptyState';
import { Message } from '../../types';
import { motion } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onPromptSelect: (text: string) => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onPromptSelect, 
  bottomRef 
}) => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 scrollbar-hide px-5 py-6">
        <div className="min-h-full flex flex-col justify-end">
            
            {messages.length === 0 ? (
                <ChatEmptyState onSelectPrompt={onPromptSelect} />
            ) : (
                <>
                    {/* Spacer to push content down if list is short */}
                    <div className="flex-1 min-h-[20vh]" /> 
                    
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 px-4 mb-4"
                        >
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-xs text-zinc-500 font-bold animate-pulse">در حال تحلیل...</span>
                        </motion.div>
                    )}
                </>
            )}
            
            {/* Invisible Anchor for Auto-Scroll */}
            <div ref={bottomRef} className="h-4" />
            
            {/* Spacer for Floating Input (Prevents overlap) */}
            <div className="h-24" />
        </div>
    </div>
  );
};
