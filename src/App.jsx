import React, { useEffect, useState } from 'react';
import {
  FaSun, FaMoon, FaInstagram, FaUserFriends, FaUserCheck,
  FaUserTimes, FaUserClock, FaLink, FaExclamationTriangle
} from 'react-icons/fa';
import './App.css';

function App() {
  const [uniqueFollowers, setUniqueFollowers] = useState([]);
  const [uniqueFollowing, setUniqueFollowing] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showFollowers, setShowFollowers] = useState(true);
  const [showFollowing, setShowFollowing] = useState(true);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);

  // Load data with error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setDataError(null);

        // Try to load data files from public directory
        let followersData, followingData;
        let hasFollowers = false;
        let hasFollowing = false;

        try {
          const followersResponse = await fetch('./src/assets/followers_and_following/followers_1.json');
          if (followersResponse.ok) {
            followersData = await followersResponse.json();
            setFollowersData(followersData);
            hasFollowers = true;
          }
        } catch (e) {
          console.error('Followers file not found:', e.message);
        }

        try {
          const followingResponse = await fetch('./src/assets/followers_and_following/following.json');
          if (followingResponse.ok) {
            followingData = await followingResponse.json();
            setFollowingData(followingData);
            hasFollowing = true;
          }
        } catch (e) {
          console.error('Following file not found:', e.message);
        }

        if (!hasFollowers && !hasFollowing) {
          throw new Error('Instagram data files not found. Please add your data files to the public folder.');
        }

      } catch (error) {
        setDataError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Process data when loaded
  useEffect(() => {
    if (!followersData && !followingData) return;

    try {
      const followers = extractFollowers(followersData);
      const following = extractFollowing(followingData);
      findUniqueRelationships(followers, following);
      detectOwnerProfile(followersData, followingData);
    } catch (error) {
      setDataError(error.message);
    }
  }, [followersData, followingData]);

  // Detect owner profile
  const detectOwnerProfile = (followers, following) => {
    // Try from followers data
    if (followers && followers.length > 0 && followers[0].title) {
      const ownerData = followers.find(item =>
        item.string_list_data && item.string_list_data.some(data =>
          data.value && data.href && item.title.includes("'s followers")
        )
      );

      if (ownerData) {
        const title = ownerData.title;
        const username = title.replace("'s followers", "").trim();
        const profileUrl = `https://www.instagram.com/${username}/`;
        setOwnerProfile({ username, profileUrl });
        return;
      }
    }

    // Try from following data
    if (following && following.relationships_following) {
      const followingList = following.relationships_following;
      if (followingList.length > 0 && followingList[0].title) {
        const ownerData = followingList.find(item =>
          item.string_list_data && item.string_list_data.some(data =>
            data.value && data.href && item.title.includes("'s following")
          )
        );

        if (ownerData) {
          const title = ownerData.title;
          const username = title.replace("'s following", "").trim();
          const profileUrl = `https://www.instagram.com/${username}/`;
          setOwnerProfile({ username, profileUrl });
        }
      }
    }
  };

  // Extract followers data
  const extractFollowers = (data) => {
    if (!data || !Array.isArray(data)) return [];
    const followers = [];
    data.forEach((item) => {
      if (item.string_list_data) {
        item.string_list_data.forEach((data) => {
          followers.push({
            username: data.value,
            href: data.href,
            timestamp: data.timestamp ? new Date(data.timestamp * 1000) : null,
            isPrivate: item.title && item.title.includes('Private'),
            isVerified: item.title && item.title.includes('Verified')
          });
        });
      }
    });
    return followers;
  };

  // Extract following data
  const extractFollowing = (data) => {
    if (!data || !data.relationships_following) return [];
    const following = [];
    data.relationships_following.forEach((item) => {
      if (item.string_list_data) {
        item.string_list_data.forEach((data) => {
          following.push({
            username: data.value,
            href: data.href,
            timestamp: data.timestamp ? new Date(data.timestamp * 1000) : null,
            isPrivate: item.title && item.title.includes('Private'),
            isVerified: item.title && item.title.includes('Verified')
          });
        });
      }
    });
    return following;
  };

  // Find non-reciprocal relationships
  const findUniqueRelationships = (followers, following) => {
    const uniqueFollowers = followers.filter(
      (follower) => !following.some((follow) => follow.username === follower.username)
    );
    setUniqueFollowers(uniqueFollowers);

    const uniqueFollowing = following.filter(
      (follow) => !followers.some((follower) => follower.username === follow.username)
    );
    setUniqueFollowing(uniqueFollowing);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate time since follow
  const timeSinceFollow = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return 'Today';
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  // Set dark mode based on preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  if (isLoading) {
    return (
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your Instagram data...</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <header className="app-header">
          <div className="header-content">
            <div className="logo-container">
              <FaInstagram className="logo-icon" />
              <h1>Instagram Connections Analyzer</h1>
            </div>
          </div>
        </header>
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <h2>Data Not Found</h2>
          <p>Please make sure you've added your Instagram data:</p>
          <ol className="instructions">
            <li>Put your JSON files in: <code>src/assets/followers_and_following/</code></li>
            <li>Place below files in above directory:
              <ul>
                <li><code>followers_1.json</code></li>
                <li><code>following.json</code></li>
              </ul>
            </li>
            <li>Refresh/Restart the app</li>
          </ol>
          <p>Get your data from Instagram Settings → Account Center → Information and Data → Download Data</p>
        </div>
      </div>
    );
  }

  const followers = extractFollowers(followersData);
  const following = extractFollowing(followingData);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <FaInstagram className="logo-icon" />
            <h1>Instagram Connections Analyzer</h1>
          </div>
          <div className="header-right">
            {ownerProfile && (
              <a
                href={ownerProfile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="owner-profile-link"
              >
                <FaLink /> {ownerProfile.username}
              </a>
            )}
            <button onClick={toggleDarkMode} className="theme-toggle">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
        <p className="subtitle">Discover who's not following you back and more</p>
      </header>

      <div className="dashboard-container">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon followers">
              <FaUserFriends />
            </div>
            <div className="card-content">
              <h3>Followers</h3>
              <p>{followers.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon following">
              <FaUserCheck />
            </div>
            <div className="card-content">
              <h3>Following</h3>
              <p>{following.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon not-following-back">
              <FaUserTimes />
            </div>
            <div className="card-content">
              <h3>Not Following Back</h3>
              <p>{uniqueFollowing.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon not-followed-back">
              <FaUserClock />
            </div>
            <div className="card-content">
              <h3>You Don't Follow Back</h3>
              <p>{uniqueFollowers.length}</p>
            </div>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            onClick={() => setShowFollowers(!showFollowers)}
            className={`toggle-btn ${showFollowers ? 'active' : ''}`}
          >
            {showFollowers ? 'Hide' : 'Show'} Followers
          </button>
          <button
            onClick={() => setShowFollowing(!showFollowing)}
            className={`toggle-btn ${showFollowing ? 'active' : ''}`}
          >
            {showFollowing ? 'Hide' : 'Show'} Following
          </button>
        </div>

        {/* Followers Table */}
        {showFollowers && (
          <div className="table-container">
            <h2 className="table-title">
              <FaUserFriends /> Your Followers ({followers.length})
            </h2>
            <div className="table-scroll">
              <table className="connections-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Profile</th>
                    <th>Followed On</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {followers.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="username-cell">
                          {user.username}
                          {user.isVerified && <span className="verified-badge">✓</span>}
                        </div>
                      </td>
                      <td>
                        {user.isPrivate ? (
                          <span className="private-badge">Private</span>
                        ) : (
                          <span className="public-badge">Public</span>
                        )}
                      </td>
                      <td>
                        <a href={user.href} target="_blank" rel="noopener noreferrer" className="profile-link">
                          Visit Profile
                        </a>
                      </td>
                      <td>{formatDate(user.timestamp)}</td>
                      <td>{timeSinceFollow(user.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Following Table */}
        {showFollowing && (
          <div className="table-container">
            <h2 className="table-title">
              <FaUserCheck /> Your Following ({following.length})
            </h2>
            <div className="table-scroll">
              <table className="connections-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Profile</th>
                    <th>Followed On</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {following.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="username-cell">
                          {user.username}
                          {user.isVerified && <span className="verified-badge">✓</span>}
                        </div>
                      </td>
                      <td>
                        {user.isPrivate ? (
                          <span className="private-badge">Private</span>
                        ) : (
                          <span className="public-badge">Public</span>
                        )}
                      </td>
                      <td>
                        <a href={user.href} target="_blank" rel="noopener noreferrer" className="profile-link">
                          Visit Profile
                        </a>
                      </td>
                      <td>{formatDate(user.timestamp)}</td>
                      <td>{timeSinceFollow(user.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Non-reciprocal Relationships - Side by Side */}
        <div className="non-reciprocal-container">
          {/* You Don't Follow Back */}
          <div className="table-container highlight-box">
            <h2 className="table-title">
              <FaUserTimes /> You Don't Follow Back ({uniqueFollowers.length})
            </h2>
            {uniqueFollowers.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Status</th>
                      <th>Profile</th>
                      <th>Followed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueFollowers.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="username-cell">
                            {user.username}
                            {user.isVerified && <span className="verified-badge">✓</span>}
                          </div>
                        </td>
                        <td>
                          {user.isPrivate ? (
                            <span className="private-badge">Private</span>
                          ) : (
                            <span className="public-badge">Public</span>
                          )}
                        </td>
                        <td>
                          <a href={user.href} target="_blank" rel="noopener noreferrer" className="profile-link">
                            Visit Profile
                          </a>
                        </td>
                        <td>{formatDate(user.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-results">All your followers are following you back! 🎉</p>
            )}
          </div>

          {/* They Don't Follow Back */}
          <div className="table-container highlight-box">
            <h2 className="table-title">
              <FaUserClock /> They Don't Follow Back ({uniqueFollowing.length})
            </h2>
            {uniqueFollowing.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Status</th>
                      <th>Profile</th>
                      <th>Followed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueFollowing.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="username-cell">
                            {user.username}
                            {user.isVerified && <span className="verified-badge">✓</span>}
                          </div>
                        </td>
                        <td>
                          {user.isPrivate ? (
                            <span className="private-badge">Private</span>
                          ) : (
                            <span className="public-badge">Public</span>
                          )}
                        </td>
                        <td>
                          <a href={user.href} target="_blank" rel="noopener noreferrer" className="profile-link">
                            Visit Profile
                          </a>
                        </td>
                        <td>{formatDate(user.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-results">You follow back all your followers! 🤝</p>
            )}
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>Instagram Connections Analyzer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;