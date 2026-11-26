import React, { useState } from "react";

import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "../../../core/errors/error-message";
import { colors } from "../../../theme";
import { Avatar } from "../../../shared/ui";
import { uploadMyProfilePhotoApi } from "../api/user.api";

export default function ProfilePhoto({ name, source, size = 76, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const choosePhoto = async () => {
    if (uploading) {
      return;
    }

    setUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const profile = await uploadMyProfilePhotoApi(result.assets[0]);
      onUploaded(profile);
      await Promise.all(
        ["conversations", "jobs", "offers", "requests", "reviews"].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    } catch (error) {
      Alert.alert(
        "No pudimos actualizar tu foto",
        getApiErrorMessage(error, "Intenta nuevamente con otra imagen."),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Pressable
      onPress={choosePhoto}
      disabled={uploading}
      accessibilityRole="button"
      accessibilityLabel="Cambiar foto de perfil"
      style={[styles.avatarButton, { width: size, height: size, borderRadius: size / 2 }]}>
      <Avatar name={name} source={source} size={size} />
      <View style={styles.editBadge}>
        {uploading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Ionicons name="camera" size={15} color={colors.white} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    position: "relative",
  },
  editBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
