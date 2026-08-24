import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: '1', name: 'Plomería', icon: 'water-outline' },
  { id: '2', name: 'Electricidad', icon: 'flash-outline' },
  { id: '3', name: 'Mecánica', icon: 'build-outline' },
  { id: '4', name: 'Albañilería', icon: 'hammer-outline' },
  { id: '5', name: 'Pintura', icon: 'color-palette-outline' },
  { id: '6', name: 'Reparaciones', icon: 'settings-outline' },
  { id: '7', name: 'Otros', icon: 'ellipsis-horizontal-outline' },
];

export const Home = () => {
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSearch = useCallback(() => {
    console.log('Searching:', { description, selectedCategory });
  }, [description, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>¿Qué necesitas solucionar?</Text>
          <Text style={styles.subtitle}>
            Cuéntanos tu problema en tus palabras. Encontramos al profesional indicado cerca de ti.
          </Text>
        </View>

        {/* Tarjeta de Entrada */}
        <View style={styles.card}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Necesito un plomero porque tengo una fuga debajo del lavamanos..."
            placeholderTextColor="#8E8E93"
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <View style={styles.divider} />

          <View style={styles.cardFooter}>
            <Text style={styles.footerHint}>Describe tu problema con tus palabras</Text>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Buscar profesionales"
            >
              <Ionicons name="search" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Buscar profesionales</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chips de Categorías */}
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={isSelected ? '#4C8EB0' : '#2A4356'}
                  style={styles.chipIcon}
                />
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7F9',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0A192F',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#52606D',
    textAlign: 'center',
    maxWidth: 480,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  textInput: {
    minHeight: 110,
    fontSize: 15,
    color: '#1A202C',
    padding: 0,
    outlineStyle: 'none',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerHint: {
    fontSize: 13,
    color: '#718096',
  },
  searchButton: {
    backgroundColor: '#6C9CB2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  chipSelected: {
    borderColor: '#4C8EB0',
    backgroundColor: '#F0F7FA',
  },
  chipIcon: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#1A202C',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#4C8EB0',
    fontWeight: '600',
  },
});