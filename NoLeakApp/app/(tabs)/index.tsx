import { getUserByRationCard, performSync, saveTransaction } from '@/database'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import CryptoJS from "crypto-js"
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default function HomeScreen() {

  const [token, setToken] = useState("")
  const [rationCard, setRationCard] = useState("")

  // 🔐 REAL TOTP (Matches speakeasy)
  async function generateTOTP(secret: string) {

    const step = 900
    const epoch = Math.floor(Date.now() / 1000)
    const counter = Math.floor(epoch / step)

    // convert counter to 8-byte big-endian
    const counterHex = counter.toString(16).padStart(16, "0")
    const counterWordArray = CryptoJS.enc.Hex.parse(counterHex)

    // ASCII encoding (matches backend encoding: "ascii")
    const key = CryptoJS.enc.Latin1.parse(secret)
    // HMAC-SHA1
    const hmac = CryptoJS.HmacSHA1(counterWordArray, key)
    const hmacHex = hmac.toString(CryptoJS.enc.Hex)

    // Dynamic truncation
  const offset = parseInt(hmacHex.slice(-1), 16)

const binary =
  ((parseInt(hmacHex.slice(offset * 2, offset * 2 + 2), 16) & 0x7f) << 24) |
  (parseInt(hmacHex.slice(offset * 2 + 2, offset * 2 + 4), 16) << 16) |
  (parseInt(hmacHex.slice(offset * 2 + 4, offset * 2 + 6), 16) << 8) |
  (parseInt(hmacHex.slice(offset * 2 + 6, offset * 2 + 8), 16))

return (binary % 1000000).toString().padStart(6, "0")
  }

  const handleDispense = async () => {

    if (!token || !rationCard) {
      alert("Enter all fields")
      return
    }

    const shopId = await AsyncStorage.getItem("shopId")
    if (!shopId) {
      alert("Shop not found")
      return
    }

    const user = getUserByRationCard(rationCard, shopId)
    if (!user) {
      alert("User not found")
      return
    }

    const generatedToken = await generateTOTP(user.secretKey)

    console.log("Backend Secret:", user.secretKey)
    console.log("Frontend Token:", generatedToken)

    if (generatedToken !== token) {
      alert("Invalid Token")
      return
    }

    const now = new Date()
    const monthString = `${now.getFullYear()}-${now.getMonth() + 1}`

    if (monthString === user.lastMonth) {
      alert("Ration already collected this month")
      return
    }

    await saveTransaction(
      rationCard,
      shopId,
      user.utid,
      user.allocationKg,
      monthString
    )
    alert("Dispensed Successfully")
    const net = await NetInfo.fetch()
if (net.isConnected && net.isInternetReachable) {
   await performSync()
}

    
    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <TextInput
        placeholder="Token"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setToken}
        value={token}
      />

      <TextInput
        placeholder="Ration Card"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setRationCard}
        value={rationCard}
      />

      <Button title="Dispense" onPress={handleDispense} />
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
})