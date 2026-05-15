const { normalizeCandidateSearchInput, createSearchHash } = require('../utils/cacheHelper');

const search1 = {
  personTitleIncludes: ["Software Engineer"],
  personLocationCityIncludes: ["Lahore", "Islamabad"],
  seniorityIncludes: ["senior", "associate"],
  hasEmail: true,
  totalResults: 50, // Should be excluded
  resetProgress: true // Should be excluded
};

const search2 = {
  personLocationCityIncludes: ["islamabad ", "LAHORE"], // Case and order difference
  personTitleIncludes: ["SOFTWARE ENGINEER"],
  seniorityIncludes: ["associate", "SENIOR"],
  hasEmail: true,
  totalResults: 25, // Different value, but should be excluded
  dontSaveProgress: false // Should be excluded
};

console.log("--- STARTING CACHE HASH TEST ---");

const normalized1 = normalizeCandidateSearchInput(search1);
const normalized2 = normalizeCandidateSearchInput(search2);

const hash1 = createSearchHash(normalized1);
const hash2 = createSearchHash(normalized2);

console.log("Normalized 1:", JSON.stringify(normalized1, null, 2));
console.log("Normalized 2:", JSON.stringify(normalized2, null, 2));

console.log("\nHash 1:", hash1);
console.log("Hash 2:", hash2);

if (hash1 === hash2) {
  console.log("\n✅ SUCCESS: Both searches produced the same hash!");
} else {
  console.log("\n❌ FAILURE: Hashes do not match.");
}
