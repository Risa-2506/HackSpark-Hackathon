
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';




export default function Login(){
    const [shopId,setshopId]=useState<string>("")
    const [password,setpassword]=useState<string>("")
    const router = useRouter()
    const handleLogin= async ()=>{
        if (shopId.trim()===""|| password.trim()==="")
        {
            alert("Empty ")
        }
        else{
            const cleanId = shopId.trim()
            
            await AsyncStorage.setItem("shopId",cleanId)
            router.replace("/(tabs)/users")
            console.log("SAVED SHOPID: ",cleanId)
        }
       
    }

   return (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>

    <TextInput
      placeholder="Shop ID"
      placeholderTextColor="#aaa"
      style={styles.input}
      onChangeText={setshopId}
      value={shopId}
    />

    <TextInput
      placeholder="Password"
      placeholderTextColor="#aaa"
      secureTextEntry
      style={styles.input}
      onChangeText={setpassword}
      value={password}
    />

    <Button title="Login" onPress={handleLogin} />
  </View>
)

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
});
