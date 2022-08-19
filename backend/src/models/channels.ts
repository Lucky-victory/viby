import { Entity, Schema, Repository, Client } from "redis-om";

import { redis } from "../db";

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
  async addRoomId(roomId: string) {
    this.rooms.push(roomId);
  }
  async addMemberId(memberId: string) {
    this.members.push(memberId);
  }
  removeRoomId(roomId: string) {
    this.rooms = this.rooms.filter((_roomId) => _roomId !== roomId);
  }
  removeMemberId(memberId: string) {
    this.members = this.members.filter((_memberId) => _memberId !== memberId);
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
  const clientOM = await new Client().use(redis);
  const repo = clientOM.fetchRepository(ChannelsSchema);
  await repo.createIndex();
  return repo;
})();
