import socket from '../socket'

export default function archivePrrr(prrrId) {
  console.log('WS SND: archivePrrr', prrrId)
  socket.emit('archive', {id:prrrId})
}
