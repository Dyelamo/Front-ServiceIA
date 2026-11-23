import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_MODE_KEY = "@servia_app_mode";

export async function getStoredAppMode() {
  const mode = await AsyncStorage.getItem(APP_MODE_KEY);
  return mode === "profesional" ? "profesional" : "cliente";
}

export async function saveAppMode(mode) {
  const safeMode = mode === "profesional" ? "profesional" : "cliente";
  await AsyncStorage.setItem(APP_MODE_KEY, safeMode);
}
