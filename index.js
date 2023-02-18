const express = require("express");
const { connection } = require("./Config/db");
const { authenticate } = require("./Middlewares/authenticate.middleware");
const { noteRouter } = require("./Routes/Note.routes");
const { userRouter } = require("./Routes/User.routes");
const cors = require("cors");
require('dotenv').config()
const app = express();
app.use(express.json());
app.use(cors({
	origin:"*"
}));

app.get("/", (req, res) => {
	res.send("Homepage");
});

app.use("/users", userRouter);
app.use(authenticate);
app.use("/notes", noteRouter);
app.listen(process.env.PORT, async () => {
	try {
		await connection;
		console.log("Connected to DB");
	} catch (err) {
		console.log(err.message);
	}
	console.log(`Server is running at ${process.env.PORT}`);
});
