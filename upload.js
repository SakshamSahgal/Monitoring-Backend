const { writeDB, readDB } = require('./MongoOperations');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const path = require('path');
const ManageUsers = require('./ManageUsers');


module.exports = (app) => {

    app.post('/uploadImage', upload.single('image'), (req, res) => {

        console.log('Received body:', req.body);
        console.log('Received file:', req.file);
    
         // Create a folder for the client if it doesn't exist [new user]
        if (!fs.existsSync(path.join(__dirname, 'uploads', req.body.clientName))) {
            let Data = {
                Name : req.body.clientName,
                ClientData: []
            }
            
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
