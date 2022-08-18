import { Request,Response } from "express";
import { ChannelsRepo,ChannelsEntity } from "../models/channels";
import RoomsController from "./rooms";
import { v4 as uuidv4 } from 'uuid';
import { IUser, IUserToView } from "../interfaces/user.interface";
import { IRoom } from "../interfaces/rooms.interface";

import { IChannel, IChannelToView } from "../interfaces/channels.interface";
import { EntityData } from "redis-om";
import { UsersEntity, UsersRepo } from "../models/users";
import { Utils } from "../utils";

export default class ChannelsController{
    static async createChannel(req:Request,res:Response) {
        try {
            // removed the dashes from the id
            const channelId = uuidv4().split('-').join('');
            const ownerId = req?.auth?.user_id;
            const currentTime = new Date().getTime();
            const { title, description, channel_cover, channel_picture,is_public=true } = req.body; 
           
            
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
            const channelToBeSent = Utils.omit(newChannel, ['rooms', 'members']) as IChannelToView;

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
            //@todo implement channel picture/cover update

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
            channel['description'] = description;
            channel['title'] = title;
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
            const { channel_id } = req.params;
            const user = req?.auth;
            const channel = await ChannelsController.channelExist(channel_id);
            if (!channel) {
                res.status(404).json({
                    message: `channel with id '${channel_id}' was not found`
                });
                return
            }
            // check if the user was already a member
            const alreadyMember = await (await ChannelsRepo).search().where('members').contains(user?.user_id).returnFirst();
            if (alreadyMember) {
                res.status(200).json({
                    message: 'already a member',
                    data: null,
                    
                });
                return 
            }
// otherwise add to members
            channel.members?.push(user?.user_id);
            await (await ChannelsRepo).save(channel);
// get the user info and return it
            const newMember = await (await UsersRepo).search().where('user_id').equal(user?.user_id).returnFirst();
        
            // remove confidential properties
            const member = Utils.omit(newMember as UsersEntity, ['password', 'email', 'entityId','friends']) as IUserToView;

            res.status(200).json({
                message: 'successfully added',
                data:member
            })
        }
        catch (error) {
            res.status(500).json({
                message:"An error occurred, couldn't add member to channel"
            })
        }

    }
    static async getMembers(req:Request,res:Response) {
        try {
            const { channel_id } = req.params;
            const channel = await ChannelsController.channelExist(channel_id);
            if (!channel) {
                res.status(404).json({
                    message: `channel with id '${channel_id}' was not found`
                });
                return
            }
            const { members } = channel;
            const users = await Promise.all(members.map(async (memberId) => {
                const user = await (await UsersRepo).search().where('user_id').equal(memberId).returnFirst();
                // omit some properties before sending out to client;
              const userToView= Utils.omit(user as UsersEntity,['password','email','entityId','friends'])
                return userToView;
            }));

            res.status(200).json({
                message: 'members retrieved successfully',
                data:users
            })
        }
        catch (error) {
            res.status(500).json({
                message: "An error occurred, couldn't fetch members"
            });
        }

    }
    /**
     * Get public channels
     */
    static async getPublicChannels(req:Request,res:Response) {
        try {
            let { limit = 100,page=1 } = req.query;
            limit = +limit;
            page = +page;
            const offset = (limit * page) - 1;
            const channels = await (await ChannelsRepo).search().where('is_public').is.true().page(offset,limit);
          const  channelsToView = Utils.omit(channels, ['rooms', 'members', 'entityId']) as IChannelToView[];
            res.status(200).json({
                message: 'channels retrieved successfully',
                data:channelsToView
            })
        }
        catch (error) {
     res.status(500).json({
                message: "An error occurred, couldn't fetch channels"
            });       
        }
    }
    static async searchChannels(req: Request, res: Response) {
        try {
            const { term } = req.query;
            const channels = await (await ChannelsRepo).search().where('title').matches(term as string).or('description').matches(term as string).returnAll();
             const  channelsToView = Utils.omit(channels, ['rooms', 'members', 'entityId']) as IChannelToView[];
            res.status(200).json({
                message: 'channels retrieved successfully',
                data:channelsToView
            })
        }
        catch (error) {
              res.status(500).json({
                message: "An error occured",
                error
              }); 
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
    /**
     * Converts the entity into a JSON
     * @param channels 
     */
    private static entityToJSON(channels: ChannelsEntity[]) {
       return channels.map((channel) => channel.toJSON()) as IChannel[];
        
}
}