//Description: This file contains the code to generate a JWT token and send it to the client.

const jwt = require('jsonwebtoken');

module.exports = (app) => {

    app.post("/login",(req,res) => {
        console.log(req.body);
        const {username,password} = req.body;

        // replace with database check here
        if(username === "admin" && password === "admin"){ 
            
            // replace with database data here
            const payload = {                          
                username: username,
                password: password,
                role: "admin"
              };

              const secretKey = process.env.JWT_SECRET_KEY;
              const token = jwt.sign(payload, secretKey);
              
              console.log('Generated Token:', token);

            res.status(200).json({
                success: true,
                message: "Login successful",
                token: token
            })

        }else{
            res.json({
                success: false,
                message: "Login failed, invalid credentials"
            })
        }
    })
}
