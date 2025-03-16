import React, { createContext, useState } from "react";
import { ref, push, onValue, remove } from "firebase/database";
import { database } from "../firebaseConfig"; // Firebase 초기화 파일에서 가져옴
// Create the context
export const TransactionContext = createContext();

// Transaction provider to wrap the app
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // 트랜잭션 불러오기
  const fetchTransactions = (userId) => {
    const transactionsRef = ref(database, `transactions/${userId}`);
    console.log(`Fetching transactions for user: ${userId}`); // 로그 추가

    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("Data fetched successfully:", data); // 데이터 로깅
        const transactionsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTransactions(transactionsArray);
      } else {
        console.log("No transactions found for this user."); // 로그 추가
        setTransactions([]);
      }
    });
  };

  // 트랜잭션 추가
  const addTransaction = (userId, transaction) => {
    const transactionsRef = ref(database, `transactions/${userId}`);
    console.log(`Adding transaction for user: ${userId}`, transaction); // 로그 추가

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
    const transactionRef = ref(database, `transactions/${userId}`);

    remove(transactionRef)
      .then(() => {
        console.log("Transaction deleted successfully."); // 성공 로그
        // 상태 업데이트
        const updatedTransactions = transactions.filter(
          (transaction) => transaction.id !== transactionId
        );
        setTransactions(updatedTransactions);
        console.log(
          `Deleting transaction: ${transactionId} for user: ${userId}`
        ); // 로그 추가
      })
      .catch((error) => {
        console.error("Failed to delete transaction:", error); // 에러 로깅
      });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
