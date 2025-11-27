import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export default function GlobalLoading() {
  return (
    <LinearGradient
      colors={["#FF6B9D", "#FF8C42"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <LottieView
          source={require("../assets/animations/cat_animation.json")}
          autoPlay
          loop
          style={{ width: 350, height: 350 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
  },
});
