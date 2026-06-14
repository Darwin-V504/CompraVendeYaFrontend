import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getThemeColors } from "../infoutils/theme";
import propiedadService, { PropiedadDB } from "../services/propiedadService";
import rolService from "../services/rolService";

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);
    
    const [properties, setProperties] = useState<PropiedadDB[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<PropiedadDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOperation, setSelectedOperation] = useState<'Venta' | 'Alquiler' | 'Todas'>('Todas');
    const [esPropietario, setEsPropietario] = useState(false);

    useEffect(() => {
        loadProperties();
        verificarRol();
    }, []);

    const verificarRol = async () => {
        try {
            const perfil = await rolService.getPerfil();
            setEsPropietario(perfil?.esPropietario || false);
        } catch (error) {
            
        }
    };

    const loadProperties = async () => {
        setLoading(true);
        try {
            const data = await propiedadService.getAllPropiedades();
            setProperties(data);
            setFilteredProperties(data);
        } catch (error) {
            console.error("Error cargando propiedades:", error);
            Alert.alert("Error", "No se pudieron cargar las propiedades");
        } finally {
            setLoading(false);
        }
    };

    const filterProperties = () => {
        let filtered = [...properties];
        
        if (selectedOperation !== 'Todas') {
            filtered = filtered.filter(p => p.operacionNombre === selectedOperation);
        }
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.titulo.toLowerCase().includes(query) ||
                p.direccion.toLowerCase().includes(query)
            );
        }
        
        setFilteredProperties(filtered);
    };

    useEffect(() => {
        filterProperties();
    }, [selectedOperation, searchQuery, properties]);

    const formatPrice = (price: number, operation: string) => {
        const symbol = operation === 'Venta' ? 'L ' : 'L/mes ';
        return `${symbol}${price.toLocaleString()}`;
    };

    const renderProperty = ({ item }: { item: PropiedadDB }) => (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => navigation.navigate("PropertyDetail", { 
                propiedadId: item.idPropiedad,
                fromDB: true
            })}
        >
            <Image 
                source={{ uri: item.imagenPrincipal || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500' }} 
                style={styles.propertyImage} 
            />
            <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle} numberOfLines={2}>{item.titulo}</Text>
                <Text style={styles.propertyAddress}>
                    <Ionicons name="location-outline" size={12} /> {item.direccion}
                </Text>
                <View style={styles.propertyFeatures}>
                    {item.habitaciones > 0 && (
                        <Text style={styles.featureText}>
                            <Ionicons name="bed-outline" size={12} /> {item.habitaciones}
                        </Text>
                    )}
                    {item.banos > 0 && (
                        <Text style={styles.featureText}>
                            <Ionicons name="water-outline" size={12} /> {item.banos}
                        </Text>
                    )}
                    {item.areaConstruida > 0 && (
                        <Text style={styles.featureText}>
                            <Ionicons name="resize-outline" size={12} /> {item.areaConstruida} m²
                        </Text>
                    )}
                </View>
                <Text style={styles.propertyPrice}>
                    {formatPrice(item.precio, item.operacionNombre)}
                </Text>
                <View style={[styles.operationBadge, item.operacionNombre === 'Venta' ? styles.saleBadge : styles.rentBadge]}>
                    <Text style={styles.operationText}>{item.operacionNombre}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>¡Bienvenido a CompraVendeYa Honduras!</Text>
                    <Text style={styles.subtitle}>Encuentra la propiedad de tus sueños</Text>
                </View>

                <View style={styles.operationSelector}>
                    {['Todas', 'Venta', 'Alquiler'].map((op) => (
                        <TouchableOpacity
                            key={op}
                            style={[styles.operationButton, selectedOperation === op && styles.operationActive]}
                            onPress={() => setSelectedOperation(op as any)}
                        >
                            <Text style={[styles.operationText, selectedOperation === op && styles.operationTextActive]}>
                                {op}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar por título o dirección..."
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
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                ) : (
                    <FlatList
                        data={filteredProperties}
                        keyExtractor={(item) => item.idPropiedad.toString()}
                        renderItem={renderProperty}
                        scrollEnabled={false}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="home-outline" size={50} color={colors.textSecondary} />
                                <Text style={styles.emptyText}>No se encontraron propiedades</Text>
                                <Text style={styles.emptySubtext}>Publica tu primera propiedad</Text>
                            </View>
                        }
                    />
                )}
            </ScrollView>

            {esPropietario && (
                <TouchableOpacity 
                    style={styles.floatingButton}
                    onPress={() => navigation.navigate("CreateProperty")}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color={colors.white} />
                </TouchableOpacity>
            )}
        </View>
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
    operationSelector: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 15,
        gap: 12,
    },
    operationButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: colors.backgroundAlt,
        borderWidth: 1,
        borderColor: colors.border,
    },
    operationActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    operationText: {
        color: colors.textSecondary,
        fontWeight: "500",
    },
    operationTextActive: {
        color: colors.white,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        padding: 12,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
        padding: 0,
    },
    loader: {
        paddingVertical: 40,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 100,
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
        position: "relative",
    },
    propertyTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 4,
        paddingRight: 70,
    },
    propertyAddress: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 4,
        paddingRight: 70,
    },
    propertyFeatures: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 6,
    },
    featureText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    propertyPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.primary,
    },
    operationBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    saleBadge: {
        backgroundColor: colors.primary,
    },
    rentBadge: {
        backgroundColor: colors.accent,
    },
    operationTextBadge: {
        color: colors.white,
        fontSize: 10,
        fontWeight: "600",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.textSecondary,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 10,
    },
});
