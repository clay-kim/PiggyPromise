import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TransactionContext } from "./TransactionContext"; // Import context
import { PieChart } from "react-native-chart-kit"; // Import PieChart from react-native-chart-kit
import { auth } from "../firebaseConfig"; // auth 객체 가져오기

const Transaction = ({ navigation }) => {
  const { transactions, deleteTransaction } = useContext(TransactionContext); // Use context to get transactions

  // Handle deleting the transaction
  const handleDeleteItem = async (id) => {
    try {
      if (!auth.currentUser) {
        throw new Error("User is not logged in."); // 사용자가 로그인하지 않은 경우 에러 처리
      }
      const userId = auth.currentUser.uid; // 현재 사용자의 ID 가져오기
      deleteTransaction(userId, id); // deleteTransaction 호출
      console.log("Transaction page handleDeleted working");
    } catch (error) {
      console.error("Failed to delete the transaction", error);
      Alert.alert("Error", error.message); // 사용자에게 에러 메시지 표시
    }
  };

  // Calculate the sum of each category
  const getCategorySums = () => {
    const categorySums = transactions.reduce((acc, transaction) => {
      // Handle category being null, undefined, or empty
      const category = transaction.category || "?"; // Default to "?" if category is falsy

      // Ensure amount is treated as a valid number
      const amount = parseFloat(transaction.amount);

      // Only proceed if amount is a valid number
      if (!isNaN(amount)) {
        if (acc[category]) {
          acc[category] += amount; // Add to existing sum
        } else {
          acc[category] = amount; // Initialize sum for this category
        }
      }
      return acc;
    }, {});

    return categorySums;
  };
  const categorySums = getCategorySums();

  // Prepare data for the pie chart
  const getPieChartData = () => {
    //const categorySums = getCategorySums();
    return Object.entries(categorySums).map(([category, sum]) => ({
      name: category,
      amount: sum,
      color: categoryColors[category] || categoryColors["?"],
      legendFontColor: "#163b50",
      legendFontSize: 15,
    }));
  };

  // Color mapping for each category
  const categoryColors = {
    Auto: "#5dbdea",
    Grocery: "#ffdb15",
    Entertainment: "#f582a8",
    Dining: "#97d49b",
    Pet: "#163b50",
    Other: "#97a090",
    "?": "#e9dac4",
  };

  // Render each transaction item
  const renderTransactionItem = ({ item }) => {
    const transactionDate = new Date(item.date);
    const formattedDate = transactionDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    }); // Format as "MM/DD" (e.g., "10/15") // Format date (e.g., "10/15/2023")
    const dayOfWeek = transactionDate.toLocaleDateString("en-US", {
      weekday: "long",
    }); // Format day (e.g., "Sunday")

    return (
      <View style={styles.transactionContainer}>
        <View style={styles.transactionCard}>
          <View style={styles.transactionContent}>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text style={styles.transactionMemo}>{item.memo}</Text>
            <Text style={styles.transactionDate}>
              {formattedDate} ({dayOfWeek})
            </Text>
          </View>
          <Text style={styles.transactionAmount}>${item.amount}</Text>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={() => handleDeleteItem(item.id)}
        >
          <View style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Transactions</Text>
      {transactions.length === 0 ? (
        <Text style={styles.infoText}>No transactions found.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransactionItem}
        />
      )}

      {/* Pie chart=================== */}
      <View style={styles.additionalSection}>
        <View style={styles.chartContainer}>
          <Text style={styles.additionalText}>Category Distribution</Text>
          <PieChart
            data={getPieChartData()}
            width={300} // width of the chart
            height={200} // height of the chart
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // Optional: specify the decimal places for labels
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(28, 3, 45, 0.01)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0074b7",
    marginBottom: 10,
    padding: 10,
  },
  infoText: {
    fontSize: 15,
    color: "#fff",
  },
  transactionContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(208, 214, 187, 0.28)",
    height: 50,
    padding: 10,
    marginTop: 3,
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "80%",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  transactionCategory: {
    fontSize: 14,
    color: "#333",
  },
  transactionMemo: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 11,
    color: "red",
    marginTop: 5,
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    width: "18%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF4C4C", // Red color for delete button
    height: 50,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: "light",
    color: "#fff",
  },
  backButton: {
    backgroundColor: "rgba(247, 116, 16, 0.81)",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  additionalSection: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    height: "40%",
    backgroundColor: "rgba(206, 238, 255, 0.07)",
  },
  additionalText: {
    fontSize: 18,
    color: "#896fbc",
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
});
