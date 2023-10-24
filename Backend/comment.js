
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commenterName:{ type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
  //String
  commentText:String,
  creationDate: { type: Date, default: Date.now },
  blogPost: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
},{
    collection:"Comment",
});

module.exports = mongoose.model('Comment', commentSchema);
