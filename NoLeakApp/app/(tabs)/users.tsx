
import { getUsers } from '@/database';
import { APIuser } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


export default function Home(){
    const [users,setUsers] = useState<APIuser[]>([])
   const loadUsers = async () => {
      const id = await AsyncStorage.getItem("shopId")
      console.log("Loaded id:", id)

      if (!id) {
        setUsers([])
        return
      }

      const usersFromDb = getUsers(id)
      console.log("User from DB:", usersFromDb)

      setUsers([...usersFromDb])
    }
    useFocusEffect(
  useCallback(() => {

    

    loadUsers()

  }, [])
)
 
  
   return (
  <View style={styles.container}>
    <Text style={styles.title}>Users Working</Text>
    <Button title="RELOAD" onPress={loadUsers} />

    {users.map((user, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.name}>Name: {user.name}</Text>
        <Text style={styles.name}>Allocated Ration(in kg): {user.allocationKg}</Text>
        <Text style={styles.name}>Ration Card Id: {user.rationCard}</Text>
      </View>
    ))}
  </View>
  
)


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    color: "#ffffff",
    fontSize: 16,
  },
});
