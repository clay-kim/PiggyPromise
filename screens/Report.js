import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TransactionContext } from "./TransactionContext";
import { BudgetContext } from "./BudgetContext";

const Report = () => {
  const { transactions } = useContext(TransactionContext);
  const { weeklyBudget } = useContext(BudgetContext);

  // Function to calculate weekly total
  const calculateWeeklyTotal = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() + 6));

    const weeklyTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
    });

    return weeklyTransactions
      .reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
      .toFixed(2);
  };

  // Function to calculate monthly total
  const calculateMonthlyTotal = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const monthlyTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    });

    return monthlyTransactions
      .reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
      .toFixed(2);
  };

  const weeklyTotal = calculateWeeklyTotal();
  const monthlyTotal = calculateMonthlyTotal();

  // Check if weekly budget is exceeded
  const isWeeklyExceeded = parseFloat(weeklyTotal) > weeklyBudget;
  const weeklyExceedingAmount = isWeeklyExceeded
    ? (parseFloat(weeklyTotal) - weeklyBudget).toFixed(2)
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly and Monthly Report</Text>

      {/* Weekly Report */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Weekly Report</Text>
        <Text style={styles.amountText}>Total Spent: ${weeklyTotal}</Text>
        <Text style={styles.amountText}>Weekly Budget: ${weeklyBudget}</Text>
        {isWeeklyExceeded ? (
          <Text style={styles.exceededText}>
            You have exceeded your weekly budget by ${weeklyExceedingAmount}
          </Text>
        ) : (
          <Text style={styles.withinBudgetText}>
            You are within your weekly budget.
          </Text>
        )}
      </View>

      {/* Monthly Report */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Monthly Report</Text>
        <Text style={styles.amountText}>Total Spent: ${monthlyTotal}</Text>
        <Text style={styles.amountText}>
          Monthly Budget: ${weeklyBudget * 4}
        </Text>
        <Text style={styles.infoText}>
          (Monthly budget is calculated as 4x the weekly budget)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  reportSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0074b7",
  },
  amountText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  exceededText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
  },
  withinBudgetText: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default Report;
