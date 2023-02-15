import './src/lib/dayjs';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';


import { Loading } from './src/components/Loading';

import { AuthContextProvider } from './src/contexts/AuthContext';

import {Feather} from '@expo/vector-icons'
import { HoldMenuProvider } from 'react-native-hold-menu';
import { Routes } from './src/routes';
import { StatusBar } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });




  if (!fontsLoaded) {
    return (
      <Loading />
    );
  }

  return (
    <AuthContextProvider>
      
      <HoldMenuProvider
      theme='dark'
      iconComponent={Feather}
      >
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      </HoldMenuProvider>
    
    </AuthContextProvider>
  );
}
