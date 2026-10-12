import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
} from "react-native";
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
      handleFetch();
      // Todo: update the list
    } catch (error) {
      console.error("Could not open database", error);
    }
  };

  const handleFetch = async () => {
    try {
      const list = await db.getAllAsync("SELECT * from list");
      setList(list as List[]);
    } catch (error) {
      console.error("Could not get items", error);
    }
  };

  const handleSave = async () => {
    try {
      await db.runAsync(
        "INSERT INTO list (product, amount) VALUES (?, ?)",
        product,
        amount,
      );
      handleFetch();
      // Todo: update the course list
    } catch (error) {
      console.error("Could not add item", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.runAsync("DELETE FROM list WHERE id=?", id);
      await handleFetch();
    } catch (error) {
      console.error("Could not delete item", error);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Product"
          onChangeText={(product) => setProduct(product)}
          value={product}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          onChangeText={(amount) => setAmount(amount)}
          value={amount}
        />
        <Button onPress={handleSave} title="SAVE" />

        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.text}>
                {item.product}, {item.amount}
              </Text>
              <Text
                style={{ color: "#0d00ff", marginLeft: 15 }}
                onPress={() => handleDelete(item.id)}
              >
                Bought
              </Text>
            </View>
          )}
        />
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
    paddingTop: 50,
  },
  input: {
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
  },
});
