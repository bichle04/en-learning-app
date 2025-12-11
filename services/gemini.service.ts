/**
 * Gemini AI Service
 * Tích hợp Google Gemini API cho hỏi đáp học tập
 */

interface GeminiContent {
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
}

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{ text: string }>;
        };
    }>;
    error?: {
        message?: string;
    };
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Gọi Gemini API để lấy response từ hỏi đáp học tập
 * @param userMessage Tin nhắn của người dùng
 * @returns Promise chứa response từ Gemini
 */
export const callGeminiApi = async (userMessage: string): Promise<string> => {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key không được cấu hình. Vui lòng thêm EXPO_PUBLIC_GEMINI_API_KEY vào .env');
        }

        console.log('🔗 Gọi Gemini API với message:', userMessage);

        const response = await fetch(`${GEMINI_API_BASE}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: 'Bạn là một trợ lý học tiếng Anh thân thiện và chuyên sâu. Hãy trả lời các câu hỏi về tiếng Anh một cách rõ ràng, chi tiết và có ích. Sử dụng tiếng Việt để giải thích nhưng có thể sử dụng tiếng Anh để minh họa.\n\nCâu hỏi: ' + userMessage,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Gemini API Error:', errorData);
            throw new Error(
                `Gemini API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`
            );
        }

        const data: GeminiResponse = await response.json();
        console.log('✅ Gemini response:', data);

        // Xử lý response từ Gemini
        const answer =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';
        return answer;
    } catch (error) {
        console.error('❌ Error calling Gemini API:', error);
        throw error;
    }
};

/**
 * Lấy fallback response nếu API thất bại
 * @returns Fallback message
 */
export const getGeminiFallbackResponse = (): string => {
    const fallbackResponses = [
        'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
        'Tôi không thể kết nối với dịch vụ lúc này. Hãy kiểm tra kết nối internet của bạn.',
        'Có lỗi xảy ra. Vui lòng thử lại sau vài giây.',
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

/**
 * Kiểm tra kết nối Gemini API
 * @returns Promise<boolean> - true nếu kết nối thành công
 */
export const testGeminiConnection = async (): Promise<boolean> => {
    try {
        if (!GEMINI_API_KEY) {
            console.warn('⚠️ Gemini API key không được cấu hình');
            return false;
        }

        console.log('🧪 Kiểm tra kết nối Gemini...');
        const response = await fetch(`${GEMINI_API_BASE}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: 'Xin chào',
                            },
                        ],
                    },
                ],
            }),
        });

        const isConnected = response.ok;
        console.log(`✅ Gemini connection test: ${isConnected ? 'Thành công' : 'Thất bại'}`);
        return isConnected;
    } catch (error) {
        console.error('❌ Gemini connection test failed:', error);
        return false;
    }
};
