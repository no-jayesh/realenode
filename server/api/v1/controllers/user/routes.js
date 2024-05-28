import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import uploadHandler from "../../../../helper/uploadHandler";   

export default Express.Router()


    .post('/userEnquiry', controller.userEnquiry)
    .get('/newsList', controller.newsList)

