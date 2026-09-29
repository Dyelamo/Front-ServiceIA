import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  Input,
  Skeleton,
  Stepper,
  TextArea,
} from "../shared/ui";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../shared/layout";

import {
  colors,
  spacing,
} from "../theme";

export default function UiPreviewScreen() {
  return (
    <Screen scroll>
      <AppHeader
        title="Serv-IA UI"
        subtitle="Componentes compartidos"
      />

      <ResponsiveContainer
        maxWidth={700}
        style={styles.container}
      >
        <Text style={styles.heading}>
          Botones
        </Text>

        <Button>
          Botón principal
        </Button>

        <View style={styles.space} />

        <Button variant="secondary">
          Botón secundario
        </Button>

        <View style={styles.space} />

        <Button variant="outline">
          Botón outline
        </Button>

        <View style={styles.section}>
          <Text style={styles.heading}>
            Inputs
          </Text>

          <Input
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
          />

          <View style={styles.space} />

          <TextArea
            label="Descripción"
            placeholder="Describe lo que necesitas..."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            Tarjeta
          </Text>

          <Card variant="outlined">
            <View style={styles.row}>
              <Avatar
                name="Carlos Martínez"
              />

              <View style={styles.userInfo}>
                <Text style={styles.name}>
                  Carlos Martínez
                </Text>

                <Badge tone="success">
                  Disponible
                </Badge>
              </View>
            </View>

            <Divider />

            <Text>
              Técnico especializado en plomería.
            </Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            Stepper
          </Text>

          <Stepper
            current={2}
            total={5}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            Skeleton
          </Text>

          <Skeleton height={80} />
        </View>

        <View style={styles.section}>
          <EmptyState
            title="Todavía no tienes publicaciones"
            description="Cuando publiques una solicitud aparecerá aquí."
            actionLabel="Publicar solicitud"
            onAction={() => {}}
          />
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.lg,
  },

  section: {
    marginTop: spacing.xxxl,
  },

  space: {
    height: spacing.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  userInfo: {
    marginLeft: spacing.md,
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: spacing.xs,
  },
});