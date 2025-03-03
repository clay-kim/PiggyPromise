import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function Profile() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Heather i Love you</Text>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF5EF",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontFamily: "HalveticaNeue",
    fontSize: 32,
    fontWeight: "bold",
    padding: 10,
    color: "#0F6EDFw",
  },
});
