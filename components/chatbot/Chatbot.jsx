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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { callDifyApi, getDifyFallbackResponse } from '@/services/dify.service';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Xin chào! Tôi là trợ lý học tiếng Anh của bạn. Tôi có thể giúp bạn học từ vựng, luyện nghe, nói, viết và còn nhiều hơn nữa. Bạn cần giúp gì?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const scrollViewRef = useRef();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    // Send message to Dify AI
    const sendMessage = async () => {
        if (inputText.trim() === '') return;

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
            // Call Dify API
            const aiResponse = await callDifyApi(messageToProcess);

            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            // Fallback response if API fails
            const fallbackResponse = getDifyFallbackResponse();

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
                        <View style={[styles.botAvatar, { backgroundColor: tintColor }]}>
                            <Ionicons name="chatbubble" size={20} color="white" />
                        </View>
                    </View>
                )}

                <View
                    style={[
                        styles.messageBubble,
                        isBot
                            ? [styles.botBubble, { backgroundColor: '#f0f0f0' }]
                            : [styles.userBubble, { backgroundColor: tintColor }],
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            {
                                color: isBot ? '#333' : 'white',
                            },
                        ]}
                    >
                        {message.text}
                    </Text>
                    <Text
                        style={[
                            styles.timestamp,
                            {
                                color: isBot ? '#999' : 'rgba(255,255,255,0.7)',
                            },
                        ]}
                    >
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>

                {!isBot && (
                    <View style={styles.userAvatarContainer}>
                        <View style={[styles.userAvatar, { backgroundColor: tintColor }]}>
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
            style={[styles.container, { backgroundColor }]}
        >
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: '#e0e0e0' }]}>
                <View style={styles.headerContent}>
                    <View style={[styles.headerAvatar, { backgroundColor: tintColor }]}>
                        <Ionicons name="chatbubbles" size={24} color="white" />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={[styles.headerTitle, { color: textColor }]}>
                            Trợ lý học tiếng Anh
                        </Text>
                        <Text style={styles.headerStatus}>Luôn sẵn sàng giúp bạn</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color={textColor} />
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
                                color: textColor,
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
                                backgroundColor: isProcessing ? '#ccc' : '#FF6B9D',
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
    },

    // Header styles
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    headerStatus: {
        fontSize: 12,
        color: '#999',
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
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    botBubble: {
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 11,
        marginTop: 4,
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
