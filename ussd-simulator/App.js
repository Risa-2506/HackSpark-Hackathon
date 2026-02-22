import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- UPDATED KEYMAP (Numbers First!) ---
const keyMap = {
  '1': ['1'],
  '2': ['2', 'A', 'B', 'C'],
  '3': ['3', 'D', 'E', 'F'],
  '4': ['4', 'G', 'H', 'I'],
  '5': ['5', 'J', 'K', 'L'],
  '6': ['6', 'M', 'N', 'O'],
  '7': ['7', 'P', 'Q', 'R', 'S'],
  '8': ['8', 'T', 'U', 'V'],
  '9': ['9', 'W', 'X', 'Y', 'Z'],
  '*': ['*'],
  '0': ['0', ' '],
  '#': ['#']
};

const KeyPadButton = ({ label, subLabel, color = "#333", onPress }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
    {subLabel ? <Text style={styles.subText}>{subLabel}</Text> : null}
  </TouchableOpacity>
);

export default function App() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- MULTI-TAP STATE ---
  const tapTimer = useRef(null);
  const currentTap = useRef({ key: null, index: 0 });

  // --- STATES FOR COMPLAINT FORM ---
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [rcInput, setRcInput] = useState('');
  const [shopInput, setShopInput] = useState('');
  const [kgInput, setKgInput] = useState('');

  // --- RISA'S BASE API URL ---
  const API_BASE_URL = 'https://kenspeckle-norah-guiltily.ngrok-free.dev';

  // --- NEW MULTI-TAP KEYPAD LOGIC ---
  const handlePress = (key) => {
    const chars = keyMap[key];

    if (currentTap.current.key === key) {
      currentTap.current.index = (currentTap.current.index + 1) % chars.length;
      setInput((prev) => prev.slice(0, -1) + chars[currentTap.current.index]);
    } else {
      currentTap.current.key = key;
      currentTap.current.index = 0;
      setInput((prev) => prev + chars[0]);
    }

    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      currentTap.current = { key: null, index: 0 };
    }, 1000); 
  };

  const handleBackspace = () => {
    if (tapTimer.current) clearTimeout(tapTimer.current);
    currentTap.current = { key: null, index: 0 };
    setInput(prev => prev.slice(0, -1));
  };

  // --- STEP 3: SUBMIT COMPLAINT ---
  const submitComplaint = async () => {
    if (!rcInput || !shopInput || !kgInput) {
      Alert.alert("Missing Info", "Please fill out all fields to submit your complaint.");
      return;
    }

    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/v1/complaint`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ 
            rationCard: rcInput, 
            shopId: shopInput, 
            receivedKg: Number(kgInput) 
        }),
      });
      
      Alert.alert("Complaint Registered", "Your complaint has been successfully recorded.");
      
      setShowComplaintForm(false);
      setRcInput('');
      setShopInput('');
      setKgInput('');
      setInput('');
    } catch (error) {
      console.log("Error filing complaint:", error);
      Alert.alert("Error", "Could not connect to the server to file complaint.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = async () => {
    // NEW REGEX: Expects only *99*RationCard#
    const regex = /^\*99\*([A-Z0-9]+)#$/i;
    const match = input.match(regex);

    if (!match) {
      Alert.alert("Error", "Invalid Format.\nUse: *99*RationCard#\n(e.g., *99*RC001#)");
      return;
    }

    const extractedRC = match[1].toUpperCase(); 
    
    console.log(`Dialing server for RC: ${extractedRC}`);
    setIsLoading(true);

    try {
      // --- STEP 1: POST RATION CARD ONLY ---
      const response = await fetch(`${API_BASE_URL}/api/v1/ussd/get-utid`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ 
            rationCard: extractedRC 
        }),
      });

      const data = await response.json();
      
      if (data.token) {
        const allotedKgs = data.allocationKg || 0;

        Alert.alert(
            "USSD Response", 
            `Welcome to PDS Ration System.\n\nYour UTID: ${data.token}\nAllotted KGs: ${allotedKgs}kg\n\nValid for 15 mins.`,
            [
              {
                text: "OK", 
                onPress: () => {
                  // --- STEP 2: CHECK DISTRIBUTION ---
                  let pollInterval = setInterval(async () => {
                    try {
                      const checkRes = await fetch(`${API_BASE_URL}/api/v1/check-distribution?rationCard=${extractedRC}`, {
                        headers: { 'ngrok-skip-browser-warning': 'true' }
                      });
                      const pollData = await checkRes.json();

                      if (pollData.distributed) {
                        clearInterval(pollInterval); 

                        // 1 OR 0 CONFIRMATION SCREEN
                        Alert.alert(
                          "Shopkeeper Update",
                          `The shopkeeper has logged your distribution.\n\nDid you receive your exact ration?`,
                          [
                            { 
                              text: "1 (YES)", 
                              onPress: () => Alert.alert("PDS Reception Confirmed ✅", `You have received your ration successfully.`) 
                            },
                            { 
                              text: "0 (NO)", 
                              style: "destructive",
                              onPress: () => {
                                setRcInput(extractedRC);
                                setShowComplaintForm(true);
                              } 
                            }
                          ]
                        );
                      }
                    } catch (e) {
                      console.log("Polling error:", e);
                    }
                  }, 5000); 
                }
              }
            ]
        );
      } else {
        Alert.alert("Error", data.message || "User not found.");
      }

    } catch (error) {
      Alert.alert("Connection Failed", "Could not reach the Server.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showComplaintForm) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', padding: 20, backgroundColor: '#f2f2f2' }]}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' }}>File a Complaint</Text>
        
        <TextInput style={styles.inputField} placeholder="Enter Ration Card No." value={rcInput} onChangeText={setRcInput} placeholderTextColor="#888" />
        <TextInput style={styles.inputField} placeholder="Enter Shop ID (e.g. SHOP99)" value={shopInput} onChangeText={setShopInput} placeholderTextColor="#888" />
        <TextInput style={styles.inputField} placeholder="Actual Received Kg (e.g. 5)" value={kgInput} onChangeText={setKgInput} keyboardType="numeric" placeholderTextColor="#888" />

        <TouchableOpacity style={[styles.callBtn, { width: '100%', marginBottom: 15 }]} onPress={submitComplaint}>
          {isLoading ? <ActivityIndicator color="#fff"/> : <Text style={styles.callBtnText}>Submit Complaint</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.callBtn, { width: '100%', backgroundColor: '#ff3b30' }]} onPress={() => setShowComplaintForm(false)}>
          <Text style={styles.callBtnText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}><Text style={styles.inputText}>{input}</Text></View>
      <View style={styles.keypad}>
        <View style={styles.row}>
          <KeyPadButton label="1" onPress={() => handlePress('1')} />
          <KeyPadButton label="2" subLabel="ABC" onPress={() => handlePress('2')} />
          <KeyPadButton label="3" subLabel="DEF" onPress={() => handlePress('3')} />
        </View>
        <View style={styles.row}>
          <KeyPadButton label="4" subLabel="GHI" onPress={() => handlePress('4')} />
          <KeyPadButton label="5" subLabel="JKL" onPress={() => handlePress('5')} />
          <KeyPadButton label="6" subLabel="MNO" onPress={() => handlePress('6')} />
        </View>
        <View style={styles.row}>
          <KeyPadButton label="7" subLabel="PQRS" onPress={() => handlePress('7')} />
          <KeyPadButton label="8" subLabel="TUV" onPress={() => handlePress('8')} />
          <KeyPadButton label="9" subLabel="WXYZ" onPress={() => handlePress('9')} />
        </View>
        <View style={styles.row}>
          <KeyPadButton label="*" onPress={() => handlePress('*')} />
          <KeyPadButton label="0" subLabel="␣" onPress={() => handlePress('0')} />
          <KeyPadButton label="#" onPress={() => handlePress('#')} />
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.backspaceBtn} onPress={handleBackspace}><Text style={styles.backspaceText}>⌫</Text></TouchableOpacity>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
             {isLoading ? <ActivityIndicator color="#fff"/> : <Text style={styles.callBtnText}>CALL</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'flex-end' },
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginBottom: 20 },
  inputText: { fontSize: 32, fontWeight: '500', color: '#000', textAlign: 'center', paddingHorizontal: 10 },
  keypad: { paddingBottom: 40, paddingHorizontal: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  button: { width: 75, height: 75, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  subText: { fontSize: 10, color: '#ccc', marginTop: -5 },
  callBtn: { width: 150, height: 75, borderRadius: 40, backgroundColor: '#4CD964', justifyContent: 'center', alignItems: 'center' },
  callBtnText: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  backspaceBtn: { width: 75, height: 75, justifyContent: 'center', alignItems: 'center' },
  backspaceText: { fontSize: 30, color: '#333' },
  inputField: { backgroundColor: '#fff', fontSize: 18, padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', color: '#000'}
});