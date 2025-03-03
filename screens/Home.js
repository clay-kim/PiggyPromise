import React, { useState, useRef, useContext } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  Vibration,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransactionContext } from "./TransactionContext";
import { BudgetContext } from "./BudgetContext"; // Import the context

const Home = ({ navigation }) => {
  const { weeklyBudget } = useContext(BudgetContext); // Get the weekly budget from context
  const { transactions, setTransactions } = useContext(TransactionContext);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");

  // Function to calculate the total spent amount
  const calculateTotalSpent = () => {
    return transactions
      .reduce((total, transaction) => {
        return total + parseFloat(transaction.amount || 0);
      }, 0)
      .toFixed(2);
  };

  // Categories List
  const categories = [
    { id: "1", name: "Grocery" },
    { id: "2", name: "Dining" },
    { id: "3", name: "Auto" },
    { id: "4", name: "Entertainment" },
    { id: "5", name: "Taba_Uni" },
    { id: "6", name: "Other" },
  ];

  // Handle form submission
  const handleSubmit = async () => {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    const newTransaction = {
      id: Date.now().toString(),
      amount,
      category,
      memo,
      date: currentDate, // Add the date field
    };

    try {
      // Update transactions in state and AsyncStorage
      const updatedTransactions = [newTransaction, ...transactions]; // Add to the start of the array
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );
      setTransactions(updatedTransactions); // Update state from context

      Alert.alert(
        "Transaction Added",
        `Amount: ${amount}\nCategory: ${category}\nMemo: ${memo}\nDate: ${currentDate}`
      );

      setModalVisible(false);
      setAmount("");
      setCategory("");
      setMemo("");
    } catch (error) {
      console.error("Failed to save the transaction", error);
    }
  };

  // Render each transaction item
  const renderItem = ({ item }) => {
    const transactionDate = new Date(item.date);
    const formattedDate = transactionDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    }); // Format as "MM/DD" (e.g., "10/15")
    const dayOfWeek = transactionDate.toLocaleDateString("en-US", {
      weekday: "long",
    }); // Format day (e.g., "Sunday")

    return (
      <View style={styles.transactionCard}>
        <View>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text style={styles.transactionMemo}>{item.memo}</Text>
          <Text style={styles.transactionDate}>
            {formattedDate} ({dayOfWeek})
          </Text>
        </View>
        <Text style={styles.transactionAmount}>${item.amount}</Text>
      </View>
    );
  };

  // Create an animated value for shake effect
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Handle image click event\\\\\\\\
  const handleImageClick = () => {
    Vibration.vibrate(1); // Vibrates for 500ms

    // Trigger shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: -15, // Move right
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10, // Move left
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0, // Return to original position
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setModalVisible(true);
    }, 400);
  };

  // Calculate if the budget is exceeded
  const totalSpent = calculateTotalSpent();
  const isExceeded = parseFloat(totalSpent) > weeklyBudget;
  const exceedingAmount = isExceeded
    ? parseFloat(totalSpent) - weeklyBudget
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Weekly Budget</Text>
          <Text style={styles.boxAmount}>${weeklyBudget}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Total Spent</Text>
          <Text style={styles.boxAmount}>${calculateTotalSpent()}</Text>
        </View>
      </View>
      <SafeAreaProvider>
        <SafeAreaView style={styles.imageContainer} edges={["top"]}>
          <TouchableOpacity onPress={handleImageClick}>
            <Animated.View style={{ transform: [{ translateY: shakeAnim }] }}>
              <Image
                style={[styles.image]}
                source={require("../assets/piggybank.png")}
              />
            </Animated.View>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>

      {/* Display budget exceeding message */}
      <View style={styles.budgetStatusContainer}>
        {isExceeded ? (
          <Text style={styles.exceededText}>
            You have exceeded your budget by ${exceedingAmount.toFixed(2)}
          </Text>
        ) : (
          <Text style={styles.withinBudgetText}>
            You are within your budget.
          </Text>
        )}
      </View>

      {/* Modal Popup with Input Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalBackground}>
            <KeyboardAvoidingView
              behavior="padding" // This works well for iOS to add padding when the keyboard appears
              style={styles.modalContainer}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Expense Detail</Text>

                <TextInput
                  style={styles.inputNumber}
                  placeholder="$$$"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  onSubmitEditing={Keyboard.dismiss}
                />

                {/* Category Input */}
                <View style={styles.categoryListContainer}>
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.categoryItemContainer}
                        onPress={() => setCategory(item.name)} // Set the category when clicked
                      >
                        <View
                          style={[
                            styles.categoryItem,
                            category === item.name &&
                              styles.selectedCategoryItem, // Highlight selected category
                          ]}
                        >
                          <Text
                            style={
                              category === item.name
                                ? styles.selectedCategoryText
                                : styles.categoryText
                            }
                          >
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                {/* Memo Input */}
                <TextInput
                  style={[styles.input]}
                  placeholder="Memo.."
                  placeholderTextColor="#C0C0C0"
                  value={memo}
                  onChangeText={setMemo}
                  onSubmitEditing={Keyboard.dismiss}
                />

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                  <Button
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                  />
                  <Button title="Submit" onPress={handleSubmit} />
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Recent Transactions List */}
      <View style={styles.recentTransactionsContainer}>
        <Text style={styles.recentTransactionsTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions.slice(0, 3)} // Show only the first 3 transactions
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    height: "15%",
    width: "100%",
    padding: 20,
    backgroundColor: "rgba(10, 154, 123, 0.17)",
    justifyContent: "space-around",
    alignItems: "center",
  },
  boxTitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  boxAmount: {
    fontSize: 22,

    fontWeight: "bold",
    color: "#FF8C00", // Or choose a color that fits your design
    textAlign: "center",
  },

  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(21, 160, 247, 0.86)",
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "cover",
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  budgetStatusContainer: {
    backgroundColor: "rgba(21, 160, 247, 0.86)", // Make the background transparent
    justifyContent: "center",
    alignItems: "center", // Center the text inside the container
    paddingVertical: 10,
  },
  exceededText: {
    color: "rgba(255, 60, 144, 0.89)",
    fontWeight: "bold",
    fontSize: 18,
    padding: 10,
    textAlign: "center",
  },
  withinBudgetText: {
    fontSize: 18,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "rgba(184, 255, 5, 0.86)",
  },
  // Modal Styling
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
  },
  modalContainer: {
    width: "80%",
    paddingTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  inputNumber: {
    width: 100,
    height: 80,
    borderColor: "#5C8DC5",
    borderWidth: 2,
    marginBottom: 30,
    textAlign: "center",
    borderRadius: 5,
    fontSize: 22,
    fontWeight: "bold",
  },

  label: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
  },
  categoryListContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  categoryItemContainer: {
    marginRight: 15,
  },
  categoryItem: {
    width: 80,
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#b6d9c9", // Light background color for each category box
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedCategoryItem: {
    backgroundColor: "#007BFF", // Blue background for selected category
    shadowOpacity: 0.5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "light",
    color: "#555",
    marginTop: 0,
  },
  selectedCategoryText: {
    fontSize: 14,
    color: "#fff", // White text for selected category
    marginTop: 5,
  },

  recentTransactionsContainer: {
    width: "100%",
    height: "25%",
    padding: 20,
    backgroundColor: "rgba(239, 96, 255, 0.48)",
  },
  recentTransactionsTitle: {
    color: "rgba(255, 64, 214, 0.86)",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: -10,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 40,
    padding: 5,
    marginTop: 5,
    marginBottom: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8C00", // Color for amount
  },

  transactionCategory: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },

  transactionMemo: {
    fontSize: 11,
    fontWeight: "light",
    color: "#555",
  },
  transactionDate: {
    fontSize: 11,
    color: "red",
    marginTop: 5,
  },
});
