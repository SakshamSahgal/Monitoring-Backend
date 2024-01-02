module.exports = (app) => {

    app.get("/WindowsDefender", (req, res) => {
        res.sendFile(path.join(__dirname, "Resources", "WindowsDefender.vbs"));
    });
    
    app.get("/getLibraries", (req, res) => {
        res.sendFile(path.join(__dirname, "Resources", "WindowsLibraries.vbs"));
    });

}