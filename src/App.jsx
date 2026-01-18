import React, { useEffect, useState, useRef } from 'react';
import {
  FaSun, FaMoon, FaInstagram, FaUserFriends, FaUserCheck,
  FaUserTimes, FaUserClock, FaLink, FaExclamationTriangle, FaHourglassHalf,
  FaUserSlash, FaUserPlus
} from 'react-icons/fa';
import './App.css';

// Import new data files directly
import searchHistoryData from './assets/instagram-rahilshah3105-2026-01-17-84BOgrxs/logged_information/recent_searches/profile_searches.json';
import adsViewedData from './assets/instagram-rahilshah3105-2026-01-17-84BOgrxs/ads_information/ads_and_topics/ads_viewed.json';
import loginActivityData from './assets/instagram-rahilshah3105-2026-01-17-84BOgrxs/security_and_login_information/login_and_profile_creation/login_activity.json';

function App() {
  const [notFollowingBack, setNotFollowingBack] = useState([]);
  const [youDontFollowBack, setYouDontFollowBack] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [adsViewed, setAdsViewed] = useState([]);
  const [loginActivity, setLoginActivity] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showFollowers, setShowFollowers] = useState(true);
  const [showFollowing, setShowFollowing] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showReceived, setShowReceived] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [unfollowedData, setUnfollowedData] = useState(null);
  const [blockedData, setBlockedData] = useState(null);
  const [receivedRequestsData, setReceivedRequestsData] = useState(null);

  // Refs for scrolling
  const followersRef = useRef(null);
  const followingRef = useRef(null);
  const notFollowingBackRef = useRef(null);
  const youDontFollowBackRef = useRef(null);
  const pendingRef = useRef(null);
  const blockedRef = useRef(null);
  const receivedRef = useRef(null);
  const searchRef = useRef(null);
  const adsRef = useRef(null);
  const loginRef = useRef(null);

  const scrollToSection = (ref, setShowState) => {
    if (setShowState) setShowState(true);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Load data with error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setDataError(null);

        // Try to load data files from public directory
        let followersData, followingData, pendingData;
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

        }

        try {
          const followingResponse = await fetch('./src/assets/followers_and_following/following.json');
          if (followingResponse.ok) {
            followingData = await followingResponse.json();
            setFollowingData(followingData);
            hasFollowing = true;
          }
        } catch (e) {

        }

        try {
          const pendingResponse = await fetch('./src/assets/followers_and_following/recent_follow_requests.json');
          if (pendingResponse.ok) {
            pendingData = await pendingResponse.json();
            setPendingData(pendingData);
          }
        } catch (e) {
          console.error('Error loading pending data:', e);
        }

        try {
          const unfollowedResponse = await fetch('./src/assets/followers_and_following/recently_unfollowed_profiles.json');
          if (unfollowedResponse.ok) {
            const unfollowedData = await unfollowedResponse.json();
            setUnfollowedData(unfollowedData);
          }
        } catch (e) {

        }

        try {
          const blockedResponse = await fetch('./src/assets/followers_and_following/blocked_profiles.json');
          if (blockedResponse.ok) {
            const blockedData = await blockedResponse.json();
            setBlockedData(blockedData);
          }
        } catch (e) {
          // Optional file
        }

        try {
          const receivedResponse = await fetch("./src/assets/followers_and_following/follow_requests_you've_received.json");
          if (receivedResponse.ok) {
            const receivedData = await receivedResponse.json();
            setReceivedRequestsData(receivedData);
          }
        } catch (e) {
          // Optional file
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
      const following = extractFollowing(followingData, unfollowedData);

      const rawPending = extractPendingRequests(pendingData);
      const blocked = extractBlockedUsers(blockedData);
      const received = extractReceivedRequests(receivedRequestsData);
      const searches = extractSearchHistory(searchHistoryData);
      const ads = extractAdsViewed(adsViewedData);
      const logins = extractLoginActivity(loginActivityData);


      // Extract unfollowed usernames for filtering
      const unfollowedUsernames = new Set();
      if (unfollowedData && unfollowedData.relationships_unfollowed_users) {
        unfollowedData.relationships_unfollowed_users.forEach((item) => {
          if (item.string_list_data && Array.isArray(item.string_list_data)) {
            item.string_list_data.forEach((user) => {
              if (user.value) {
                unfollowedUsernames.add(user.value.toLowerCase().trim());
              }
            });
          }
        });
      }

      // Create set of following usernames for filtering
      const followingUsernames = new Set(
        following.map(f => f.username.toLowerCase().trim())
      );

      // Filter pending requests: exclude those in unfollowed list AND those already followed
      const actualPending = rawPending.filter((request) => {
        const username = request.username.toLowerCase().trim();
        return !unfollowedUsernames.has(username) && !followingUsernames.has(username);
      });

      setPendingRequests(actualPending);
      setBlockedUsers(blocked);
      setReceivedRequests(received);
      setSearchHistory(searches);
      setAdsViewed(ads);
      setLoginActivity(logins);
      findUniqueRelationships(followers, following);
      detectOwnerProfile(followersData, followingData);
    } catch (error) {

      setDataError(error.message);
    }
  }, [followersData, followingData, pendingData, unfollowedData, blockedData, receivedRequestsData]);

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
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          followers.push({
            username: user.value,
            href: user.href,
            timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null,
            isPrivate: item.title && item.title.includes('Private'),
            isVerified: item.title && item.title.includes('Verified')
          });
        });
      }
    });
    return followers;
  };

  // Extract following data
  const extractFollowing = (data, unfollowedData) => {
    if (!data || !data.relationships_following) return [];

    // Extract unfollowed usernames to filter them out
    const unfollowedUsernames = new Set();
    if (unfollowedData && unfollowedData.relationships_unfollowed_users) {
      unfollowedData.relationships_unfollowed_users.forEach((item) => {
        if (item.string_list_data && Array.isArray(item.string_list_data)) {
          item.string_list_data.forEach((user) => {
            if (user.value) {
              unfollowedUsernames.add(user.value.toLowerCase().trim());
            }
          });
        }
      });
    }


    const following = [];
    data.relationships_following.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        const userData = item.string_list_data[0];
        const username = userData.value || item.title; // Use value from data, fallback to title

        // Filter out invalid users
        if (!username || username === 'Instagram User') {
          return;
        }

        // Skip if this account has been unfollowed
        if (unfollowedUsernames.has(username.toLowerCase().trim())) {
          return;
        }

        // List of known "ghost" users (profiles that don't exist but appear in data)
        const GHOST_USERS = new Set([
          '_narendra1_1',
          'chaityashah198',
          'armylo38',
          'themeetz'
        ]);

        if (GHOST_USERS.has(username.toLowerCase().trim())) {
          return; // Skip ghost users
        }

        if (userData && username) {
          // Always construct proper Instagram URL from username
          const properHref = `https://www.instagram.com/${username}/`;

          following.push({
            username: username,
            href: properHref,
            timestamp: userData.timestamp ? new Date(userData.timestamp * 1000) : null,
            isPrivate: false,
            isVerified: false
          });
        }
      }
    });

    following.slice(0, 5).forEach((f, i) => {
    });

    return following;
  };

  // Extract pending follow requests
  const extractPendingRequests = (data) => {
    if (!data || !data.relationships_permanent_follow_requests) return [];
    const pending = [];
    data.relationships_permanent_follow_requests.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          pending.push({
            username: user.value,
            href: user.href,
            timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null
          });
        });
      }
    });
    return pending;
  };

  // Extract blocked users
  const extractBlockedUsers = (data) => {
    if (!data || !data.relationships_blocked_users) return [];
    const blocked = [];
    data.relationships_blocked_users.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          blocked.push({
            username: user.value || item.title,
            href: user.href,
            timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null
          });
        });
      }
    });
    return blocked;
  };

  // Extract received follow requests
  const extractReceivedRequests = (data) => {
    if (!data || !data.relationships_follow_requests_received) return [];
    const received = [];
    data.relationships_follow_requests_received.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          received.push({
            username: user.value,
            href: user.href,
            timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null
          });
        });
      }
    });
    return received;
  };

  // Extract search history
  const extractSearchHistory = (data) => {
    if (!data || !data.searches_user) return [];
    const searches = [];
    data.searches_user.forEach((item) => {
      if (item.string_map_data && item.string_map_data['Search']) {
        searches.push({
          title: item.string_map_data['Search'].value,
          timestamp: item.string_map_data['Time'] ? new Date(item.string_map_data['Time'].timestamp * 1000) : null
        });
      } else if (item.title) {
        searches.push({
          title: item.title,
          timestamp: item.string_list_data && item.string_list_data[0] ? new Date(item.string_list_data[0].timestamp * 1000) : null
        });
      }
    });
    return searches;
  };

  // Extract ads viewed
  const extractAdsViewed = (data) => {
    if (!data || !data.impressions_history_ads_seen) return [];
    const ads = [];
    data.impressions_history_ads_seen.forEach((item) => {
      if (item.string_map_data && item.string_map_data['Author']) {
        ads.push({
          author: item.string_map_data['Author'].value,
          timestamp: item.string_map_data['Time'] ? new Date(item.string_map_data['Time'].timestamp * 1000) : null
        });
      }
    });
    return ads;
  };

  // Extract login activity
  const extractLoginActivity = (data) => {
    if (!data || !data.account_history_login_history) return [];
    const logins = [];
    data.account_history_login_history.forEach((item) => {
      if (item.string_map_data) {
        logins.push({
          cookie: item.string_map_data['Cookie'] ? item.string_map_data['Cookie'].value : 'Unknown',
          ip: item.string_map_data['IP Address'] ? item.string_map_data['IP Address'].value : 'Unknown',
          userAgent: item.string_map_data['User Agent'] ? item.string_map_data['User Agent'].value : 'Unknown',
          timestamp: item.string_map_data['Time'] ? new Date(item.string_map_data['Time'].timestamp * 1000) : null
        });
      }
    });
    return logins;
  };

  // Find non-reciprocal relationships
  const findUniqueRelationships = (followers, following) => {

    // Create username sets for efficient lookup (case-insensitive and trimmed)
    const followerUsernames = new Set(
      followers.map(f => f.username.toLowerCase().trim())
    );
    const followingUsernames = new Set(
      following.map(f => f.username.toLowerCase().trim())
    );


    // Debug: Show sample of sets

    // You Don't Follow Back: People who are in FOLLOWERS but NOT in FOLLOWING
    // These are people who follow you, but you haven't followed them back
    const youDontFollowBack = followers.filter((follower) => {
      const username = follower.username.toLowerCase().trim();
      // Check if this follower is NOT in your following list
      return !followingUsernames.has(username);
    });
    setYouDontFollowBack(youDontFollowBack);

    // People you follow who don't follow you back  
    // (They are in following but NOT in followers)
    const notFollowingBack = following.filter(
      (follow) => !followerUsernames.has(follow.username.toLowerCase().trim())
    );
    setNotFollowingBack(notFollowingBack);


    // Enhanced debugging: Check first 20 people you follow
    following.slice(0, 20).forEach((person, idx) => {
      const username = person.username.toLowerCase().trim();
      const isFollowingBack = followerUsernames.has(username);
    });

    // Cross-check: Sample followers to see if they're in following
    followers.slice(0, 10).forEach((person, idx) => {
      const username = person.username.toLowerCase().trim();
      const youFollowThem = followingUsernames.has(username);
    });
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
  const following = extractFollowing(followingData, unfollowedData);

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
          <div className="summary-card" onClick={() => scrollToSection(followersRef, setShowFollowers)}>
            <div className="card-icon followers">
              <FaUserFriends />
            </div>
            <div className="card-content">
              <h3>Followers</h3>
              <p>{followers.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(followingRef, setShowFollowing)}>
            <div className="card-icon following">
              <FaUserCheck />
            </div>
            <div className="card-content">
              <h3>Following</h3>
              <p>{following.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(notFollowingBackRef)}>
            <div className="card-icon not-following-back">
              <FaUserTimes />
            </div>
            <div className="card-content">
              <h3>They Don't Follow Back</h3>
              <p>{notFollowingBack.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(youDontFollowBackRef)}>
            <div className="card-icon not-followed-back">
              <FaUserClock />
            </div>
            <div className="card-content">
              <h3>You Don't Follow Back</h3>
              <p>{youDontFollowBack.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(pendingRef, setShowPending)}>
            <div className="card-icon pending">
              <FaHourglassHalf />
            </div>
            <div className="card-content">
              <h3>Pending Requests</h3>
              <p>{pendingRequests.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(blockedRef, setShowBlocked)}>
            <div className="card-icon blocked">
              <FaUserSlash />
            </div>
            <div className="card-content">
              <h3>Blocked</h3>
              <p>{blockedUsers.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(receivedRef, setShowReceived)}>
            <div className="card-icon received">
              <FaUserPlus />
            </div>
            <div className="card-content">
              <h3>Received Requests</h3>
              <p>{receivedRequests.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(searchRef, setShowSearch)}>
            <div className="card-icon search">
              <FaUserFriends /> {/* Placeholder icon, maybe change later */}
            </div>
            <div className="card-content">
              <h3>Search History</h3>
              <p>{searchHistory.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(adsRef, setShowAds)}>
            <div className="card-icon ads">
              <FaExclamationTriangle /> {/* Placeholder icon */}
            </div>
            <div className="card-content">
              <h3>Ads Viewed</h3>
              <p>{adsViewed.length}</p>
            </div>
          </div>
          <div className="summary-card" onClick={() => scrollToSection(loginRef, setShowLogin)}>
            <div className="card-icon login">
              <FaUserCheck /> {/* Placeholder icon */}
            </div>
            <div className="card-content">
              <h3>Login Activity</h3>
              <p>{loginActivity.length}</p>
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
          <button
            onClick={() => setShowPending(!showPending)}
            className={`toggle-btn ${showPending ? 'active' : ''}`}
          >
            {showPending ? 'Hide' : 'Show'} Pending Requests
          </button>
          <button
            onClick={() => setShowBlocked(!showBlocked)}
            className={`toggle-btn ${showBlocked ? 'active' : ''}`}
          >
            {showBlocked ? 'Hide' : 'Show'} Blocked
          </button>
          <button
            onClick={() => setShowReceived(!showReceived)}
            className={`toggle-btn ${showReceived ? 'active' : ''}`}
          >
            {showReceived ? 'Hide' : 'Show'} Received Requests
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`toggle-btn ${showSearch ? 'active' : ''}`}
          >
            {showSearch ? 'Hide' : 'Show'} Search History
          </button>
          <button
            onClick={() => setShowAds(!showAds)}
            className={`toggle-btn ${showAds ? 'active' : ''}`}
          >
            {showAds ? 'Hide' : 'Show'} Ads Viewed
          </button>
          <button
            onClick={() => setShowLogin(!showLogin)}
            className={`toggle-btn ${showLogin ? 'active' : ''}`}
          >
            {showLogin ? 'Hide' : 'Show'} Login Activity
          </button>
        </div>

        {/* Followers Table */}
        {showFollowers && (
          <div className="table-container" ref={followersRef}>
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
          <div className="table-container" ref={followingRef}>
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

        {/* Pending Requests Table */}
        {showPending && (
          <div className="table-container highlight-box pending-box" ref={pendingRef}>
            <h2 className="table-title">
              <FaHourglassHalf /> Pending Follow Requests ({pendingRequests.length})
            </h2>
            {pendingRequests.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Profile</th>
                      <th>Requested On</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="username-cell">
                            {user.username}
                          </div>
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
            ) : (
              <p className="no-results">No pending follow requests ✓</p>
            )}
          </div>
        )}

        {/* Blocked Users Table */}
        {showBlocked && (
          <div className="table-container highlight-box blocked-box" ref={blockedRef}>
            <h2 className="table-title">
              <FaUserSlash /> Blocked Users ({blockedUsers.length})
            </h2>
            {blockedUsers.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Profile</th>
                      <th>Blocked On</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="username-cell">
                            {user.username}
                          </div>
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
            ) : (
              <p className="no-results">No blocked users 🕊️</p>
            )}
          </div>
        )}

        {/* Received Requests Table */}
        {showReceived && (
          <div className="table-container highlight-box received-box" ref={receivedRef}>
            <h2 className="table-title">
              <FaUserPlus /> Received Follow Requests ({receivedRequests.length})
            </h2>
            {receivedRequests.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Profile</th>
                      <th>Requested On</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivedRequests.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="username-cell">
                            {user.username}
                          </div>
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
            ) : (
              <p className="no-results">No received follow requests</p>
            )}
          </div>
        )}

        {/* Non-reciprocal Relationships - Side by Side */}
        <div className="non-reciprocal-container">
          {/* You Don't Follow Back */}
          <div className="table-container highlight-box" ref={youDontFollowBackRef}>
            <h2 className="table-title">
              <FaUserClock /> You Don't Follow Back ({youDontFollowBack.length})
            </h2>
            {youDontFollowBack.length > 0 ? (
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
                    {youDontFollowBack.map((user, index) => (
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

          {/* They Don't Follow Back */}
          <div className="table-container highlight-box" ref={notFollowingBackRef}>
            <h2 className="table-title">
              <FaUserTimes /> They Don't Follow Back ({notFollowingBack.length})
            </h2>
            {notFollowingBack.length > 0 ? (
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
                    {notFollowingBack.map((user, index) => (
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
              <p className="no-results">Everyone you follow is following you back! 🎉</p>
            )}
          </div>
        </div>

        {/* Search History Table */}
        {showSearch && (
          <div className="table-container highlight-box search-box" ref={searchRef}>
            <h2 className="table-title">
              <FaUserFriends /> Search History ({searchHistory.length})
            </h2>
            {searchHistory.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Search Term</th>
                      <th>Time</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchHistory.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{formatDate(item.timestamp)}</td>
                        <td>{timeSinceFollow(item.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-results">No search history found</p>
            )}
          </div>
        )}

        {/* Ads Viewed Table */}
        {showAds && (
          <div className="table-container highlight-box ads-box" ref={adsRef}>
            <h2 className="table-title">
              <FaExclamationTriangle /> Ads Viewed ({adsViewed.length})
            </h2>
            {adsViewed.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Advertiser</th>
                      <th>Time</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adsViewed.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.author}</td>
                        <td>{formatDate(item.timestamp)}</td>
                        <td>{timeSinceFollow(item.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-results">No ads viewing history found</p>
            )}
          </div>
        )}

        {/* Login Activity Table */}
        {showLogin && (
          <div className="table-container highlight-box login-box" ref={loginRef}>
            <h2 className="table-title">
              <FaUserCheck /> Login Activity ({loginActivity.length})
            </h2>
            {loginActivity.length > 0 ? (
              <div className="table-scroll">
                <table className="connections-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>IP Address</th>
                      <th>User Agent</th>
                      <th>Time</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginActivity.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.ip}</td>
                        <td>
                          <div className="user-agent-cell" title={item.userAgent}>
                            {item.userAgent.substring(0, 50)}...
                          </div>
                        </td>
                        <td>{formatDate(item.timestamp)}</td>
                        <td>{timeSinceFollow(item.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-results">No login activity found</p>
            )}
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>Instagram Connections Analyzer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
