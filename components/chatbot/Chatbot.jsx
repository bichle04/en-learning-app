import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { callDifyApi, getDifyFallbackResponse } from '@/services/dify.service';
import { callGeminiApi, getGeminiFallbackResponse } from '@/services/gemini.service';

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Xin chào! Tôi là trợ lý học tiếng Anh của bạn. Bạn muốn gì?',
            sender: 'bot',
            timestamp: new Date(),
        },
        {
            id: 2,
            text: 'Vui lòng chọn một trong các tùy chọn bên dưới:',
            sender: 'bot',
            timestamp: new Date(),
            showOptions: true,
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [chatMode, setChatMode] = useState(null); // null, 'dify', or 'gemini'

    const scrollViewRef = useRef();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    // Xử lý lựa chọn mode
    const handleModeSelection = (mode) => {
        setChatMode(mode);

        let confirmationText = '';
        if (mode === 'dify') {
            confirmationText = 'Bạn đã chọn: Tư vấn khóa học. Tôi sẽ giúp bạn tìm khóa học phù hợp nhất!';
        } else if (mode === 'gemini') {
            confirmationText = 'Bạn đã chọn: Hỏi đáp học tập. Tôi sẽ trả lời các câu hỏi về tiếng Anh của bạn!';
        }

        const confirmMessage = {
            id: Date.now(),
            text: confirmationText,
            sender: 'bot',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, confirmMessage]);
    };



    // Send message to AI (Dify or Gemini)
    const sendMessage = async () => {
        if (inputText.trim() === '') return;

        // Nếu chưa chọn mode, yêu cầu chọn
        if (!chatMode) {
            const warningMessage = {
                id: Date.now(),
                text: '⚠️ Vui lòng chọn một chế độ trước khi gửi tin nhắn.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, warningMessage]);
            return;
        }

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const messageToProcess = inputText.trim();
        setInputText('');
        setIsProcessing(true);

        try {
            let aiResponse;

            if (chatMode === 'dify') {
                // Call Dify API
                aiResponse = await callDifyApi(messageToProcess);
            } else if (chatMode === 'gemini') {
                // Call Gemini API
                aiResponse = await callGeminiApi(messageToProcess);
            }

            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            // Fallback response if API fails
            let fallbackResponse;

            if (chatMode === 'dify') {
                fallbackResponse = getDifyFallbackResponse();
            } else if (chatMode === 'gemini') {
                fallbackResponse = getGeminiFallbackResponse();
            }

            const aiMessage = {
                id: Date.now() + 1,
                text: fallbackResponse,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const MessageBubble = ({ message }) => {
        const isBot = message.sender === 'bot';

        return (
            <View
                style={[
                    styles.messageContainer,
                    isBot ? styles.botMessageContainer : styles.userMessageContainer,
                ]}
            >
                {isBot && (
                    <View style={styles.botAvatarContainer}>
                        <View style={styles.botAvatar}>
                            <Image
                                source={require('@/assets/images/chatbot.png')}
                                style={styles.botAvatarImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                )}

                <View
                    style={[
                        styles.messageBubble,
                        isBot
                            ? [styles.botBubble, { backgroundColor: '#F5F7FA' }]
                            : [styles.userBubble, { backgroundColor: '#E3F2FD' }],
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            {
                                color: isBot ? '#2C3E50' : '#1565C0',
                            },
                        ]}
                    >
                        {message.text}
                    </Text>
                    <Text
                        style={[
                            styles.timestamp,
                            {
                                color: isBot ? '#95A5A6' : '#7B8794',
                            },
                        ]}
                    >
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>

                    {/* Hiển thị nút tùy chọn */}
                    {message.showOptions && !chatMode && (
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: '#42A5F5' },
                                ]}
                                onPress={() => handleModeSelection('dify')}
                            >
                                <Ionicons name="school" size={20} color="white" />
                                <Text style={styles.optionText}>Tư vấn khóa học</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: '#66BB6A' },
                                ]}
                                onPress={() => handleModeSelection('gemini')}
                            >
                                <Ionicons name="help-circle" size={20} color="white" />
                                <Text style={styles.optionText}>Hỏi đáp học tập</Text>
                            </TouchableOpacity>
                        </View>
                    )}


                </View>

                {!isBot && (
                    <View style={styles.userAvatarContainer}>
                        <View style={[styles.userAvatar, { backgroundColor: '#90CAF9' }]}>
                            <Ionicons name="person" size={20} color="white" />
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerAvatar}>
                        <Image
                            source={require('@/assets/images/chatbot.png')}
                            style={styles.headerAvatarImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>
                            Trợ lý học tiếng Anh
                        </Text>
                        <Text style={styles.headerStatus}>Luôn sẵn sàng giúp bạn</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {isProcessing && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={tintColor} />
                        <Text style={[styles.loadingText, { color: '#999' }]}>
                            Trợ lý đang suy nghĩ...
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Input Area */}
            <View style={[styles.inputArea, { borderTopColor: '#e0e0e0' }]}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: '#000000', // Màu đen rõ ràng cho text
                                borderColor: '#e0e0e0',
                            },
                        ]}
                        placeholder="Nhập tin nhắn..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={sendMessage}
                        multiline
                        maxLength={500}
                        editable={!isProcessing}
                    />

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setInputText('')}
                        disabled={inputText.trim() === '' || isProcessing}
                    >
                        <Ionicons
                            name="close-circle"
                            size={24}
                            color={inputText.trim() === '' || isProcessing ? '#ccc' : '#999'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            {
                                backgroundColor: isProcessing ? '#ccc' : '#1E90FF', // Màu xanh từ Speaking UI
                            },
                        ]}
                        onPress={sendMessage}
                        disabled={inputText.trim() === '' || isProcessing}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Header styles
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        borderBottomWidth: 1,
        borderBottomColor: '#E3F2FD',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerAvatarImage: {
        width: 32,
        height: 32,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerStatus: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },

    // Messages container
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    botMessageContainer: {
        justifyContent: 'flex-start',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    botAvatarContainer: {
        marginRight: 8,
    },
    userAvatarContainer: {
        marginLeft: 8,
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    botAvatarImage: {
        width: 24,
        height: 24,
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    botBubble: {
        borderBottomLeftRadius: 4,
        borderWidth: 0.5,
        borderColor: '#DDE7F0',
    },
    userBubble: {
        borderBottomRightRadius: 4,
        borderWidth: 0.5,
        borderColor: '#BBDEFB',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 11,
        marginTop: 4,
    },

    // Options container
    optionsContainer: {
        marginTop: 12,
        gap: 8,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    optionText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },

    // Loading indicator
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 12,
    },

    // Input area
    inputArea: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        gap: 8,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderColor: '#e0e0e0',
        gap: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
        maxHeight: 100,
    },
    actionButton: {
        padding: 4,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Chatbot;
