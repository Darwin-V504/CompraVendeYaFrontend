import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';

// Importa las pantallas correctas
import HomeScreen from '../screens/HomeScreen';
import PropertiesScreen from '../screens/PropertiesScreen';
import FavoritesScreen from '../screens/FavoriteScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabsParamList = {
    Home: undefined;
    CreateProperties: undefined;
    Favorites: undefined;
    Profile: undefined;
}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerStyle: {
                    backgroundColor: colors.card,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    title: 'Favoritos',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}