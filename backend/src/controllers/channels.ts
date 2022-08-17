import { Request,Response } from "express";
import { ChannelsRepo,ChannelsEntity } from "../models/channels";
import RoomsController from "./rooms";
import { v4 as uuidv4 } from 'uuid';
import { IUser } from "../interfaces/user.interface";
import { IRoom } from "../interfaces/rooms.interface";

import { IChannel, IChannelToView } from "../interfaces/channels.interface";
import { EntityData } from "redis-om";
import omit from 'just-omit';

export default class ChannelsController{
    static async createChannel(req:Request,res:Response) {
        try {
            // removed the dashes from the id
            const channelId = uuidv4().split('-').join('');
            const ownerId = req?.auth?.user_id;
            const currentTime = new Date().getTime();
            const { title, description, channel_cover, channel_picture,is_public=false } = req.body; 
           
            
            // create a welcome room when the channel is created
            const firstRoom = {
                title: 'welcome',
                description: 'This is the first room in this channel, you can edit or delete it',
                channel_id: channelId,
                
            }
            const roomsRepo = await RoomsController.addNewRoom(firstRoom) as IRoom;
            const rooms = [roomsRepo?.room_id];
            // the channel to be saved to the database
       const newChannel:IChannel= {
         channel_id: channelId,
           title, is_public,
           description,
           owner_id: ownerId,
           members: [],
           rooms,
         created_at:currentTime,
           channel_cover,
           channel_picture
       };
            
            (await ChannelsRepo).createAndSave(newChannel as unknown as EntityData);

            // the channel to be sent out to the frontend
            const channelToBeSent = omit(newChannel, ['rooms', 'members']) as IChannelToView;

            res.status(201).json({
                message: "channel created successfully",
                data:channelToBeSent
            
            });
        }
        
        catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't create channel"
            })
        }

    }
    static async updateChannel(req:Request,res:Response) {
        try {
            const {title,description } = req.body;

            const user= req?.auth;
            const { channel_id } = req.params;

            const channel = await ChannelsController.channelExist(channel_id);
            if (!channel) {
                res.status(404).json({
                    message: `channel with id '${channel_id}' was not found`
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
            await (await ChannelsRepo).save(channel);
            
            res.status(200).json({
                message: 'channel updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't delete channel"
            })
        }

    }
    static async deleteChannel(req:Request,res:Response) {
        try {
            const user= req?.auth;
            const { channel_id } = req.params;

            const channel = await ChannelsController.channelExist(channel_id);
            if (!channel) {
                res.status(404).json({
                    message: `channel with id '${channel_id}' was not found`
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
            await (await ChannelsRepo).remove(channel.entityId);
            
            res.status(200).json({
                message: 'channel deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't delete channel"
            })
        }

    }
    static async addMember(req:Request,res:Response) {
        try {
    
        }
        catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't create channel"
            })
        }

    }
    static async getMembers(req:Request,res:Response) {
        try {
            const { channel_id } = req.params;
            const channel = await ChannelsController.channelExist(channel_id);
            if (channel) {
                const { members } = channel;
            }
        }
        catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't create channel"
            })
        }

    }
    /**
 * Check if a channel exist
 * @param channelId 
 * @returns 
 */
    static async channelExist(channelId:string):Promise<ChannelsEntity|null> {
        return  (await (await ChannelsRepo).search().where('channel_id').equal(channelId).returnFirst());
    }
    /**
     * Check if the user performing the operation has access
     * @param channel 
     * @param user 
     * @returns 
     */
 static hasAccess(channel: ChannelsEntity | null, user: IUser): boolean {
        
        return channel?.owner_id === user?.user_id;
    }

}