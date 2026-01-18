// Test script to verify JSON parsing
import followersData from './src/assets/followers_and_following/followers_1.json';
import followingData from './src/assets/followers_and_following/following.json';
import pendingData from './src/assets/followers_and_following/recent_follow_requests.json';

console.log('=== DATA LOADED ===');
console.log('Followers count:', followersData?.length || 0);
console.log('Following count:', followingData?.relationships_following?.length || 0);
console.log('Pending count:', pendingData?.relationships_permanent_follow_requests?.length || 0);

console.log('\n=== FOLLOWERS SAMPLE ===');
console.log(followersData?.[0]);

console.log('\n=== FOLLOWING SAMPLE ===');
console.log(followingData?.relationships_following?.[0]);

console.log('\n=== PENDING SAMPLE ===');
console.log(pendingData?.relationships_permanent_follow_requests?.[0]);
