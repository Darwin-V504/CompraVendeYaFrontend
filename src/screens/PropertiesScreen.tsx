import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import propiedadService, { Propiedad } from "../services/propiedadService";

export default function PropertiesScreen({ navigation }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);
    
    const [properties, setProperties] = useState<Propiedad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProperties();
        testBackendConnection();
    }, []);

    const testBackendConnection = async () => {
        try {
            const result = await propiedadService.getTestConnection();
            console.log('Test conexión backend:', result);
            if (result?.connected === true) {
                console.log('✅ Backend conectado correctamente');
            } else {
                console.log('⚠️ Backend conectado pero respuesta inesperada');
            }
        } catch (err) {
            console.error('❌ Error conectando al backend:', err);
            Alert.alert('Error de Conexión', 'No se pudo conectar al backend. Verifica que esté corriendo en http://10.0.2.2:5000');
        }
    };

    const loadProperties = async () => {
        setLoading(true);
        setError(null);
        const data = await propiedadService.getAll();
        if (data.length === 0) {
            setError('No hay propiedades disponibles. Agrega datos de prueba en la base de datos.');
        }
        setProperties(data);
        setLoading(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Cargando propiedades...</Text>
            </View>
        );
    }

    if (error && properties.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="cloud-offline-outline" size={64} color={colors.textSecondary} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadProperties}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderProperty = ({ item }: { item: Propiedad }) => (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => navigation.navigate("PropertyDetail", { propertyId: item.idPropiedad })}
        >
            <Image 
                source={{ uri: item.fotosUrls?.[0] || 'https://via.placeholder.com/300x200?text=Sin+Imagen' }} 
                style={styles.propertyImage} 
            />
            <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{item.titulo}</Text>
                <Text style={styles.propertyLocation}>
                    <Ionicons name="location-outline" size={12} /> {item.direccion}
                </Text>
                <View style={styles.propertyFeatures}>
                    {item.habitaciones ? <Text style={styles.featureText}>{item.habitaciones} hab</Text> : null}
                    {item.banos ? <Text style={styles.featureText}>{item.banos} baños</Text> : null}
                    {item.areaConstruida ? <Text style={styles.featureText}>{item.areaConstruida} m²</Text> : null}
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.propertyPrice}>{formatPrice(item.precio)}</Text>
                    {item.operacionNombre === 'Alquiler' && (
                        <Text style={styles.pricePeriod}>/ mes</Text>
                    )}
                </View>
                {item.operacionNombre && (
                    <View style={[styles.transactionBadge, item.operacionNombre === 'Alquiler' ? styles.rentBadge : styles.saleBadge]}>
                        <Text style={styles.transactionBadgeText}>{item.operacionNombre}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={properties}
                keyExtractor={(item) => item.idPropiedad.toString()}
                renderItem={renderProperty}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={loadProperties}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="home-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No hay propiedades disponibles</Text>
                        <Text style={styles.emptySubtext}>Agrega datos en la base de datos</Text>
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
        position: 'relative',
    },
    propertyTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 2,
    },
    propertyLocation: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    propertyFeatures: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: 4,
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
    transactionBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    saleBadge: {
        backgroundColor: colors.primary,
    },
    rentBadge: {
        backgroundColor: '#FF9800',
    },
    transactionBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: colors.textSecondary,
    },
    errorText: {
        marginTop: 12,
        color: '#FF0000',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: colors.primary,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        color: colors.textSecondary,
        fontSize: 16,
    },
    emptySubtext: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: 12,
    },
});