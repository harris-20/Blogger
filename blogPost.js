const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title:String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
  creationDate: { type: Date, default: Date.now },
  tags:[String],
},{
    collection:"BlogPost",
}
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
