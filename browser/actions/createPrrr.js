import socket from '../socket'

export default function createPrrr({owner, repo, number}) {
  console.log('WS SND: createPrrr', {owner, repo, number})
  socket.emit('createPrrr', {owner, repo, number})
}
