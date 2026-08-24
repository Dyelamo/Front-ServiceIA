// src/screens/client/Step4PhotosScreen.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import StepProgressBar from '../../components/StepProgressBar';
import WizardFooter from '../../components/WizardFooter';
import { useRequestForm } from '../../hook/useRequestForm';

export default function Step4PhotosScreen({ navigation }) {
  const { form, updateForm } = useRequestForm();
  const [photos, setPhotos] = useState(form.photos || []);

  // Carga simulada: no se usa cámara/galería real, solo agrega un placeholder.
  const handleAddPhoto = () => {
    setPhotos((prev) => [...prev, { id: `photo-${prev.length + 1}` }]);
  };

  const handleContinue = () => {
    updateForm({ photos });
    navigation.navigate('Step5Review');
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <StepProgressBar step={4} total={5} label="Fotos" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Agrega fotos (opcional)</Text>
        <Text style={styles.subtitle}>Una imagen ayuda al profesional a entender mejor el problema.</Text>

        <View style={styles.photosRow}>
          {photos.map((p) => (
            <View key={p.id} style={styles.photoThumb}>
              <Ionicons name="image" size={22} color={colors.primary} />
            </View>
          ))}
          <Pressable onPress={handleAddPhoto} style={styles.addPhoto}>
            <Ionicons name="image-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.addPhotoText}>Agregar foto</Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>Carga simulada para el prototipo. No se sube ningún archivo real.</Text>
      </ScrollView>
      <WizardFooter
        onBack={() => navigation.goBack()}
        onContinue={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 22, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  photosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md },
  addPhoto: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.chipBorder,
    borderStyle: 'dashed',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: { ...typography.small, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  photoThumb: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { ...typography.small, color: colors.textMuted },
});
