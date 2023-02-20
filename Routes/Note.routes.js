const express = require("express");
const { NoteModel } = require("../Models/Note.model");

const noteRouter = express.Router();

//get notes
noteRouter.get("/", async (req, res) => {
	const notes = await NoteModel.find();
	res.send(notes);
});


noteRouter.get("/notes", async(req,res)=>{
    const userID_making_req=req.body.userID;
    const note=await NoteModel.find({userID:userID_making_req});
    res.send(note)
})
//create notes
noteRouter.post("/create", async (req, res) => {
	const payload = req.body;
	const note = new NoteModel(payload);
	await note.save();
	res.send({ msg: "Notes Created" });
});

//delete notes
noteRouter.delete("/delete/:id", async (req, res) => {
	const id = req.params.id;
	const note = await NoteModel.findOne({ _id: id });
	const userID_in_note = note.userID;
	const userID_making_req = req.body.userID;
	console.log(userID_in_note,userID_making_req)
	try {
		if (userID_making_req !== userID_in_note) {
			res.send({ msg: "You are not AUthorized" });
		} else {
			await NoteModel.findByIdAndDelete({ _id: id });
			res.send({ msg: `Note with id ${id} has been updated` });
		}
	} catch (err) {
		console.log(err);
		res.send({ msg: "Something went wrong" });
	}
});

//update notes
noteRouter.patch("/update/:id", async (req, res) => {
	const payload = req.body;
	const id = req.params.id;
	const note = await NoteModel.findOne({ _id: id });
	const userID_in_note = note.userID;
	const userID_making_req = req.body.userID;
	console.log(userID_in_note,userID_making_req)
	try {
		if (userID_making_req !== userID_in_note) {
			res.send({ msg: "You are not AUthorized" });
		} else {
			await NoteModel.findByIdAndUpdate({ _id: id }, payload);
			res.send({ msg: `Note with id ${id} has been updated` });
		}
	} catch (err) {
		console.log(err);
		res.send({ msg: "Something went wrong" });
	}
});

module.exports = { noteRouter };
