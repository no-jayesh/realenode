import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from '../enums/status';

const userSchema = new Schema({
  name: { type: 'string'},
  email: { type:'string'},
  countryCode: { type:'string'},
  mobileNumber: { type:'string'},
  message: { type:'string'},
  location: { type:'string'},
  status: { type:'string',default:"New" },
},
{ timestamps: true } 

);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);

export default Mongoose.model('User', userSchema);



  