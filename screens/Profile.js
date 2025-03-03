import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { BudgetContext } from "./BudgetContext"; // Import the context
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { AuthContext } from "../AuthContext"; // Import AuthContext

const Profile = () => {
  const { updateWeeklyBudget } = useContext(BudgetContext); // Get the function to update the budget
  const [inputBudget, setInputBudget] = useState("");
  const { user } = useContext(AuthContext); // Get the user from AuthContext

  // Handle budget update
  const handleBudgetChange = () => {
    const parsedBudget = parseFloat(inputBudget);

    // Validate the input
    if (!isNaN(parsedBudget) && parsedBudget > 0) {
      updateWeeklyBudget(parsedBudget); // Update the context with the new budget
      setInputBudget(""); // Clear the input field
      Keyboard.dismiss(); // Hide the keyboard after update
      Alert.alert("New weekly budget has been updated");
    } else {
      alert("Please enter a valid number greater than 0");
    }
  };
  // Dismiss the keyboard when the user taps outside the TextInput
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Clear the storage (clear all data from AsyncStorage)
  const clearStorage = async () => {
    Alert.alert(
      "Confirm Clear Storage", // Title of the alert
      "Are you sure you want to clear all data? This action cannot be undone.", // Message
      [
        {
          text: "Cancel", // Cancel button
          style: "cancel",
        },
        {
          text: "Yes", // Confirm button
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              alert("Storage has been reset.");
            } catch (error) {
              console.error("Failed to clear storage", error);
            }
          },
        },
      ]
    );
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      Alert.alert("Logged Out!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userInfo}>Welcome, {user.email}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topContainer}>
          <Text style={styles.title}>Set</Text>
          <Text style={styles.title}>Weekly </Text>
          <Text style={styles.title}>Budget</Text>
        </View>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={inputBudget}
          onChangeText={setInputBudget}
          placeholder="Enter amount"
          placeholderTextColor="#fff"
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBudgetChange}>
            <Text style={styles.buttonTextSubmit}>Let's Go!</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={clearStorage}>
          <Text style={styles.buttonTextClear}>Clear Storage</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 88, 88, 0.73)",
    justifyContent: "start",
    alignItems: "center",
  },
  userContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 15,
    fontWeight: "bold",
    color: "rgba(19, 18, 18, 0.79)",
  },
  topContainer: {
    backgroundColor: "rgba(255, 245, 245, 0.33)",
    width: "80%",
    padding: 5,
    height: "40%",
    marginLeft: -80,
    borderBottomRightRadius: 20,
  },
  title: {
    width: "80%",
    fontSize: 65,
    marginBottom: 0,
    fontWeight: "bold",
    color: "rgba(38, 35, 35, 0.8)",
  },
  input: {
    width: "45%",
    textAlign: "left",
    height: 45,
    borderColor: "#fff",
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 50,
    backgroundColor: "rgba(255, 255, 255, 0.11)",
    fontSize: 15,
  },
  clearButton: {
    position: "absolute",
    bottom: 20,
    color: "rgba(255, 44, 181, 0.88)",
    height: 40,
  },
  buttonTextClear: {
    color: "rgb(55, 255, 245)",
    fontSize: 16,
    textAlign: "center",

    padding: 10,
  },
  buttonTextSubmit: {
    fontSize: 24,
    fontWeight: "light",
    width: "100%",
    height: 50,
    padding: 10,
    justifyContent: "center",
    color: "rgba(252, 92, 83, 0.91)",
    backgroundColor: "rgba(220, 255, 116, 0.95)",
    textAlign: "right",
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // The offset of the shadow (horizontal and vertical)
    shadowOpacity: 0.2, // The opacity of the shadow
    shadowRadius: 100, // The blur radius of the shadow
  },
  bottomContainer: {
    margin: 15,
    width: "100%",
    alignItems: "right",
    backgroundColor: "rgba(39, 37, 37, 0.6)",
    shadowColor: "#fff", // Shadow color
    shadowOffset: { width: 0, height: 1 }, // The offset of the shadow (horizontal and vertical)
    shadowOpacity: 0.2, // The opacity of the shadow
    shadowRadius: 10, // The blur radius of the shadow
  },
  logoutButton: {
    backgroundColor: "rgba(59, 10, 96, 0.59)",
    padding: 5,
    borderRadius: 5,
    height: 28,
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
