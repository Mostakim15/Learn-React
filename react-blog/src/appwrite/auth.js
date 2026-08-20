import confi from '../confi/config.js';
import { Client, Account, ID } from 'appwrite';

export class AuthService {
    clint = new Client();
    account;

    constructor(){
        this.clint
            .setEndpoint(confi.appwriteUrl)
            .setProject(confi.appwriteProjectId);
        this.account = new Account(this.clint)
    }

    async createAccount({email, password, name}){

        try{
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount){
                return this.login({email, password});
            }else{
                return userAccount;
            }
        }catch(error){
            throw error;
        } 
    }

    async login({email, password}){
        try{
            return await this.account.createAnonymousSession(email,password);
    
        } catch(error){
            throw error;
        }
    }

    async getCurrentUser(){
        try{
            return await this.account.get();

        }catch(error){
            console.log("getCurrentUser", error);
        }
        return null;
    }

    async logout(){
        try{
            await this.account.deleteSessions();
        }catch(error){
            console.log("Logout", error);
        }
    }
}

const authService = new AuthService();

export default authService