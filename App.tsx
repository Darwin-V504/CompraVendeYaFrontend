import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
<<<<<<< HEAD
import { AuthProvider } from './src/contexts/AuthContexts';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
=======
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { AuthProvider } from './src/contexts/AuthContexts';
>>>>>>> 049e814f77b0e44aa1426e82cd31620acde862c4
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <StackNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 049e814f77b0e44aa1426e82cd31620acde862c4
