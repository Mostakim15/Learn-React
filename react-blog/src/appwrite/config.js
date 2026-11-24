import confi from '../confi/confi.js';
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(confi.appwriteUrl)
        .setProject(confi.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, blogImage, status, userId}){
        try {
            return await this.databases.createDocument(
                confi.appwriteDatabaseId,
                confi.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    blogImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, blogImage, status}){
        try {
            return await this.databases.updateDocument(
                confi.appwriteDatabaseId,
                confi.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    blogImage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                confi.appwriteDatabaseId,
                confi.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                confi.appwriteDatabaseId,
                confi.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                confi.appwriteDatabaseId,
                confi.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                confi.appwriteBucketId,
                ID.unique(),
                file,
                [Permission.read(Role.any())]
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                confi.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFileView(fileId){
        if (!fileId || fileId === confi.appwriteBucketId) {
            console.error("Appwrite service :: getFileView :: blogImage must be a Storage file ID");
            return "";
        }

        return this.bucket.getFileView(
            confi.appwriteBucketId,
            fileId
        )
    }

    // --- LIKES & DISLIKES SERVICE ---

    async updateLikes(slug, { likes, dislikes }) {
        try {
            return await this.databases.updateDocument(
                confi.appwriteDatabaseId,
                confi.appwriteCollectionId,
                slug,
                {
                    likes,
                    dislikes,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateLikes :: error", error);
            return false;
        }
    }

    // --- COMMENTS / FEEDBACK SERVICE ---

    async createComment({ postId, userId, userName, content }) {
        try {
            return await this.databases.createDocument(
                confi.appwriteDatabaseId,
                confi.appwriteCommentsCollectionId,
                ID.unique(),
                {
                    postId,
                    userId,
                    userName,
                    content,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createComment :: error", error);
            throw error;
        }
    }

    async getComments(postId) {
        try {
            return await this.databases.listDocuments(
                confi.appwriteDatabaseId,
                confi.appwriteCommentsCollectionId,
                [
                    Query.equal("postId", postId),
                    Query.orderDesc("$createdAt"),
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getComments :: error", error);
            return { documents: [] };
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databases.deleteDocument(
                confi.appwriteDatabaseId,
                confi.appwriteCommentsCollectionId,
                commentId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteComment :: error", error);
            return false;
        }
    }

    // --- EDUCATIONAL REELS SERVICE ---

    async createReel({ title, description = "", videoFileId, topic, userId, authorName }) {
        try {
            return await this.databases.createDocument(
                confi.appwriteDatabaseId,
                confi.appwriteReelsCollectionId,
                ID.unique(),
                {
                    title,
                    description,
                    videoFileId,
                    topic,
                    userId,
                    authorName,
                    likes: [],
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createReel :: error", error);
            throw error;
        }
    }

    async getReels(queries = [Query.orderDesc("$createdAt")]) {
        try {
            return await this.databases.listDocuments(
                confi.appwriteDatabaseId,
                confi.appwriteReelsCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getReels :: error", error);
            return { documents: [] };
        }
    }

    async updateReelLikes(reelId, likes) {
        try {
            return await this.databases.updateDocument(
                confi.appwriteDatabaseId,
                confi.appwriteReelsCollectionId,
                reelId,
                {
                    likes,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateReelLikes :: error", error);
            return false;
        }
    }

    async deleteReel(reelId) {
        try {
            await this.databases.deleteDocument(
                confi.appwriteDatabaseId,
                confi.appwriteReelsCollectionId,
                reelId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteReel :: error", error);
            return false;
        }
    }
}


const service = new Service()
export default service