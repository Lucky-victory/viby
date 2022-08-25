import { Request, Response } from "express";

import { INewRoom, IRoom } from "../interfaces/rooms.interface";

import merge from "just-merge";
import { RoomsEntity, RoomsRepo } from "../models/rooms";
import { EntityData } from "redis-om";
import ChannelsController from "./channels";
import Utils from "../utils";
import { ChannelsEntity, ChannelsRepo } from "../models/channels";
import UsersController from "./users";
import { UsersEntity } from "../models/users";

// todo, transform entities to json
export default class RoomsController {
  static async createRoom(req: Request, res: Response) {
    try {
      const { channel_id } = req.params;
      const user = Utils.getAuthenticatedUser(req);
      const userId = user?.user_id;
      // check if the channel exist
      const channel = await ChannelsController.channelExist(channel_id);
      if (!channel) {
        res.status(404).json({
          message: `channel with id '${channel_id}' does not exists`,
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

      const { title, description, message_allowed = true } = req.body;
      // add channel members as room members
      // in future this would be changed to implement rooms for users of specific roles
      const members = channel.members;
      
      const newRoom: INewRoom = {
        owner_id: userId,
        members,
        message_allowed,
        title,
        description,
        channel_id,
      };
      const room = (await RoomsController.addNewRoom(newRoom)) as RoomsEntity;

      const roomToView = Utils.omit(room, ["entityId"]) as IRoom;
      channel.addRoomId(room?.room_id);
      await (await ChannelsRepo).save(channel);
      res.status(200).json({
        data: roomToView,
        message: "room created successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't create room",
      });
    }
  }
  static async updateRoom(req: Request, res: Response) {
    try {
      const { description, title, message_allowed } = req.body;

      const updateables: Partial<RoomsEntity> = {
        title,
        description,
        message_allowed,
      };

      const user = Utils.getAuthenticatedUser(req);
      const { room_id } = req.params;
      const room = await RoomsController.roomExist(room_id);
      if (!room) {
        res.status(404).json({
          message: `room with id '${room_id}' does not exist`,
        });
        return;
      }
      const channel = await ChannelsController.channelExist(room?.channel_id);

      const isAuthorized = ChannelsController.hasAccess(channel, user);
      if (!isAuthorized) {
        res.status(403).json({
          message: "Unauthorized",
        });
        return;
      }
      room.update(updateables);
      await (await RoomsRepo).save(room);
      res.status(200).json({
        message: "room updated successfully",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't update room",
      });
    }
  }
  static async deleteRoom(req: Request, res: Response) {
    try {
      const user = Utils.getAuthenticatedUser(req);
      const { room_id } = req.params;
      const room = await RoomsController.roomExist(room_id);
      if (!room) {
        res.status(404).json({
          message: `room with id '${room_id}' does not exist`,
        });
        return;
      }
      const channel = (await ChannelsController.channelExist(
        room?.channel_id
      )) as ChannelsEntity;

      const isAuthorized = ChannelsController.hasAccess(channel, user);
      if (!isAuthorized) {
        res.status(403).json({
          message: "Unauthorized",
        });
        return;
      }
      await (await RoomsRepo).remove(room?.entityId);

      // remove the room id and resave the channel
      channel.removeRoomId(room_id);
      await (await ChannelsRepo).save(channel);
      // remove(delete) the room
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't delete room",
      });
    }
  }
  static async addMemberToRoom(req: Request, res: Response) {
    try {
      const { room_id } = req.params;
      const user = Utils.getAuthenticatedUser(req);
      const room = await RoomsController.roomExist(room_id);
      if (!room) {
        res.status(404).json({
          message: `room with id '${room_id}' does not exist`,
        });
        return;
      }
      // check if the user was already a member
      const alreadyMember = await (await RoomsRepo)
        .search()
        .where("members")
        .contains(user?.user_id)
        .and("room_id")
        .equal(room_id)
        .returnFirst();
      if (alreadyMember) {
        res.status(200).json({
          message: "already a member",
          data: null,
        });
        return;
      }
      room.addMemberId(user?.user_id);
      await (await RoomsRepo).save(room);

      res.status(200).json({
        message: "member added successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't add member to room",
      });
    }
  }
  static async removeMemberFromRoom(req: Request, res: Response) {
    try {
      const { room_id } = req.params;
      const user = Utils.getAuthenticatedUser(req);
      const room = await RoomsController.roomExist(room_id);
      if (!room) {
        res.status(404).json({
          message: `room with id '${room_id}' does not exist`,
        });
        return;
      }
      // check if the user was a member
      const isMember = await (await RoomsRepo)
        .search()
        .where("members")
        .contains(user?.user_id)
        .and("room_id")
        .equal(room_id)
        .returnFirst();
      if (!isMember) {
        res.status(200).json({
          message: "not a member",
          data: null,
        });
        return;
      }
      room.removeMemberId(user?.user_id);
      await (await RoomsRepo).save(room);

      res.status(200).json({
        message: "member removed successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't add member to room",
      });
    }
  }

  /**
   * Get members in a room
   * @param req
   * @param res
   * @returns
   */
  static async getMembers(req: Request, res: Response) {
    try {
      const { room_id } = req.params;
      const room = await RoomsController.roomExist(room_id);
      if (!room) {
        res.status(404).json({
          message: `room with id '${room_id}' does not exist`,
        });
        return;
      }
      const { members } = room;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't fetch members",
      });
    }
  }

  static async addNewRoom(newRoom: INewRoom): Promise<RoomsEntity | unknown> {
    try {
      const currentTime = Utils.currentTime;
      const roomId = Utils.generateID(false);
      const roomToSave: IRoom = merge(newRoom, {
        room_id: roomId,
        created_at: currentTime,
      });
      const roomSaved = await (
        await RoomsRepo
      ).createAndSave(roomToSave as unknown as EntityData);

      return roomSaved;
    } catch (error) {
      if (error) throw error;
    }
  }
  static async getRoomById(roomId: string) {
    return RoomsController.roomExist(roomId);
  }
  static async getRoomByIdAndChannelId(channelId: string, roomId: string) {
    return (await RoomsRepo)
      .search()
      .where("channel_id")
      .equal(channelId)
      .and("room_id")
      .equal(roomId)
      .returnFirst();
  }
  private static async roomExist(roomId: string): Promise<RoomsEntity | null> {
    return (await RoomsRepo)
      .search()
      .where("room_id")
      .equal(roomId)
      .returnFirst();
  }
}
