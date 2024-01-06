const { writeDB, readDB } = require('./MongoOperations');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const path = require('path');
const ManageUsers = require('./ManageUsers');


module.exports = (app) => {

    //this route is used to upload the image to the server
    //first it checks if there is an folder for the client in the uploads folder
    //if there is no folder then it creates one
    //then it writes the image to the uploads folder with the name of the client and the current time as the name of the image
    //then it sends a response to the client - "Data received"
    //the ManageUsers function is called to update the database

    app.post('/uploadImage', upload.single('image'), (req, res) => {

        console.log('Received body:', req.body);
        console.log('Received file:', req.file);
    
        // Create a folder for the client if it doesn't exist [new user]
        if (!fs.existsSync(path.join(__dirname, 'uploads', req.body.clientName))) {            
            fs.mkdirSync(path.join(__dirname, 'uploads', req.body.clientName));
        }
        const textData = req.body;
        const image = req.file;
        filename = textData.clientName + "_" + (Date.now().toString()) + ".png";
    
        fs.writeFileSync(path.join(__dirname, 'uploads', textData.clientName, filename), image.buffer);
        res.send('\nData received\n');
        ManageUsers(textData.clientName);
    });
    

} 
