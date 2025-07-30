import React, { useState, useEffect } from 'react';
import "../App.css";

const API_URL = "https://api.aixbt.tech/terminal/projects/xrp/summaries";

const TABS = ["TIMELINE", "MOMENTUM", "THESIS", "INFOS"];

const UserPage = () => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("THESIS"); // Default tab

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("API fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#ffffff" }}>AIXBT Project Explorer</h1>

      {/* TAB BAR */}
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {projects.length === 0 ? (
        <p style={{ color: "#ccc" }}>Loading projects...</p>
      ) : (
        projects.map((project) => (
          <div key={project._id} className="project-card">
            <div className="project-title">{project.name}</div>

            {activeTab === "THESIS" && (
                    <div>
        <p><strong>Bull Case:</strong></p>
        <ul>
          {project.thesis?.bull_case?.split("•").map((point, idx) => (
            point.trim() && <li key={idx}>{point.trim()}</li>
          ))}
        </ul>
      </div>
            )}

            {activeTab === "TIMELINE" && (
              <p style={{ color: "#aaa" }}>Timeline content not implemented yet.</p>
            )}

            {activeTab === "MOMENTUM" && (
              <p style={{ color: "#aaa" }}>Momentum content not implemented yet.</p>
            )}

            {activeTab === "INFOS" && (
              <div>
        <p><strong>Symbol:</strong> {project.coingeckoData?.symbol}</p>
        <p><strong>Score:</strong> {project.popularityScore}</p>
        <p><strong>Analysis:</strong> {project.analysis}</p>
      </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserPage;


