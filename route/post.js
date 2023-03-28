const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const Post = require("../model/postSchema");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

router.post("/add-post", auth, async (req, res) => {
  const {content, title, type, link} = req.body;
  const regex = new RegExp('\<img.*?src="(.*?)"');
  let imageUrl = content.match(regex);
  if (!imageUrl)
    imageUrl = "";
  let newPost = {
    content : content,
    title : title,
    imageURL : imageUrl[1],
    view: 0,
    type: type,
    link: link,
    privacy: "Public"
  }
  await Post.create(newPost);
  res.json({ message: "Post added successfully!", statusCode: 200 });
});

router.post("/update-post", auth, async (req, res) => {
  const {content, title, id, status, type} = req.body;
  await Post.findOneAndUpdate({_id:id},{content:content, title:title, privacy: status, type:type, modifiedAt: Date.now()});
  res.json({ message: "Post updated successfully!", statusCode: 200 });
});

router.post("/delete-post", auth, async (req, res) => {
  const {id} = req.body;
  const post = await Post.findById(id);
  const content = post.content;
  let regex = /\<img.*?src="(.*?)"/g;
  const imageTags = content.match(regex);
  for (const imageTag of imageTags){
    regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
    let imageUrl = imageTag.match(regex);
    if (imageUrl){
      const publicId = imageUrl[0].split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
  }
  await Post.deleteOne({_id:id});
  res.json({ message: "Post deleted successfully!", statusCode: 200 });
});

router.post("/get-post", auth, async (req, res) => {
  const {type} = req.body;
  const allPosts = await Post.find({type: type})
  res.json({ posts: allPosts, statusCode: 200 });
});


module.exports = router