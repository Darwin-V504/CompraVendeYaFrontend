import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContexts";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import rolService, { UsuarioPerfil } from "../services/rolService";

export default function ProfileScreen({ navigation }: any) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [numeroCuenta, setNumeroCuenta] = useState("");
    const [activando, setActivando] = useState(false);

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        setLoading(true);
        try {
            const data = await rolService.getPerfil();
            setPerfil(data);
        } catch (error) {
            console.error('Error cargando perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActivarPropietario = async () => {
        if (!numeroCuenta || numeroCuenta.length !== 6) {
            Alert.alert("Error", "Ingresa un número de cuenta válido de 6 dígitos");
            return;
        }

        setActivando(true);
        try {
            const nuevoPerfil = await rolService.activarPropietario(numeroCuenta);
            setPerfil(nuevoPerfil);
            setModalVisible(false);
            setNumeroCuenta("");
            Alert.alert("Éxito", "Ahora eres Propietario verificada(o)");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Número de cuenta inválido");
        } finally {
            setActivando(false);
        }
    };

   

    const getInitials = () => {
        if (perfil?.nombre) {
            return `${perfil.nombre[0]}${perfil.apellido?.[0] || ''}`.toUpperCase();
        }
        if (user?.full_name) {
            return user.full_name.substring(0, 2).toUpperCase();
        }
        return "U";
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header del Perfil */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials()}</Text>
                    </View>
                </View>
                <Text style={styles.name}>{perfil?.nombre || user?.full_name || "Usuario"}</Text>
                <Text style={styles.email}>{perfil?.email || user?.email}</Text>
                {perfil?.telefono && (
                    <Text style={styles.phone}>
                        <Ionicons name="call-outline" size={14} /> {perfil.telefono}
                    </Text>
                )}
                
                {/* Badge de rol */}
                <View style={[styles.roleBadge, perfil?.esPropietario ? styles.propietarioBadge : styles.usuarioBadge]}>
                    <Text style={styles.roleText}>
                        {perfil?.esPropietario ? 'Propietario Verificado' : ' Usuario'}
                    </Text>
                </View>
            </View>

            {/* Sección de Propietario */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estado de Propietario</Text>
                <View style={styles.propietarioCard}>
                    {perfil?.esPropietario ? (
                        <>
                            <Ionicons name="checkmark-circle" size={40} color={colors.success} />
                            <Text style={styles.propietarioStatus}>Cuenta verificada como Propietario</Text>
                            {perfil.numeroCuenta && (
                                <Text style={styles.numeroCuenta}>N° Cuenta: {perfil.numeroCuenta}</Text>
                            )}
                           
                             
                        </>
                    ) : (
                        <>
                            <Ionicons name="add-circle-outline" size={40} color={colors.primary} />
                            <Text style={styles.propietarioInfo}>
                                ¿Eres Propietario? Activa tu cuenta para publicar propiedades.
                            </Text>
                            <TouchableOpacity
                                style={styles.activarButton}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.activarButtonText}>Activar Propietario</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Menú de opciones */}
            <View style={styles.menuContainer}>
               
                <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="moon-outline" size={22} color={colors.primary} />
                        <Text style={styles.menuText}>Modo Oscuro</Text>
                    </View>
                    <View style={[styles.themeIndicator, theme === "dark" && styles.themeIndicatorActive]} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={logout}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="log-out-outline" size={22} color={colors.error} />
                        <Text style={[styles.menuText, styles.menuTextDanger]}>Cerrar Sesión</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.version}>CompraVendeYa Honduras </Text>

            {/* Modal para ingresar número de cuenta */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Activar Cuenta de Propietario</Text>
                        <Text style={styles.modalSubtitle}>
                            Ingresa tu número de cuenta de 6 dígitos proporcionado por CompraVendeYa Honduras
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Número de cuenta (6 dígitos)"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="numeric"
                            maxLength={6}
                            value={numeroCuenta}
                            onChangeText={setNumeroCuenta}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setNumeroCuenta("");
                                }}
                            >
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalConfirmButton]}
                                onPress={handleActivarPropietario}
                                disabled={activando}
                            >
                                <Text style={styles.modalConfirmText}>
                                    {activando ? "Verificando..." : "Activar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    header: {
        alignItems: "center",
        padding: 24,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarText: {
        fontSize: 36,
        color: colors.white,
        fontWeight: "bold",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    phone: {
        fontSize: 13,
        color: colors.primary,
        marginTop: 4,
    },
    roleBadge: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    usuarioBadge: {
        backgroundColor: colors.backgroundAlt,
        borderWidth: 1,
        borderColor: colors.border,
    },
    propietarioBadge: {
        backgroundColor: colors.success + '20',
        borderWidth: 1,
        borderColor: colors.success,
    },
    roleText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
    },
    section: {
        margin: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 12,
    },
    propietarioCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    propietarioStatus: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.success,
        marginTop: 12,
    },
    propietarioInfo: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 16,
    },
    numeroCuenta: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
        marginBottom: 16,
    },
    activarButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    activarButtonText: {
        color: colors.white,
        fontWeight: "600",
    },
    desactivarButton: {
        backgroundColor: colors.error + '20',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.error,
    },
    desactivarButtonText: {
        color: colors.error,
        fontWeight: "600",
    },
    menuContainer: {
        backgroundColor: colors.card,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    menuText: {
        fontSize: 16,
        color: colors.text,
    },
    menuTextDanger: {
        color: colors.error,
    },
    themeIndicator: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    themeIndicatorActive: {
        backgroundColor: colors.primary,
    },
    version: {
        textAlign: "center",
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 30,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: 20,
    },
    modalInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        textAlign: "center",
        color: colors.text,
        backgroundColor: colors.backgroundAlt,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    modalCancelButton: {
        backgroundColor: colors.backgroundAlt,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalConfirmButton: {
        backgroundColor: colors.primary,
    },
    modalCancelText: {
        color: colors.text,
    },
    modalConfirmText: {
        color: colors.white,
        fontWeight: "600",
    },
});