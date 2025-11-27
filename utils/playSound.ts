import { Audio } from "expo-av";

export const playSound = async (type: "correct" | "wrong") => {
  const sound = new Audio.Sound();
  try {
    const source =
      type === "correct"
        ? require("../assets/sounds/correct.mp3")
        : require("../assets/sounds/wrong.mp3");

    await sound.loadAsync(source);
    await sound.playAsync();
  } catch (error) {
    console.warn("Error playing sound", error);
  }
};
