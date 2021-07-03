
module.exports = (io, socket) => {
  socket.on("clientMsg", async (socketRoomName, msgObj ,cb) => {
    try {
      console.log("msgObj", msgObj);

      socket.to(socketRoomName).emit("serverMsg", msgObj);

      cb({
        status: "ok",
        msgObj
      })

    } catch (err) {
      console.log(err);
      cb({
        status: "error",
        message: err.message
      });
    }
  })
}