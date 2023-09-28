const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (e) {
        return res.status(500).json(e);
      }
    }
    try {
      const _id = req.params.id;
      const user = await User.findByIdAndUpdate(_id, { $set: req.body });
      res.status(200).send("Your account has been updated");
    } catch (error) {
      res.status(404).send(error);
    }
  } else {
    return res.status(403).send("You can only update only your account");
  }
});
// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).send("Your account has been deleted successfully");
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    res.status(403).send("You can only delete your Account");
  }
});
// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
// follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).send("User has been followed")
      } else {
        res.status(403).send("You already follow this account");
      }
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    res.status(403).send("You can't follow yourself");
  }
});
// unfollow a user
router.put("/:id/unfollow", async (req, res)=>{
  if(req.body.userId !== req.params.id){
    try{
      const currUser = await User.findById(req.body.userId)
      const user = await User.findById(req.params.id)
      if(user.followers.includes(req.body.userId)){
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).send("Successfully unfollowed the user")
      }
      else{
        res.status(403).send("You dont follow this account")
      }
    }
    catch(e){
      res.status(500).send(e)
    }
  }
  else{
    res.status(404).send("You can't unfollow this account")
  }
})
module.exports = router;
