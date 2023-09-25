module.exports = startServer = (app, req, res) => {
    try {
        app.listen(5000, () => {
            console.log("The server is running on port 5000");
        });
    } catch (error) {
        console.log(error);
    }
};