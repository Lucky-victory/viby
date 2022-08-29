import dotenv from "dotenv";
dotenv.config();

const { REDIS_DB_URL, JWT_SECRET, JWT_EXPIRATION = "2h" } = process.env;
interface Config {
  redis_db_url: string;
  jwt_secret: string;
  jwt_expiration: string;
  origin?: string;
}
const config: Config = {
  redis_db_url: REDIS_DB_URL as string,
  jwt_secret: JWT_SECRET as string,
  jwt_expiration: JWT_EXPIRATION as string,
};
export default config;
