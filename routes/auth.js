const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

// register
router.post("/register", async (req, res) => {
  try {
    // generate hashed password using bcrypt so that the password is not directly visible in the mongodb database.
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)
    const user = new User({
      username:req.body.username,
      password:hashedPass,
      email:req.body.email
    })
    const userdata = await user.save();
    res.status(201).send(userdata);
  } catch (error) {
    console.log(error);
  }
});

// login
router.post("/login", async (req, res)=>{
  try{
    const user = await User.findOne({email:req.body.email})
    if(!user){
      res.status(404).send("User not found")
    }
    else{
      const validPass = await bcrypt.compare(req.body.password, user.password)
      if(!validPass){
        res.status(400).send("Wrong Password")
      }
      else{
        res.status(200).send(user)
      }
    }
  }
  catch(e){
    res.status(500).json(e)
  }
  
})
module.exports = router;