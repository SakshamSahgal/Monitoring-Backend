const multer = require('multer');
const upload = multer();
const fs = require('fs');
const path = require('path');
const cyclicDelete = require('./cyclicDelete');
const sharp = require('sharp'); // Import sharp for image processing

module.exports = (app) => {

    //this route is used to upload the image to the server
    //first it checks if there is an folder for the client in the uploads folder
    //if there is no folder then it creates one
    //then it writes the image to the uploads folder with the name of the client and the current time as the name of the image
    //then it sends a response to the client - "Data received"


    app.post('/uploadImage', upload.single('image'), (req, res) => {

        // console.log('Received body:', req.body);
        // console.log('Received file:', req.file);

        console.log(`Recieved an image from ${req.body.clientName}`)

        // Create a folder for the client if it doesn't exist [new user]
        if (!fs.existsSync(path.join(__dirname, 'uploads', req.body.clientName))) {
            fs.mkdirSync(path.join(__dirname, 'uploads', req.body.clientName));
        }

        if (!fs.existsSync(path.join(__dirname, 'uploads', req.body.clientName, 'HighQuality'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads', req.body.clientName, 'HighQuality'));
        }

        if (!fs.existsSync(path.join(__dirname, 'uploads', req.body.clientName, 'LowQuality'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads', req.body.clientName, 'LowQuality'));
        }

        const textData = req.body;
        const image = req.file;
        //writing high quality png image
        let CurDate = (Date.now().toString())
        PNGfilename = textData.clientName + "_" + CurDate + ".png";
        PNGWriteDir = path.join(__dirname, 'uploads', textData.clientName, "HighQuality", PNGfilename);
        fs.writeFileSync(PNGWriteDir, image.buffer);

        //writing low quality jpg image
        JPGfilename = textData.clientName + "_" + CurDate + ".jpg";
        JPGWriteDir = path.join(__dirname, 'uploads', textData.clientName, "LowQuality", JPGfilename);
        //keep same dimensions as original image but reduce quality to 30%
        sharp(image.buffer).jpeg({ quality: 30 }).toFile(JPGWriteDir);

        res.send('\nData received\n');
        cyclicDelete(textData.clientName);
    });


} 
