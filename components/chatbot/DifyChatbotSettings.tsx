/**
 * Dify Chatbot Settings Component
 * Component để cấu hình Dify AI chatbot
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useDifyChatbotSettings } from '@/hooks/useDifyChatbotSettings';

const DifyChatbotSettings = ({ onClose }: { onClose?: () => void }) => {
    const {
        provider,
        difyToken,
        apiBaseUrl,
        isLoading,
        error,
        setProvider,
        setDifyToken,
        setApiBaseUrl,
        testConnection,
        resetToDefaults,
    } = useDifyChatbotSettings();

    const [testingConnection, setTestingConnection] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    const handleTestConnection = async () => {
        setTestingConnection(true);
        try {
            const isConnected = await testConnection();
            if (isConnected) {
                Alert.alert(
                    'Thành công',
                    'Kết nối Dify AI thành công! ✅',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Lỗi',
                    'Không thể kết nối đến Dify AI. Vui lòng kiểm tra token.',
                    [{ text: 'OK' }]
                );
            }
        } catch (err) {
            Alert.alert('Lỗi', `Lỗi: ${error || 'Unknown error'}`, [{ text: 'OK' }]);
        } finally {
            setTestingConnection(false);
        }
    };

    const handleReset = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn reset về cấu hình mặc định?',
            [
                { text: 'Hủy', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Reset',
                    onPress: resetToDefaults,
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: textColor }]}>
                        Cấu hình Dify AI Chatbot
                    </Text>
                    <Text style={styles.subtitle}>Quản lý cài đặt chatbot của bạn</Text>
                </View>
                {onClose && (
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={textColor} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Provider Selection */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    📱 Chọn Provider
                </Text>
                <View style={styles.providerContainer}>
                    {(['dify', 'n8n', 'hybrid'] as const).map((p) => (
                        <TouchableOpacity
                            key={p}
                            style={[
                                styles.providerButton,
                                provider === p && [
                                    styles.providerButtonActive,
                                    { borderColor: tintColor, borderWidth: 2 },
                                ],
                                { backgroundColor: provider === p ? `${tintColor}20` : '#f0f0f0' },
                            ]}
                            onPress={() => setProvider(p)}
                        >
                            <Text
                                style={[
                                    styles.providerButtonText,
                                    { color: provider === p ? tintColor : '#666' },
                                ]}
                            >
                                {p === 'dify'
                                    ? '🤖 Dify'
                                    : p === 'n8n'
                                        ? '🔗 N8N'
                                        : '🔄 Hybrid'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.helperText}>
                    {provider === 'dify'
                        ? 'Sử dụng Dify AI làm chatbot chính'
                        : provider === 'n8n'
                            ? 'Sử dụng N8N workflow'
                            : 'Sử dụng Dify AI trước, nếu lỗi sẽ chuyển sang N8N'}
                </Text>
            </View>

            {/* Dify Configuration */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    🔐 Cấu hình Dify
                </Text>

                {/* API Token */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: textColor }]}>
                        API Token
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: textColor,
                                borderColor: error ? '#ff6b6b' : '#e0e0e0',
                                backgroundColor: `${backgroundColor}`,
                            },
                        ]}
                        placeholder="Nhập Dify API Token..."
                        placeholderTextColor="#999"
                        value={difyToken}
                        onChangeText={setDifyToken}
                        secureTextEntry
                        multiline
                    />
                    <Text style={styles.helperText}>
                        Token từ Dify dashboard (Settings → API Keys)
                    </Text>
                </View>

                {/* API Base URL */}
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: textColor }]}>
                        API Base URL
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: textColor,
                                borderColor: '#e0e0e0',
                                backgroundColor: `${backgroundColor}`,
                            },
                        ]}
                        placeholder="https://api.dify.ai/v1"
                        placeholderTextColor="#999"
                        value={apiBaseUrl}
                        onChangeText={setApiBaseUrl}
                    />
                    <Text style={styles.helperText}>
                        Endpoint API của Dify server
                    </Text>
                </View>

                {/* Error Message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#ff6b6b" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* Test Connection Button */}
                <TouchableOpacity
                    style={[styles.testButton, { backgroundColor: tintColor }]}
                    onPress={handleTestConnection}
                    disabled={testingConnection || isLoading}
                >
                    {testingConnection ? (
                        <>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={styles.testButtonText}>Đang kiểm tra...</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="checkmark-done" size={20} color="white" />
                            <Text style={styles.testButtonText}>Kiểm tra kết nối</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    ℹ️ Thông tin
                </Text>
                <View style={styles.infoBox}>
                    <Text style={[styles.infoText, { color: textColor }]}>
                        • Hiện tại đang sử dụng: <Text style={{ fontWeight: 'bold' }}>{provider.toUpperCase()}</Text>
                    </Text>
                    <Text style={[styles.infoText, { color: textColor }]}>
                        • Token: {difyToken?.slice(0, 10)}...
                    </Text>
                    <Text style={[styles.infoText, { color: textColor }]}>
                        • API URL: {apiBaseUrl}
                    </Text>
                </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
                style={[styles.resetButton, { borderColor: '#ff6b6b' }]}
                onPress={handleReset}
            >
                <Ionicons name="refresh" size={20} color="#ff6b6b" />
                <Text style={styles.resetButtonText}>Reset về mặc định</Text>
            </TouchableOpacity>

            {/* Spacing */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
    },

    // Sections
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },

    // Provider Selection
    providerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 8,
    },
    providerButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    providerButtonActive: {},
    providerButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },

    // Form Fields
    fieldContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        marginBottom: 8,
    },
    helperText: {
        fontSize: 12,
        color: '#999',
    },

    // Error
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffe0e0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#ff6b6b',
        flex: 1,
    },

    // Buttons
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
        marginTop: 8,
    },
    testButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        gap: 8,
    },
    resetButtonText: {
        color: '#ff6b6b',
        fontSize: 14,
        fontWeight: '600',
    },

    // Info Box
    infoBox: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
    },
});

export default DifyChatbotSettings;
