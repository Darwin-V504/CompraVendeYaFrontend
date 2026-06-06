import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getThemeColors } from "../infoutils/theme";

interface Property {
  id: string;
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  images: string[];
  transactionType: 'sale' | 'rent';
}

type Props = {
  property: Property;
  onPress: (id: string) => void;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
};

export default function PropertyCard({ property, onPress, onFavorite, isFavorite = false }: Props) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(property.id)}
      activeOpacity={0.9}
    >
      {/* Imagen */}
      <Image
        source={{ uri: property.images[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Badge de tipo de transacción */}
      <View style={[
        styles.transactionBadge,
        property.transactionType === 'sale' ? styles.saleBadge : styles.rentBadge
      ]}>
        <Text style={styles.transactionText}>
          {property.transactionType === 'sale' ? t('forSale') : t('forRent')}
        </Text>
      </View>

      {/* Botón favorito */}
      {onFavorite && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavorite(property.id)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? colors.accent : colors.white}
          />
        </TouchableOpacity>
      )}

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        
        <Text style={styles.location} numberOfLines={1}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          {' '}{property.location}
        </Text>

        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <Ionicons name="bed-outline" size={16} color={colors.primary} />
            <Text style={styles.featureText}>{property.bedrooms} {t('bedrooms')}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="water-outline" size={16} color={colors.primary} />
            <Text style={styles.featureText}>{property.bathrooms} {t('bathrooms')}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="resize-outline" size={16} color={colors.primary} />
            <Text style={styles.featureText}>{property.area} m²</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(property.price)}</Text>
          {property.transactionType === 'rent' && (
            <Text style={styles.pricePeriod}>/ {t('month')}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.lightGray,
  },
  transactionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  saleBadge: {
    backgroundColor: colors.primary,
  },
  rentBadge: {
    backgroundColor: colors.accent,
  },
  transactionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pricePeriod: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
});