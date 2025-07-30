import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = "https://api.aixbt.tech/terminal/projects/xrp/summaries";
const TABS = ["TIMELINE", "INFOS"];

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(localStorage.getItem("selected_tab") || "TIMELINE");
  const [loadingExtra, setLoadingExtra] = useState(false);
  const [extraMessage, setExtraMessage] = useState(null); // null initially
  const [loadedIds, setLoadedIds] = useState(new Set());

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error: " + res.status);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoadedIds(new Set(Object.keys(json.dates || {})));
      })
      .catch(() => setError("Failed to load data"));
  }, []);

  const handleLoadExtra = () => {
    setLoadingExtra(true);
    setExtraMessage(null); // Clear previous message on new click

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error: " + res.status);
        return res.json();
      })
      .then((newJson) => {
        const newIds = Object.keys(newJson.dates || {});
        const currentIds = loadedIds;
        const freshItems = newIds.filter(id => !currentIds.has(id));

        if (freshItems.length > 0) {
          setData(newJson);
          setLoadedIds(new Set(newIds));
          setExtraMessage("✅ Loaded new tweets");
        } else {
          setExtraMessage("❌ No new tweets available");
        }
      })
      .catch(() => setExtraMessage("❌ Failed to fetch new tweets"))
      .finally(() => setLoadingExtra(false));
  };

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>Loading data...</div>;

  const dateEntries = Object.entries(data.dates || {}).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="container">
      <h1 className="title">🚀 XRP Project Explorer</h1>

      <div className="tabs" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              localStorage.setItem("selected_tab", tab);
            }}
          >
            {tab}
          </button>
        ))}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={handleLoadExtra}
            disabled={loadingExtra}
            className="tab-button"
          >
            {loadingExtra ? "🔄 Loading..." : "📥New Tweets"}
          </button>
          {extraMessage !== null && (
            <span style={{ marginTop: "5px", fontWeight: "bold", color: "#ccc" }}>
              {extraMessage} 
            </span>
          )}
        </div>
      </div>

      {activeTab === "TIMELINE" && (
        <div className="timeline">
          {dateEntries.length > 0 ? (
            dateEntries.map(([timestamp, entry]) => (
              <div key={timestamp} className="card">
                <div className="date-left">
                  <small>{new Date(timestamp).toLocaleString()}</small>
                </div>
                <p>Description: {entry.description}</p>

                {entry.tweets?.map((t, i) => {
                  const tweetId = t.id_str || t.id || t._id;
                  const tweetUrl =
                    tweetId && t.screen_name
                      ? `https://twitter.com/${t.screen_name}/status/${tweetId}`
                      : `https://twitter.com/${t.screen_name || ""}`;

                  return (
                    <div key={i} className="tweet">
                      <img src={t.avatar} alt="avatar" />
                      <div>
                        <strong>{t.name}</strong> @{t.screen_name}
                        <p>Followers: {t.followers_count}</p>
                        <a
                          href={tweetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🔗 View Tweet
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <p>No timeline data available.</p>
          )}
        </div>
      )}

      {activeTab === "INFOS" && (
        <div className="card">
          <h3>Project Info</h3>
          <p><strong>Score:</strong> {data.score}</p>
          <p><strong>Updated:</strong> {new Date(data.lastUpdated).toLocaleString()}</p>

          <h4>🧠 Analysis</h4>
          <ReactMarkdown>{data.analysis}</ReactMarkdown>

          <h4>🐦 X‑Bio Info</h4>
          <p><strong>Name:</strong> {data.xbio?.name}</p>
          <p><strong>Username:</strong> @{data.xbio?.username}</p>
          <p><strong>Description:</strong> {data.xbio?.description}</p>
          <p><strong>Followers:</strong> {data.xbio?.public_metrics?.followers_count}</p>

          {data.xbio?.profile_image_url && (
            <img
              src={data.xbio.profile_image_url}
              alt="Profile"
              className="profile-img"
            />
          )}
        </div>
      )}
    </div>
  );
}




