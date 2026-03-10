import { useState, useEffect } from "react";
import { 
  Alert, Platform,
  Text, TextInput, 
  View, KeyboardAvoidingView,
  Pressable,
  ScrollView,
 } from 'react-native';

import { auth, db} from "./src/lib/firebase";
import { 
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "firebase/auth";

import { 
  addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp 
} from "firebase/firestore";

type Note = {id: string, text: string};

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Auth form
  const [email, setEmail] = useState("fjsilva@sp.senac.br");
  const [password, setPassword]= useState("a1b2c3");

  // DB Firestore 
  const [noteText, setNoteText] = useState("Primeira anotação");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect( () =>{
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserEmail(u?.email ?? null);
    });
    return unsub;
  },[])

  async function handleRegister(){
    try {
      console.log("Register -> ", email.trim());
      const create = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log("Register Ok uid: ", create.user.uid);
      Alert.alert("Conta criada com sucesso", create.user.email ?? "");
    } catch (error) {
      console.log("Register failed ", error);      
    }
  }

  async function handleLogin() {
    try {
      console.log("Login --> ", email.trim());
      const logged = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log("LOGIN OK uid: ", logged.user.uid);
      Alert.alert("Login Ok ", logged.user.email ?? "");
    } catch (error) {
      console.log("Login failed ", error);  
    }
  }

  async function handleLogout(){
    try {
      console.log("LOGOUT !!!");
      await signOut(auth);
      console.log("LOGOUT OK");
      Alert.alert("Logout Ok!");
    } catch (error) {
      console.log("Logout failed ", error)
    }
  }

  async function AddNote(){
    try {
      console.log("ADD Note --> ", noteText);
      const docRef = await addDoc(collection(db, "notes"), {
        text: noteText,
        createdAt: serverTimestamp(),
        user: userEmail ?? null,
      })
      console.log("ADD NOTE OK id: ", docRef.id);
      setNoteText("")
      await refreshNotes();
    } catch (error) {
      console.log("addNote failed ", error);
    }
  }

  async function refreshNotes(){
    try {
      console.log("REFRESH NOTES !!!");
      const response = query(collection(db,"notes"), orderBy("createdAt", "desc"), limit(10));
      const snap = await getDocs(response);
      console.log("NOTES count: ", snap.size);
      setNotes(snap.docs.map(n => ({id: n.id, text:String(n.data().text ?? "") })));
    } catch (error) {
      console.log("refreshNotes failed ", error)      
    }
  }
  return (
    <KeyboardAvoidingView
    style={{ flex:1, marginTop:25}}
    behavior={Platform.select({ios:"padding", android:"height"})}
    >
      <ScrollView contentContainerStyle={{padding:16, gap:16}}>
        <Text style={{fontSize:22, fontWeight:"700"}}
        >Expo/React + Firebase(mínimo)</Text>
        <View 
        style={{padding:12, borderWidth:1, borderRadius:12, 
        gap:10, marginTop:5}}>
          <Text style={{fontSize:16, fontWeight:"600"}}
          >Auth</Text>
          <Text>Usuário logado: {userEmail ?? "nenhum"}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            autoCapitalize="none"
            style={{borderWidth:1, borderRadius:10, padding:10}}
          ></TextInput>
          <TextInput 
            value={password}
            onChangeText={setPassword}
            placeholder="senha"
            secureTextEntry
            style={{borderWidth:1, borderRadius:10, padding:10}}
          ></TextInput>
          <View style={{flexDirection:"row", gap: 10, flexWrap: "wrap"}}>
            <Pressable onPress={handleRegister}
            style={{padding:10, borderWidth:1, borderRadius:10 }}>
              <Text>Criar conta</Text>
            </Pressable>
            <Pressable onPress={handleLogin}
            style={{padding:10, borderWidth:1, borderRadius:10 }}>
              <Text>Login</Text>
            </Pressable>
            <Pressable  onPress={handleLogout}
            style={{padding:10, borderWidth:1, borderRadius:10 }}>
              <Text>Logout</Text>
            </Pressable>
          </View>
        </View>
        <View style={{padding:12, borderWidth:1, borderRadius:12, 
          gap:10, marginTop:5}}>
          <Text style={{fontSize:16, fontWeight: "600"}}
          >Firestore</Text>
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Texto da anotação"
            style={{borderWidth:1, borderRadius:10, padding:10}}
          ></TextInput>
          <View style={{flexDirection:"row", gap:10, flexWrap:"wrap"}}>
            <Pressable onPress={AddNote}
            style={{padding:10, borderWidth:1, borderRadius:10 }}
            ><Text>Salvar nota</Text></Pressable>
            <Pressable onPress={refreshNotes}
            style={{padding:10, borderWidth:1, borderRadius:10 }}
            ><Text>Recarregar</Text></Pressable>
          </View>
          <View>
            {notes.map(n => (
              <Text key={n.id}>- {n.text}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

