module.exports = (io, socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
}
