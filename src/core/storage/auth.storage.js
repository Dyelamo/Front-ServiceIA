import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "@servia_access_token";
const REFRESH_TOKEN_KEY = "@servia_refresh_token";
const USER_ID_KEY = "@servia_user_id";

export const saveAuthData = async ({
  access_token,
  refresh_token,
  user_id,
}) => {
  if (access_token) {
    await AsyncStorage.setItem(
      ACCESS_TOKEN_KEY,
      access_token
    );
  }

  if (refresh_token) {
    await AsyncStorage.setItem(
      REFRESH_TOKEN_KEY,
      refresh_token
    );
  }

  if (user_id) {
    await AsyncStorage.setItem(
      USER_ID_KEY,
      String(user_id)
    );
  }
};

export const getAccessToken = async () => {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getUserId = async () => {
  return AsyncStorage.getItem(USER_ID_KEY);
};

export const clearAuthData = async () => {
  await AsyncStorage.multiRemove([
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_ID_KEY,
  ]);
};