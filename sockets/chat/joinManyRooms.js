module.exports = (io, socket) => {
  socket.on("joinManyRooms", (socketRoomNamesArr, cb) => {
    try {
      console.log("joinManyRooms", socketRoomNamesArr)
      socketRoomNamesArr.forEach(roomName => {
        console.log(roomName)
        socket.join(roomName);
      })

      cb({
        status: "ok",
        message: `joined all`
      })

    } catch (err) {
      cb({
        status: "error",
        message: err.message
      })
    }
  })
}