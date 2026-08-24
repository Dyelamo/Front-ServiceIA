import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "@servia_access_token";
const REFRESH_TOKEN_KEY = "@servia_refresh_token";
const USER_ID_KEY = "@servia_user_id";

export const saveAuthData = async ({
    access_token,
    refresh_token,
    user_id,
}) => {
    await AsyncStorage.setItem(
        ACCESS_TOKEN_KEY,
        access_token
    );

    await AsyncStorage.setItem(
        REFRESH_TOKEN_KEY,
        refresh_token
    );

    await AsyncStorage.setItem(
        USER_ID_KEY,
        user_id
    );
};

export const getAccessToken = async () => {
    return await AsyncStorage.getItem(
        ACCESS_TOKEN_KEY
    );
};

export const getRefreshToken = async () => {
    return await AsyncStorage.getItem(
        REFRESH_TOKEN_KEY
    );
};

export const getUserId = async () => {
    return await AsyncStorage.getItem(
        USER_ID_KEY
    );
};

export const clearAuthData = async () => {
    await AsyncStorage.removeItem(
        ACCESS_TOKEN_KEY
    );

    await AsyncStorage.removeItem(
        REFRESH_TOKEN_KEY
    );

    await AsyncStorage.removeItem(
        USER_ID_KEY
    );
};