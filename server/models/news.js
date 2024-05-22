import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";


 const newsSchema = new Schema({
    source: {
      id: { type: String },
      name: { type: String }
    },
    author: { type: String },
    title: { type: String },
    description: { type: String },
    url: { type: String },
    urlToImage: { type: String },
    publishedAt: { type: Date },
    content: { type: String },
  }, 
  { timestamps: true }
)

newsSchema.plugin(mongoosePaginate);
newsSchema.plugin(mongooseAggregatePaginate);

export default Mongoose.model('news', newsSchema);



  
