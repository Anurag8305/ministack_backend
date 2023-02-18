const express = require("express");
const { UserModel } = require("../Models/User.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//get
userRouter.get("/", async (req, res) => {
	const user = await UserModel.find();
	if (user) res.send(user);
	else res.send("Count'not get users");
});
//register new user
userRouter.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	try {
		bcrypt.hash(password, 5, async (err, hash) => {
			if(err) res.send(err.message)
			else{
				const user = new UserModel({ name, email, password: hash });
				await user.save();
				res.send({ msg: "New user has been registered" });
			}
		});
	} catch (err) {
		res.send({ msg: "Something went wrong", err: err.message });
	}
});

//login user
userRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await UserModel.find({ email });
		if (user.length > 0) {
			bcrypt.compare(password, user[0].password, (err, result) => {
				if (result) {
					let token = jwt.sign({ userID: user[0]._id }, "shhhhh");
					res.send({ msg: "Logged in", token: token });
				} else {
					res.send({ msg: "Something went wrong", err: err });
				}
			});
		} else res.send({ msg: "Wrong Credentials" });
	} catch (err) {
		res.send({ msg: "Something went wrong", err: err.message });
	}
});

//delete user
userRouter.delete("/delete/:id",async(req,res)=>{
    const Id=req.params.id
    try{
        await UserModel.findByIdAndRemove({_id:Id})
    }catch(err){
        console.log(err)
        res.send({"msg":"can not delete","error":err.message})
    }
    res.send({"msg":"deleted successfully"})
})

//Becrypt is a package which takes out password and saves in our database
//this process is known as hashing

module.exports = { userRouter };
