import { supabase } from '../lib/supabase';
import { API_CONFIG } from '../constants/api.config';
import { SpeakingHistory, SpeakingTestHistory } from '../types/database';
import { SpeakingQuestion, SpeakingTopic, SpeakingPart } from '../types/speaking';

interface SupabaseQuestion {
  id: number;
  question: string;
  prepTime: number;
  speakTime: number;
  audioUrl: string;
}

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
  },

  async getSpeakingTopics() {
    const { data, error } = await supabase
      .from('speaking_parts')
      .select('*')
      .order('part', { ascending: true });

    if (error) {
      console.error('Error fetching speaking topics:', error);
      throw error;
    }

    return data;
  },

  async getTopicsByPart(part: number): Promise<SpeakingTopic[]> {
    const { data, error } = await supabase
      .from("speaking_parts")
      .select("id, part, title, description")
      .eq("part", part);

    if (error) {
      console.error("Error fetching speaking topics:", error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id.toString(),
      part: item.part,
      title: item.title,
      description: item.description || "",
    }));
  },

  async getSpeakingQuestions(topicId: string): Promise<SpeakingQuestion[]> {
    const { data, error } = await supabase
      .from("speaking_parts")
      .select("part, questions")
      .eq("id", parseInt(topicId))
      .single();

    if (error) {
      console.error("Error fetching speaking questions:", error);
      return [];
    }

    if (!data || !data.questions) {
      return [];
    }

    const questions = data.questions as unknown as SupabaseQuestion[];

    return questions.map((q) => ({
      id: `${topicId}-${q.id}`,
      part: Number(data.part) as SpeakingPart,
      topicId: topicId,
      question: q.question,
      prepTime: Number(q.prepTime) || 0,
      speakTime: Number(q.speakTime) || 0,
      audioUrl: q.audioUrl,
    }));
  },

  async getFullTestQuestions(): Promise<SpeakingQuestion[]> {
    try {
      const fullTestQuestions: SpeakingQuestion[] = [];

      // Fetch one random topic for each part (1, 2, 3)
      for (let part = 1; part <= 3; part++) {
        const topics = await this.getTopicsByPart(part);
        if (topics.length > 0) {
          // Select a random topic
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          const questions = await this.getSpeakingQuestions(randomTopic.id);
          fullTestQuestions.push(...questions);
        }
      }

      return fullTestQuestions;
    } catch (error) {
      console.error("Error fetching full test questions:", error);
      return [];
    }
  },

  async getUserStats(userId: string) {
    // Fetch all history to calculate stats
    const history = await this.getAllHistory(userId);

    // Fetch user activity for study time and streak
    const { data: activityData, error: activityError } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('activity_date', { ascending: false });

    if (activityError) {
      console.error('Error fetching user activity:', activityError);
    }

    // Calculate basic stats
    const totalTests = history.length;

    // Calculate average score
    const scores = history
      .map(h => Number(h.overall_score) || 0)
      .filter(s => s > 0);
    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    // Calculate study time (minutes) from user_activity
    const studyTime = activityData?.reduce((total, curr) => total + (curr.study_time_minutes || 0), 0) || 0;

    // Calculate streak
    let streak = 0;
    if (activityData && activityData.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Check if there is activity today or yesterday to start the streak
      const lastActivityDate = activityData[0].activity_date;

      if (lastActivityDate === today || lastActivityDate === yesterday) {
        streak = 1;
        let currentDate = new Date(lastActivityDate);

        for (let i = 1; i < activityData.length; i++) {
          const prevDate = new Date(currentDate);
          prevDate.setDate(prevDate.getDate() - 1);
          const prevDateString = prevDate.toISOString().split('T')[0];

          if (activityData[i].activity_date === prevDateString) {
            streak++;
            currentDate = prevDate;
          } else {
            break;
          }
        }
      }
    }

    // Recent scores for chart (last 6)
    const recentScores = scores.slice(0, 6).reverse();

    // Calculate skills average
    let fluencyTotal = 0, lexicalTotal = 0, grammarTotal = 0, pronunciationTotal = 0;
    let count = 0;

    history.forEach(h => {
      const details = h.type === 'practice' ? h.details : (h.data?.[0] || {});
      if (details) {
        fluencyTotal += details.fluency || 0;
        lexicalTotal += details.lexical || 0;
        grammarTotal += details.grammar || 0;
        pronunciationTotal += details.pronunciation || 0;
        if (details.fluency || details.lexical || details.grammar || details.pronunciation) {
          count++;
        }
      }
    });

    const skills = [
      { name: "Fluency", score: count ? fluencyTotal / count : 0, color: "#4CAF50" },
      { name: "Lexical", score: count ? lexicalTotal / count : 0, color: "#2196F3" },
      { name: "Grammar", score: count ? grammarTotal / count : 0, color: "#FF9800" },
      { name: "Pronunciation", score: count ? pronunciationTotal / count : 0, color: "#9C27B0" },
    ];

    // Recent activity
    const recentActivity = history.slice(0, 3).map(h => ({
      id: h.id,
      title: h.type === 'test' ? 'Full Speaking Test' : (h.speaking_parts?.title || 'Speaking Practice'),
      time: new Date(h.created_at).toLocaleDateString('vi-VN'),
      score: Number(h.overall_score) || 0
    }));

    return {
      totalTests,
      averageScore: Number(averageScore.toFixed(1)),
      studyTime,
      streak,
      recentScores,
      skills,
      recentActivity
    };
  },

  async saveSpeakingFeedback(
    userId: string,
    part: number,
    partId: number,
    feedback: any
  ) {
    try {
      console.log('[saveSpeakingFeedback] Saving feedback for user:', userId);

      // Save complete API response with all details
      const detailsData = {
        overall_score: feedback.overall_score,
        transcript: feedback.transcript,
        fluency: {
          score: feedback.details.fluency.score,
          evaluation: feedback.details.fluency.evaluation,
          errors: feedback.details.fluency.errors,
          feedback: feedback.details.fluency.feedback,
          wpm: feedback.details.fluency.wpm,
        },
        pronunciation: {
          score: feedback.details.pronunciation.score,
          evaluation: feedback.details.pronunciation.evaluation,
          errors: feedback.details.pronunciation.errors,
          feedback: feedback.details.pronunciation.feedback,
        },
        grammar: {
          score: feedback.details.grammar.score,
          evaluation: feedback.details.grammar.evaluation,
          errors: feedback.details.grammar.errors,
          feedback: feedback.details.grammar.feedback,
        },
        vocabulary: {
          score: feedback.details.vocabulary.score,
          evaluation: feedback.details.vocabulary.evaluation,
          errors: feedback.details.vocabulary.errors,
          feedback: feedback.details.vocabulary.feedback,
        },
      };

      const generalSuggestions = feedback.general_suggestions || [];

      const { data, error } = await supabase
        .from('speaking_history')
        .insert([
          {
            user_id: userId,
            part: part,
            part_id: partId,
            overall_score: feedback.overall_score,
            details: detailsData,
            general_suggestions: generalSuggestions,
          },
        ])
        .select();

      if (error) {
        console.error('[saveSpeakingFeedback] Error saving feedback:', error);
        throw error;
      }

      console.log('[saveSpeakingFeedback] Feedback saved successfully:', data);
      return data?.[0];
    } catch (error) {
      console.error('[saveSpeakingFeedback] Error:', error);
      throw error;
    }
  },

  async submitSpeakingAudio(audioFilePath: string, questions?: string[]) {
    try {
      console.log('[submitSpeakingAudio] Audio path:', audioFilePath);
      console.log('[submitSpeakingAudio] Questions:', questions);

      // Get filename from path - ensure it has .wav extension
      let fileName = 'audio.wav';
      const fileNameFromPath = audioFilePath.split('/').pop();
      if (fileNameFromPath && fileNameFromPath.match(/\.(mp3|wav|m4a|ogg|webm)$/i)) {
        fileName = fileNameFromPath.replace(/\.(mp3|m4a|ogg|webm)$/i, '.wav');
      }
      console.log('[submitSpeakingAudio] File name:', fileName);

      // For web: convert blob URL to File directly
      if (audioFilePath.includes('blob:')) {
        console.log('[submitSpeakingAudio] Handling blob URI');

        const blobUrl = audioFilePath.substring(audioFilePath.indexOf('blob:'));
        console.log('[submitSpeakingAudio] Blob URL:', blobUrl);

        const response = await fetch(blobUrl);
        const blob = await response.blob();
        console.log('[submitSpeakingAudio] Blob fetched - Size:', blob.size, 'Type:', blob.type);

        // Create FormData with blob directly
        const formData = new FormData();
        formData.append('file', blob, fileName);

        // Add questions to FormData if provided
        if (questions && questions.length > 0) {
          questions.forEach(question => {
            formData.append('questions', question);
          });
        }

        // Send to API
        console.log('[submitSpeakingAudio] Sending to API...');
        const apiUrl = API_CONFIG.IELTS_SPEAKING_API;
        console.log('[submitSpeakingAudio] API URL:', apiUrl);

        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const apiResponse = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
        }).catch(error => {
          console.error('[submitSpeakingAudio] Fetch error details:', {
            message: error.message,
            name: error.name,
            url: apiUrl,
            corsHint: 'If CORS error: Check if ngrok backend is running and URL is up-to-date'
          });
          throw error;
        });

        console.log('[submitSpeakingAudio] Response status:', apiResponse.status);

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error('[submitSpeakingAudio] Error response:', errorText);
          throw new Error(`API Error: ${apiResponse.status} - ${errorText}`);
        }

        const feedback = await apiResponse.json();
        console.log('[submitSpeakingAudio] Feedback received:', feedback);
        return feedback;
      }
      // For native: handle file paths
      else if (audioFilePath.startsWith('file://')) {
        console.log('[submitSpeakingAudio] Handling native file URI');

        const formData = new FormData();
        (formData as any).append('file', {
          uri: audioFilePath,
          type: 'audio/mp4',
          name: fileName,
        });

        // Add questions to FormData if provided
        if (questions && questions.length > 0) {
          questions.forEach(question => {
            (formData as any).append('questions', question);
          });
        }

        const apiUrl = API_CONFIG.IELTS_SPEAKING_API;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const apiResponse = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
        });

        console.log('[submitSpeakingAudio] Response status:', apiResponse.status);

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error('[submitSpeakingAudio] Error response:', errorText);
          throw new Error(`API Error: ${apiResponse.status} - ${errorText}`);
        }

        const feedback = await apiResponse.json();
        console.log('[submitSpeakingAudio] Feedback received:', feedback);
        return feedback;
      }
      else {
        throw new Error('Invalid audio file path');
      }
    } catch (error) {
      console.error('[submitSpeakingAudio] Error:', error);
      throw error;
    }
  }
};
