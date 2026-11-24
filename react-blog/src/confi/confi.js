const confi = {
  appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  appwriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  appwriteCommentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  appwriteReelsCollectionId: import.meta.env.VITE_APPWRITE_REELS_COLLECTION_ID,
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
};

export default confi;