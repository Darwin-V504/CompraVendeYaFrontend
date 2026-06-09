import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getThemeColors } from "../infoutils/theme";
import CButton from "../components/CButton";

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    // Datos de ejemplo para propiedades destacadas
    const featuredProperties = [
        { id: "1", title: "Casa moderna en el centro", price: 2500000, location: "Centro", image: "https://via.placeholder.com/300x200" },
        { id: "2", title: "Departamento de lujo", price: 1800000, location: "Norte", image: "https://via.placeholder.com/300x200" },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>¡Hola de nuevo!</Text>
                <Text style={styles.subtitle}>Encuentra tu hogar ideal</Text>
            </View>

            {/* Search Bar */}
            <TouchableOpacity 
                style={styles.searchBar}
                onPress={() => navigation.navigate("Search")}
            >
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.searchText}>Buscar propiedades...</Text>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Properties")}>
                    <Ionicons name="business-outline" size={32} color={colors.primary} />
                    <Text style={styles.actionText}>Comprar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Properties")}>
                    <Ionicons name="home-outline" size={32} color={colors.primary} />
                    <Text style={styles.actionText}>Rentar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Favorites")}>
                    <Ionicons name="heart-outline" size={32} color={colors.primary} />
                    <Text style={styles.actionText}>Favoritos</Text>
                </TouchableOpacity>
            </View>

            {/* Featured Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Propiedades Destacadas</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Properties")}>
                        <Text style={styles.seeAll}>Ver todas</Text>
                    </TouchableOpacity>
                </View>

                {featuredProperties.map((property) => (
                    <TouchableOpacity
                        key={property.id}
                        style={styles.propertyCard}
                        onPress={() => navigation.navigate("PropertyDetail", { propertyId: property.id })}
                    >
                        <Image source={{ uri: property.image }} style={styles.propertyImage} />
                        <View style={styles.propertyInfo}>
                            <Text style={styles.propertyTitle}>{property.title}</Text>
                            <Text style={styles.propertyLocation}>
                                <Ionicons name="location-outline" size={12} /> {property.location}
                            </Text>
                            <Text style={styles.propertyPrice}>${property.price.toLocaleString()} MXN</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 20,
        paddingTop: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        gap: 8,
    },
    searchText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    quickActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginHorizontal: 20,
        marginBottom: 30,
    },
    actionCard: {
        alignItems: "center",
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        minWidth: 100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    actionText: {
        marginTop: 8,
        color: colors.text,
        fontWeight: "500",
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
    },
    seeAll: {
        color: colors.primary,
        fontSize: 14,
    },
    propertyCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    propertyImage: {
        width: "100%",
        height: 180,
        backgroundColor: colors.lightGray,
    },
    propertyInfo: {
        padding: 12,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
    propertyLocation: {
        fontSize: 12,
        color: colors.textSecondary,
        marginVertical: 4,
    },
    propertyPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.primary,
    },
});