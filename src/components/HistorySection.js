import React from "react";

const HistorySection = ({ user }) => {
  // The user's scan history, or an empty array if none exists.
  // We reverse it to show the most recent scans first.
  const history = (user.scanHistory || []).slice().reverse();

  // A helper function to determine the text color based on the health score.
  const getScoreClass = (score) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  return (
    <div id="historySection" className="content-section">
      <div className="card">
        <div className="card-header">
          <h5>
            <i className="fas fa-history me-2"></i>Scan History
          </h5>
        </div>
        <div className="card-body">
          {history.length === 0 ? (
            // Display this message if there's no scan history
            <div className="text-center text-muted py-4">
              <i className="fas fa-history fa-3x mb-3"></i>
              <p>
                No scan history yet. Start scanning products to see them here!
              </p>
            </div>
          ) : (
            // Map over the history array and render a card for each scan
            history.map((scan, index) => (
              <div className="card mb-3" key={scan.timestamp || index}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="card-title mb-1">{scan.product.name}</h6>
                      <p className="text-muted small">
                        {new Date(scan.timestamp).toLocaleString()}
                      </p>
                      <div className="mb-2">
                        {scan.foundAllergens.length > 0 ? (
                          // Display tags for found allergens
                          scan.foundAllergens.map((allergen, i) => (
                            <span
                              key={i}
                              className="allergen-tag allergen-found"
                            >
                              {allergen}
                            </span>
                          ))
                        ) : (
                          // Display a "Safe" tag if no allergens were found
                          <span className="allergen-tag allergen-safe">
                            Safe
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end text-start">
                      <div
                        className={`h4 mb-0 ${getScoreClass(scan.healthScore)}`}
                      >
                        {scan.healthScore}
                      </div>
                      <small className="text-muted">Health Score</small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
