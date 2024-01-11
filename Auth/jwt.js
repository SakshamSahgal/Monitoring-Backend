//Description: This file contains the code to generate a JWT token and send it to the client.

const jwt = require('jsonwebtoken');
const { readDB } = require("../MongoOperations")

module.exports = (app) => {


    

    // This route first if any admin exists with this username and password
    // If yes, then it signs the response from the database as a payload and generates a JWT token
    // The token is then sent to the client
    // The client can then use this token to access the protected routes
    //if  no admin exists with this username and password, it sends a login failed message

    app.post("/login", (req, res) => {

        // console.log(req.body);
        const { username, password } = req.body;

        readDB("Main", "admins", { Username: username, Password: password }).then(response => {
            
            if (response.length) {

                const payload = response[0];
                // console.log(payload)

                const secretKey = process.env.JWT_SECRET_KEY;
                const token = jwt.sign(payload, secretKey);

                // console.log('Generated Token:', token);

                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    token: token
                })
            }
            else{
                res.json({
                    success: false,
                    message: "Login failed, invalid credentials"
                })
            }
        })
    })
}
