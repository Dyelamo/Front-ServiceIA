import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceFormSchema } from '../features/services/services.schema';

export const ServiceForm = ({ initialData, onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData || {
      nombre: '', descripcion: '', precioDesde: '', precioHasta: '', duracionEstimada: '', categoriaId: ''
    }
  });

  return (
    <View style={styles.container}>
      {/* Nombre */}
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Nombre del servicio" value={value} onChangeText={onChange} />
        )}
      />
      {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}

      {/* Descripción */}
      <Controller
        control={control}
        name="descripcion"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Descripción" multiline value={value} onChangeText={onChange} />
        )}
      />
      {errors.descripcion && <Text style={styles.error}>{errors.descripcion.message}</Text>}

      {/* Precio Desde / Hasta */}
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Controller
            control={control} name="precioDesde"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Precio desde" keyboardType="numeric" value={String(value)} onChangeText={onChange} />
            )}
          />
          {errors.precioDesde && <Text style={styles.error}>{errors.precioDesde.message}</Text>}
        </View>
        <View style={styles.flex1}>
          <Controller
            control={control} name="precioHasta"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Precio hasta" keyboardType="numeric" value={String(value)} onChangeText={onChange} />
            )}
          />
          {errors.precioHasta && <Text style={styles.error}>{errors.precioHasta.message}</Text>}
        </View>
      </View>

      {/* Duración */}
      <Controller
        control={control} name="duracionEstimada"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Duración (minutos)" keyboardType="numeric" value={String(value)} onChangeText={onChange} />
        )}
      />
      {errors.duracionEstimada && <Text style={styles.error}>{errors.duracionEstimada.message}</Text>}

      {/* Categoría ID (Simulado como input simple por ahora) */}
      <Controller
        control={control} name="categoriaId"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="ID de la Categoría (UUID)" value={value} onChangeText={onChange} />
        )}
      />
      {errors.categoriaId && <Text style={styles.error}>{errors.categoriaId.message}</Text>}

      {/* Botón de Enviar */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title={initialData ? "Actualizar Servicio" : "Crear Servicio"} onPress={handleSubmit(onSubmit)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5 },
  error: { color: 'red', fontSize: 12, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10 },
  flex1: { flex: 1 }
});