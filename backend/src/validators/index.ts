import { NextFunction, Request, Response } from "express";
import { check, ValidationError, validationResult } from "express-validator";

export default class Validators {
  static validateSignUp() {
    return [
      check("fullname")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name is required!")
        .isString()
        .withMessage("Must be a valid name!")
        .isLength({ min: 3, max: 20 })
        .withMessage("Name must be within 3 to 20 character!"),
      check("email").normalizeEmail().isEmail().withMessage("Invalid email!"),
      check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is empty!")
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be 6 to 20 characters long!")
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/
        )
        .withMessage(
          "Must contain at least one number,one uppercase ,one lowercase and one special character"
        ),
    ];
  }
  static validateSignIn() {
    return [
      check("username_or_email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email / username and  password are required!"),
      check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email / username and password are required!"),
    ];
  }

  static validateChannelAdd() {
    return [
      check("title")
        .trim()
        .not()
        .isEmpty()
        .withMessage("title is required!")
        .isString()
        .withMessage("Must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("title must be within 3 to 20 character!"),
      //  check("is_public")
      // .isBoolean()
      //.withMessage("'is_public' must be a boolean "),
    ];
  }
  static validateRoomAdd() {
    return [
      check("title")
        .trim()
        .not()
        .isEmpty()
        .withMessage("title is required!")
        .isString()
        .withMessage("Must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("title must be within 3 to 20 character!"),
    ];
  }
  static validationResult(req: Request, res: Response, next: NextFunction) {
    let results = validationResult(req).array() as ValidationError[];

    if (!results.length) {
      return next();
    }
    results = results.map((result) => {
      return {
        value: result.value,
        message: result.msg,
        param: result.param,
      };
    }) as unknown as ValidationError[];

    res.status(400).json({
      errors: results,
    });
  }
}
