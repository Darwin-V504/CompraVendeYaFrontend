import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getThemeColors } from "../infoutils/theme";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
    required?: boolean | string;
    type?: 'text' | 'email' | 'password' | 'number';
    value: string;
    placeholder: string;
    onChangeText?: (text: string) => void;
    editable?: boolean | string;
    icon?: React.ReactNode;
};

export default function CInput({
    type = "text",
    required,
    value,
    placeholder,
    onChangeText,
    editable = true,       
    icon,              
}: Props) {
    const [isSecureText, setIsSecureText] = useState(type === "password");
    const isPasswordField = type === "password";
    const { theme } = useTheme();
    const colors = getThemeColors(theme);

    // 🔧 Conversión explícita a booleanos
    const isEditable = editable === true || editable === "true";
    const isRequired = required === true || required === "true";

    const defaultIcon = type === "email" ? "email" :
                        type === "password" ? "lock" :
                        null;

    const keyboardType: KeyboardTypeOptions =
        type === "email" ? "email-address" :
            type === "number" ? "numeric" :
                "default";

    const getError = () => {
        if (type === "email" && !value.includes("@")) return "Correo inválido";
        if (type === "password" && value.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        return "";
    };

    const error = getError();

    return (
        <View style={styles.wrapper}>
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {icon ? (
                    <View style={{ marginRight: 10 }}>
                        {icon}
                    </View>
                ) : (
                    defaultIcon && (
                        <MaterialIcons
                            name={defaultIcon as any}
                            size={20}
                            color={colors.text}
                            style={{ marginRight: 10 }}
                        />
                    )
                )}

                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isSecureText}
                    editable={isEditable}
                    keyboardType={keyboardType}
                    style={styles.input}
                />

                {isPasswordField && (
                    <TouchableOpacity
                        onPress={() => setIsSecureText(!isSecureText)}
                    >
                        <Ionicons
                            name={isSecureText ? "eye" : "eye-off"}
                            size={22}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 13,
        backgroundColor: "#f9f9f9",
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        flex: 1,
    },
    inputError: {
        borderColor: "red",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 3,
        marginLeft: 5,
    },
});