import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContexts';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
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
}
