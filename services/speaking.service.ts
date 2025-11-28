import { supabase } from '../lib/supabase';
import { SpeakingHistory, SpeakingTestHistory } from '../types/database';

export const speakingService = {
  async getPracticeHistory(userId: string) {
    const { data, error } = await supabase
      .from('speaking_history')
      .select(`
        *,
        speaking_parts (
          id,
          title,
          part
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching practice history:', error);
      throw error;
    }

    return data as SpeakingHistory[];
  },

  async getTestHistory(userId: string) {
    const { data, error } = await supabase
      .from('speaking_test_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching test history:', error);
      throw error;
    }

    return data as SpeakingTestHistory[];
  },

  async getAllHistory(userId: string) {
    const [practice, test] = await Promise.all([
      this.getPracticeHistory(userId),
      this.getTestHistory(userId)
    ]);

    // Combine and sort by date
    const combined = [
      ...practice.map(p => ({ ...p, type: 'practice' as const })),
      ...test.map(t => ({ ...t, type: 'test' as const }))
    ].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return combined;
  },

  async getHistoryItem(id: number, type: 'practice' | 'test') {
    const table = type === 'practice' ? 'speaking_history' : 'speaking_test_history';
    
    let query = supabase.from(table).select('*').eq('id', id).single();
    
    if (type === 'practice') {
        query = supabase.from(table).select(`
            *,
            speaking_parts (
                id,
                title,
                part
            )
        `).eq('id', id).single();
    }

    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${type} history item:`, error);
      throw error;
    }
    
    return data;
  }
};
