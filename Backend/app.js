const express =require("express");
const app= express();
const mongoose = require("mongoose");
app.use(express.json());
const cors=require("cors");
app.use(cors());
const bcrypt=require("bcryptjs");

const jwt = require("jsonwebtoken");

const JWT_SECRET="yfifgifiwfh5362628627()ejrviurviur7382247iueriwir3u63hk3igi34gii?[]ji646igyiyiu6";

//const mongourl="mongodb+srv://haarisr2000:Raj-mongodb23@cluster0.mjm9nj1.mongodb.net/?retryWrites=true&w=majority";
const mongourl="mongodb://localhost:27017";

mongoose.connect(mongourl,{
    useNewUrlParser:true,
})
.then(()=>{
    console.log("Connected to Database");
})
.catch((e) =>console.log(e));


app.listen(5000, ()=>{
    console.log("Server Started");
});



require("./userDetails");
require("./blogPost");
require("./comment");

const User=mongoose.model("UserInfo");
const BlogPost = mongoose.model("BlogPost");
const Comment = mongoose.model("Comment");

app.post("/register",async(req,res)=>{
    
    const{fname,lname,email,password}=req.body;

    const encryptedPassword=await bcrypt.hash(password,10);
    try {
        const oldUser= await User.findOne({email});

        if(oldUser){
            return res.send({error:"User Exist"});
        }
        await User.create({
            fname,
            lname,
            email,
            password:encryptedPassword,
        });
        res.send({status:"ok"});
    } catch (error) {
        res.send({status:"error"});
        
    }
});

app.post("/login-user",async(req,res)=>{
    const{email,password}=req.body;

        const user= await User.findOne({email});

        if(!user){
            return res.json({error:"User Not Found"});
        }
        
    if(await bcrypt.compare(password,user.password)){
        const token =jwt.sign({email:user.email},JWT_SECRET);

        if(res.status(201)){
            return res.json({status:"ok",data:token});
        }
        else{
            return res.json({error:"error"});
        }
    }
    res.json({status:"error",error:"Invalid Password"});
});

app.post("/userData", async (req, res) => {
    const {token} = req.body;
  
    try {
      const user = jwt.verify(token, JWT_SECRET);
      console.log(user);

      const useremail = user.email;
      User.findOne({email: useremail})
        .then((data)=>{
            res.send({ status:"ok", data:data});
        })
        .catch((error) =>{
            res.send({ status: "error", data: error });
        })
  
    } catch(error) {}
  });

//user
//Read

app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({ status: "error", error: "User not found" });
      }
  
      res.json({ status: "ok", user });
    } catch (error) {
      res.json({ status: "error" });
    }
  });
  
  // Update User Details
  app.put("/update-user/:id", async (req, res) => {
    const { fname,lname, email, password } = req.body;
    const userId = req.params.id;
  
    try {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fname,
          lname,
          email,
          password: encryptedPassword,
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.json({ status: "error", error: "User not found" });
      }
  
      res.json({ status: "ok", user: updatedUser });
    } catch (error) {
      res.json({ status: "error" });
    }
  });
  
  // Delete a User
  app.delete("/delete-user/:id", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const deletedUser = await User.findByIdAndRemove(userId);
  
      if (!deletedUser) {
        return res.json({ status: "error", error: "User not found" });
      }
  
      res.json({ status: "ok", message: "User deleted successfully" });
    } catch (error) {
      res.json({ status: "error" });
    }
  });

//blog
app.post("/create-blog", async (req, res) => {
    const { title, content, author, tags } = req.body;
  
    try {
      const blogPost = await BlogPost.create({
        title,
        content,
        author,
        tags,
      });
      res.send({ status: "ok", blogPost });
    } catch (error) {
      res.send({ status: error });
    }
  });
  
  app.get("/blog-posts", async (req, res) => {
    try {
      const blogPosts = await BlogPost.find().populate("author");
      res.json({ status: "ok", blogPosts });
    } catch (error) {
      res.json({ status: "error" });
    }
  });

  // Update a Blog Post
app.put("/update-blog/:id", async (req, res) => {
    const { title, content, tags } = req.body;
    const postId = req.params.id;
  
    try {
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(
        postId,
        {
          title,
          content,
          tags,
        },
        { new: true }
      );
  
      if (!updatedBlogPost) {
        return res.json({ status: "error", error: "Blog Post not found" });
      }
  
      res.json({ status: "ok", blogPost: updatedBlogPost });
    } catch (error) {
      res.json({ status: "error" });
    }
  });
  
  // Delete a Blog Post
  app.delete("/delete-blog/:id", async (req, res) => {
    const postId = req.params.id;
  
    try {
      const deletedBlogPost = await BlogPost.findByIdAndRemove(postId);
  
      if (!deletedBlogPost) {
        return res.json({ status: "error", error: "Blog Post not found" });
      }
  
      res.json({ status: "ok", message: "Blog Post deleted successfully" });
    } catch (error) {
      res.json({ status: "error" });
    }
  });

   //Comment
  // Create a Comment
app.post("/create-comment", async (req, res) => {
    const { commenterName, commentText, blogPostId } = req.body;
  
    try {
      const comment = await Comment.create({
        commenterName:commenterName,
        commentText:commentText,
        blogPost: blogPostId,
      });
  
      res.json({ status: "ok", comment });
    } catch (error) {
      res.json({ status: error });
    }
  });
  
  // Read Comments for a Blog Post
  app.get("/comments/:blogPostId", async (req, res) => {
    const blogPostId = req.params.blogPostId;
  
    try {
      const comments = await Comment.find({ blogPost: blogPostId })
        .populate("commenterName")
        .exec();
  
      res.json({ status: "ok", comments });
    } catch (error) {
      res.json({ status: "error" });
    }
  });
  
  // Update a Comment
  app.put("/update-comment/:id", async (req, res) => {
    const { commentText } = req.body;
    const commentId = req.params.id;
  
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { commentText },
        { new: true }
      );
  
      if (!updatedComment) {
        return res.json({ status: "error", error: "Comment not found" });
      }
  
      res.json({ status: "ok", comment: updatedComment });
    } catch (error) {
      res.json({ status: "error" });
    }
  });
  
  // Delete a Comment
  app.delete("/delete-comment/:id", async (req, res) => {
    const commentId = req.params.id;
  
    try {
      const deletedComment = await Comment.findByIdAndRemove(commentId);
  
      if (!deletedComment) {
        return res.json({ status: "error", error: "Comment not found" });
      }
  
      res.json({ status: "ok", message: "Comment deleted successfully" });
    } catch (error) {
      res.json({ status: "error" });
    }
  });
