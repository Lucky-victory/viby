import { Entity, Schema, Repository } from "redis-om";
// import {harpee,HType} from 'harpee';
import { client } from "../db";
import { RoomsRepo } from "./rooms";

export interface ChannelsEntity {
  title: string;
  description: string;
  owner_id: string;
  channel_id: string;
  is_public: boolean;
  channel_picture: string;
  channel_cover: string;
  members: string[];
  created_at: string;
  rooms: string[];
}

export class ChannelsEntity extends Entity {
  addRoomId(roomId: string) {
    this.rooms.push(roomId);
  }
  addMemberId(memberId: string) {
    this.members.push(memberId);
  }
  removeRoomId(roomId: string) {
    this.rooms = this.rooms.filter((_roomId) => _roomId !== roomId);
  }
  removeMemberId(memberId: string) {
    this.members = this.members.filter((_memberId) => _memberId !== memberId);
  }
  isMember(userId: string) {
    return this.members.indexOf(userId) !== -1;
  }
  async getRooms() {
    return await Promise.all(
      this.rooms.map(async (roomId) => {
        const rooms = await (await RoomsRepo)
          .search()
          .where("channel_id")
          .equal(this.channel_id)
          .and("room_id")
          .equal(roomId)
          .returnFirst();
        return rooms;
      })
    );
  }

  update({
    title,
    description,
    channel_cover,
    channel_picture,
    is_public,
  }: Partial<ChannelsEntity>) {
    // assign new values if provided, otherwise reassign to previous values;
    this.title = title || this.title;
    this.description = description || this.description;
    this.channel_cover = channel_cover || this.channel_cover;
    this.channel_picture = channel_picture || this.channel_picture;
    this.is_public =
      typeof is_public !== "undefined" ? is_public : this.is_public;
  }
}

const ChannelsSchema = new Schema(ChannelsEntity, {
  channel_id: { type: "string" },
  title: { type: "text", sortable: true },
  description: { type: "text", sortable: true },
  owner_id: { type: "string" },
  rooms: { type: "string[]" },
  is_public: { type: "boolean" },
  channel_picture: { type: "string" },
  channel_cover: { type: "string" },
  created_at: { type: "date", sortable: true },
  members: { type: "string[]" },
});

export const ChannelsRepo: Promise<Repository<ChannelsEntity>> = (async () => {
  const repo = await (await client).fetchRepository(ChannelsSchema);
  await repo.createIndex();
  return repo;
})();
