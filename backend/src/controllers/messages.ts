import { IMessageToDB } from '../interfaces/message.interface';
import {MessagesRepo} from '../models/messages';

export default class MessagesController{

    static async createNewMessage(message:IMessageToDB){
const messageRepo= await MessagesRepo;

const msg=messageRepo.createEntity(message);
await messageRepo.createIndex();
console.log(msg,'to db');

    }
}