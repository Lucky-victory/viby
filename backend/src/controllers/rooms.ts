import { Request, Response } from "express";

import { INewRoom, IRoom } from "../interfaces/rooms.interface";

import merge from "just-merge";
import { RoomsEntity, RoomsRepo } from "../models/rooms";
import { EntityData } from "redis-om";
import ChannelsController from "./channels";
import Utils from "../utils";
import { ChannelsEntity, ChannelsRepo } from "../models/channels";

// todo, transform entities to json
export default class RoomsController {
  static async createRoom(req: Request, res: Response) {
    try {
      const { channel_id } = req.params;
      const user = Utils.getAuthenticatedUser(req);
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

      const { title, description } = req.body;
      const newRoom: INewRoom = {
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
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't create room",
      });
    }
  }
  static async updateRoom(req: Request, res: Response) {
    try {
      const { description, title } = req.body;
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
      room["description"] = description || room["description"];
      room["title"] = title || room["title"];

      await (await RoomsRepo).save(room);
      res.status(200).json({
        message: "room updated successfully",
      });
    } catch (error) {
      res.status(500).json({
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
    } catch (error) {
      res.status(500).json({
        message: "An error occurred, couldn't delete room",
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
  private static async roomExist(roomId: string): Promise<RoomsEntity | null> {
    return (await RoomsRepo)
      .search()
      .where("room_id")
      .equal(roomId)
      .returnFirst();
  }
}
