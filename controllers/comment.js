const Comment = require("../models/Comment");
const Like = require("../models/Like");
const getComments = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({
      success: false,
      message: "post id required",
    });
  }
  try {
    const comments = await Comment.find({ belong_to: req.params.id });
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  const comment = req.body;
  try {
    await Comment.create(comment);
    res.status(201).json({
      success: true,
      message: "create commets successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletComment = async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "delete commets successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const likeComment = async (req, res) => {
  const {  id:userId } = req.body;
  const {id} = req.params
  console.log(id , userId)
  try {
    const like = await Like.find({ commentId:id , userId});
    const foundComment = await Comment.findById(id);
    console.log(foundComment)
    console.log(like[0])

    if (like[0] === undefined) {
      await Like.create({ commentId:id , userId });
      foundComment.likes++;
      foundComment.save();
      console.log(foundComment?.likes)
      res.status(201).send("liked comment success fully");
      return
    }

    if(like[0] !== undefined){
       if(foundComment?.likes === 0){
        return res.status(204)
      }
        await Like.deleteOne({ commentId:id , userId });
        foundComment.likes--;
        foundComment.save();
        console.log(foundComment?.likes)
        res.status(201).send("liked comment successfully");
    }
  } catch (error) {
    console.log(error.message)
  }
};

module.exports = {
  addComment,
  getComments,
  likeComment,
  deletComment,
};
