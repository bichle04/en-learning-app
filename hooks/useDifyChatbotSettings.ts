/**
 * Hook để quản lý Dify Chatbot Settings
 */
import { useState, useCallback } from 'react';
import { DIFY_CONFIG, CHATBOT_PROVIDER } from '@/constants/dify.config';

export interface UseDifyChatbotSettingsResult {
    provider: 'dify' | 'n8n' | 'hybrid';
    difyToken: string;
    apiBaseUrl: string;
    isLoading: boolean;
    error: string | null;
    setProvider: (provider: 'dify' | 'n8n' | 'hybrid') => void;
    setDifyToken: (token: string) => void;
    setApiBaseUrl: (url: string) => void;
    testConnection: () => Promise<boolean>;
    resetToDefaults: () => void;
}

export const useDifyChatbotSettings = (): UseDifyChatbotSettingsResult => {
    const [provider, setProvider] = useState<'dify' | 'n8n' | 'hybrid'>(
        CHATBOT_PROVIDER
    );
    const [difyToken, setDifyToken] = useState(DIFY_CONFIG.API_TOKEN);
    const [apiBaseUrl, setApiBaseUrl] = useState(DIFY_CONFIG.API_BASE_URL);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testConnection = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${apiBaseUrl}/chat-messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${difyToken}`,
                },
                body: JSON.stringify({
                    inputs: {},
                    query: 'Xin chào',
                    response_mode: 'blocking',
                    user: 'test',
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const isConnected = response.ok;
            if (!isConnected) {
                setError(`Connection failed: ${response.status}`);
            }
            return isConnected;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl, difyToken]);

    const resetToDefaults = useCallback(() => {
        setProvider(CHATBOT_PROVIDER);
        setDifyToken(DIFY_CONFIG.API_TOKEN);
        setApiBaseUrl(DIFY_CONFIG.API_BASE_URL);
        setError(null);
    }, []);

    return {
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
    };
};
