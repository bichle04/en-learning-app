import React from 'react';
import { Modal, View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ScoringModalProps {
    visible: boolean;
    status?: 'analyzing' | 'success' | 'error';
}

export default function ScoringModal({ visible, status = 'analyzing' }: ScoringModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => { }}
        >
            <View style={styles.overlay}>
                <LinearGradient
                    colors={status === 'success' ? ['#4CAF50', '#45a049'] : ['#1E90FF', '#00BFFF']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Decorative elements */}
                    <View style={[styles.decorStar, { top: 40, left: 30 }]} />
                    <View style={[styles.decorStar, { top: 80, right: 40 }]} />
                    <View style={[styles.decorStar, { bottom: 100, left: 50 }]} />
                    <View style={[styles.decorStar, { bottom: 60, right: 30 }]} />

                    <View style={styles.content}>
                        {status === 'success' ? (
                            <>
                                <Text style={styles.mainEmoji}>🎉</Text>
                                <Text style={styles.title}>Congratulations!</Text>
                                <Text style={styles.subtitle}>
                                    You have completed the speaking test.
                                </Text>
                                <View style={styles.successIconBox}>
                                    <Text style={styles.successIcon}>✓</Text>
                                </View>
                                <Text style={styles.helpText}>Redirecting to results...</Text>
                            </>
                        ) : (
                            <>
                                {/* Animated emoji */}
                                <Text style={styles.mainEmoji}>🎤</Text>

                                {/* Title */}
                                <Text style={styles.title}>Evaluating Your Response</Text>
                                <Text style={styles.subtitle}>
                                    Please wait while we analyze your speaking...
                                </Text>

                                {/* Loading animation dots */}
                                <View style={styles.dotsContainer}>
                                    <View style={[styles.dot, styles.dotAnimated1]} />
                                    <View style={[styles.dot, styles.dotAnimated2]} />
                                    <View style={[styles.dot, styles.dotAnimated3]} />
                                </View>

                                {/* Progress steps */}
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressStep}>
                                        <View style={styles.stepIconBox}>
                                            <Text style={styles.stepIcon}>✓</Text>
                                        </View>
                                        <Text style={styles.stepText}>Recording received</Text>
                                    </View>

                                    <View style={styles.progressStep}>
                                        <View style={styles.stepIconBox}>
                                            <Text style={styles.stepIcon}>⟳</Text>
                                        </View>
                                        <Text style={styles.stepText}>Analyzing speech...</Text>
                                    </View>

                                    <View style={styles.progressStep}>
                                        <View style={styles.stepIconBox}>
                                            <Text style={styles.stepIcon}>○</Text>
                                        </View>
                                        <Text style={styles.stepText}>Generating feedback</Text>
                                    </View>
                                </View>

                                {/* Help text */}
                                <Text style={styles.helpText}>This may take a few moments...</Text>
                            </>
                        )}
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.85,
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    decorStar: {
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 6,
    },
    mainEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 24,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    dotAnimated1: {
        backgroundColor: '#FFFFFF',
    },
    dotAnimated2: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    dotAnimated3: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    progressContainer: {
        width: '100%',
        marginBottom: 20,
    },
    progressStep: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepIconBox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepIcon: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    stepText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
    },
    successIconBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    successIcon: {
        fontSize: 40,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    helpText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 12,
        fontStyle: 'italic',
    },
});
