import AsyncStorage from "@react-native-async-storage/async-storage";

const REQUEST_DRAFT_KEY = "@servia_request_draft";

export async function getStoredRequestDraft() {
  const value = await AsyncStorage.getItem(REQUEST_DRAFT_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    await AsyncStorage.removeItem(REQUEST_DRAFT_KEY);
    return null;
  }
}

export async function saveRequestDraft(draft) {
  await AsyncStorage.setItem(REQUEST_DRAFT_KEY, JSON.stringify(draft));
}

export async function clearStoredRequestDraft() {
  await AsyncStorage.removeItem(REQUEST_DRAFT_KEY);
}
