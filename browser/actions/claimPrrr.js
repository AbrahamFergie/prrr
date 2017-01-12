import socket from '../socket'

export default function claimPrrr(prrrId) {
  console.log('WS SND: claimPrrr', prrrId)
  socket.emit('claimPrrr', {prrrId})  
}
