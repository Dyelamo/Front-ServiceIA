import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "servia.access_token";
const REFRESH_TOKEN_KEY = "servia.refresh_token";
const LEGACY_ACCESS_TOKEN_KEY = "@servia_access_token";
const LEGACY_REFRESH_TOKEN_KEY = "@servia_refresh_token";
const USER_ID_KEY = "@servia_user_id";
const LAST_ACTIVITY_KEY = "@servia_last_activity";
const USE_SECURE_STORAGE = Platform.OS !== "web";
const SECURE_OPTIONS = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

async function saveSecret(key, legacyKey, value) {
  if (USE_SECURE_STORAGE) {
    await SecureStore.setItemAsync(key, value, SECURE_OPTIONS);
    await AsyncStorage.removeItem(legacyKey);
    return;
  }

  await AsyncStorage.setItem(legacyKey, value);
}

async function getSecret(key, legacyKey) {
  if (!USE_SECURE_STORAGE) {
    return AsyncStorage.getItem(legacyKey);
  }

  const storedValue = await SecureStore.getItemAsync(key, SECURE_OPTIONS);

  if (storedValue) {
    return storedValue;
  }

  const legacyValue = await AsyncStorage.getItem(legacyKey);

  if (legacyValue) {
    await saveSecret(key, legacyKey, legacyValue);
  }

  return legacyValue;
}

export const saveAuthData = async ({ access_token, refresh_token, user_id }) => {
  if (access_token) {
    await saveSecret(ACCESS_TOKEN_KEY, LEGACY_ACCESS_TOKEN_KEY, access_token);
  }

  if (refresh_token) {
    await saveSecret(REFRESH_TOKEN_KEY, LEGACY_REFRESH_TOKEN_KEY, refresh_token);
  }

  if (user_id) {
    await AsyncStorage.setItem(USER_ID_KEY, String(user_id));
  }
};

export const getAccessToken = async () => {
  return getSecret(ACCESS_TOKEN_KEY, LEGACY_ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return getSecret(REFRESH_TOKEN_KEY, LEGACY_REFRESH_TOKEN_KEY);
};

export const getUserId = async () => {
  return AsyncStorage.getItem(USER_ID_KEY);
};

export const saveLastActivityAt = async (timestamp) => {
  await AsyncStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
};

export const getLastActivityAt = async () => {
  return AsyncStorage.getItem(LAST_ACTIVITY_KEY);
};

export const clearAuthData = async () => {
  const removals = [
    AsyncStorage.multiRemove([
      LEGACY_ACCESS_TOKEN_KEY,
      LEGACY_REFRESH_TOKEN_KEY,
      USER_ID_KEY,
      LAST_ACTIVITY_KEY,
    ]),
  ];

  if (USE_SECURE_STORAGE) {
    removals.push(
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, SECURE_OPTIONS),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, SECURE_OPTIONS),
    );
  }

  await Promise.all(removals);
};
