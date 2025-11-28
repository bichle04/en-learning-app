/**
 * Dify AI Configuration
 * Quản lý cấu hình cho Dify chatbot
 */

// Lấy API key từ environment variables
const getDifyApiKey = (): string => {
    // Cho Expo, sử dụng process.env với prefix EXPO_PUBLIC_
    if (typeof process !== 'undefined') {
        // Thử với EXPO_PUBLIC_DIFY_CHATBOT_KEY (Expo web)
        if (process.env?.EXPO_PUBLIC_DIFY_CHATBOT_KEY) {
            console.log('✅ Loaded DIFY key từ EXPO_PUBLIC_DIFY_CHATBOT_KEY');
            return process.env.EXPO_PUBLIC_DIFY_CHATBOT_KEY;
        }
        // Thử với DIFY_CHATBOT_KEY (Node.js/backend)
        if (process.env?.DIFY_CHATBOT_KEY) {
            console.log('✅ Loaded DIFY key từ DIFY_CHATBOT_KEY');
            return process.env.DIFY_CHATBOT_KEY;
        }
    }

    // Fallback cho web
    if (typeof window !== 'undefined' && (window as any).__ENV__?.DIFY_CHATBOT_KEY) {
        console.log('✅ Loaded DIFY key từ window.__ENV__');
        return (window as any).__ENV__.DIFY_CHATBOT_KEY;
    }

    console.warn('⚠️ DIFY_CHATBOT_KEY not found in environment variables');
    return 'app-0G7vOkXUT9vA4bQOs3i0ownD'; // Default fallback
};

export const DIFY_CONFIG = {
    // API Key từ .env file
    API_TOKEN: getDifyApiKey(),

    // API endpoints - Dify Cloud
    API_BASE_URL: 'https://api.dify.ai/v1',

    // Mode: 'blocking' hoặc 'streaming'
    RESPONSE_MODE: 'blocking' as const,

    // Timeout cho API call (ms)
    REQUEST_TIMEOUT: 30000,

    // Enable debug logging
    DEBUG: true,
};

/**
 * Loại chatbot backend sử dụng
 */
export type ChatbotProvider = 'dify';

/**
 * Config để chọn chatbot provider
 */
export const CHATBOT_PROVIDER: ChatbotProvider = 'dify';