import SocketIO from 'socket.io'
import Queries from './queries'
import Commands from './commands'

module.exports = (server, httpServer) => {
  const io = new SocketIO(httpServer)

  io.use(function(socket, next){
    server.sessionMiddleware(socket.request, socket.request.res, next)
  })

  io.on('connection', function(socket){
    const session = socket.request.session
    let commands = new Commands()
    let queries = new Queries()

    if (session && session.passport && session.passport.user && session.passport.user.github_id){
      queries.getUserByGithubId(session.passport.user.github_id)
        .then(user => {
          queries = new Queries(user)
          commands = new Commands(user)
          socket.emit('updateSession', {user})
        })
    } else {
      socket.emit('updateSession', {})
    }
    queries.getPrrrs()
      .then(prrrs => {
        socket.emit('initialPrrrs', prrrs)
      })
      .catch(error => {
        socket.emit('error', error)
      })

    socket.on('archive', payload => {
      commands.archivePrrr(payload.id)
        .then(prrr => updatePrrr('removePrrr', prrr))
    })

    socket.on('loadPrrs', () => {
      queries.getPrrrs()
        .then(prrrs => state.set({prrrs}))
        .catch(loadPrrrsError => state.set({loadPrrrsError}))
    })

    socket.on('claimPrrr', prrrId => {
      commands.markPullRequestAsClaimed(prrrId)
        .then(prrr => updatePrrr('updatePrrr', prrr))
    })

    socket.on('unclaimPrrr', prrrId => {
      commands.unclaimPrrr(prrrId)
      .then(prrr => updatePrrr('updatePrrr', prrr))
    })

    socket.on('completePrrr', prrrId => {
      commands.completePrrr(prrrId)
        .then(prrr => updatePrrr('removePrrr', prrr))
    })

    socket.on('createPrrr', data => {
      commands.createPrrr(data)
        .then(prrr => updatePrrr('newPrrr', prrr))
    })

    const updatePrrr = ( type, prrr ) => {
      socket.emit( type, prrr )
      socket.broadcast.emit( type, prrr )
    }
  })
}
