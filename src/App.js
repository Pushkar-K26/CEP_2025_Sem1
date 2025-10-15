import React, { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen.js";
import MainApp from "./components/MainApp.js";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // On initial load, check if a user is saved in localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[updatedUser.email] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
  };

  return (
    <>
      {currentUser ? (
        <MainApp
          user={currentUser}
          onLogout={handleLogout}
          onProfileUpdate={handleProfileUpdate}
        />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
