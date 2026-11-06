import confi from '../confi/confi.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(confi.appwriteUrl)
            .setProject(confi.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    async createAccount({email, password, name}) {
        const userAccount = await this.account.create(ID.unique(), email, password, name);
        if (userAccount) {
            return this.login({email, password});
        }
        return userAccount;
    }

    async login({email, password}) {
        return await this.account.createEmailPasswordSession(email, password);
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async updateName(name) {
        try {
            return await this.account.updateName(name);
        } catch (error) {
            console.log("Appwrite service :: updateName :: error", error);
            throw error;
        }
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService