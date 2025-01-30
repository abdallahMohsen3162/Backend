const io = require("socket.io")(8900, {
    cors: {
        origin: "*",
    }
});
let arr = []
io.on("connection", (socket) => {
    console.log("id = ", socket.id);
    arr.push(socket.id);
    socket.on("send", (data) => {
        console.log(data);
        for (let i = 0; i < arr.length; i++) {
            // io.to(arr[i]).emit("send", data);
            socket.to(arr[i]).emit("notification", data);
        }
    });

    socket.on("disconnect", () => {
        arr.slice(arr.indexOf(socket.id), 1);
        console.log(`Socket ${socket.id} disconnected`);
    });
});
