import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient"; // Thêm import này
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function LoadingScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Sau khi auth context đã load xong
      const timer = setTimeout(() => {
        if (user) {
          // Đã đăng nhập -> đi đến tabs
          router.replace("/(tabs)");
        } else {
          // Chưa đăng nhập -> đi đến login
          router.replace("/(auth)/login");
        }
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C3483",
    marginTop: 24,
    textAlign: "center",
  },
});