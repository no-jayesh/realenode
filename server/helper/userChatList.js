import userChatListModel from "../../../models/userChatList";


const userChatListServices = {
    userChatListCreate:async(insertObj)=>{
        return await userChatListModel(insertObj).save();
    },
    userChatListData:async(query)=>{
        return await userChatListModel.find(query);
    },
    userChatListList:async(query)=>{
        return await userChatListModel.paginate(query);
    },
    userChatListUpdate:async(query,updateObj)=>{
        return await userChatListModel.findByIdAndUpdate(query,updateObj,{new:true});
    },
    multiUpdateuserChatList: async (query, updateObj) => {
        return await userChatListModel.updateMany(query, updateObj, { multi: true });
    },
}

module.exports = { userChatListServices };