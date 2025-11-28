/**
 * Dify AI Chatbot Service
 * Tích hợp Dify AI API cho chatbot
 */

import { DIFY_CONFIG } from '@/constants/dify.config';

const DIFY_API_BASE = DIFY_CONFIG.API_BASE_URL;
const DIFY_CHATBOT_TOKEN = DIFY_CONFIG.API_TOKEN; // API Key từ .env (DIFY_CHATBOT_KEY)

interface DifyMessage {
    role: 'user' | 'assistant';
    text: string;
}

interface DifyResponse {
    event?: string;
    message_id?: string;
    conversation_id?: string;
    answer?: string;
    data?: {
        answer?: string;
    };
}

/**
 * Gọi Dify AI API để lấy response từ chatbot
 * Sử dụng public API endpoint cho chatbot token
 * @param userMessage Tin nhắn của người dùng
 * @param conversationId ID của cuộc hội thoại (nếu có)
 * @returns Promise chứa response từ Dify
 */
export const callDifyApi = async (
    userMessage: string,
    conversationId?: string
): Promise<string> => {
    try {
        console.log('🔗 Gọi Dify API với message:', userMessage);

        const response = await fetch(`${DIFY_API_BASE}/chat-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${DIFY_CHATBOT_TOKEN}`,
            },
            body: JSON.stringify({
                inputs: {},
                query: userMessage,
                response_mode: 'blocking',
                conversation_id: conversationId || undefined,
                user: 'user_from_mobile_app',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Dify API Error:', errorData);
            throw new Error(
                `Dify API error: ${response.status} - ${errorData?.message || 'Unknown error'}`
            );
        }

        const data: DifyResponse = await response.json();
        console.log('✅ Dify response:', data);

        // Xử lý response từ Dify
        const answer = data.answer || data.data?.answer || 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';
        return answer;
    } catch (error) {
        console.error('❌ Error calling Dify API:', error);
        throw error;
    }
};

/**
 * Lấy fallback response nếu API thất bại
 * @returns Fallback message
 */
export const getDifyFallbackResponse = (): string => {
    const fallbackResponses = [
        'Cảm ơn bạn đã chia sẻ! Tôi hiểu rồi. Hãy kể thêm về nội dung học tập bạn muốn nhé?',
        'Rất thú vị! Bạn có thể giải thích thêm chi tiết không?',
        'Tuyệt vời! Đó là một câu hỏi hay. Bạn muốn học gì tiếp theo?',
        'Cảm ơn bạn! Tôi sẽ giúp bạn hiểu rõ hơn về vấn đề này.',
        'Tôi hiểu rồi. Bạn có câu hỏi gì khác không?',
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

/**
 * Kiểm tra kết nối Dify API
 * @returns Promise<boolean> - true nếu kết nối thành công
 */
export const testDifyConnection = async (): Promise<boolean> => {
    try {
        console.log('🧪 Kiểm tra kết nối Dify...');
        const response = await fetch(`${DIFY_API_BASE}/chat-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${DIFY_CHATBOT_TOKEN}`,
            },
            body: JSON.stringify({
                inputs: {},
                query: 'Xin chào',
                response_mode: 'blocking',
                user: 'test',
            }),
        });

        const isConnected = response.ok;
        console.log(`✅ Dify connection test: ${isConnected ? 'Thành công' : 'Thất bại'}`);
        return isConnected;
    } catch (error) {
        console.error('❌ Dify connection test failed:', error);
        return false;
    }
};
