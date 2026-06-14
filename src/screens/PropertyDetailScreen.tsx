
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, Linking, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import CButton from "../components/CButton";
import guardadasService from "../services/guardadasService";
import propiedadService, { PropiedadDB } from "../services/propiedadService";
import { useAuth } from "../contexts/AuthContexts";

const { width } = Dimensions.get("window");

export default function PropertyDetailScreen({ route, navigation }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);
    const { user } = useAuth();
    const { propiedadId, fromDB } = route.params;
    
    const [property, setProperty] = useState<PropiedadDB | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGuardada, setIsGuardada] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [idGuardado, setIdGuardado] = useState<number | null>(null);

    useEffect(() => {
        if (fromDB && propiedadId) {
            loadPropertyFromDB(propiedadId);
        }
    }, [propiedadId]);

    const loadPropertyFromDB = async (id: number) => {
        setLoading(true);
        try {
            const data = await propiedadService.getPropiedadById(id);
            if (data) {
                setProperty(data);
                if (user) {
                    await checkIfGuardada(data.idPropiedad.toString());
                }
            }
        } catch (error) {
            console.error("Error cargando propiedad:", error);
            Alert.alert("Error", "No se pudo cargar la propiedad");
        } finally {
            setLoading(false);
        }
    };

    const checkIfGuardada = async (propId: string) => {
        try {
            const guardada = await guardadasService.isPropiedadGuardada(propId);
            setIsGuardada(guardada);
            
            if (guardada) {
                const misGuardadas = await guardadasService.getMisGuardadas();
                const encontrada = misGuardadas.find(g => g.propiedadIdExterno === propId);
                if (encontrada) {
                    setIdGuardado(encontrada.idGuardado);
                }
            }
        } catch (error) {
            console.error('Error verificando:', error);
        }
    };

    const handleGuardarPropiedad = async () => {
    if (!user) {
        Alert.alert("Inicia Sesión", "Debes iniciar sesión para guardar propiedades");
        return;
    }
    
    if (!property) return;
    
    setGuardando(true);
    try {
        // Asegurar que la URL de imagen no esté vacía
        const imageUrl = property.imagenPrincipal || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500';
        
        const result = await guardadasService.guardarPropiedad({
            propiedadIdExterno: property.idPropiedad.toString(),
            titulo: property.titulo,
            precio: property.precio,
            direccion: property.direccion,
            ciudad: property.direccion.split(',')[1]?.trim() || 'Honduras',
            barrio: property.direccion.split(',')[0]?.trim() || '',
            habitaciones: property.habitaciones,
            banos: property.banos,
            area: property.areaConstruida,
            urlImagen: imageUrl,  // ← Ahora siempre tiene un valor
            tipoOperacion: property.operacionNombre === 'Venta' ? 'venta' : 'alquiler',
            claseSocial: 'media',
            descripcion: property.descripcion,
            caracteristicas: []
        });
        
        if (result) {
            setIsGuardada(true);
            setIdGuardado(result.idGuardado);
            Alert.alert("Éxito", "Propiedad guardada correctamente");
        }
    } catch (error: any) {
        console.error('Error detallado:', error);
        Alert.alert("Error", error.message || "No se pudo guardar la propiedad");
    } finally {
        setGuardando(false);
    }
};

    const handleEliminarGuardada = async () => {
        if (!idGuardado) return;
        
        Alert.alert(
            "Eliminar",
            "¿Eliminar esta propiedad de tus guardadas?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        setGuardando(true);
                        const success = await guardadasService.eliminarGuardada(idGuardado);
                        if (success) {
                            setIsGuardada(false);
                            setIdGuardado(null);
                            Alert.alert("Eliminada", "Propiedad eliminada de guardadas");
                        } else {
                            Alert.alert("Error", "No se pudo eliminar");
                        }
                        setGuardando(false);
                    }
                }
            ]
        );
    };

    const openInMaps = () => {
        const address = encodeURIComponent(property?.direccion || '');
        const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
        Linking.openURL(url).catch(() => {
            Alert.alert("Error", "No se pudo abrir el mapa");
        });
    };

    const formatPrice = (price: number, operation: string) => {
        const symbol = operation === 'Venta' ? 'L ' : 'L/mes ';
        return `${symbol}${price.toLocaleString()}`;
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!property) {
        return (
            <View style={styles.centered}>
                <Text>Propiedad no encontrada</Text>
                <CButton title="Volver" onPress={() => navigation.goBack()} variant="primary" size="medium" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: property.imagenPrincipal }} style={styles.mainImage} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{property.titulo}</Text>
                    <Text style={styles.price}>
                        {formatPrice(property.precio, property.operacionNombre)}
                    </Text>
                </View>

                <TouchableOpacity style={styles.locationContainer} onPress={openInMaps}>
                    <Ionicons name="location-outline" size={16} color={colors.primary} />
                    <Text style={styles.location}>{property.direccion}</Text>
                    <Ionicons name="open-outline" size={14} color={colors.textSecondary} />
                </TouchableOpacity>

                <View style={styles.featuresGrid}>
                    <View style={styles.featureItem}>
                        <Ionicons name="bed-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.habitaciones}</Text>
                        <Text style={styles.featureLabel}>Recámaras</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="water-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.banos}</Text>
                        <Text style={styles.featureLabel}>Baños</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="resize-outline" size={22} color={colors.primary} />
                        <Text style={styles.featureValue}>{property.areaConstruida} m²</Text>
                        <Text style={styles.featureLabel}>Construcción</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>{property.descripcion}</Text>
                </View>

                <View style={styles.actionButtons}>
                    
                    
                    <CButton
                        title="Ver Ubicación"
                        onPress={openInMaps}
                        variant="secondary"
                        size="large"
                    />
                    
                    {isGuardada ? (
                        <CButton
                            title={guardando ? "Eliminando..." : "Eliminar de Guardadas"}
                            onPress={handleEliminarGuardada}
                            variant="tertiary"
                            size="large"
                            disabled={guardando}
                        />
                    ) : (
                        <CButton
                            title={guardando ? "Guardando..." : "Guardar Propiedad"}
                            onPress={handleGuardarPropiedad}
                            variant="tertiary"
                            size="large"
                            disabled={guardando}
                        />
                    )}
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
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    imageContainer: {
        position: "relative",
    },
    mainImage: {
        width: width,
        height: 300,
        backgroundColor: colors.lightGray,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        marginBottom: 12,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text,
        marginRight: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.primary,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 20,
        paddingVertical: 8,
    },
    location: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
    },
    featuresGrid: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    featureItem: {
        alignItems: "center",
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
    actionButtons: {
        gap: 12,
        marginBottom: 30,
    },
});