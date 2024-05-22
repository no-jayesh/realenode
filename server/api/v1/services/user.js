
import userModel from "../../../models/user";
import status from '../../../enums/status';
import userType from "../../../enums/userType";


const userServices = {
  deleteUser: async (query) => {
    return await userModel.deleteOne(query);
  },
  findAllUsers: async (query) => {
    return await userModel.find(query);
  },
  createUser: async (insertObj) => {
    return await userModel.create(insertObj);
  },
  findUser: async (query) => {
    return await userModel.findOne(query)
  },
  findCount: async (query) => {
    return await userModel.count(query);
  },

  updateUser: async (query, updateObj) => {
    return await userModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  updateUserById: async (query, updateObj) => {
    return await userModel.findByIdAndUpdate(query, updateObj, { new: true });
  },

  insertManyUser: async (obj) => {
    return await userModel.insertMany(obj);
  },


  paginateSearch: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE, } , userType: { $in: [userType.INDIVIDUAL, userType.ORGANIZATION] } };
    const { search, fromDate, toDate, page, limit, status1 } = validatedBody;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ]
    }
    if (status1) {
      query.status = status1
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate }; 
    }
    if (fromDate && toDate) {
      query.$and = [ 
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      // sort: { createdAt: -1 }
    };
    return await userModel.paginate(query, options);
  },


  subAdminPaginateSearch: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE }, userType: userType.SUBADMIN };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ]
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    } 
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 }
    };
    return await userModel.paginate(query, options);
  },
  agentPaginateSearch: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE }, userType: userType.AGENT };
    const { search, fromDate, toDate, page, limit, status1 } = validatedBody;
    console.log("jnbnbnbnbbnbnbnbnnnnnnnnnn", validatedBody)
    if (search) {
      query.$or = [
        {
          "$expr": {
            "$regexMatch": {
              "input": { "$concat": ["$firstName", " ", "$surName"] },
              "regex": search,
              "options": "i"
            }
          }
        },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ]
    }
    if (status1) {
      query.status = status1
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 },
      populate: { path: "vehicleType" }
    };
    return await userModel.paginate(query, options);
  },
  expertPaginateSearch: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE }, userType: userType.EXPERT };
    const { search, fromDate, toDate, page, limit, status1 } = validatedBody;
    if (search) {
      query.$or = [
        {
          "$expr": {
            "$regexMatch": {
              "input": { "$concat": ["$firstName", " ", "$surName"] },
              "regex": search,
              "options": "i"
            }
          }
        },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ]
    }
    if (status1) {
      query.status = status1
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 },
      populate: { path: "trade" }
    };
    return await userModel.paginate(query, options);
  },

  findAllUser: async (query) => {
    return await userModel.find(query)
  },

  paginateSearchAll: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE }, userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } };
    const { search, fromDate, toDate, page, limit, userType1 } = validatedBody;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ]
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 }
    };
    return await userModel.paginate(query, options);
  },
  async userWithAggregation(validateBody) {
    let data = []
    if (validateBody.type == "AGENT") {
      data.push({
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": [parseFloat(validateBody.lat), parseFloat(validateBody.lng)]
          },
          "spherical": true,
          "distanceField": "distance",
          // "distanceMultiplier": 0.000621371,
          "maxDistance": 20,
        }
      }, {
        $match: {
          "status": status.ACTIVE
        }
      }, {
        $lookup:
        {
          from: 'service',
          localField: "trade",
          foriegnField: "_id",
          as: 'tradeDetails',
        }
      }, {
        $match: {
          "trade": { $in: validateBody.serviceId }
        }
      })
    }
    else {
      data.push({
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": [parseFloat(validateBody.lat), parseFloat(validateBody.lng)]
          },
          "spherical": true,
          "distanceField": "distance",
          // "distanceMultiplier": 0.000621371,
          "maxDistance": 20,
        }
      }, {
        $match: {
          "status": status.ACTIVE
        }
      }, {
        $lookup:
        {
          from: 'vehicle',
          localField: "vehicleType",
          foriegnField: "_id",
          as: 'vehicleDetails',
        }
      })
    }
    let aggregate = userModel.aggregate(data)
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 }
    };
    return await userModel.aggregatePaginate(aggregate, options)
  },
  paginateSearchWithoutLogininUser: async (validatedBody, userId) => {
    let query = { _id: { $ne: userId }, status: { $ne: status.DELETE } };
    const { search, status1, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ]
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 200,
      sort: { createdAt: -1 },
      select: (["firstName", "lastName", "profilePic", "mobileNumber",])


    };
    let data = await userModel.paginate(query, options)
    return data;
  },
}

module.exports = { userServices };