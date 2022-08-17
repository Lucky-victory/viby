import { Request,Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { INewRoom, IRoom } from "../interfaces/rooms.interface";

import merge from 'just-merge';
import { RoomsEntity, RoomsRepo } from "../models/rooms";
import { EntityData } from "redis-om";
import ChannelsController from "./channels";

// todo, transform entities to json
export default class RoomsController{
    static async createRoom(req:Request,res:Response) {
        try {
            const {channel_id
            } = req.params;
            const user = req?.auth;
// check if the channel exist
            const channel = await ChannelsController.channelExist(channel_id);
            if (!channel) {
                res.status(404).json({
                    message: `channel with id ${channel_id} was not found`
                });
                return
            }
           const isAuthorized = ChannelsController.hasAccess(channel, user);
            if (!isAuthorized) {
                res.status(403).json({
                    message: 'Unauthorized'
                });
             return
            }
            
            const { title, description } = req.body;
            const newRoom:INewRoom = {
                title,description,channel_id
            }
            const room = await RoomsController.addNewRoom(newRoom) as IRoom;
            res.status(200).json({
                data: room,
                message:'room created successfully'
            })
        }
        catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't create room"
            })
        }

    }
    static async updateRoom(req:Request,res:Response) {
        try {
            const { description, title } = req.body;
              const user = req?.auth;
            const { room_id } = req.params;
            const room = await RoomsController.roomExist(room_id);
            if (!room) {
                res.status(404).json({
                    message: `room with id '${room_id}' was not found`
                });
                return
            }
            const channel = await ChannelsController.channelExist(room?.channel_id);
       
            const isAuthorized = ChannelsController.hasAccess(channel, user);
            if (!isAuthorized) {
                res.status(403).json({
                    message: 'Unauthorized'
                });
                return
            }
         room['description']=description
            room['title'] = title;
             
            await (await RoomsRepo).save(room);
            res.status(200).json({
                message:'room updated successfully'
            })

        }    catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't update room"
            })
        }

    }
    static async deleteRoom(req: Request, res: Response) {
        try {
            const user = req?.auth;
            const { room_id } = req.params;
            const room = await RoomsController.roomExist(room_id);
            if (!room) {
                res.status(404).json({
                    message: `room with id '${room_id}' was not found`
                });
                return
            }
            const channel = await ChannelsController.channelExist(room?.channel_id);
       
            const isAuthorized = ChannelsController.hasAccess(channel, user);
            if (!isAuthorized) {
                res.status(403).json({
                    message: 'Unauthorized'
                });
                return
            }

            await (await RoomsRepo).remove(room?.entityId);
        }
    
        catch (error) {
            res.status(500).json({
                message: "An error occurred, couldn't delete room"
            });
        }

    }
    static async addNewRoom(newRoom:Pick<IRoom,'channel_id'|'description'|'title'>):Promise<IRoom|unknown> {
        try {
             // removed the dashes from the id
            const currentTime = new Date().getTime();
            const roomId = uuidv4().split('-').join('');
            const roomToSave:IRoom = merge(newRoom, {
                room_id: roomId,
                created_at:currentTime
            });
            (await RoomsRepo).createAndSave(roomToSave as unknown as EntityData);
            (await RoomsRepo).createIndex();
            return roomToSave;
        }
        catch (error) {
            if (error) throw error;
        }
        
    }

   
    private static async roomExist(roomId:string):Promise<RoomsEntity|null> {
       return  (await (await RoomsRepo).search().where('room_id').equal(roomId).returnFirst());
    
    } 
}
