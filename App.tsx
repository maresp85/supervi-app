import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { AuthProvider } from './src/context/AuthContext';
import FlashMessage from 'react-native-flash-message';

const AppState = ({ children }: any) => {
  return (
    <AuthProvider>
      { children }
    </AuthProvider>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
        <FlashMessage position="bottom" /> 
      </AppState>
    </NavigationContainer>
  );
}

export default App;