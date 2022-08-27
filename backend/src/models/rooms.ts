import { Entity, Schema, Repository } from "redis-om";

import { client } from "../db";

export interface RoomsEntity {
  title: string;
  description?: string;
  room_id: string;
  channel_id: string;
  created_at: string;
  members: string[];
  message_allowed?: boolean;
  owner_id: string;
}

export class RoomsEntity extends Entity {
  async addMemberId(memberId: string) {
    this.members.push(memberId);
  }
  async removeMemberId(memberId: string) {
    this.members = this.members.filter((_memberId) => _memberId !== memberId);
  }
  async update({ title, description, message_allowed }: Partial<RoomsEntity>) {
    this.title = title || this.title;
    this.description = description || this.description;
    this.message_allowed =
      typeof message_allowed !== "undefined"
        ? message_allowed
        : this.message_allowed;
  }
  isMember(userId: string) {
    return this.members.indexOf(userId) !== -1;
  }
}

const RoomsSchema = new Schema(RoomsEntity, {
  channel_id: { type: "string" },
  title: { type: "text", sortable: true },
  description: { type: "text", sortable: true },
  room_id: { type: "string" },
  owner_id: { type: "string" },
  members: { type: "string[]" },
  message_allowed: { type: "boolean" },
  created_at: { type: "date", sortable: true },
});

export const RoomsRepo: Promise<Repository<RoomsEntity>> = (async () => {
  const repo = await (await client).fetchRepository(RoomsSchema);

  await repo.createIndex();
  return repo;
})();
