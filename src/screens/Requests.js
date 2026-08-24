import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('Nuevas');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado */}
        <Text style={styles.title}>Solicitudes</Text>
        <Text style={styles.subtitle}>
          Clientes que necesitan un servicio cerca de ti.
        </Text>

        {/* Control de Pestañas (Tabs) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Nuevas' && styles.activeTab]}
            onPress={() => setActiveTab('Nuevas')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Nuevas' && styles.activeTabText,
              ]}
            >
              Nuevas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Ofertas enviadas' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Ofertas enviadas')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Ofertas enviadas' && styles.activeTabText,
              ]}
            >
              Ofertas enviadas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tarjeta de Solicitud */}
        <View style={styles.card}>
          {/* Header de la Tarjeta */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Fuga de agua</Text>
              <Text style={styles.cardSubtitle}>
                Plomería · Laura Mendoza
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Hoy</Text>
            </View>
          </View>

          {/* Descripción */}
          <Text style={styles.cardDescription}>
            Se me está saliendo agua debajo del lavamanos y el gabinete ya está
            mojado. Necesito que lo revisen hoy...
          </Text>

          {/* Detalles (Ubicación y Tiempo) */}
          <View style={styles.metaContainer}>
            <Text style={styles.metaItem}>
              <Text style={styles.icon}>📍</Text> Barrio Los Fundadores
            </Text>
            <Text style={styles.metaItem}>
              <Text style={styles.icon}>🕒</Text> Hace 22 min
            </Text>
          </View>

          {/* Botón de Acción */}
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Ver solicitud y enviar oferta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A192F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAEFF5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    // Sombra ligera para el tab activo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0A192F',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FDEEE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    fontSize: 13,
    color: '#64748B',
  },
  icon: {
    fontSize: 12,
  },
  button: {
    backgroundColor: '#005A9C',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Requests;