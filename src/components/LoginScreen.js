import React, { useState } from "react";

const LoginScreen = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email] && users[email].password === password) {
      onLogin(users[email]);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const dob = e.target.dob.value;

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const newUser = {
      name,
      email,
      password,
      dateOfBirth: dob,
      allergies: [],
      medicalConditions: "",
      medications: "",
      weight: "",
      height: "",
    };
    users[email] = newUser;
    localStorage.setItem("users", JSON.stringify(users));
    onLogin(newUser);
  };

  return (
    <div
      id="loginScreen"
      className="login-container d-flex align-items-center justify-content-center"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-primary text-white text-center py-4">
                <h3>
                  <i className="fas fa-heartbeat me-2"></i>MedScan
                </h3>
                <p className="mb-0">Medical Allergen Scanner</p>
              </div>
              <div className="card-body p-4">
                <ul className="nav nav-pills nav-justified mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "login" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("login")}
                    >
                      Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "register" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("register")}
                    >
                      Register
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {/* Login Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "login" ? "show active" : ""
                    }`}
                  >
                    <form onSubmit={handleLoginSubmit}>
                      <div className="mb-3">
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        <i className="fas fa-sign-in-alt me-2"></i>Login
                      </button>
                    </form>
                  </div>

                  {/* Register Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "register" ? "show active" : ""
                    }`}
                  >
                    <form onSubmit={handleRegisterSubmit}>
                      <div className="mb-3">
                        <input
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Full Name"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          name="dob"
                          type="date"
                          className="form-control"
                          placeholder="Date of Birth"
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-success w-100">
                        <i className="fas fa-user-plus me-2"></i>Register
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
