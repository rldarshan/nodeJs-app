const
    io = require("socket.io-client"),
    ioClient = io.connect("http://49.207.177.215:8000/");

ioClient.on("news", (msg) => console.log(msg));