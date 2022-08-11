import { Entity, Schema, Repository, Client } from "redis-om";

import { redis } from "../db";

export interface UsersEntity {
  username: string;
  user_id: string;
  fullname: string;
  email: string;
  password: string;
  status: string;
  profile_picture: string;
  cover_picture: string;
  bio: string;
  friends: string[];
  created_at: string;
}

export class UsersEntity extends Entity {
  get userName() {
    return this.username;
  }
}

const UsersSchema = new Schema(UsersEntity, {
  user_id: { type: "string" },
  username: { type: "text", sortable: true },
  fullname: { type: "text", sortable: true },
  email: { type: "string" },
  password: { type: "string", sortable: false },
  profile_picture: { type: "string" },
  cover_picture: { type: "string" },
  created_at: { type: "date", sortable: true },
  bio: { type: "text" },
  status: { type: "string" },
  friends: { type: "string[]" },
});

export const UsersRepo = (async () => {
  const clientOM = await new Client().use(redis);
  return clientOM.fetchRepository(UsersSchema);
})();
