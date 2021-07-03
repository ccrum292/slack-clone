module.exports = (io, socket) => {
  socket.on("joinRoom", async (socketRoomName, cb) => {
    try {

      socket.join(socketRoomName);

      cb({
        status: "ok",
        message: `joined ${socketRoomName}`
      })

    } catch (err) {
      cb({
        status: "error",
        message: err.message
      })
    }
  })
}