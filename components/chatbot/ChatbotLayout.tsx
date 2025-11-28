import React from 'react';
import { View } from 'react-native';
import ChatbotButton from '@/components/chatbot/ChatbotButton';

interface ChatbotLayoutProps {
    children: React.ReactNode;
}

const ChatbotLayout: React.FC<ChatbotLayoutProps> = ({ children }) => {
    return (
        <View style={{ flex: 1, position: 'relative' }}>
            {children}
            <ChatbotButton />
        </View>
    );
};

export default ChatbotLayout;
