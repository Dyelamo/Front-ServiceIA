// src/components/RequestCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import Badge from './Badge';
import PrimaryButton from './PrimaryButton';

export default function RequestCard({ request, onPress, ctaLabel }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{request.title}</Text>
          <Text style={styles.category}>
            {request.category}
            {request.client ? ` · ${request.client}` : ''}
          </Text>
        </View>
        <Badge label={request.badge} type={request.badgeType} />
      </View>

      {!!request.description && (
        <Text style={styles.description} numberOfLines={2}>
          {request.description}
        </Text>
      )}

      <View style={styles.footerRow}>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{request.location}</Text>
          {!!request.time && (
            <>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.textSecondary}
                style={{ marginLeft: spacing.sm }}
              />
              <Text style={styles.metaText}>{request.time}</Text>
            </>
          )}
        </View>
      </View>

      {ctaLabel ? (
        <PrimaryButton title={ctaLabel} onPress={onPress} style={{ marginTop: spacing.md }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { ...typography.bodyBold, color: colors.textPrimary },
  category: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  description: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  footerRow: { marginTop: spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { ...typography.small, color: colors.textSecondary, marginLeft: 4 },
});
