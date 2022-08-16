import { expressjwt } from "express-jwt";
import config from "../config";

export class AuthMiddleware {
  /**
   * Retrieves and validate a JWT token
   * @returns
   */
  static authenticate() {
    return expressjwt({
      algorithms: ["HS256"],
      secret: config.jwt_secret as string,
    });
  }
}
