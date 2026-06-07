import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { Linking } from "react-native"; 
import mercadoLibreService, { PropiedadML } from "../services/mercadoLibreService";

export default function SearchMercadoLibreScreen({ navigation }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<PropiedadML[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [siteId, setSiteId] = useState("MLM"); // MLM = México

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        const response = await mercadoLibreService.buscarPropiedades(searchQuery, siteId, 30);
        setResults(response.results);
        setTotal(response.total);
        setLoading(false);
    };

    const formatPrice = (price: number, currency: string) => {
        const symbols: Record<string, string> = {
            MXN: "$", ARS: "$", BRL: "R$", COP: "$", CLP: "$", PEN: "S/", USD: "US$"
        };
        const symbol = symbols[currency] || "$";
        return `${symbol} ${price.toLocaleString()}`;
    };

    const renderItem = ({ item }: { item: PropiedadML }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => Linking.openURL(item.urlDetalle)}
        >
            <Image 
                source={{ uri: item.urlImagen || 'https://via.placeholder.com/100x100?text=ML' }} 
                style={styles.image} 
            />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.titulo}</Text>
                <Text style={styles.price}>{formatPrice(item.precio, item.moneda)}</Text>
                <Text style={styles.location}>
                    <Ionicons name="location-outline" size={12} /> {item.direccion}
                </Text>
                <View style={styles.badges}>
                    <View style={[styles.badge, styles.mlBadge]}>
                        <Text style={styles.badgeText}>Mercado Libre</Text>
                    </View>
                    {item.condicion === "new" && (
                        <View style={[styles.badge, styles.newBadge]}>
                            <Text style={styles.badgeText}>Nuevo</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar en Mercado Libre..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={24} color={colors.white} />
                </TouchableOpacity>
            </View>
            
            {/* Selector de país */}
            <View style={styles.siteSelector}>
                <Text style={styles.siteLabel}>País:</Text>
                <TouchableOpacity 
                    style={[styles.siteButton, siteId === "MLM" && styles.siteButtonActive]}
                    onPress={() => setSiteId("MLM")}
                >
                    <Text style={[styles.siteButtonText, siteId === "MLM" && styles.siteButtonTextActive]}>🇲🇽 México</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.siteButton, siteId === "MLA" && styles.siteButtonActive]}
                    onPress={() => setSiteId("MLA")}
                >
                    <Text style={[styles.siteButtonText, siteId === "MLA" && styles.siteButtonTextActive]}>🇦🇷 Argentina</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.siteButton, siteId === "MLB" && styles.siteButtonActive]}
                    onPress={() => setSiteId("MLB")}
                >
                    <Text style={[styles.siteButtonText, siteId === "MLB" && styles.siteButtonTextActive]}>🇧🇷 Brasil</Text>
                </TouchableOpacity>
            </View>
            
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Buscando en Mercado Libre...</Text>
                </View>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.idExterno}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={
                        <Text style={styles.resultsCount}>{total} propiedades encontradas</Text>
                    }
                />
            ) : searchQuery ? (
                <View style={styles.center}>
                    <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
                    <Text style={styles.emptyText}>No se encontraron propiedades</Text>
                    <Text style={styles.emptySubtext}>Intenta con otra búsqueda</Text>
                </View>
            ) : (
                <View style={styles.center}>
                    <Ionicons name="business-outline" size={64} color={colors.textSecondary} />
                    <Text style={styles.emptyText}>Busca propiedades en Mercado Libre</Text>
                    <Text style={styles.emptySubtext}>Escribe algo para comenzar</Text>
                </View>
            )}
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchContainer: { flexDirection: "row", padding: 16, gap: 8 },
    searchInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: colors.card, color: colors.text },
    searchButton: { backgroundColor: colors.primary, borderRadius: 8, padding: 12, justifyContent: "center", alignItems: "center" },
    siteSelector: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 8, gap: 8, flexWrap: "wrap" },
    siteLabel: { color: colors.text, fontWeight: "500" },
    siteButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    siteButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    siteButtonText: { color: colors.text, fontSize: 12 },
    siteButtonTextActive: { color: colors.white },
    resultsCount: { paddingHorizontal: 16, paddingVertical: 8, color: colors.textSecondary, fontSize: 14 },
    list: { padding: 16, paddingTop: 0 },
    card: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 12, marginBottom: 12, overflow: "hidden", shadowColor: colors.black, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    image: { width: 100, height: 100, backgroundColor: colors.lightGray },
    info: { flex: 1, padding: 12 },
    title: { fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 4 },
    price: { fontSize: 16, fontWeight: "bold", color: colors.primary, marginBottom: 4 },
    location: { fontSize: 11, color: colors.textSecondary, marginBottom: 6 },
    badges: { flexDirection: "row", gap: 6 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    mlBadge: { backgroundColor: "#FFF159" },
    newBadge: { backgroundColor: "#00A650" },
    badgeText: { fontSize: 10, fontWeight: "bold", color: "#333" },
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    loadingText: { marginTop: 12, color: colors.textSecondary },
    emptyText: { marginTop: 16, fontSize: 16, fontWeight: "500", color: colors.textSecondary },
    emptySubtext: { marginTop: 8, fontSize: 14, color: colors.textSecondary, textAlign: "center" },
});