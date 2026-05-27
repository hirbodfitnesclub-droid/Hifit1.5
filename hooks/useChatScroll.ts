
import { useRef, useEffect } from 'react';
import { Message } from '../types';

export const useChatScroll = (messages: Message[], isLoading: boolean, hasImage: boolean) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    // Small timeout ensures DOM is updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading, hasImage]);

  return { scrollRef, bottomRef, scrollToBottom };
};
