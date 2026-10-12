import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

type List = {
  id: number;
  product: string;
  amount: string;
};

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState<List[]>([]);

  const db = SQLite.openDatabaseSync("listdb");

  const initialize = async () => {
    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS list (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);
    `);
      // Todo: update the course list
    } catch (error) {
      console.error("Could not open database", error);
    }
  };

  const handleSave = async () => {
  try {
    await db.runAsync('INSERT INTO list (product, amount) VALUES (?, ?)', product, amount);
    // Todo: update the course list
  } catch (error) {
    console.error('Could not add item', error);
  }
};

  useEffect(() => {
    initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Product"
          onChangeText={(product) => setProduct(product)}
          value={product}
        />
        <TextInput
          placeholder="Amount"
          onChangeText={(amount) => setAmount(amount)}
          value={amount}
        />
        <Button onPress={handleSave} title="SAVE" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
