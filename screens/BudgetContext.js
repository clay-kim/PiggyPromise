import React, { createContext, useState } from "react";

// Create the context
export const BudgetContext = createContext();

// Create a provider component
export const BudgetProvider = ({ children }) => {
  const [weeklyBudget, setWeeklyBudget] = useState(500); // Default budget

  // Function to update weekly budget
  const updateWeeklyBudget = (newAmount) => {
    setWeeklyBudget(newAmount);
  };

  return (
    <BudgetContext.Provider value={{ weeklyBudget, updateWeeklyBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};
