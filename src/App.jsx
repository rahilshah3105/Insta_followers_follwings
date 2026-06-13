import React, { useEffect, useState, useRef } from 'react';
import {
  FaSun, FaMoon, FaInstagram, FaUserFriends, FaUserCheck,
  FaUserTimes, FaUserClock, FaLink, FaExclamationTriangle, FaHourglassHalf,
  FaUserSlash, FaUserPlus, FaUpload, FaSearch, FaTrashAlt
} from 'react-icons/fa';
import './App.css';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Raw uploaded data states
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [unfollowedData, setUnfollowedData] = useState(null);
  const [blockedData, setBlockedData] = useState(null);
  const [receivedRequestsData, setReceivedRequestsData] = useState(null);
  const [searchHistoryData, setSearchHistoryData] = useState(null);
  const [adsViewedData, setAdsViewedData] = useState(null);
  const [loginActivityData, setLoginActivityData] = useState(null);
  const [isUsingUploadedData, setIsUsingUploadedData] = useState(false);

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

  // Local Storage Helpers
  const saveToLocalStorage = (key, data) => {
    if (data) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.removeItem(key);
    }
  };

  const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error parsing localStorage key:', key, e);
      return null;
    }
  };

  // Load default data files from disk/public directory
  const loadDefaultData = async () => {
    try {
      setIsLoading(true);
      setDataError(null);

      let hasFollowers = false;
      let hasFollowing = false;

      // Try fetching followers
      try {
        const res = await fetch('./src/assets/followers_and_following/followers_1.json');
        if (res.ok) {
          const parsed = await res.json();
          setFollowersData(parsed);
          hasFollowers = true;
        }
      } catch (e) {
        console.warn('Could not load default followers_1.json', e);
      }

      // Try fetching following
      try {
        const res = await fetch('./src/assets/followers_and_following/following.json');
        if (res.ok) {
          const parsed = await res.json();
          setFollowingData(parsed);
          hasFollowing = true;
        }
      } catch (e) {
        console.warn('Could not load default following.json', e);
      }

      // Try fetching pending requests
      try {
        const res = await fetch('./src/assets/followers_and_following/recent_follow_requests.json');
        if (res.ok) setPendingData(await res.json());
      } catch (e) {}

      // Try fetching unfollowed users
      try {
        const res = await fetch('./src/assets/followers_and_following/recently_unfollowed_profiles.json');
        if (res.ok) setUnfollowedData(await res.json());
      } catch (e) {}

      // Try fetching blocked profiles
      try {
        const res = await fetch('./src/assets/followers_and_following/blocked_profiles.json');
        if (res.ok) setBlockedData(await res.json());
      } catch (e) {}

      // Try fetching received requests
      try {
        const res = await fetch("./src/assets/followers_and_following/follow_requests_you've_received.json");
        if (res.ok) setReceivedRequestsData(await res.json());
      } catch (e) {}

      if (hasFollowers || hasFollowing) {
        setIsUsingUploadedData(false);
      }
    } catch (error) {
      console.error('Error loading default data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial mount: load localStorage or fall back to defaults
  useEffect(() => {
    const loadInitialData = async () => {
      const cachedFollowers = getFromLocalStorage('insta_followersData');
      const cachedFollowing = getFromLocalStorage('insta_followingData');

      if (cachedFollowers || cachedFollowing) {
        setFollowersData(cachedFollowers);
        setFollowingData(cachedFollowing);
        setPendingData(getFromLocalStorage('insta_pendingData'));
        setUnfollowedData(getFromLocalStorage('insta_unfollowedData'));
        setBlockedData(getFromLocalStorage('insta_blockedData'));
        setReceivedRequestsData(getFromLocalStorage('insta_receivedRequestsData'));
        setSearchHistoryData(getFromLocalStorage('insta_searchHistoryData'));
        setAdsViewedData(getFromLocalStorage('insta_adsViewedData'));
        setLoginActivityData(getFromLocalStorage('insta_loginActivityData'));
        setIsUsingUploadedData(true);
        setIsLoading(false);
      } else {
        await loadDefaultData();
      }
    };

    loadInitialData();
  }, []);

  // FileReader helper
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const mergeJsonData = (prev, next, key) => {
    if (!prev) return next;
    
    const getList = (data) => {
      if (Array.isArray(data)) return data;
      if (data && key && data[key] && Array.isArray(data[key])) return data[key];
      return [];
    };

    const prevList = getList(prev);
    const nextList = getList(next);
    
    // Deduplicate lists based on username/value to prevent duplicate objects
    const seen = new Set();
    const mergedList = [];

    const addItems = (list) => {
      if (!Array.isArray(list)) return;
      list.forEach(item => {
        let identifier = '';
        if (item.string_list_data && item.string_list_data[0]) {
          identifier = item.string_list_data[0].value || item.title || '';
        } else if (item.label_values) {
          const userObj = getFromLabelValues(item.label_values);
          identifier = userObj.username;
        } else if (item.value) {
          identifier = item.value;
        } else if (item.title) {
          identifier = item.title;
        }

        if (identifier) {
          const cleanId = identifier.toLowerCase().trim();
          if (!seen.has(cleanId)) {
            seen.add(cleanId);
            mergedList.push(item);
          }
        } else {
          // If no clean identifier found, just push it (for search logs, ads, logins)
          mergedList.push(item);
        }
      });
    };

    addItems(prevList);
    addItems(nextList);

    if (prev && key && prev[key]) {
      return { [key]: mergedList };
    }
    return mergedList;
  };

  // Core processing function for loaded files
  const processFiles = async (filesList) => {
    if (!filesList || filesList.length === 0) return;

    setIsLoading(true);
    let uploadedCount = 0;

    // Use local buffers to accumulate changes in this batch
    let newFollowers = isUsingUploadedData ? followersData : null;
    let newFollowing = isUsingUploadedData ? followingData : null;
    let newPending = isUsingUploadedData ? pendingData : null;
    let newUnfollowed = isUsingUploadedData ? unfollowedData : null;
    let newBlocked = isUsingUploadedData ? blockedData : null;
    let newReceived = isUsingUploadedData ? receivedRequestsData : null;
    let newSearch = isUsingUploadedData ? searchHistoryData : null;
    let newAds = isUsingUploadedData ? adsViewedData : null;
    let newLogin = isUsingUploadedData ? loginActivityData : null;

    // Keep track of which categories were actually touched in this upload batch
    let categoriesTouched = {
      followers: false,
      following: false,
      pending: false,
      unfollowed: false,
      blocked: false,
      received: false,
      search: false,
      ads: false,
      login: false
    };

    for (const file of filesList) {
      const name = file.name.toLowerCase();
      if (!name.endsWith('.json')) continue;

      try {
        const content = await readFileContent(file);
        const parsed = JSON.parse(content);

        if (name.includes('followers_1') || name.includes('followers')) {
          newFollowers = mergeJsonData(newFollowers, parsed, 'relationships_followers');
          categoriesTouched.followers = true;
          uploadedCount++;
        } else if (name.includes('following') && !name.includes('followers')) {
          newFollowing = mergeJsonData(newFollowing, parsed, 'relationships_following');
          categoriesTouched.following = true;
          uploadedCount++;
        } else if (name.includes('recent_follow_requests') || name.includes('pending_follow_requests') || name.includes('pending')) {
          newPending = mergeJsonData(newPending, parsed, 'relationships_permanent_follow_requests');
          categoriesTouched.pending = true;
          uploadedCount++;
        } else if (name.includes('recently_unfollowed_profiles') || name.includes('unfollowed')) {
          newUnfollowed = mergeJsonData(newUnfollowed, parsed, 'relationships_unfollowed_users');
          categoriesTouched.unfollowed = true;
          uploadedCount++;
        } else if (name.includes('blocked_profiles') || name.includes('blocked')) {
          newBlocked = mergeJsonData(newBlocked, parsed, 'relationships_blocked_users');
          categoriesTouched.blocked = true;
          uploadedCount++;
        } else if (name.includes("follow_requests_you've_received") || name.includes('received')) {
          newReceived = mergeJsonData(newReceived, parsed, 'relationships_follow_requests_received');
          categoriesTouched.received = true;
          uploadedCount++;
        } else if (name.includes('profile_searches') || name.includes('recent_searches') || name.includes('search')) {
          newSearch = mergeJsonData(newSearch, parsed, 'searches_user');
          categoriesTouched.search = true;
          uploadedCount++;
        } else if (name.includes('ads_viewed') || name.includes('ads')) {
          newAds = mergeJsonData(newAds, parsed, 'impressions_history_ads_seen');
          categoriesTouched.ads = true;
          uploadedCount++;
        } else if (name.includes('login_activity') || name.includes('login')) {
          newLogin = mergeJsonData(newLogin, parsed, 'account_history_login_history');
          categoriesTouched.login = true;
          uploadedCount++;
        }
      } catch (err) {
        console.error('Error reading/parsing file:', file.name, err);
      }
    }

    if (uploadedCount > 0) {
      // If we were using default local data, we discard any demo data for categories
      // that weren't uploaded, so the demo data doesn't mix with user's personal upload.
      if (!isUsingUploadedData) {
        if (!categoriesTouched.followers) newFollowers = null;
        if (!categoriesTouched.following) newFollowing = null;
        if (!categoriesTouched.pending) newPending = null;
        if (!categoriesTouched.unfollowed) newUnfollowed = null;
        if (!categoriesTouched.blocked) newBlocked = null;
        if (!categoriesTouched.received) newReceived = null;
        if (!categoriesTouched.search) newSearch = null;
        if (!categoriesTouched.ads) newAds = null;
        if (!categoriesTouched.login) newLogin = null;
      }

      // Update states
      setFollowersData(newFollowers);
      setFollowingData(newFollowing);
      setPendingData(newPending);
      setUnfollowedData(newUnfollowed);
      setBlockedData(newBlocked);
      setReceivedRequestsData(newReceived);
      setSearchHistoryData(newSearch);
      setAdsViewedData(newAds);
      setLoginActivityData(newLogin);

      // Save to localStorage
      saveToLocalStorage('insta_followersData', newFollowers);
      saveToLocalStorage('insta_followingData', newFollowing);
      saveToLocalStorage('insta_pendingData', newPending);
      saveToLocalStorage('insta_unfollowedData', newUnfollowed);
      saveToLocalStorage('insta_blockedData', newBlocked);
      saveToLocalStorage('insta_receivedRequestsData', newReceived);
      saveToLocalStorage('insta_searchHistoryData', newSearch);
      saveToLocalStorage('insta_adsViewedData', newAds);
      saveToLocalStorage('insta_loginActivityData', newLogin);

      setIsUsingUploadedData(true);
    }
    setIsLoading(false);
  };

  const handleFolderUpload = async (event) => {
    const files = event.target.files;
    if (files) {
      await processFiles(Array.from(files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const filesList = [];
    const traverseEntry = async (entry) => {
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        filesList.push(file);
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => reader.readEntries(resolve));
        for (const ent of entries) {
          await traverseEntry(ent);
        }
      }
    };

    if (e.dataTransfer.items) {
      const promises = [];
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            promises.push(traverseEntry(entry));
          } else {
            const file = item.getAsFile();
            if (file) filesList.push(file);
          }
        }
      }
      await Promise.all(promises);
    } else if (e.dataTransfer.files) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        filesList.push(e.dataTransfer.files[i]);
      }
    }

    await processFiles(filesList);
  };

  const handleResetData = () => {
    const keys = [
      'insta_followersData',
      'insta_followingData',
      'insta_pendingData',
      'insta_unfollowedData',
      'insta_blockedData',
      'insta_receivedRequestsData',
      'insta_searchHistoryData',
      'insta_adsViewedData',
      'insta_loginActivityData'
    ];
    keys.forEach(k => localStorage.removeItem(k));

    setFollowersData(null);
    setFollowingData(null);
    setPendingData(null);
    setUnfollowedData(null);
    setBlockedData(null);
    setReceivedRequestsData(null);
    setSearchHistoryData(null);
    setAdsViewedData(null);
    setLoginActivityData(null);
    setIsUsingUploadedData(false);

    loadDefaultData();
  };

  // Process data when loaded
  useEffect(() => {
    try {
      const followers = followersData ? extractFollowers(followersData) : [];
      const following = followingData ? extractFollowing(followingData, unfollowedData) : [];

      const rawPending = pendingData ? extractPendingRequests(pendingData) : [];
      const blocked = blockedData ? extractBlockedUsers(blockedData) : [];
      const received = receivedRequestsData ? extractReceivedRequests(receivedRequestsData) : [];
      const searches = searchHistoryData ? extractSearchHistory(searchHistoryData) : [];
      const ads = adsViewedData ? extractAdsViewed(adsViewedData) : [];
      const logins = loginActivityData ? extractLoginActivity(loginActivityData) : [];

      // Extract unfollowed usernames for filtering
      const unfollowedUsernames = new Set();
      if (unfollowedData) {
        const parsedUnfollowed = extractUnfollowed(unfollowedData);
        parsedUnfollowed.forEach((user) => {
          if (user.username) {
            unfollowedUsernames.add(user.username.toLowerCase().trim());
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
  }, [followersData, followingData, pendingData, unfollowedData, blockedData, receivedRequestsData, searchHistoryData, adsViewedData, loginActivityData]);

  // Detect owner profile dynamically
  const detectOwnerProfile = (followers, following) => {
    const findUsernameInTitle = (data) => {
      if (!data) return null;
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.title && (item.title.includes("'s followers") || item.title.includes("'s following"))) {
            return item.title.replace("'s followers", "").replace("'s following", "").trim();
          }
        }
      } else if (typeof data === 'object') {
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key])) {
            const username = findUsernameInTitle(data[key]);
            if (username) return username;
          }
        }
      }
      return null;
    };

    const username = findUsernameInTitle(followers) || findUsernameInTitle(following);
    if (username) {
      setOwnerProfile({
        username,
        profileUrl: `https://www.instagram.com/${username}/`
      });
    }
  };

  // Polymorphic extraction helpers
  const getFromLabelValues = (labelValues) => {
    let username = '';
    let href = '';
    let name = '';
    if (Array.isArray(labelValues)) {
      labelValues.forEach(lbl => {
        if (lbl.label === 'Username') username = lbl.value;
        if (lbl.label === 'URL') href = lbl.value;
        if (lbl.label === 'Name') name = lbl.value;
      });
    }
    return { username, href, name };
  };

  const extractFollowers = (data) => {
    if (!data) return [];
    let list = [];
    if (data.relationships_followers && Array.isArray(data.relationships_followers)) {
      list = data.relationships_followers;
    } else if (Array.isArray(data)) {
      list = data;
    }

    const followers = [];
    list.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          let username = user.value || item.title;
          if (!username && user.href) {
            const parts = user.href.replace(/\/$/, '').split('/');
            username = parts[parts.length - 1];
          }
          if (username) {
            followers.push({
              username: username,
              href: user.href || `https://www.instagram.com/${username}/`,
              timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null,
              isPrivate: item.title && item.title.includes('Private'),
              isVerified: item.title && item.title.includes('Verified')
            });
          }
        });
      } else if (item.label_values && Array.isArray(item.label_values)) {
        const userObj = getFromLabelValues(item.label_values);
        if (userObj.username) {
          followers.push({
            username: userObj.username,
            href: userObj.href || `https://www.instagram.com/${userObj.username}/`,
            timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null,
            isPrivate: false,
            isVerified: false
          });
        }
      } else if (item.value) {
        followers.push({
          username: item.value,
          href: item.href || `https://www.instagram.com/${item.value}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null,
          isPrivate: false,
          isVerified: false
        });
      } else if (item.title) {
        followers.push({
          username: item.title,
          href: `https://www.instagram.com/${item.title}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null,
          isPrivate: false,
          isVerified: false
        });
      }
    });
    return followers;
  };

  const extractFollowing = (data, unfollowedData) => {
    if (!data) return [];
    
    // Extract unfollowed usernames to filter them out
    const unfollowedUsernames = new Set();
    if (unfollowedData) {
      const parsedUnfollowed = extractUnfollowed(unfollowedData);
      parsedUnfollowed.forEach(user => {
        if (user.username) {
          unfollowedUsernames.add(user.username.toLowerCase().trim());
        }
      });
    }

    let rawFollowing = [];
    if (data.relationships_following && Array.isArray(data.relationships_following)) {
      rawFollowing = data.relationships_following;
    } else if (Array.isArray(data)) {
      rawFollowing = data;
    }

    const following = [];
    rawFollowing.forEach((item) => {
      let username = '';
      let href = '';
      let timestamp = null;

      if (item.string_list_data && Array.isArray(item.string_list_data) && item.string_list_data.length > 0) {
        const userData = item.string_list_data[0];
        username = userData.value || item.title;
        href = userData.href || `https://www.instagram.com/${username}/`;
        timestamp = userData.timestamp ? new Date(userData.timestamp * 1000) : null;
        if (!username && userData.href) {
          const parts = userData.href.replace(/\/$/, '').split('/');
          username = parts[parts.length - 1];
        }
      } else if (item.label_values && Array.isArray(item.label_values)) {
        const userObj = getFromLabelValues(item.label_values);
        username = userObj.username;
        href = userObj.href;
        timestamp = item.timestamp ? new Date(item.timestamp * 1000) : null;
      } else if (item.value) {
        username = item.value;
        href = item.href || `https://www.instagram.com/${username}/`;
        timestamp = item.timestamp ? new Date(item.timestamp * 1000) : null;
      } else if (item.title) {
        username = item.title;
        href = `https://www.instagram.com/${username}/`;
        timestamp = item.timestamp ? new Date(item.timestamp * 1000) : null;
      }

      if (!username || username === 'Instagram User') {
        return;
      }

      const cleanUsername = username.toLowerCase().trim();
      if (unfollowedUsernames.has(cleanUsername)) {
        return;
      }

      // Skip ghost users
      const GHOST_USERS = new Set([
        '_narendra1_1',
        'chaityashah198',
        'armylo38',
        'themeetz'
      ]);
      if (GHOST_USERS.has(cleanUsername)) {
        return;
      }

      following.push({
        username: username,
        href: href.startsWith('http') ? href : `https://www.instagram.com/${username}/`,
        timestamp: timestamp,
        isPrivate: false,
        isVerified: false
      });
    });

    return following;
  };

  const extractUnfollowed = (data) => {
    if (!data) return [];
    let list = [];
    if (data.relationships_unfollowed_users && Array.isArray(data.relationships_unfollowed_users)) {
      list = data.relationships_unfollowed_users;
    } else if (Array.isArray(data)) {
      list = data;
    } else if (data.label_values) {
      list = [data]; // Single object
    } else if (typeof data === 'object') {
      const userObj = getFromLabelValues(data.label_values);
      if (userObj.username) {
        return [{
          username: userObj.username,
          href: userObj.href || `https://www.instagram.com/${userObj.username}/`,
          timestamp: data.timestamp ? new Date(data.timestamp * 1000) : null
        }];
      }
    }

    const unfollowed = [];
    list.forEach(item => {
      let username = '';
      let href = '';
      let timestamp = null;

      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach(user => {
          let userVal = user.value || item.title;
          if (!userVal && user.href) {
            const parts = user.href.replace(/\/$/, '').split('/');
            userVal = parts[parts.length - 1];
          }
          if (userVal) {
            unfollowed.push({
              username: userVal,
              href: user.href || `https://www.instagram.com/${userVal}/`,
              timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null
            });
          }
        });
      } else if (item.label_values && Array.isArray(item.label_values)) {
        const userObj = getFromLabelValues(item.label_values);
        username = userObj.username;
        href = userObj.href;
        timestamp = item.timestamp ? new Date(item.timestamp * 1000) : null;
        if (username) {
          unfollowed.push({ username, href, timestamp });
        }
      } else if (item.value) {
        username = item.value;
        href = item.href || `https://www.instagram.com/${username}/`;
        timestamp = item.timestamp ? new Date(item.timestamp * 1000) : null;
        unfollowed.push({ username, href, timestamp });
      } else if (item.title) {
        username = item.title;
        href = `https://www.instagram.com/${username}/`;
        timestamp = item.timestamp ? new Date(item.timestamp * 1000) : null;
        unfollowed.push({ username, href, timestamp });
      }
    });
    return unfollowed;
  };

  const extractPendingRequests = (data) => {
    if (!data) return [];
    let list = [];
    if (data.relationships_permanent_follow_requests && Array.isArray(data.relationships_permanent_follow_requests)) {
      list = data.relationships_permanent_follow_requests;
    } else if (Array.isArray(data)) {
      list = data;
    } else if (data.label_values) {
      list = [data];
    }

    const pending = [];
    list.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          let username = user.value || item.title;
          if (!username && user.href) {
            const parts = user.href.replace(/\/$/, '').split('/');
            username = parts[parts.length - 1];
          }
          if (username) {
            pending.push({
              username: username,
              href: user.href || `https://www.instagram.com/${username}/`,
              timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null
            });
          }
        });
      } else if (item.label_values && Array.isArray(item.label_values)) {
        const userObj = getFromLabelValues(item.label_values);
        if (userObj.username) {
          pending.push({
            username: userObj.username,
            href: userObj.href || `https://www.instagram.com/${userObj.username}/`,
            timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
          });
        }
      } else if (item.value) {
        pending.push({
          username: item.value,
          href: item.href || `https://www.instagram.com/${item.value}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
        });
      } else if (item.title) {
        pending.push({
          username: item.title,
          href: `https://www.instagram.com/${item.title}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
        });
      }
    });
    return pending;
  };

  const extractBlockedUsers = (data) => {
    if (!data) return [];
    let list = [];
    if (data.relationships_blocked_users && Array.isArray(data.relationships_blocked_users)) {
      list = data.relationships_blocked_users;
    } else if (Array.isArray(data)) {
      list = data;
    }

    const blocked = [];
    list.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          let username = user.value || item.title;
          if (!username && user.href) {
            const parts = user.href.replace(/\/$/, '').split('/');
            username = parts[parts.length - 1];
          }
          if (username) {
            blocked.push({
              username: username,
              href: user.href || `https://www.instagram.com/${username}/`,
              timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null
            });
          }
        });
      } else if (item.label_values && Array.isArray(item.label_values)) {
        const userObj = getFromLabelValues(item.label_values);
        if (userObj.username) {
          blocked.push({
            username: userObj.username,
            href: userObj.href || `https://www.instagram.com/${userObj.username}/`,
            timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
          });
        }
      } else if (item.value) {
        blocked.push({
          username: item.value,
          href: item.href || `https://www.instagram.com/${item.value}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
        });
      } else if (item.title) {
        blocked.push({
          username: item.title,
          href: `https://www.instagram.com/${item.title}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
        });
      }
    });
    return blocked;
  };

  const extractReceivedRequests = (data) => {
    if (!data) return [];
    let list = [];
    if (data.relationships_follow_requests_received && Array.isArray(data.relationships_follow_requests_received)) {
      list = data.relationships_follow_requests_received;
    } else if (Array.isArray(data)) {
      list = data;
    }

    const received = [];
    list.forEach((item) => {
      if (item.string_list_data && Array.isArray(item.string_list_data)) {
        item.string_list_data.forEach((user) => {
          let username = user.value || item.title;
          if (!username && user.href) {
            const parts = user.href.replace(/\/$/, '').split('/');
            username = parts[parts.length - 1];
          }
          if (username) {
            received.push({
              username: username,
              href: user.href || `https://www.instagram.com/${username}/`,
              timestamp: user.timestamp ? new Date(user.timestamp * 1000) : null
            });
          }
        });
      } else if (item.label_values && Array.isArray(item.label_values)) {
        const userObj = getFromLabelValues(item.label_values);
        if (userObj.username) {
          received.push({
            username: userObj.username,
            href: userObj.href || `https://www.instagram.com/${userObj.username}/`,
            timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
          });
        }
      } else if (item.value) {
        received.push({
          username: item.value,
          href: item.href || `https://www.instagram.com/${item.value}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
        });
      } else if (item.title) {
        received.push({
          username: item.title,
          href: `https://www.instagram.com/${item.title}/`,
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
        });
      }
    });
    return received;
  };

  const extractSearchHistory = (data) => {
    if (!data) return [];
    let list = [];
    if (data.searches_user && Array.isArray(data.searches_user)) {
      list = data.searches_user;
    } else if (Array.isArray(data)) {
      list = data;
    }

    const searches = [];
    list.forEach((item) => {
      if (item.string_map_data) {
        const searchTerm = item.string_map_data['Search']?.value || '';
        const timeObj = item.string_map_data['Time'];
        const ts = timeObj ? (timeObj.timestamp ? new Date(timeObj.timestamp * 1000) : null) : null;
        if (searchTerm) {
          searches.push({ title: searchTerm, timestamp: ts });
        }
      } else if (item.title) {
        const ts = item.string_list_data && item.string_list_data[0] ? new Date(item.string_list_data[0].timestamp * 1000) : null;
        searches.push({ title: item.title, timestamp: ts });
      }
    });
    return searches;
  };

  const extractAdsViewed = (data) => {
    if (!data) return [];
    let list = [];
    if (data.impressions_history_ads_seen && Array.isArray(data.impressions_history_ads_seen)) {
      list = data.impressions_history_ads_seen;
    } else if (Array.isArray(data)) {
      list = data;
    }

    const ads = [];
    list.forEach((item) => {
      if (item.string_map_data) {
        const author = item.string_map_data['Author']?.value || '';
        const timeObj = item.string_map_data['Time'];
        const ts = timeObj ? (timeObj.timestamp ? new Date(timeObj.timestamp * 1000) : null) : null;
        if (author) {
          ads.push({ author, timestamp: ts });
        }
      } else if (item.author) {
        ads.push({ author: item.author, timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null });
      }
    });
    return ads;
  };

  const extractLoginActivity = (data) => {
    if (!data) return [];
    let list = [];
    if (data.account_history_login_history && Array.isArray(data.account_history_login_history)) {
      list = data.account_history_login_history;
    } else if (Array.isArray(data)) {
      list = data;
    }

    const logins = [];
    list.forEach((item) => {
      if (item.string_map_data) {
        logins.push({
          cookie: item.string_map_data['Cookie']?.value || 'Unknown',
          ip: item.string_map_data['IP Address']?.value || 'Unknown',
          userAgent: item.string_map_data['User Agent']?.value || 'Unknown',
          timestamp: item.string_map_data['Time'] ? new Date(item.string_map_data['Time'].timestamp * 1000) : null
        });
      } else if (item.ip) {
        logins.push({
          cookie: item.cookie || 'Unknown',
          ip: item.ip,
          userAgent: item.userAgent || 'Unknown',
          timestamp: item.timestamp ? new Date(item.timestamp * 1000) : null
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

  // Filtered lists based on search query
  const filteredFollowers = followers.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFollowing = following.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredNotFollowingBack = notFollowingBack.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredYouDontFollowBack = youDontFollowBack.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPending = pendingRequests.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredBlocked = blockedUsers.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredReceived = receivedRequests.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSearch = searchHistory.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAds = adsViewed.filter(item => item.author.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLogins = loginActivity.filter(item => 
    item.ip.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.userAgent.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Drop Zone / Upload Section */}
        <div className="upload-container">
          {followers.length === 0 && following.length === 0 ? (
            <div 
              className="drop-zone large-drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="drop-zone-content">
                <FaUpload className="upload-arrow-icon" />
                <h2>Import Instagram Export Folder</h2>
                <p className="upload-description">
                  Drag and drop your unzipped Instagram data folder here or select the files directly.
                </p>
                <div className="upload-actions">
                  <label htmlFor="folder-upload" className="upload-btn primary-btn">
                    Select Instagram Folder
                  </label>
                  <input 
                    type="file" 
                    id="folder-upload" 
                    webkitdirectory="true" 
                    directory="true" 
                    multiple 
                    onChange={handleFolderUpload}
                    className="hidden-file-input"
                  />

                  <label htmlFor="files-upload" className="upload-btn secondary-btn">
                    Select JSON Files
                  </label>
                  <input 
                    type="file" 
                    id="files-upload" 
                    accept=".json" 
                    multiple 
                    onChange={handleFolderUpload}
                    className="hidden-file-input"
                  />
                </div>
                <div className="guide-box">
                  <h4>How to get your data:</h4>
                  <p>Instagram Settings &rarr; Account Center &rarr; Your Information and Data &rarr; Download Your Information. Choose JSON format.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="data-status-card">
              <div className="status-header">
                <div className="status-title">
                  <span className="live-indicator"></span>
                  <h3>Active Dataset: {isUsingUploadedData ? "Uploaded Profile" : "Default Local Data"}</h3>
                </div>
                <button className="reset-data-btn" onClick={handleResetData}>
                  <FaTrashAlt /> Reset & Upload New Folder
                </button>
              </div>
              <div className="file-status-grid">
                <div className={`status-pill ${followers.length > 0 ? 'active' : ''}`}>
                  Followers: {followers.length > 0 ? `${followers.length} users` : 'Not loaded'}
                </div>
                <div className={`status-pill ${following.length > 0 ? 'active' : ''}`}>
                  Following: {following.length > 0 ? `${following.length} users` : 'Not loaded'}
                </div>
                <div className={`status-pill ${pendingRequests.length > 0 ? 'active' : ''}`}>
                  Pending: {pendingRequests.length > 0 ? `${pendingRequests.length} requests` : 'Not loaded'}
                </div>
                <div className={`status-pill ${blockedUsers.length > 0 ? 'active' : ''}`}>
                  Blocked: {blockedUsers.length > 0 ? `${blockedUsers.length} profiles` : 'Not loaded'}
                </div>
                <div className={`status-pill ${receivedRequests.length > 0 ? 'active' : ''}`}>
                  Received: {receivedRequests.length > 0 ? `${receivedRequests.length} requests` : 'Not loaded'}
                </div>
                <div className={`status-pill ${searchHistory.length > 0 ? 'active' : ''}`}>
                  Searches: {searchHistory.length > 0 ? `${searchHistory.length} logs` : 'Not loaded'}
                </div>
                <div className={`status-pill ${adsViewed.length > 0 ? 'active' : ''}`}>
                  Ads Seen: {adsViewed.length > 0 ? `${adsViewed.length} ads` : 'Not loaded'}
                </div>
                <div className={`status-pill ${loginActivity.length > 0 ? 'active' : ''}`}>
                  Logins: {loginActivity.length > 0 ? `${loginActivity.length} logins` : 'Not loaded'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Search and Control wrappers */}
        {(followers.length > 0 || following.length > 0) && (
          <>
            <div className="search-control-container">
              <div className="search-wrapper">
                <FaSearch className="search-icon-inside" />
                <input
                  type="text"
                  placeholder="Search usernames, IPs, agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="global-search-bar"
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                    &times;
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* If we have data, show the rest of the dashboard */}
        {(followers.length > 0 || following.length > 0) && (
          <div className="dashboard-content-wrapper">

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
              <FaUserFriends /> Your Followers ({filteredFollowers.length === followers.length ? followers.length : `${filteredFollowers.length} of ${followers.length}`})
            </h2>
            {filteredFollowers.length > 0 ? (
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
                    {filteredFollowers.map((user, index) => (
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
            ) : (
              <p className="no-results">No matching followers found</p>
            )}
          </div>
        )}

        {/* Following Table */}
        {showFollowing && (
          <div className="table-container" ref={followingRef}>
            <h2 className="table-title">
              <FaUserCheck /> Your Following ({filteredFollowing.length === following.length ? following.length : `${filteredFollowing.length} of ${following.length}`})
            </h2>
            {filteredFollowing.length > 0 ? (
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
                    {filteredFollowing.map((user, index) => (
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
            ) : (
              <p className="no-results">No matching following profiles found</p>
            )}
          </div>
        )}

        {/* Pending Requests Table */}
        {showPending && (
          <div className="table-container highlight-box pending-box" ref={pendingRef}>
            <h2 className="table-title">
              <FaHourglassHalf /> Pending Follow Requests ({filteredPending.length === pendingRequests.length ? pendingRequests.length : `${filteredPending.length} of ${pendingRequests.length}`})
            </h2>
            {filteredPending.length > 0 ? (
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
                    {filteredPending.map((user, index) => (
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
              <p className="no-results">No matching pending follow requests found</p>
            )}
          </div>
        )}

        {/* Blocked Users Table */}
        {showBlocked && (
          <div className="table-container highlight-box blocked-box" ref={blockedRef}>
            <h2 className="table-title">
              <FaUserSlash /> Blocked Users ({filteredBlocked.length === blockedUsers.length ? blockedUsers.length : `${filteredBlocked.length} of ${blockedUsers.length}`})
            </h2>
            {filteredBlocked.length > 0 ? (
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
                    {filteredBlocked.map((user, index) => (
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
              <p className="no-results">No matching blocked users found</p>
            )}
          </div>
        )}

        {/* Received Requests Table */}
        {showReceived && (
          <div className="table-container highlight-box received-box" ref={receivedRef}>
            <h2 className="table-title">
              <FaUserPlus /> Received Follow Requests ({filteredReceived.length === receivedRequests.length ? receivedRequests.length : `${filteredReceived.length} of ${receivedRequests.length}`})
            </h2>
            {filteredReceived.length > 0 ? (
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
                    {filteredReceived.map((user, index) => (
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
              <p className="no-results">No matching received follow requests found</p>
            )}
          </div>
        )}

        {/* Non-reciprocal Relationships - Side by Side */}
        <div className="non-reciprocal-container">
          {/* You Don't Follow Back */}
          <div className="table-container highlight-box" ref={youDontFollowBackRef}>
            <h2 className="table-title">
              <FaUserClock /> You Don't Follow Back ({filteredYouDontFollowBack.length === youDontFollowBack.length ? youDontFollowBack.length : `${filteredYouDontFollowBack.length} of ${youDontFollowBack.length}`})
            </h2>
            {filteredYouDontFollowBack.length > 0 ? (
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
                    {filteredYouDontFollowBack.map((user, index) => (
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
              <p className="no-results">No matching profiles found</p>
            )}
          </div>

          {/* They Don't Follow Back */}
          <div className="table-container highlight-box" ref={notFollowingBackRef}>
            <h2 className="table-title">
              <FaUserTimes /> They Don't Follow Back ({filteredNotFollowingBack.length === notFollowingBack.length ? notFollowingBack.length : `${filteredNotFollowingBack.length} of ${notFollowingBack.length}`})
            </h2>
            {filteredNotFollowingBack.length > 0 ? (
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
                    {filteredNotFollowingBack.map((user, index) => (
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
              <p className="no-results">No matching profiles found</p>
            )}
          </div>
        </div>

        {/* Search History Table */}
        {showSearch && (
          <div className="table-container highlight-box search-box" ref={searchRef}>
            <h2 className="table-title">
              <FaUserFriends /> Search History ({filteredSearch.length === searchHistory.length ? searchHistory.length : `${filteredSearch.length} of ${searchHistory.length}`})
            </h2>
            {filteredSearch.length > 0 ? (
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
                    {filteredSearch.map((item, index) => (
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
              <p className="no-results">No matching search history logs found</p>
            )}
          </div>
        )}

        {/* Ads Viewed Table */}
        {showAds && (
          <div className="table-container highlight-box ads-box" ref={adsRef}>
            <h2 className="table-title">
              <FaExclamationTriangle /> Ads Viewed ({filteredAds.length === adsViewed.length ? adsViewed.length : `${filteredAds.length} of ${adsViewed.length}`})
            </h2>
            {filteredAds.length > 0 ? (
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
                    {filteredAds.map((item, index) => (
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
              <p className="no-results">No matching ads viewing logs found</p>
            )}
          </div>
        )}

        {/* Login Activity Table */}
        {showLogin && (
          <div className="table-container highlight-box login-box" ref={loginRef}>
            <h2 className="table-title">
              <FaUserCheck /> Login Activity ({filteredLogins.length === loginActivity.length ? loginActivity.length : `${filteredLogins.length} of ${loginActivity.length}`})
            </h2>
            {filteredLogins.length > 0 ? (
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
                    {filteredLogins.map((item, index) => (
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
              <p className="no-results">No matching login activity logs found</p>
            )}
          </div>
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
