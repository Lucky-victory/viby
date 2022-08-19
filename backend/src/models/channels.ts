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
  async channelTitle() {
    return this.title;
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
