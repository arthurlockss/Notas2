import { createContext, useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovementsScreen from './screens/MovementsScreen';
import AddMovementScreen from './screens/AddMovementScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditMovementScreen from './screens/EditMovementScreen';
import { SQLiteProvider } from 'expo-sqlite';
import { NOME_DATABASE, criacaoTabelaSeNecessario } from './db';

export const NoteContext = createContext({ notes: [], setNotes: () => { }, selectedNote: { index: 0, note: '' }, setSelectedNote: () => { } })

export default function App() {
  const Stack = createNativeStackNavigator()

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState({});
 
  return (
    <PaperProvider>
      <NavigationContainer>
        <SQLiteProvider databaseName={NOME_DATABASE} onInit={criacaoTabelaSeNecessario}>
          <NoteContext.Provider value={{ notes, setNotes, selectedNote, setSelectedNote }}>
            <Stack.Navigator>
              <Stack.Screen name='Movimentações' component={MovementsScreen} />
              <Stack.Screen name='Nova movimentação' component={AddMovementScreen} />
              <Stack.Screen name='Editar movimentação' component={EditMovementScreen} />
            </Stack.Navigator>
          </NoteContext.Provider>
        </SQLiteProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}