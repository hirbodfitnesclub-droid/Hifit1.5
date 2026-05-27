
import React from 'react';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatInput } from '../../components/chat/ChatInput';
import { MessageList } from '../../components/chat/MessageList';
import { useAiCoachLogic } from './useAiCoachLogic';
import { useChatScroll } from '../../hooks/useChatScroll';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const AiCoach: React.FC = () => {
  // 1. Logic Layer
  const {
    user,
    messages,
    input,
    setInput,
    isLoading,
    actionStatus,
    selectedImage,
    handleImageSelect,
    clearImage,
    sendMessage
  } = useAiCoachLogic();

  // 2. Scroll Logic Layer
  const { bottomRef } = useChatScroll(messages, isLoading, !!selectedImage);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-gold-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-20%] w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Header */}
      <ChatHeader />

      {/* Scrollable Message Area */}
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        onPromptSelect={(text) => sendMessage(text)}
        bottomRef={bottomRef}
      />

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 w-full z-40">
           <ChatInput 
              input={input}
              setInput={setInput}
              onSend={() => sendMessage()}
              isLoading={isLoading}
              selectedImage={selectedImage}
              onImageSelect={handleImageSelect}
              onClearImage={clearImage}
           />
      </div>

      {/* Action Status Toast */}
      <AnimatePresence>
          {actionStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -40, x: '-50%' }}
                animate={{ opacity: 1, y: 20, x: '-50%' }}
                exit={{ opacity: 0, y: -40, x: '-50%' }}
                className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
                    actionStatus.type === 'success' 
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400' 
                    : 'bg-red-950/80 border-red-500/50 text-red-400'
                }`}
              >
                  {actionStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-bold">{actionStatus.msg}</span>
              </motion.div>
          )}
      </AnimatePresence>

    </div>
  );
};
