import config from "config";
import jwt from "jsonwebtoken";
import userModel from "../models/user";
import apiError from "./apiError";
import responseMessage from "../../assets/responseMessage";

module.exports = {

  async verifyToken(req, res, next) {
    try {
      if (req.headers.token) {
        let result = jwt.verify(req.headers.token, config.get('jwtsecret'));
        if ("ADMIN" === result.userType) {
          let result = jwt.verify(req.headers.token, config.get('jwtsecret'));
          let userData = await userModel.findOne({ _id: result.id||result._id});
          if (!userData) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
          }
          else {
            if (userData.status == "BLOCK") {
              throw apiError.forbidden(responseMessage.BLOCK_BY_ADMIN);
            }
            else if (userData.status == "DELETE") {
              throw apiError.unauthorized(responseMessage.DELETE_BY_ADMIN);
            }
            else {
              req.userId = result.id||result._id;
              req.userDetails = result;
              next();
            }
          }
        } else {
          let userData = await userModel.findOne({ _id: result.id||result._id });
          if (!userData) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
          }
          else {
            if (userData.status == "BLOCK") {
              throw apiError.forbidden(responseMessage.BLOCK_BY_ADMIN);
            }
            else if (userData.status == "DELETE") {
              throw apiError.unauthorized(responseMessage.DELETE_BY_ADMIN);
            }
            else {
              req.userId = result.id||result._id;
              req.userDetails = result;
              next();
            }
          }
        }

      } else {
        throw apiError.badRequest(responseMessage.NO_TOKEN);
      }

    } catch (error) {
      return next(error);
    }
  },



  async verifyAdminToken(req, res, next) {
    try {
      if (req.headers.token) {
        let result = jwt.verify(req.headers.token, config.get('jwtsecret'));
        if ("ADMIN" === result.userType) {
          let result = jwt.verify(req.headers.token, config.get('jwtsecret'));
          let userData = await userModel.findOne({ _id: result.id||result._id});
          if (!userData) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
          }
          else {
            if (userData.status == "BLOCK") {
              throw apiError.forbidden(responseMessage.BLOCK_BY_ADMIN);
            }
            else if (userData.status == "DELETE") {
              throw apiError.unauthorized(responseMessage.DELETE_BY_ADMIN);
            }
            else {
              req.userId = result.id||result._id;
              req.userDetails = result;
              next();
            }
          }
        } 
        else {
          throw apiError.badRequest(responseMessage.ADMIN_TOKEN);
        }
      }}

     catch (error) {
      return next(error);
    }
  },
}
