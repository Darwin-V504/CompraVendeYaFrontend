// screens/FavoritesScreen.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import guardadasService, { PropiedadGuardada } from "../services/guardadasService";
import CButton from "../components/CButton";

export default function FavoritesScreen({ navigation }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [properties, setProperties] = useState<PropiedadGuardada[]>([]);
    const [loading, setLoading] = useState(true);
    const [eliminando, setEliminando] = useState<number | null>(null);

    const loadFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const data = await guardadasService.getMisGuardadas();
            setProperties(data);
        } catch (error) {
            console.error("Error cargando favoritos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadFavorites);
        return unsubscribe;
    }, [navigation, loadFavorites]);

    const handleEliminar = (id: number, titulo: string) => {
        Alert.alert(
            "Eliminar",
            `¿Quitar "${titulo}" de favoritos?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        setEliminando(id);
                        const success = await guardadasService.eliminarGuardada(id);
                        if (success) {
                            setProperties(prev => prev.filter(p => p.idGuardado !== id));
                        } else {
                            Alert.alert("Error", "No se pudo eliminar");
                        }
                        setEliminando(null);
                    }
                }
            ]
        );
    };

    const renderProperty = ({ item }: { item: PropiedadGuardada }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                const propertyData = {
                    id: item.propiedadIdExterno,
                    title: item.titulo,
                    price: item.precio,
                    address: item.direccion,
                    city: item.ciudad,
                    neighborhood: item.barrio,
                    bedrooms: item.habitaciones,
                    bathrooms: item.banos,
                    sqft: item.area,
                    imageUrl: item.urlImagen,
                    description: item.descripcion || `Propiedad ubicada en ${item.barrio}, ${item.ciudad}`,
                    features: item.caracteristicas || [],
                    priceType: item.tipoOperacion === 'venta' ? 'venta' : 'alquiler',
                    class: item.claseSocial
                };
                
                navigation.navigate("PropertyDetail", {
                    propertyId: item.propiedadIdExterno,
                    isExternal: true,
                    externalData: propertyData
                });
            }}
        >
            <Image source={{ uri: item.urlImagen }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.titulo}</Text>
                <Text style={styles.location}>
                    <Ionicons name="location-outline" size={12} /> {item.barrio}, {item.ciudad}
                </Text>
                <View style={styles.detailsRow}>
                    {item.habitaciones > 0 && (
                        <Text style={styles.detailText}>
                            <Ionicons name="bed-outline" size={12} /> {item.habitaciones}
                        </Text>
                    )}
                    {item.banos > 0 && (
                        <Text style={styles.detailText}>
                            <Ionicons name="water-outline" size={12} /> {item.banos}
                        </Text>
                    )}
                    {item.area > 0 && (
                        <Text style={styles.detailText}>
                            <Ionicons name="resize-outline" size={12} /> {item.area} m²
                        </Text>
                    )}
                </View>
                <Text style={styles.price}>
                    {item.tipoOperacion === 'venta' ? 'L ' : 'L/mes '}
                    {item.precio.toLocaleString()}
                </Text>
                
                <View style={[styles.classBadge, { backgroundColor: getClassColor(item.claseSocial) }]}>
                    <Text style={styles.classText}>{getClassLabel(item.claseSocial)}</Text>
                </View>
                <View style={[styles.typeBadge, item.tipoOperacion === 'venta' ? styles.saleBadge : styles.rentBadge]}>
                    <Text style={styles.typeText}>{item.tipoOperacion === 'venta' ? 'VENTA' : 'ALQUILER'}</Text>
                </View>
            </View>
            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleEliminar(item.idGuardado, item.titulo)}
                disabled={eliminando === item.idGuardado}
            >
                {eliminando === item.idGuardado ? (
                    <ActivityIndicator size="small" color={colors.error} />
                ) : (
                    <Ionicons name="trash-outline" size={22} color={colors.error} />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (properties.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No tienes favoritos</Text>
                <Text style={styles.emptyText}>Guarda propiedades que te gusten para verlas aquí</Text>
                <CButton 
                    title="Explorar propiedades" 
                    onPress={() => navigation.navigate("Home")} 
                    variant="primary" 
                    size="medium" 
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={properties}
                keyExtractor={(item) => item.idGuardado.toString()}
                renderItem={renderProperty}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={loadFavorites}
            />
        </View>
    );
}

const getClassColor = (propertyClass: string) => {
    switch(propertyClass) {
        case 'lujo': return '#FFD700';
        case 'alta': return '#4CAF50';
        case 'media': return '#2196F3';
        case 'baja': return '#FF9800';
        default: return '#666';
    }
};

const getClassLabel = (propertyClass: string) => {
    switch(propertyClass) {
        case 'lujo': return 'LUJO';
        case 'alta': return 'ALTA';
        case 'media': return 'MEDIA';
        case 'baja': return 'ECONÓMICA';
        default: return '';
    }
};

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        width: 100,
        height: 100,
        backgroundColor: colors.lightGray,
    },
    info: {
        flex: 1,
        padding: 12,
        position: "relative",
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 4,
        paddingRight: 70,
    },
    location: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 4,
        paddingRight: 70,
    },
    detailsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 6,
    },
    detailText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.primary,
    },
    classBadge: {
        position: "absolute",
        bottom: 8,
        right: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    classText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: "bold",
    },
    typeBadge: {
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
    typeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: "600",
    },
    deleteButton: {
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
        marginBottom: 20,
        textAlign: "center",
    },
});