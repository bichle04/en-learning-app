import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { ArrowLeft, Hash, Save, Volume2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { VocabularyService } from "../services/vocabulary.service";
import { UserVocabulary } from "../types/database";

interface SearchResult {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  partOfSpeech: string;
  audioUrl?: string;
  allDefinitions?: {
    partOfSpeech: string;
    definition: string;
    example?: string;
  }[];
}

interface Word {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  topic?: string;
  dateAdded: string;
  isFavorite: boolean;
  reviewCount?: number;
  lastReviewed?: string;
  audioUrl?: string;
}

interface WordDetailModalProps {
  visible: boolean;
  onClose: () => void;
  word?: Word;
  searchResult?: SearchResult;
  onSave?: () => void;
  onToggleFavorite?: (wordId: string) => void;
  onUpdate?: () => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  visible,
  onClose,
  word,
  searchResult,
  onSave,
  onToggleFavorite,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

  // Use either saved word or search result data
  const displayWord = word?.word || searchResult?.word || "";
  const displayPronunciation =
    word?.pronunciation || searchResult?.pronunciation || "";
  const displayDefinition = word?.definition || searchResult?.definition || "";
  const displayExample = word?.example || searchResult?.example || "";
  const displayPartOfSpeech = searchResult?.partOfSpeech || "";
  const displayTopic = word?.topic;
  const displayDateAdded = word?.dateAdded;
  const displayIsFavorite = word?.isFavorite || false;
  const displayReviewCount = word?.reviewCount;
  const [displayAllDefinitions, setAllDefinition] = useState(
    searchResult?.allDefinitions
  );

  // console.log(displayWord);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${displayWord}`
      );
      const data = await response.json();
      const result = data?.[0];
      const allDefinitions: {
        definition: string;
        example?: string;
        partOfSpeech: string;
      }[] = [];

      result.meanings.forEach((meaning: any) => {
        meaning.definitions.forEach((def: any) => {
          allDefinitions.push({
            definition: def.definition,
            example: def.example,
            partOfSpeech: meaning.partOfSpeech,
          });
        });
      });
      // console.log(searchResult);
      // console.log(result.meanings[0].definitions[0]);
      setAllDefinition(allDefinitions);
    }
    fetchData();
  }, [displayWord]);

  const playPronunciation = () => {
    if (!displayWord) return;

    Speech.stop();
    Speech.speak(displayWord, {
      language: "en",
      rate: 1,
      pitch: 1,
    });
  };

  const handleSaveWord = async () => {
    if (!searchResult || !user || isSaving) return;

    setIsSaving(true);
    try {
      const vocabularyData: Omit<
        UserVocabulary,
        "id" | "created_at" | "updated_at"
      > = {
        user_id: user.id,
        word: searchResult.word,
        pronunciation: searchResult.pronunciation,
        definition: searchResult.definition,
        example: searchResult.example,
        topic: undefined,
        audio_url: undefined, // Not using audio URL anymore
        is_favorite: false,
        review_count: 0,
        last_reviewed: undefined,
        date_added: new Date().toISOString().split("T")[0],
      };

      await VocabularyService.createVocabulary(vocabularyData);
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error saving word:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!word || !user || isUpdatingFavorite) return;

    setIsUpdatingFavorite(true);
    try {
      await VocabularyService.updateVocabulary(word.id, {
        is_favorite: !word.isFavorite,
      });
      onToggleFavorite?.(word.id);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const isFromSearch = !!searchResult && !word;
  const canSave = isFromSearch && user && !isSaving;
  const canToggleFavorite = !!word && user && !isUpdatingFavorite;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ArrowLeft size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Word Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Word Info */}
          <View style={styles.wordSection}>
            <View style={styles.wordHeader}>
              <View style={styles.wordInfo}>
                <Text style={styles.wordTitle}>{displayWord}</Text>
                <Text style={styles.pronunciation}>{displayPronunciation}</Text>
                {displayPartOfSpeech && (
                  <Text style={styles.partOfSpeech}>
                    ({displayPartOfSpeech})
                  </Text>
                )}
              </View>

              <View style={styles.wordActions}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={playPronunciation}
                >
                  <Volume2 size={24} color="#FF6B9D" />
                </TouchableOpacity>

                {/* {canToggleFavorite && (
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleToggleFavorite}
                    disabled={isUpdatingFavorite}
                  >
                    <Star
                      size={24}
                      color={displayIsFavorite ? "#FFD700" : "#BDC3C7"}
                      fill={displayIsFavorite ? "#FFD700" : "none"}
                    />
                  </TouchableOpacity>
                )} */}
              </View>
            </View>

            {displayTopic && (
              <View style={styles.topicContainer}>
                <View style={styles.topicBadge}>
                  <Hash size={14} color="#9B59B6" />
                  <Text style={styles.topicText}>{displayTopic}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Main Definition */}
          <View style={styles.definitionSection}>
            <Text style={styles.sectionTitle}>Definition</Text>
            <Text style={styles.definition}>{displayDefinition}</Text>
          </View>

          {/* Example */}
          {displayExample !== "No example data." && (
            <View style={styles.exampleSection}>
              <Text style={styles.sectionTitle}>Example</Text>
              <View style={styles.exampleContainer}>
                <Text style={styles.example}>&quot;{displayExample}&quot;</Text>
              </View>
            </View>
          )}

          {/* Additional Definitions */}
          {displayAllDefinitions && displayAllDefinitions.length > 1 && (
            <View style={styles.additionalDefinitionsSection}>
              <Text style={styles.sectionTitle}>Other Meanings</Text>
              {displayAllDefinitions.map((def, index) => (
                <View key={index} style={styles.additionalDefinition}>
                  <View style={styles.additionalDefinitionHeader}>
                    <Text style={styles.additionalPartOfSpeech}>
                      ({def.partOfSpeech})
                    </Text>
                  </View>
                  <Text style={styles.additionalDefinitionText}>
                    {def.definition}
                  </Text>
                  {def.example && (
                    <Text style={styles.additionalExample}>
                      &quot;{def.example}&quot;
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Word Stats for saved words */}
          {word && (
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Learning Progress</Text>
              <View style={styles.statsContainer}>
                {displayDateAdded && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Added:</Text>
                    <Text style={styles.statValue}>{displayDateAdded}</Text>
                  </View>
                )}
                {displayReviewCount !== undefined && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Reviews:</Text>
                    <Text style={styles.statValue}>
                      {displayReviewCount}{" "}
                      {displayReviewCount === 1 ? "time" : "times"}
                    </Text>
                  </View>
                )}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.statValue,
                      displayIsFavorite && styles.favoriteStatus,
                    ]}
                  >
                    {displayIsFavorite ? "⭐ Favorite" : "📚 Learning"}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Action */}
        {canSave && (
          <View style={styles.bottomAction}>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSaveWord}
              disabled={isSaving}
            >
              <LinearGradient
                colors={["#FF6B9D", "#FF8C42"]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isSaving ? (
                  <Text style={styles.saveButtonText}>Saving...</Text>
                ) : (
                  <>
                    <Save size={20} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>
                      Save to Collection
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  wordSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  wordInfo: {
    flex: 1,
  },
  wordTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  pronunciation: {
    fontSize: 18,
    color: "#7F8C8D",
    fontStyle: "italic",
    marginBottom: 4,
  },
  partOfSpeech: {
    fontSize: 16,
    color: "#9B59B6",
    fontWeight: "500",
  },
  wordActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5F8",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF9E6",
    alignItems: "center",
    justifyContent: "center",
  },
  topicContainer: {
    marginTop: 12,
  },
  topicBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  topicText: {
    fontSize: 14,
    color: "#9B59B6",
    fontWeight: "500",
    marginLeft: 4,
  },
  definitionSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  definition: {
    fontSize: 16,
    color: "#34495E",
    lineHeight: 24,
  },
  exampleSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exampleContainer: {
    backgroundColor: "#F8F9FA",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B9D",
    paddingLeft: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  example: {
    fontSize: 16,
    color: "#34495E",
    fontStyle: "italic",
    lineHeight: 24,
  },
  additionalDefinitionsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  additionalDefinition: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  additionalDefinitionHeader: {
    marginBottom: 8,
  },
  additionalPartOfSpeech: {
    fontSize: 14,
    color: "#9B59B6",
    fontWeight: "600",
  },
  additionalDefinitionText: {
    fontSize: 15,
    color: "#34495E",
    lineHeight: 22,
    marginBottom: 8,
  },
  additionalExample: {
    fontSize: 14,
    color: "#7F8C8D",
    fontStyle: "italic",
    lineHeight: 20,
  },
  statsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsContainer: {
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "600",
  },
  favoriteStatus: {
    color: "#FFD700",
  },
  bottomAction: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
