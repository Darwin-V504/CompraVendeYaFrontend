import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

export default function PropertiesScreen({ navigation }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [properties] = useState([
        { id: "1", title: "Casa moderna en el centro", price: 2500000, location: "Centro", bedrooms: 3, bathrooms: 2, area: 180, image: "https://via.placeholder.com/300x200", transactionType: "sale" },
        { id: "2", title: "Departamento de lujo", price: 1800000, location: "Norte", bedrooms: 2, bathrooms: 2, area: 120, image: "https://via.placeholder.com/300x200", transactionType: "sale" },
        { id: "3", title: "Casa con jardín", price: 3200000, location: "Sur", bedrooms: 4, bathrooms: 3, area: 250, image: "https://via.placeholder.com/300x200", transactionType: "sale" },
        { id: "4", title: "Departamento céntrico", price: 15000, location: "Centro", bedrooms: 2, bathrooms: 1, area: 85, image: "https://via.placeholder.com/300x200", transactionType: "rent" },
    ]);

    const renderProperty = ({ item }: any) => (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => navigation.navigate("PropertyDetail", { propertyId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.propertyImage} />
            <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{item.title}</Text>
                <Text style={styles.propertyLocation}>
                    <Ionicons name="location-outline" size={12} /> {item.location}
                </Text>
                <View style={styles.propertyFeatures}>
                    <Text style={styles.featureText}>{item.bedrooms} hab</Text>
                    <Text style={styles.featureText}>{item.bathrooms} baños</Text>
                    <Text style={styles.featureText}>{item.area} m²</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.propertyPrice}>
                        ${item.price.toLocaleString()} MXN
                    </Text>
                    {item.transactionType === "rent" && (
                        <Text style={styles.pricePeriod}>/ mes</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={properties}
                keyExtractor={(item) => item.id}
                renderItem={renderProperty}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
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
    propertyCard: {
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
    propertyImage: {
        width: 100,
        height: 100,
        backgroundColor: colors.lightGray,
    },
    propertyInfo: {
        flex: 1,
        padding: 12,
    },
    propertyTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
    },
    propertyLocation: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 2,
    },
    propertyFeatures: {
        flexDirection: "row",
        gap: 12,
        marginTop: 6,
    },
    featureText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: 6,
    },
    propertyPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.primary,
    },
    pricePeriod: {
        fontSize: 11,
        color: colors.textSecondary,
        marginLeft: 2,
    },
});