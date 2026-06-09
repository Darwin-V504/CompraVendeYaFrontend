import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getThemeColors } from "../infoutils/theme";

export default function SearchScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        transactionType: "sale",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        propertyType: "",
    });

    // Datos de ejemplo para resultados
    const [results] = useState([
        { id: "1", title: "Casa moderna en el centro", price: 2500000, location: "Centro", bedrooms: 3, bathrooms: 2, area: 180, image: "https://via.placeholder.com/300x200" },
        { id: "2", title: "Departamento de lujo", price: 1800000, location: "Norte", bedrooms: 2, bathrooms: 2, area: 120, image: "https://via.placeholder.com/300x200" },
        { id: "3", title: "Casa con jardín", price: 3200000, location: "Sur", bedrooms: 4, bathrooms: 3, area: 250, image: "https://via.placeholder.com/300x200" },
    ]);

    const propertyTypes = ["Casa", "Departamento", "Condominio", "Terreno", "Comercial"];
    const transactionTypes = [
        { key: "sale", label: "Compra" },
        { key: "rent", label: "Renta" },
    ];

    const applyFilters = () => {
        setShowFilters(false);
        // Aquí iría la lógica de búsqueda con filtros
    };

    const resetFilters = () => {
        setFilters({
            transactionType: "sale",
            minPrice: "",
            maxPrice: "",
            bedrooms: "",
            propertyType: "",
        });
    };

    const renderPropertyItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate("PropertyDetail", { propertyId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.resultImage} />
            <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultLocation}>
                    <Ionicons name="location-outline" size={12} /> {item.location}
                </Text>
                <View style={styles.resultFeatures}>
                    <Text style={styles.featureText}>{item.bedrooms} hab</Text>
                    <Text style={styles.featureText}>{item.bathrooms} baños</Text>
                    <Text style={styles.featureText}>{item.area} m²</Text>
                </View>
                <Text style={styles.resultPrice}>${item.price.toLocaleString()} MXN</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Barra de búsqueda */}
            <View style={styles.searchHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por dirección, colonia..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Panel de filtros */}
            {showFilters && (
                <ScrollView style={styles.filtersPanel} showsVerticalScrollIndicator={false}>
                    <Text style={styles.filtersTitle}>Filtrar por</Text>

                    {/* Tipo de transacción */}
                    <Text style={styles.filterLabel}>Tipo de operación</Text>
                    <View style={styles.transactionButtons}>
                        {transactionTypes.map((type) => (
                            <TouchableOpacity
                                key={type.key}
                                style={[
                                    styles.transactionButton,
                                    filters.transactionType === type.key && styles.transactionButtonActive,
                                ]}
                                onPress={() => setFilters({ ...filters, transactionType: type.key })}
                            >
                                <Text
                                    style={[
                                        styles.transactionButtonText,
                                        filters.transactionType === type.key && styles.transactionButtonTextActive,
                                    ]}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Rango de precio */}
                    <Text style={styles.filterLabel}>Rango de precio</Text>
                    <View style={styles.priceRange}>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Mínimo"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="numeric"
                            value={filters.minPrice}
                            onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
                        />
                        <Text style={styles.priceSeparator}>-</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Máximo"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="numeric"
                            value={filters.maxPrice}
                            onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
                        />
                    </View>

                    {/* Recámaras */}
                    <Text style={styles.filterLabel}>Recámaras</Text>
                    <View style={styles.bedroomButtons}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <TouchableOpacity
                                key={num}
                                style={[
                                    styles.bedroomButton,
                                    filters.bedrooms === num.toString() && styles.bedroomButtonActive,
                                ]}
                                onPress={() =>
                                    setFilters({
                                        ...filters,
                                        bedrooms: filters.bedrooms === num.toString() ? "" : num.toString(),
                                    })
                                }
                            >
                                <Text
                                    style={[
                                        styles.bedroomButtonText,
                                        filters.bedrooms === num.toString() && styles.bedroomButtonTextActive,
                                    ]}
                                >
                                    {num}+
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Tipo de propiedad */}
                    <Text style={styles.filterLabel}>Tipo de propiedad</Text>
                    <View style={styles.propertyTypeGrid}>
                        {propertyTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.propertyTypeButton,
                                    filters.propertyType === type && styles.propertyTypeButtonActive,
                                ]}
                                onPress={() =>
                                    setFilters({
                                        ...filters,
                                        propertyType: filters.propertyType === type ? "" : type,
                                    })
                                }
                            >
                                <Text
                                    style={[
                                        styles.propertyTypeButtonText,
                                        filters.propertyType === type && styles.propertyTypeButtonTextActive,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Botones de acción */}
                    <View style={styles.filterActions}>
                        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                            <Text style={styles.resetButtonText}>Reiniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                            <Text style={styles.applyButtonText}>Aplicar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* Resultados */}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderPropertyItem}
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={styles.resultsCount}>{results.length} propiedades encontradas</Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="home-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No se encontraron propiedades</Text>
                        <Text style={styles.emptySubtext}>Intenta con otros filtros</Text>
                    </View>
                }
            />
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.backgroundAlt,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        padding: 0,
    },
    filterButton: {
        padding: 4,
    },
    filtersPanel: {
        backgroundColor: colors.card,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        maxHeight: "70%",
    },
    filtersTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
        marginTop: 12,
    },
    transactionButtons: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 8,
    },
    transactionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
    },
    transactionButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    transactionButtonText: {
        color: colors.text,
        fontWeight: "500",
    },
    transactionButtonTextActive: {
        color: colors.white,
    },
    priceRange: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    priceInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.backgroundAlt,
    },
    priceSeparator: {
        color: colors.textSecondary,
    },
    bedroomButtons: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    bedroomButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
    },
    bedroomButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    bedroomButtonText: {
        color: colors.text,
    },
    bedroomButtonTextActive: {
        color: colors.white,
    },
    propertyTypeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    propertyTypeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
    },
    propertyTypeButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    propertyTypeButtonText: {
        fontSize: 12,
        color: colors.text,
    },
    propertyTypeButtonTextActive: {
        color: colors.white,
    },
    filterActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
        marginBottom: 10,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
    },
    resetButtonText: {
        color: colors.textSecondary,
        fontWeight: "500",
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: "center",
    },
    applyButtonText: {
        color: colors.white,
        fontWeight: "600",
    },
    resultsList: {
        padding: 16,
    },
    resultsCount: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    resultCard: {
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
    resultImage: {
        width: 100,
        height: 100,
        backgroundColor: colors.lightGray,
    },
    resultInfo: {
        flex: 1,
        padding: 12,
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
    },
    resultLocation: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 2,
    },
    resultFeatures: {
        flexDirection: "row",
        gap: 12,
        marginTop: 6,
    },
    featureText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    resultPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.primary,
        marginTop: 6,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textSecondary,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
    },
});
