import React from "react";
import ReactMarkdown from "react-markdown";

const TabContent = ({ activeTab, data }) => {
  if (!data) return null;

  const { score, score_weekly, lastUpdated, analysis, xbio } = data;

  if (activeTab === "TIMELINE") {
    return (
      <div className="tab-content">
        <h3 style={{ color: "#00eaff" }}>📊 Project Score</h3>
        <p><strong>Score:</strong> {score}</p>
        <p><strong>Weekly Score:</strong> {score_weekly}</p>
        <p><strong>Last Updated:</strong> {new Date(lastUpdated).toLocaleString()}</p>
      </div>
    );
  }

  if (activeTab === "THESIS") {
    return (
      <div className="tab-content">
        <h3 style={{ color: "#00eaff" }}>📚 Analysis</h3>
        <ReactMarkdown>{analysis || "No analysis available."}</ReactMarkdown>
      </div>
    );
  }

  if (activeTab === "INFOS") {
    if (!xbio) return <p>No XBio available.</p>;
    const { name, username, description, url, profile_image_url, profile_banner_url, public_metrics } = xbio;

    return (
      <div className="tab-content">
        <h3 style={{ color: "#00eaff" }}>ℹ️ Twitter XBio</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Username:</strong> @{username}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Followers:</strong> {public_metrics.followers_count}</p>
        <p><strong>Following:</strong> {public_metrics.following_count}</p>
        <p><strong>Tweets:</strong> {public_metrics.tweet_count}</p>
        <p><strong>Likes:</strong> {public_metrics.like_count}</p>
        <p>
          <a href={url} target="_blank" rel="noreferrer" style={{ color: "#00eaff" }}>
            🔗 Visit Profile
          </a>
        </p>
        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          {profile_banner_url && (
            <img src={profile_banner_url} alt="Banner" style={{ width: "60%", borderRadius: "8px" }} />
          )}
          {profile_image_url && (
            <img src={profile_image_url} alt="Profile" style={{ width: "100px", borderRadius: "50%" }} />
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default TabContent;
