
import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { generateAgentResponse } from '../../services/geminiService';
import { convertImageToBase64 } from '../../utils/chatHelpers';

export const useAiCoachLogic = () => {
  const { 
    user, messages, addMessage, weeklyPlan, currentDayIndex, 
    dispatchAiAction, pendingChatInput, setPendingChatInput 
  } = useUser();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);

  // Handle Deep Linking / Context Input
  useEffect(() => {
    if (pendingChatInput) {
        setInput(pendingChatInput);
        setPendingChatInput('');
    }
  }, [pendingChatInput, setPendingChatInput]);

  // Handle Toast Timer
  useEffect(() => {
    if (actionStatus) {
        const timer = setTimeout(() => setActionStatus(null), 4000);
        return () => clearTimeout(timer);
    }
  }, [actionStatus]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageData = await convertImageToBase64(file);
        setSelectedImage(imageData);
      } catch (error) {
        console.error("Image upload failed", error);
        setActionStatus({ type: 'error', msg: 'خطا در بارگذاری عکس' });
      }
    }
    event.target.value = ''; // Reset input
  };

  const clearImage = () => setSelectedImage(null);

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    
    if ((!textToSend.trim() && !selectedImage) || !user || !weeklyPlan) return;

    const attachments = selectedImage ? [{ type: 'image' as const, data: selectedImage.data, mimeType: selectedImage.mimeType }] : undefined;

    const userMsg = { 
        id: crypto.randomUUID(), 
        role: 'user' as const, 
        content: textToSend, 
        timestamp: Date.now(),
        attachments: attachments
    };
    
    addMessage(userMsg);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
        const response = await generateAgentResponse(
            [...messages, userMsg], 
            user, 
            textToSend || (attachments ? "Image uploaded" : ""), 
            currentDayIndex,
            weeklyPlan.days[currentDayIndex]
        );

        if (response.text) {
            addMessage({ 
                id: crypto.randomUUID(), 
                role: 'model' as const, 
                content: response.text, 
                timestamp: Date.now(),
                isAction: !!response.toolCalls 
            });
        }

        if (response.toolCalls && response.toolCalls.length > 0) {
            let successCount = 0;
            for (const tool of response.toolCalls) {
                if (dispatchAiAction(tool)) successCount++;
            }
            setActionStatus(
                successCount > 0 
                ? { type: 'success', msg: 'برنامه شما با موفقیت بروزرسانی شد.' } 
                : { type: 'error', msg: 'مشکلی در اعمال تغییرات پیش آمد.' }
            );
        }
    } catch (error) {
        console.error("AI Error", error);
        addMessage({
            id: crypto.randomUUID(),
            role: 'model',
            content: 'متاسفانه مشکلی در ارتباط پیش آمد. لطفاً دوباره تلاش کنید.',
            timestamp: Date.now()
        });
    } finally {
        setIsLoading(false);
    }
  };

  return {
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
  };
};