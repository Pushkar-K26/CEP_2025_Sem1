import React, { useState, useRef, useEffect } from "react";

// Sample product database (in a real app, this would be from an API)
const productDatabase = {
  sample1: {
    name: "Chocolate Chip Cookies",
    ingredients: [
      "wheat flour",
      "sugar",
      "chocolate chips",
      "eggs",
      "butter",
      "vanilla",
    ],
    allergens: ["wheat", "eggs", "dairy"],
    nutritionScore: 65,
  },
  sample2: {
    name: "Almond Milk",
    ingredients: ["almonds", "water", "locust bean gum", "sunflower lecithin"],
    allergens: ["nuts"],
    nutritionScore: 85,
  },
  sample3: {
    name: "Whole Grain Bread",
    ingredients: ["whole wheat flour", "water", "yeast", "salt", "honey"],
    allergens: ["wheat"],
    nutritionScore: 78,
  },
};

const ScannerSection = ({ user, onProfileUpdate }) => {
  const [scanResults, setScanResults] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Effect to clean up camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const resetScanner = () => {
    stopCamera();
    setImagePreview(null);
    setScanResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startCamera = async () => {
    resetScanner();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera not available. Please upload an image instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

      const imageUrl = canvas.toDataURL("image/jpeg");
      setImagePreview(imageUrl);
      processImage(imageUrl);
      stopCamera();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

// ... inside your ScannerSection component

  const processImage = async (imageData) => {
    setIsProcessing(true);
    setScanResults(null);

    // The URL of your new FastAPI endpoint
    const API_URL = "http://127.0.0.1:8000/scan"; // Make sure the port matches your backend

    try {
      // Convert the base64 image data to a Blob
      const imageBlob = dataURLtoBlob(imageData);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", imageBlob, "scan.jpg"); // "file" is the key the API will look for

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData, // No 'Content-Type' header needed, browser sets it for FormData
      });

      if (!response.ok) {
        // Handle server errors (e.g., 500, 404)
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const productData = await response.json();

      // Now that we have the data, we can run the analysis
      analyzeProduct(productData);

    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to analyze the image. Please try again.");
      // You might want to show an error message in the UI
      setScanResults(null);
    } finally {
      // This will run whether the request succeeds or fails
      setIsProcessing(false);
    }
  };

// The rest of your component remains the same...
// (analyzeProduct, generateRecommendations, etc.)

  const analyzeProduct = (product) => {
    const userAllergies = user.allergies || [];
    const productAllergens = product.allergens || [];

    const foundAllergens = productAllergens.filter((allergen) =>
      userAllergies.some(
        (userAllergy) =>
          allergen.toLowerCase().includes(userAllergy.toLowerCase()) ||
          userAllergy.toLowerCase().includes(allergen.toLowerCase())
      )
    );

    let healthScore = product.nutritionScore;
    if (foundAllergens.length > 0) {
      healthScore = Math.max(10, healthScore - foundAllergens.length * 30);
    }

    const recommendations = generateRecommendations(
      foundAllergens,
      healthScore
    );

    setScanResults({
      product: product,
      healthScore: healthScore,
      foundAllergens: foundAllergens,
      timestamp: new Date().toISOString(),
      recommendations: recommendations,
    });
  };

  const generateRecommendations = (foundAllergens, healthScore) => {
    if (foundAllergens.length > 0) {
      return `<strong class="text-danger">Not recommended.</strong> This product contains ${foundAllergens.join(
        ", "
      )}.`;
    } else if (healthScore >= 70) {
      return '<strong class="text-success">Good choice!</strong> Appears safe and has a good nutritional profile.';
    } else if (healthScore >= 40) {
      return '<strong class="text-warning">Moderate choice.</strong> Safe for your allergies but consider the nutritional content.';
    } else {
      return '<strong class="text-danger">Consider alternatives.</strong> While safe, this product has poor nutritional value.';
    }
  };

  const saveToHistory = () => {
    if (scanResults) {
      const updatedHistory = [...(user.scanHistory || []), scanResults];
      const updatedUser = { ...user, scanHistory: updatedHistory };
      onProfileUpdate(updatedUser);
      alert("Scan saved to history!");
    }
  };

  const getScoreClass = (score) => {
    if (score >= 70) return { text: "score-good", bg: "bg-success" };
    if (score >= 40) return { text: "score-warning", bg: "bg-warning" };
    return { text: "score-danger", bg: "bg-danger" };
  };

  const handleDragEvents = (e, isOver) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(isOver);
  };

  const handleDrop = (e) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to convert a data URL to a Blob
const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

  return (
    <div id="scannerSection" className="content-section">
      <div className="card">
        <div className="card-header">
          <h5>
            <i className="fas fa-barcode-read me-2"></i>Product Label Scanner
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <div
                className={`scanner-area d-flex flex-column align-items-center justify-content-center p-3 
                                ${
                                  isCameraActive || imagePreview ? "active" : ""
                                } ${dragOver ? "dragover" : ""}`}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDrop={handleDrop}
              >
                {isProcessing ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="text-muted mt-3">Analyzing Image...</h5>
                  </div>
                ) : (
                  <>
                    {!(isCameraActive || imagePreview) && (
                      <div className="text-center">
                        <i className="fas fa-camera fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted mb-3">
                          Scan or Upload Product Label
                        </h5>
                        <div className="btn-group mb-2">
                          <button
                            className="btn btn-primary"
                            onClick={startCamera}
                          >
                            <i className="fas fa-camera me-2"></i>Use Camera
                          </button>
                          <button
                            className="btn btn-success"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <i className="fas fa-upload me-2"></i>Upload Photo
                          </button>
                        </div>
                        <small className="text-muted d-block">
                          Or drag & drop an image here
                        </small>
                      </div>
                    )}

                    <video
                      ref={videoRef}
                      className={`camera-preview ${
                        !isCameraActive ? "hidden" : ""
                      }`}
                      autoPlay
                      playsInline
                    ></video>

                    {imagePreview && !isCameraActive && (
                      <img
                        src={imagePreview}
                        className="camera-preview"
                        alt="Product Preview"
                      />
                    )}

                    {isCameraActive && (
                      <div className="mt-2">
                        <button
                          className="btn btn-success me-2"
                          onClick={capturePhoto}
                        >
                          <i className="fas fa-camera me-2"></i>Capture
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={stopCamera}
                        >
                          <i className="fas fa-stop me-2"></i>Stop Camera
                        </button>
                      </div>
                    )}

                    {(imagePreview || isCameraActive) && !isProcessing && (
                      <button
                        className="btn btn-outline-secondary btn-sm mt-3"
                        onClick={resetScanner}
                      >
                        <i className="fas fa-sync-alt me-1"></i>Start Over
                      </button>
                    )}
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              {scanResults && (
                <div className="card">
                  <div className="card-header bg-info text-white">
                    <h6>
                      <i className="fas fa-analytics me-2"></i>Scan Results
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-4">
                      <div
                        className={`health-score ${
                          getScoreClass(scanResults.healthScore).text
                        }`}
                      >
                        {scanResults.healthScore}
                      </div>
                      <p className="text-muted mb-1">Health Score</p>
                      <div className="progress">
                        <div
                          className={`progress-bar ${
                            getScoreClass(scanResults.healthScore).bg
                          }`}
                          role="progressbar"
                          style={{ width: `${scanResults.healthScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6>
                        Product:{" "}
                        <span className="fw-normal">
                          {scanResults.product.name}
                        </span>
                      </h6>
                    </div>

                    <div className="mb-3">
                      <h6>Allergen Check:</h6>
                      <div>
                        {scanResults.foundAllergens.length > 0 ? (
                          scanResults.foundAllergens.map((allergen, i) => (
                            <span
                              key={i}
                              className="allergen-tag allergen-found"
                            >
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              {allergen}
                            </span>
                          ))
                        ) : (
                          <span className="allergen-tag allergen-safe">
                            <i className="fas fa-check-circle me-1"></i>Safe for
                            your allergies
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6>Recommendations:</h6>
                      <p
                        className="text-muted"
                        dangerouslySetInnerHTML={{
                          __html: scanResults.recommendations,
                        }}
                      ></p>
                    </div>

                    <button
                      className="btn btn-primary w-100"
                      onClick={saveToHistory}
                    >
                      <i className="fas fa-save me-2"></i>Save to History
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerSection;
