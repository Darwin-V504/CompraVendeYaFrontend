import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';
import { useAuth } from '../contexts/AuthContexts';
import TabsNavigator from './TabsNavigator';
import SearchMercadoLibreScreen from '../screens/SearchMercadoLibreScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/Register';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import SearchScreen from '../screens/SearchScreen';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    PropertyDetail: { propertyId: string };
    Search: undefined;
    SearchML: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const colors = getThemeColors(theme);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '600',
                },
                
            }}
        >
            {!user ? (
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="MainTabs"
                        component={TabsNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen 
                      name="SearchML" 
                      component={SearchMercadoLibreScreen} 
                     options={{ title: 'Buscar en Mercado Libre' }}
                    />
                    <Stack.Screen
                        name="PropertyDetail"
                        component={PropertyDetailScreen}
                        options={{ title: 'Detalle de Propiedad' }}
                    />
                    <Stack.Screen
                        name="Search"
                        component={SearchScreen}
                        options={{ title: 'Buscar Propiedades' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}