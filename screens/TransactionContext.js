import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, push, onValue, remove } from "firebase/database";
// Create the context
export const TransactionContext = createContext();

// Transaction provider to wrap the app
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // 트랜잭션 불러오기
  const fetchTransactions = (userId) => {
    const transactionsRef = ref(database, `transactions/${userId}`);
    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transactionsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTransactions(transactionsArray);
      } else {
        setTransactions([]);
      }
    });
  };

  // 트랜잭션 추가
  const addTransaction = (userId, transaction) => {
    const transactionsRef = ref(database, `transactions/${userId}`);
    push(transactionsRef, transaction)
      .then(() => {
        console.log("트랜잭션 추가 성공");
      })
      .catch((error) => {
        console.error("트랜잭션 추가 실패:", error);
      });
  };

  // 트랜잭션 삭제
  const deleteTransaction = (userId, transactionId) => {
    const transactionRef = ref(
      database,
      `transactions/${userId}/${transactionId}`
    );
    remove(transactionRef)
      .then(() => {
        console.log("트랜잭션 삭제 성공");
      })
      .catch((error) => {
        console.error("트랜잭션 삭제 실패:", error);
      });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// // Load transactions from AsyncStorage
// useEffect(() => {
//   const loadTransactions = async () => {
//     try {
//       const storedTransactions = await AsyncStorage.getItem("transactions");
//       if (storedTransactions) {
//         setTransactions(JSON.parse(storedTransactions));
//       }
//     } catch (error) {
//       console.error("Failed to load transactions", error);
//     }
//   };

//   loadTransactions();
// }, []);

// // Save transactions to AsyncStorage whenever state changes
// useEffect(() => {
//   const saveTransactions = async () => {
//     try {
//       await AsyncStorage.setItem(
//         "transactions",
//         JSON.stringify(transactions)
//       );
//     } catch (error) {
//       console.error("Failed to save transactions", error);
//     }
//   };

//   if (transactions.length) {
//     saveTransactions();
//   }
// }, [transactions]);

// // Function to delete a transaction
// const deleteTransaction = async (id) => {
//   try {
//     // Filter out the transaction with the specified id
//     const updatedTransactions = transactions.filter(
//       (transaction) => transaction.id !== id
//     );

//     // Save the updated transactions back to AsyncStorage
//     await AsyncStorage.setItem(
//       "transactions",
//       JSON.stringify(updatedTransactions)
//     );

//     // Update the state with the new transactions list
//     setTransactions(updatedTransactions);
//   } catch (error) {
//     console.error("Failed to delete transaction", error);
//   }
// };

//   return (
//     <TransactionContext.Provider
//       value={{ transactions, setTransactions, deleteTransaction }}
//     >
//       {children}
//     </TransactionContext.Provider>
//   );
// };
