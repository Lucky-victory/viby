import { Request, Response } from "express";
import { ChannelsRepo, ChannelsEntity } from "../models/channels";
import RoomsController from "./rooms";
import { IUserForToken, IUserToView } from "../interfaces/user.interface";
import { IRoom } from "../interfaces/rooms.interface";

import { IChannel, IChannelToView } from "../interfaces/channels.interface";
import { EntityData } from "redis-om";
import { UsersEntity } from "../models/users";
import Utils from "../utils";
import UsersController from "./users";

export default class ChannelsController {
  static async createChannel(req: Request, res: Response) {
    try {
      const channelId = Utils.generateID(false);
      const ownerId = Utils.getAuthenticatedUser(req)?.user_id;
      const currentTime = Utils.currentTime;
      const {
        title,
        description,
        channel_cover,
        channel_picture,
        is_public = true,
        rooms = [],
      } = req.body;

      // create a welcome room when the channel is created
      const firstRoom = {
        title: "welcome",
        description:
          "This is the first room in this channel, you can edit or delete it",
        channel_id: channelId,
        members: [ownerId],
        message_allowed: false,
        owner_id: ownerId,
      };
      const roomsSaved = (await RoomsController.addNewRoom(firstRoom)) as IRoom;
      rooms.push(roomsSaved?.room_id);

      // the channel to be saved to the database
      const newChannel: IChannel = {
        channel_id: channelId,
        title,
        is_public,
        description,
        owner_id: ownerId,
        members: [ownerId],
        rooms,
        created_at: currentTime,
        channel_cover,
        channel_picture,
      };
      // redis OM throws an error if boolean is recieved as "boolean"
      // doing this resolves that
      const savedChannel = await ChannelsController.addNewChannel(newChannel);
      // the channel to be sent out to the frontend
      const channelToView = Utils.omit(savedChannel, [
        "rooms",
        "members",
        "entityId",
      ]) as IChannelToView;

      res.status(201).json({
        message: "channel created successfully",
        data: channelToView,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't create channel",
      });
    }
  }
  static async updateChannel(req: Request, res: Response) {
    try {
      const { title, description, is_public, channel_cover, channel_picture } =
        req.body;

      const updateables: Partial<ChannelsEntity> = {
        title,
        description,
        is_public,
        channel_cover,
        channel_picture,
      };
      const user = Utils.getAuthenticatedUser(req);
      const { channel_id } = req.params;

      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exist`,
        });
        return;
      }
      const isAuthorized = ChannelsController.hasAccess(channel, user);
      if (!isAuthorized) {
        res.status(403).json({
          message: "Unauthorized",
        });
        return;
      }
      channel.update(updateables);
      await (await ChannelsRepo).save(channel);

      res.status(200).json({
        message: "channel updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't update channel",
      });
    }
  }
  static async deleteChannel(req: Request, res: Response) {
    try {
      const user = Utils.getAuthenticatedUser(req);
      const { channel_id } = req.params;

      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exist`,
        });
        return;
      }
      const isAuthorized = ChannelsController.hasAccess(channel, user);
      if (!isAuthorized) {
        res.status(403).json({
          message: "Unauthorized",
        });
        return;
      }
      await (await ChannelsRepo).remove(channel.entityId);

      res.status(200).json({
        message: "channel deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't delete channel",
      });
    }
  }

  /**
   * Add a member to a channel
   * @param req
   * @param res
   * @returns
   */
  static async addMemberToChannel(req: Request, res: Response) {
    try {
      const { channel_id } = req.params;
      const user = Utils.getAuthenticatedUser(req);
      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exist`,
        });
        return;
      }
      // check if the user was already a member
      const alreadyMember = await (await ChannelsRepo)
        .search()
        .where("members")
        .contains(user?.user_id)
        .returnFirst();
      if (alreadyMember) {
        res.status(200).json({
          message: "already a member",
          data: null,
        });
        return;
      }
      // add to members and save
      channel.addMemberId(user?.user_id);
      await (await ChannelsRepo).save(channel);
      // get the user info and return it
      const newMember = await UsersController.getUserById(user?.user_id);

      // remove unwanted/credential properties
      const member = Utils.omit(newMember as UsersEntity, [
        "password",
        "email",
        "entityId",
        "friends",
      ]) as IUserToView;

      res.status(200).json({
        message: "successfully added",
        data: member,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't add member to channel",
      });
    }
  }
  /**
   * Remveo a member from a channel
   * @param req
   * @param res
   * @returns
   */
  static async removeMemberFromChannel(req: Request, res: Response) {
    try {
      const { channel_id } = req.params;
      const user = Utils.getAuthenticatedUser(req);
      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exist`,
        });
        return;
      }
      // check if the user was a member
      const isMember = await (await ChannelsRepo)
        .search()
        .where("members")
        .contains(user?.user_id)
        .returnFirst();
      if (!isMember) {
        res.status(200).json({
          message: "not a member",
          data: null,
        });
        return;
      }
      // remove a member and save
      channel.removeMemberId(user?.user_id);
      await (await ChannelsRepo).save(channel);
      res.status(200).json({
        message: "successfully removed",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't remove member from channel",
      });
    }
  }

  /**
   * Get members in a channel
   * @param req
   * @param res
   * @returns
   */
  static async getMembers(req: Request, res: Response) {
    try {
      const { channel_id } = req.params;
      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exist`,
        });
        return;
      }
      const { members } = channel;
      const users = await Promise.all(
        members.map(async (memberId) => {
          const user = await UsersController.getUserById(memberId);
          // omit some properties before sending out to client;
          const userToView = Utils.omit(user as UsersEntity, [
            "password",
            "email",
            "entityId",
            "friends",
          ]);
          return userToView;
        })
      );

      res.status(200).json({
        message: "members retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't fetch members",
      });
    }
  }
  /**
   * Get rooms in a channel
   * @param req
   * @param res
   * @returns
   */
  static async getRooms(req: Request, res: Response) {
    try {
      const { channel_id } = req.params;
      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exist`,
        });
        return;
      }
      const { rooms: roomIds } = channel;
      const rooms = await Promise.all(
        roomIds.map(async (roomId) => {
          const room = await RoomsController.getRoomById(roomId);
          return room;
        })
      );
      const roomsToView = Utils.omit(rooms, ["entityId", "members"]) as IRoom[];
      res.status(200).json({
        message: "rooms retrieved successfully",
        data: roomsToView,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't fetch rooms",
      });
    }
  }
  /**
   * Get public channels
   */
  static async getPublicChannels(req: Request, res: Response) {
    try {
      let { limit = 100, page = 1 } = req.query;
      limit = +limit;
      page = +page;
      const offset = limit * (page - 1);
      const channels = await (await ChannelsRepo)
        .search()
        .where("is_public")
        .is.true()
        .page(offset, limit);
      if (!channels) {
        res.status(200).json({
          data: [],
          message: "no channels",
        });
        return;
      }

      const channelsToView = Utils.omit(channels, [
        "rooms",
        "members",
        "entityId",
      ]) as IChannelToView[];
      res.status(200).json({
        message: "channels retrieved successfully",
        data: channelsToView,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't fetch channels",
      });
    }
  }
  /**
   * Get channels where the user is a member, but not where the channelid is same as the user id, because that's a unique channel
   */
  static async getChannelsForUser(req: Request, res: Response) {
    try {
      const user = Utils.getAuthenticatedUser(req);
      const channels = await (await ChannelsRepo)
        .search()
        .where("members")
        .contain(user?.user_id)
        .and("channel_id")
        .not.equal(user?.user_id)
        .returnAll();
      const channelsToView = Utils.omit(channels, [
        "rooms",
        "members",
        "entityId",
      ]) as IChannelToView[];
      res.status(200).json({
        message: "channels retrieved successfully",
        data: channelsToView,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't fetch channels",
      });
    }
  }
  static async getChannel(req: Request, res: Response) {
    try {
      const { channel_id } = req.params;
      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exist`,
          data: null,
        });
        return;
      }
      const channelToView = Utils.omit(channel as ChannelsEntity, [
        "rooms",
        "members",
        "entityId",
      ]) as IChannelToView;
      res.status(200).json({
        message: "channel retrieved successfully",
        data: channelToView,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't fetch channel",
      });
    }
  }
  static async searchChannels(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q) {
        res.status(400).json({
          message: "nothing to search,no query provided",
          data: null,
        });
        return;
      }
      const channels = await (
        await ChannelsRepo
      )
        .search()
        .where("title")
        .matches(q as string)
        .or("description")
        .matches(q as string)
        .returnAll();
      const channelsToView = Utils.omit(channels, [
        "rooms",
        "members",
        "entityId",
      ]) as IChannelToView[];
      res.status(200).json({
        message: "channels retrieved successfully",
        data: channelsToView,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occured couldn't search channels",
        error,
      });
    }
  }
  static async addNewChannel(newChannel: Partial<IChannel>) {
    newChannel = JSON.parse(JSON.stringify(newChannel));

    return await (
      await ChannelsRepo
    ).createAndSave(newChannel as unknown as EntityData);
  }
  /**
   * Check if a channel exist
   * @param channelId
   * @returns
   */
  static async channelExist(channelId: string): Promise<ChannelsEntity | null> {
    return await (await ChannelsRepo)
      .search()
      .where("channel_id")
      .equal(channelId)
      .returnFirst();
  }
  /**
   * Check if the user performing the operation has access
   * @param channel
   * @param user
   * @returns
   */
  static hasAccess(
    channel: ChannelsEntity | null,
    user: IUserForToken
  ): boolean {
    return channel?.owner_id === user?.user_id;
  }
}
