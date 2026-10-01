import React, {
  useState,
} from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  spacing,
} from "../../../theme/index";

import {
  Button,
  Input,
  TextArea,
} from "../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout/index";

import {
  createProfessionalOffer,
} from "../api/offers.api";

export default function CreateOfferScreen({
  navigation,
  route,
}) {
  const request =
    route?.params?.request;

  const [price, setPrice] =
    useState("");

  const [
    availability,
    setAvailability,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const isValid =
    Number(price) > 0 &&
    availability.trim() &&
    message.trim();

  const handleSubmit =
    async () => {
      if (!isValid) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        await createProfessionalOffer({
          publicationId:
            request.id,

          price:
            Number(price),

          availability:
            availability.trim(),

          message:
            message.trim(),
        });

        navigation.navigate(
          "ProfessionalTabs",
          {
            screen:
              "ProfessionalOffers",
          }
        );
      } catch (err) {
        console.error(
          "Error enviando oferta:",
          err
        );

        const backendMessage =
          err?.response?.data?.detail ||
          err?.response?.data?.message;

        setError(
          backendMessage ||
            "No pudimos enviar la oferta. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Screen
      scroll
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Enviar oferta"
        onBack={() =>
          navigation.goBack()
        }
      />

      <ResponsiveContainer
        maxWidth={640}
        style={styles.container}
      >
        <Text
          style={
            styles.title
          }
        >
          Prepara tu propuesta
        </Text>

        <Text
          style={
            styles.description
          }
        >
          Indica cuánto cobrarías y
          cuándo puedes realizar el
          trabajo.
        </Text>

        {error ? (
          <View
            style={
              styles.errorBox
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={
                colors.error
              }
            />

            <Text
              style={
                styles.errorText
              }
            >
              {error}
            </Text>
          </View>
        ) : null}

        <View
          style={
            styles.form
          }
        >
          <Input
            label="Precio"
            placeholder="Ej. 120000"
            keyboardType="numeric"
            value={price}
            onChangeText={
              setPrice
            }
            helperText="Valor en pesos colombianos"
          />

          <View
            style={
              styles.spacing
            }
          />

          <Input
            label="Disponibilidad"
            placeholder="Ej. Hoy después de las 3:00 p.m."
            value={
              availability
            }
            onChangeText={
              setAvailability
            }
          />

          <View
            style={
              styles.spacing
            }
          />

          <TextArea
            label="Mensaje"
            placeholder="Cuéntale al cliente cómo puedes ayudarlo..."
            value={message}
            onChangeText={
              setMessage
            }
            maxLength={500}
          />

          <Text
            style={
              styles.counter
            }
          >
            {message.length}/500
          </Text>
        </View>

        <View
          style={
            styles.action
          }
        >
          <Button
            onPress={
              handleSubmit
            }
            disabled={
              !isValid
            }
            loading={
              loading
            }
          >
            Enviar oferta
          </Button>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        spacing.xxl,
    },

    title: {
      color: colors.text,

      fontSize: 26,
      fontWeight: "800",
    },

    description: {
      color:
        colors.textSecondary,

      fontSize: 15,
      lineHeight: 22,

      marginTop:
        spacing.sm,
    },

    form: {
      marginTop:
        spacing.xxxl,
    },

    spacing: {
      height:
        spacing.lg,
    },

    counter: {
      textAlign: "right",

      color:
        colors.textMuted,

      fontSize: 12,

      marginTop:
        spacing.xs,
    },

    action: {
      marginTop:
        spacing.xxxl,
    },

    errorBox: {
      flexDirection: "row",

      marginTop:
        spacing.xxl,

      padding:
        spacing.md,

      backgroundColor:
        "#FEF2F2",

      borderRadius: 12,

      borderWidth: 1,
      borderColor:
        "#FECACA",
    },

    errorText: {
      flex: 1,

      marginLeft:
        spacing.sm,

      color:
        "#B91C1C",

      fontSize: 14,
      lineHeight: 20,
    },
  });