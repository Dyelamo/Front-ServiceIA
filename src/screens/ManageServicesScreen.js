import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import { ServiceList } from '../components/ServiceList'
import { ServiceForm } from '../components/ServiceForm';
import { createServiceApi, updateServiceApi } from '../features/services/services.api';
// import { useAuth } from '../hook/useAuth';

export const ManageServicesScreen = ({ onOpenProfile }) => {
  // const { userToken } = useAuth();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulación de una carga inicial (GET)
  const fetchServices = async () => {
    setIsLoading(true);
    // Aquí iría tu axios.get(). Simulamos datos por ahora para que no colapse la UI:
    setTimeout(() => {
      setServices([
        { id: '1', nombre: 'Limpieza profunda', descripcion: 'Limpieza de hogar a fondo', precioDesde: 50, precioHasta: 100, duracionEstimada: 120, categoriaId: 'uuid-1', activo: true }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setIsModalVisible(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingService) {
        // Modo Edición
        await updateServiceApi(editingService.id, formData);
      } else {
        // Modo Creación
        await createServiceApi(formData);
      }
      setIsModalVisible(false);
      fetchServices(); // Recargamos la lista
    } catch (error) {
      console.warn("Recuerda cambiar la API_URL real. Error simulado:", error.message);
      setIsModalVisible(false); // Cerramos el modal de todas formas para la prueba visual
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
          <Text style={styles.title}>
              Mis Servicios
          </Text>
          <Button
              title="Mi perfil"
              onPress={onOpenProfile}
          />
      </View>

      {/* <Text style={styles.title}>Mis Servicios</Text> */}
      
      <Button title="+ Nuevo Servicio" onPress={handleOpenCreate} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <ServiceList 
          services={services} 
          onEdit={(service) => {
            setEditingService(service);
            setIsModalVisible(true);
          }} 
          onRefreshList={fetchServices} 
        />
      )}

      {/* Modal para el Formulario */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingService ? 'Editar Servicio' : 'Crear Servicio'}</Text>
          <ServiceForm 
            initialData={editingService} 
            onSubmit={handleSubmit} 
            isLoading={isSubmitting} 
          />
          <Button title="Cancelar" color="red" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 16, marginBottom: 10, textAlign: 'center' },
  modalContent: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 16,
      marginBottom: 15,
  },
  });