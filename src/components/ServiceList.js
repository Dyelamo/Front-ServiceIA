import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// Hook ficticio solicitado
import { useAuth } from '../hook/useAuth'; 
import { publishServiceApi, deleteServiceApi } from '../features/services/services.api';

export const ServiceList = ({ services, onEdit, onRefreshList }) => {
  const { userToken } = useAuth();
  const [publishingId, setPublishingId] = useState(null);

  const handlePublish = async (id) => {
    try {
      setPublishingId(id);
      await publishServiceApi(id, userToken);
      Alert.alert("Éxito", "Servicio publicado correctamente");
      onRefreshList(); // Llama a tu fetch principal para recargar la lista
    } catch (error) {
      Alert.alert("Error", "No se pudo publicar el servicio");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar Servicio",
      "¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteServiceApi(id, userToken);
              onRefreshList();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el servicio");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={[styles.status, { color: item.activo ? 'green' : 'gray' }]}>
          {item.activo ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
      <Text>{item.descripcion}</Text>
      <Text>Precio: ${item.precioDesde} - ${item.precioHasta}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(item)}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        
        {!item.activo && (
          <TouchableOpacity style={styles.btnPublish} onPress={() => handlePublish(item.id)} disabled={publishingId === item.id}>
            {publishingId === item.id ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>Publicar</Text>}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  status: { fontWeight: 'bold' },
  actions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  btnEdit: { backgroundColor: '#007BFF', padding: 8, borderRadius: 5, flex: 1, alignItems: 'center' },
  btnPublish: { backgroundColor: '#28A745', padding: 8, borderRadius: 5, flex: 1, alignItems: 'center' },
  btnDelete: { backgroundColor: '#DC3545', padding: 8, borderRadius: 5, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});