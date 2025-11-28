import { supabase } from "@/lib/supabase";
import { SpeakingQuestion, SpeakingTopic, SpeakingPart } from "@/types/speaking";

export interface SupabaseSpeakingPart {
    id: number;
    part: number;
    title: string;
    description: string;
    questions: SupabaseQuestion[];
}

export interface SupabaseQuestion {
    id: number;
    question: string;
    prepTime: number;
    speakTime: number;
    audioUrl: string;
}

export const getSpeakingTopics = async (part: number): Promise<SpeakingTopic[]> => {
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
};

export const getSpeakingQuestions = async (topicId: string): Promise<SpeakingQuestion[]> => {
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
};

export const getFullTestQuestions = async (): Promise<SpeakingQuestion[]> => {
    try {
        const fullTestQuestions: SpeakingQuestion[] = [];

        // Fetch one random topic for each part (1, 2, 3)
        for (let part = 1; part <= 3; part++) {
            const topics = await getSpeakingTopics(part);
            if (topics.length > 0) {
                // Select a random topic
                const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                const questions = await getSpeakingQuestions(randomTopic.id);
                fullTestQuestions.push(...questions);
            }
        }

        return fullTestQuestions;
    } catch (error) {
        console.error("Error fetching full test questions:", error);
        return [];
    }
};
