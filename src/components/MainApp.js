import React, { useState } from "react";
import ScannerSection from "./ScannerSection.js";
import ProfileSection from "./ProfileSection.js";
import HistorySection from "./HistorySection.js";

const MainApp = ({ user, onLogout, onProfileUpdate }) => {
  const [activeSection, setActiveSection] = useState("scanner");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection user={user} onProfileUpdate={onProfileUpdate} />;
      case "history":
        return <HistorySection user={user} />;
      case "scanner":
      default:
        return <ScannerSection user={user} onProfileUpdate={onProfileUpdate} />;
    }
  };

  return (
    <div id="mainApp" className="main-app">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="fas fa-heartbeat me-2"></i>MedScan
          </span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, {user.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card profile-card">
              <div className="card-header bg-primary text-white">
                <h5>
                  <i className="fas fa-user-md me-2"></i>Medical Profile
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <i className="fas fa-user-circle fa-4x text-muted"></i>
                  <h6 className="mt-2">{user.name}</h6>
                </div>

                <ul className="nav nav-pills flex-column">
                  <li className="nav-item">
                    <button
                      className={`nav-link w-100 text-start ${
                        activeSection === "scanner" ? "active" : ""
                      }`}
                      onClick={() => setActiveSection("scanner")}
                    >
                      <i className="fas fa-camera me-2"></i>Product Scanner
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link w-100 text-start ${
                        activeSection === "profile" ? "active" : ""
                      }`}
                      onClick={() => setActiveSection("profile")}
                    >
                      <i className="fas fa-user-edit me-2"></i>Edit Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link w-100 text-start ${
                        activeSection === "history" ? "active" : ""
                      }`}
                      onClick={() => setActiveSection("history")}
                    >
                      <i className="fas fa-history me-2"></i>Scan History
                    </button>
                  </li>
                </ul>

                <div className="mt-3">
                  <h6 className="text-muted">Current Allergies:</h6>
                  <div>
                    {user.allergies && user.allergies.length > 0 ? (
                      user.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="allergen-tag allergen-safe"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <small className="text-muted">
                        No allergies recorded
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
