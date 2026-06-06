import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getThemeColors } from "../infoutils/theme";
import CInput from "../components/CInput";
import CButton from "../components/CButton";

export default function RegisterScreen({ navigation }: any) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert("Error", "Completa todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        
        try {
            const success = await signUp(email, password, {
                full_name: fullName,
                phone: phone,
            });
            
            if (success) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                Alert.alert("Error", "No se pudo registrar");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Regístrate para comenzar</Text>
                </View>

                <View style={styles.form}>
                    <CInput
                        type="text"
                        value={fullName}
                        placeholder="Nombre completo"
                        onChangeText={setFullName}
                    />
                    <CInput
                        type="email"
                        value={email}
                        placeholder="Correo electrónico"
                        onChangeText={setEmail}
                    />
                    <CInput
                        type="text"
                        value={phone}
                        placeholder="Teléfono (opcional)"
                        onChangeText={setPhone}
                    />
                    <CInput
                        type="password"
                        value={password}
                        placeholder="Contraseña"
                        onChangeText={setPassword}
                    />
                    <CInput
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirmar contraseña"
                        onChangeText={setConfirmPassword}
                    />

                    <CButton
                        title={loading ? "Registrando..." : "Registrarse"}
                        onPress={handleRegister}
                        variant="primary"
                        size="large"
                        disabled={loading}
                    />

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginLink}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    form: {
        width: "100%",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginText: {
        color: colors.textSecondary,
    },
    loginLink: {
        color: colors.primary,
        fontWeight: "600",
    },
});