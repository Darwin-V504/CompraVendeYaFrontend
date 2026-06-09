import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getThemeColors } from "../infoutils/theme";
import CButton from "../components/CButton";

const { width } = Dimensions.get("window");

export default function PropertyDetailScreen({ route, navigation }: any) {
    const { propertyId } = route.params;
    const { theme } = useTheme();
    const { t } = useLanguage();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Datos de ejemplo de la propiedad
    const [property] = useState({
        id: propertyId,
        title: "Casa moderna en el centro",
        description: "Hermosa casa ubicada en una de las zonas más exclusivas de la ciudad. Cuenta con acabados de lujo, cocina integral equipada, y un jardín espectacular. Ideal para familias que buscan tranquilidad y comodidad.",
        price: 2500000,
        area: 180,
        lotArea: 250,
        bedrooms: 3,
        bathrooms: 2,
        halfBathrooms: 1,
        parkingSpaces: 2,
        yearBuilt: 2020,
        propertyType: "Casa",
        transactionType: "sale",
        status: "available",
        location: {
            address: "Av. Principal #123, Colonia Centro",
            city: "Ciudad de México",
            state: "CDMX",
            zipCode: "06000",
            coordinates: { lat: 19.4326, lng: -99.1332 },
        },
        features: [
            "Alberca",
            "Jardín",
            "Estacionamiento",
            "Terraza",
            "Amueblada",
            "Aire Acondicionado",
            "Calefacción",
            "Seguridad 24/7",
        ],
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
        ],
        nearby: [
            { name: "Supermercado", distance: "200m", icon: "cart-outline" },
            { name: "Escuela", distance: "500m", icon: "school-outline" },
            { name: "Parque", distance: "300m", icon: "leaf-outline" },
            { name: "Metro", distance: "800m", icon: "subway-outline" },
        ],
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatMonthlyPayment = (price: number) => {
        // Simulación de pago mensual (20% enganche, 10% interés, 20 años)
        const downPayment = price * 0.2;
        const loanAmount = price - downPayment;
        const monthlyRate = 0.1 / 12;
        const months = 20 * 12;
        const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        return formatPrice(monthlyPayment);
    };

    const handleCall = () => {
        Linking.openURL("tel:5555555555");
    };

    const handleWhatsApp = () => {
        Linking.openURL("https://wa.me/525555555555");
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Carrusel de imágenes */}
            <View style={styles.imageContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / width);
                        setCurrentImageIndex(index);
                    }}
                    scrollEventThrottle={16}
                >
                    {property.images.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.mainImage} />
                    ))}
                </ScrollView>
                
                {/* Indicadores */}
                <View style={styles.imageIndicators}>
                    {property.images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentImageIndex === index && styles.indicatorActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Botón favorito */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? colors.accent : colors.white}
                    />
                </TouchableOpacity>

                {/* Badge de estado */}
                <View style={[
                    styles.statusBadge,
                    property.status === "available" ? styles.availableBadge : styles.soldBadge
                ]}>
                    <Text style={styles.statusText}>
                        {property.status === "available" ? "Disponible" : "Vendido"}
                    </Text>
                </View>
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                {/* Título y precio */}
                <View style={styles.header}>
                    <Text style={styles.title}>{property.title}</Text>
                    <Text style={styles.price}>{formatPrice(property.price)}</Text>
                    {property.transactionType === "rent" && (
                        <Text style={styles.pricePeriod}>/ mes</Text>
                    )}
                </View>

                {/* Ubicación */}
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.location}>
                        {property.location.address}, {property.location.city}, {property.location.state}
                    </Text>
                </View>

                {/* Características principales */}
                <View style={styles.featuresGrid}>
                    <View style={styles.featureItem}>
                        <Ionicons name="resize-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.area} m²</Text>
                        <Text style={styles.featureLabel}>Construcción</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="apps-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.lotArea} m²</Text>
                        <Text style={styles.featureLabel}>Terreno</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="bed-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.bedrooms}</Text>
                        <Text style={styles.featureLabel}>Recámaras</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="water-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.bathrooms}</Text>
                        <Text style={styles.featureLabel}>Baños</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="car-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.parkingSpaces}</Text>
                        <Text style={styles.featureLabel}>Estacionamiento</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="calendar-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.yearBuilt}</Text>
                        <Text style={styles.featureLabel}>Año construido</Text>
                    </View>
                </View>

                {/* Descripción */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>{property.description}</Text>
                </View>

                {/* Características */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Características</Text>
                    <View style={styles.tagsContainer}>
                        {property.features.map((feature, index) => (
                            <View key={index} style={styles.tag}>
                                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                                <Text style={styles.tagText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Lugares cercanos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lugares cercanos</Text>
                    {property.nearby.map((place, index) => (
                        <View key={index} style={styles.nearbyItem}>
                            <Ionicons name={place.icon as any} size={20} color={colors.primary} />
                            <Text style={styles.nearbyName}>{place.name}</Text>
                            <Text style={styles.nearbyDistance}>{place.distance}</Text>
                        </View>
                    ))}
                </View>

                {/* Pago mensual estimado */}
                {property.transactionType === "sale" && (
                    <View style={styles.monthlyPaymentCard}>
                        <Text style={styles.monthlyPaymentLabel}>Pago mensual estimado</Text>
                        <Text style={styles.monthlyPaymentValue}>{formatMonthlyPayment(property.price)}</Text>
                        <Text style={styles.monthlyPaymentNote}>
                            *Con 20% de enganche y financiamiento a 20 años
                        </Text>
                    </View>
                )}

                {/* Botones de acción */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                        <Ionicons name="call-outline" size={24} color={colors.white} />
                        <Text style={styles.actionButtonText}>Llamar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
                        <Ionicons name="logo-whatsapp" size={24} color={colors.white} />
                        <Text style={styles.actionButtonText}>WhatsApp</Text>
                    </TouchableOpacity>
                    <CButton
                        title="Agendar Visita"
                        onPress={() => alert("Funcionalidad: Agendar visita")}
                        variant="primary"
                        size="small"
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    imageContainer: {
        position: "relative",
    },
    mainImage: {
        width: width,
        height: 300,
        backgroundColor: colors.lightGray,
    },
    imageIndicators: {
        position: "absolute",
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.5)",
    },
    indicatorActive: {
        width: 20,
        backgroundColor: colors.white,
    },
    favoriteButton: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
        padding: 8,
    },
    statusBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    availableBadge: {
        backgroundColor: colors.success,
    },
    soldBadge: {
        backgroundColor: colors.error,
    },
    statusText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: "600",
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "baseline",
        flexWrap: "wrap",
        marginBottom: 12,
    },
    title: {
        flex: 1,
        fontSize: 22,
        fontWeight: "bold",
        color: colors.text,
    },
    price: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.primary,
    },
    pricePeriod: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 20,
    },
    location: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
    },
    featuresGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    featureItem: {
        width: "30%",
        alignItems: "center",
        marginBottom: 12,
    },
    featureValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text,
        marginTop: 4,
    },
    featureLabel: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    tag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: colors.backgroundAlt,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 12,
        color: colors.text,
    },
    nearbyItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    nearbyName: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
        marginLeft: 12,
    },
    nearbyDistance: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    monthlyPaymentCard: {
        backgroundColor: colors.backgroundAlt,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: "center",
    },
    monthlyPaymentLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    monthlyPaymentValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.primary,
    },
    monthlyPaymentNote: {
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 8,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 30,
    },
    callButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
    },
    whatsappButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#25D366",
        borderRadius: 8,
        paddingVertical: 12,
    },
    actionButtonText: {
        color: colors.white,
        fontWeight: "600",
    },
});