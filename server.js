const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 8080
const cors = require("cors")
const path = require('path');
const { connectDB } = require("./MongoOperations.js")
const { hasAccess } = require("./Auth/Middlewares.js")
const fs = require("fs")
const EnsureEarliestActivity = require("./EnsureEarliestActivity.js")

// for cross origin resource sharing
app.use(cors())
// for parsing application/json
app.use(express.json())
// making the build folder public
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDB()
  //ensuring that the uploads folder exists
  if (!fs.existsSync(path.join(__dirname, 'uploads')))
    fs.mkdirSync(path.join(__dirname, 'uploads'));
    EnsureEarliestActivity()
})



//this route is used to validate the token, it is called when a page logs in, it checks if the token is valid
//if it is valid then it sends a response to the client - "Valid token"
//the validation is done using the hasAccess function
app.get("/validateToken", hasAccess, (req, res) => {
  res.json({
    success: true,
    message: "Valid token"
  })
})

require("./Auth/jwt.js")(app)
require("./Archiever.js")(app)
require("./getSizeOnDisk.js")(app)
require("./serveTarget.js")(app)
require("./upload.js")(app)
require("./serveAdmin.js")(app)
require("./pingBot.js")(app)

//this route is used to serve the react app
//it should be the last route because it is a catch all route, so if no other route is matched then this route is used
//this is done so that the react app can handle the routing, and the server doesn't interfere with it

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});