import React, { useState } from "react";

const ProfileSection = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    dateOfBirth: user.dateOfBirth || "",
    weight: user.weight || "",
    height: user.height || "",
    medicalConditions: user.medicalConditions || "",
    medications: user.medications || "",
    additionalAllergies: user.additionalAllergies || "",
  });

  const [allergies, setAllergies] = useState(user.allergies || []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAllergyChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAllergies((prev) => [...prev, value]);
    } else {
      setAllergies((prev) => prev.filter((allergy) => allergy !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      ...formData,
      allergies,
    };
    onProfileUpdate(updatedUser);
    alert("Profile updated successfully!");
  };

  const commonAllergies = [
    "nuts",
    "dairy",
    "eggs",
    "shellfish",
    "soy",
    "wheat",
    "fish",
    "sesame",
    "sulfites",
  ];

  return (
    <div id="profileSection" className="content-section">
      <div className="card medical-form">
        <div className="card-header">
          <h5>
            <i className="fas fa-user-edit me-2"></i>Medical Profile
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* More form fields like weight, height, etc. would go here */}

            <div className="mb-3">
              <label className="form-label">Known Allergies</label>
              <div className="row">
                {commonAllergies.map((allergy, index) => (
                  <div className="col-md-4" key={allergy}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={allergy}
                        id={`allergy-${index}`}
                        checked={allergies.includes(allergy)}
                        onChange={handleAllergyChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`allergy-${index}`}
                      >
                        {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save me-2"></i>Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
