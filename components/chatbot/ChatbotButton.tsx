import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
    SafeAreaView,
    Animated,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import Chatbot from './Chatbot';

const ChatbotButton = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [scaleAnim] = React.useState(new Animated.Value(0));

    const tintColor = useThemeColor({}, 'tint');

    const openModal = () => {
        setIsModalVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.spring(scaleAnim, {
            toValue: 0,
            useNativeDriver: true,
        }).start(() => {
            setIsModalVisible(false);
        });
    };

    return (
        <>
            {/* Floating Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={openModal}
                activeOpacity={0.8}
            >
                <Image
                    source={require('@/assets/images/chatbot.png')}
                    style={styles.chatbotIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Chatbot Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={closeModal}
            >
                <SafeAreaView style={styles.modalContainer}>
                    {/* Chatbot Component with close function */}
                    <Chatbot onClose={closeModal} />
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 160,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#A8D8FF', 
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        zIndex: 999,
    },

    chatbotIcon: {
        width: 36,
        height: 36,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default ChatbotButton;
