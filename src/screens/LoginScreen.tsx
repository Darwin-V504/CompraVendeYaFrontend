import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getThemeColors } from "../infoutils/theme";
import CInput from "../components/CInput";
import CButton from "../components/CButton";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Por favor ingresa email y contraseña");
            return;
        }

        console.log('Intentando login con:', { email });

        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        
        if (success) {
            console.log('Login exitoso');
        } else {
            console.log('Login falló');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Bienes Raíces</Text>
                    <Text style={styles.subtitle}>Encuentra tu hogar ideal</Text>
                </View>

                <View style={styles.form}>
                    <CInput
                        type="email"
                        value={email}
                        placeholder="Correo electrónico"
                        onChangeText={setEmail}
                    />
                    <CInput
                        type="password"
                        value={password}
                        placeholder="Contraseña"
                        onChangeText={setPassword}
                    />
                    
                    <TouchableOpacity 
                        style={styles.forgotPassword}
                        onPress={() => alert("Recuperar contraseña")}
                    >
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <CButton
                        title={loading ? "Iniciando..." : "Iniciar Sesión"}
                        onPress={handleLogin}
                        variant="primary"
                        size="large"
                        disabled={loading}
                    />

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.registerLink}>Regístrate</Text>
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
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    form: {
        width: "100%",
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    forgotText: {
        color: colors.primary,
        fontSize: 14,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: {
        color: colors.textSecondary,
    },
    registerLink: {
        color: colors.primary,
        fontWeight: "600",
    },
});