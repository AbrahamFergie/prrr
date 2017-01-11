import socket from '../socket'

export default function loadPrrrs() {
  socket.emit('loadPrrrs')
}
