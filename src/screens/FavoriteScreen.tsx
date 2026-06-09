import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

export default function FavoritesScreen({ navigation }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [favorites, setFavorites] = useState([
        { id: "1", title: "Casa moderna en el centro", price: 2500000, location: "Centro", bedrooms: 3, bathrooms: 2, area: 180, image: "https://via.placeholder.com/300x200" },
        { id: "3", title: "Casa con jardín", price: 3200000, location: "Sur", bedrooms: 4, bathrooms: 3, area: 250, image: "https://via.placeholder.com/300x200" },
    ]);

    const removeFavorite = (id: string) => {
        setFavorites(favorites.filter(item => item.id !== id));
    };

    const renderFavorite = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("PropertyDetail", { propertyId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>
                    <Ionicons name="location-outline" size={12} /> {item.location}
                </Text>
                <Text style={styles.price}>${item.price.toLocaleString()} MXN</Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(item.id)}
            >
                <Ionicons name="heart" size={20} color={colors.accent} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (favorites.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>Sin favoritos</Text>
                <Text style={styles.emptyText}>Guarda tus propiedades favoritas aquí</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={renderFavorite}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: "row",
        backgroundColor: colors.card,
        borderRadius: 12,
        marginBottom: 12,
        overflow: "hidden",
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        backgroundColor: colors.lightGray,
    },
    info: {
        flex: 1,
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
    },
    location: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.primary,
        marginTop: 4,
    },
    removeButton: {
        padding: 12,
        justifyContent: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.text,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
    },
});