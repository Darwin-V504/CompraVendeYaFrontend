import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContexts";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

export default function ProfileScreen({ navigation }: any) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const menuItems = [
        { icon: "heart-outline", title: "Mis Favoritos", onPress: () => navigation.navigate("Favorites") },
        { icon: "search-outline", title: "Búsquedas Guardadas", onPress: () => {} },
        { icon: "notifications-outline", title: "Notificaciones", onPress: () => {} },
        { icon: "moon-outline", title: "Modo Oscuro", onPress: toggleTheme, isToggle: true },
        { icon: "language-outline", title: "Idioma", onPress: () => {} },
        { icon: "log-out-outline", title: "Cerrar Sesión", onPress: logout, isDanger: true },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </Text>
                    </View>
                </View>
                <Text style={styles.name}>{user?.full_name || "Usuario"}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Propiedades vistas</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Favoritos</Text>
                </View>
            </View>

            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <View style={styles.menuLeft}>
                            <Ionicons name={item.icon as any} size={24} color={item.isDanger ? colors.error : colors.primary} />
                            <Text style={[styles.menuText, item.isDanger && styles.menuTextDanger]}>
                                {item.title}
                            </Text>
                        </View>
                        {!item.isToggle && (
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        )}
                        {item.isToggle && (
                            <View style={[styles.themeIndicator, theme === "dark" && styles.themeIndicatorActive]} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.version}>Versión 1.0.0</Text>
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontSize: 32,
        color: colors.white,
        fontWeight: "bold",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text,
    },
    email: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: colors.card,
        margin: 20,
        padding: 16,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border,
    },
    menuContainer: {
        backgroundColor: colors.card,
        marginHorizontal: 20,
        borderRadius: 12,
        overflow: "hidden",
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
        width: 20,
        height: 20,
        borderRadius: 10,
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
        marginTop: 20,
        marginBottom: 30,
    },
});