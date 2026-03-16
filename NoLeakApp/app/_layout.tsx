import { initDB, performSync, syncUsers } from '@/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
    const router= useRouter()
  const colorScheme = useColorScheme();
  //ShopKeeper login details are checked
  useEffect(()=>{
     const checkLogin= async ()=>{
      const shopId= await AsyncStorage.getItem('shopId')
      if(shopId===null)
      {
          router.replace('/login')
      }
      else{
        router.replace("/(tabs)/users")
      }
     }
     checkLogin()
  },[])
  //Database is initialised 
  useEffect(() => {
   initDB();
  console.log("Db is initialised....")}, []);

  useEffect(() => {
  let isSyncing = false;

  const unsubscribe = NetInfo.addEventListener(async state => {
    if (
      state.isConnected &&
      state.isInternetReachable &&
      !isSyncing
    ) {
      isSyncing = true;

      console.log("Internet detected. Syncing once...");

      const id = await AsyncStorage.getItem('shopId');
      if (id) {
        await syncUsers(id);
        await performSync();
      }

      isSyncing = false;
    }
  });

  return () => unsubscribe();
}, []);


 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
