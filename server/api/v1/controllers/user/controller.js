import Joi from "joi";
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
import _ from "lodash";
import config from "config";
import apiError from '../../../../helper/apiError';
import response from '../../../../../assets/response';
import responseMessage from '../../../../../assets/responseMessage';
// import _ from 'lodash';//
import bcrypt from 'bcryptjs';
import commonFunction from '../../../../helper/util';
import jwt from 'jsonwebtoken';
import newsModel from '../../../../models/news';
import status from '../../../../enums/status';
import userType from "../../../../enums/userType";
import { userServices } from '../../services/user';
import axios from 'axios'
const { userCheck, paginateSearch, insertManyUser, createAddress, checkUserExists, emailMobileExist, createUser, findUser, updateUser, updateUserById, checkSocialLogin, findUser1 } = userServices;
export class userContenar {
    //create register api with swagger 
    /**
    * @swagger
    * /user/userEnquiry:
    *   post:
    *     summary: user Enquiry
    *     tags:
    *       - user
    *     description: user login
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: user Enquiry
    *         description: user Enquiry
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/definitions/userEnquiry'
    *     responses:
    *       200:
    *         description: Returns success message
    *       404:
    *         description: User not found || Data not found.
    *       501:
    *         description: Something went wrong!
    */
    async userEnquiry(req, res, next) {
        var validationSchema = Joi.object({
            email: Joi.string().required(),
            name: Joi.string().required(),
            countryCode: Joi.string().optional(),
            mobileNumber: Joi.string().optional(),
            message: Joi.string().required(),
            location: Joi.string().optional(),


        });
        try {
            var validatedBody = await validationSchema.validateAsync(req.body);
            let userResult = await findUser({
                email: validatedBody.email.toLowerCase()
            });
            if (userResult) {
                throw apiError.notFound(responseMessage.USER_EXIT);
            }
            await commonFunction.Enquiry(validatedBody.email, validatedBody.name)
            let userData = await createUser(validatedBody)



            return res.json(new response(responseMessage.ENQUIRY));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }
    
    // list all news articles 
     /**
    * @swagger
    * /user/newsList:
    *   get:
    *     summary: news list for users
    *     tags:
    *       - news
    *     description: news list 
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: Returns success message
    *       404:
    *         description: news not found || Data not found.
    *       501:
    *         description: Something went wrong!
    */
     async newsList(req, res, next) { 
        try {
        const responseData= await axios.get(`https://newsapi.org/v2/everything?q=real estate&apiKey=${config.get('newsApiKey')}`);
        await newsModel.deleteMany({});
        let articles = responseData.data.articles;
        articles = articles.filter(article => 
            article.title && article.description && article.url && article.publishedAt && article.source.id && article.source.name
        );
        articles = shuffleArray(articles).slice(0, 6);
       const newsData=  await newsModel.insertMany(articles);
        return res.json(new response (newsData,responseMessage.NEWS_ADDED));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }



}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export default new userContenar()

