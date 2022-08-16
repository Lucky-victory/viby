import { Entity, Schema, Repository, Client } from "redis-om";

import { redis } from "../db";

interface ChannelsEntity {
  title: string;
  description: string;
  owner: string;
  moderators: string[];
  channel_id: string;
  isPublic: boolean;
  channel_picture: string;
  channel_cover: string;
  memebers: string[];
  created_at: string;
}

class ChannelsEntity extends Entity {
  async channelTitle() {
    return this.title;
  }
}

const ChannelsSchema = new Schema(ChannelsEntity, {
  channel_id: { type: "string" },
  title: { type: "text", sortable: true },
  description: { type: "text", sortable: true },
  owner: { type: "string" },
  moderators: { type: "string[]" },
  isPublic: { type: "boolean" },
  channel_picture: { type: "string" },
  channel_cover: { type: "string" },
  created_at: { type: "date", sortable: true },
  members: { type: "string[]" },
});

export const ChannelsRepo = (async () => {
  const clientOM = await new Client().use(redis);
  return clientOM.fetchRepository(ChannelsSchema);
})();
