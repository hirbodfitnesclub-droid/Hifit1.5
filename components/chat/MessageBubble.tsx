
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Bot, User, Zap } from 'lucide-react';
import { Message } from '../../types';
import { clsx } from 'clsx';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAction = message.isAction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={clsx(
        "flex gap-3 mb-6 w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-1">
        <div className={clsx(
            "w-8 h-8 rounded-xl flex items-center justify-center border shadow-lg",
            isUser 
            ? "bg-zinc-800 border-zinc-700" 
            : "bg-gradient-to-br from-gold-600 to-amber-700 border-gold-500/50"
        )}>
            {isUser ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
      </div>

      {/* Content Bubble */}
      <div className={clsx(
          "flex flex-col max-w-[80%]",
          isUser ? "items-end" : "items-start"
      )}>
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2 justify-end">
                  {message.attachments.map((att, i) => (
                      <img 
                        key={i}
                        src={`data:${att.mimeType};base64,${att.data}`}
                        alt="attachment"
                        className="rounded-2xl border-2 border-zinc-800 w-48 h-auto object-cover shadow-xl"
                      />
                  ))}
              </div>
          )}

          {/* Text */}
          <div className={clsx(
              "px-5 py-3.5 rounded-2xl text-sm leading-7 relative shadow-md backdrop-blur-sm",
              isUser 
                ? "bg-zinc-800 text-white rounded-tr-none border border-zinc-700" 
                : "bg-zinc-900/80 text-zinc-100 rounded-tl-none border border-white/5 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]",
              isAction && "border-gold-500/40 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
          )}>
              {isAction && (
                  <div className="absolute -top-2.5 right-4 bg-gold-500 text-black text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
                      <Zap className="w-3 h-3" />
                      ACTION EXECUTED
                  </div>
              )}
              
              <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
          
          {/* Timestamp / Status */}
          <span className="text-[9px] text-zinc-600 font-bold mt-1.5 px-1 flex items-center gap-1">
              {new Date(message.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
              {isUser && <CheckCircle2 className="w-3 h-3 text-zinc-600" />}
          </span>
      </div>
    </motion.div>
  );
};
