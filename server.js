const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 8080
const cors = require("cors")
const path = require('path');
const {connectDB} = require("./MongoOperations.js")
const fs = require("fs")

// for cross origin resource sharing
app.use(cors())      
// for parsing application/json
app.use(express.json()) 
// making the build folder public
app.use(express.static(path.join(__dirname, 'build'))); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDB()
  //ensuring that the uploads folder exists
  if(!fs.existsSync(path.join(__dirname, 'uploads'))) 
    fs.mkdirSync(path.join(__dirname, 'uploads'));
})

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

require("./Auth/jwt.js")(app)
require("./Archiever.js")(app)
require("./getSizeOnDisk.js")(app)
require("./serveTarget.js")(app)
require("./serveClient.js")(app)
require("./upload.js")(app)