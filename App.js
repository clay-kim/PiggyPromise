import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/bottomTap";
import { TransactionProvider } from "./screens/TransactionContext";
import { BudgetProvider } from "./screens/BudgetContext";
import { AuthProvider, AuthContext } from "./AuthContext.js"; // Import AuthProvider and AuthContext
import Authentication from "./screens/Authentication";
import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

// Main App Content
const AppContent = () => {
  const { user, loading } = useContext(AuthContext); // Get the user and loading state from AuthContext

  // Show a loading indicator while Firebase checks the user's authentication state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0074b7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // If the user is logged in, show the main app
        <BudgetProvider>
          <TransactionProvider>
            <Tabs />
          </TransactionProvider>
        </BudgetProvider>
      ) : (
        // If the user is not logged in, show the AuthScreen
        <Authentication />
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

// App Component
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
