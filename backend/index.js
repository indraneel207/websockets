const port = 3000
const webSocketServer = require('websocket').server
const http = require('http')

const server = http.createServer()
server.listen(port)
console.log(`Server is listening on port ${port}`)

const wsServer = new webSocketServer({
  httpServer: server
})

const clients = []

const generateUUID = () => {
  return new Date().getTime()
}

wsServer.on('request', function(request) {
  const userID = generateUUID()
  console.log(`Received a request from ${userID}, with origin ${request.origin}`)
  
  const connection = request.accept(null, request.origin)
  console.log(`Accepted connection from ${userID}`)
  
  clients[userID] = connection
  connection.sendUTF(JSON.stringify({ userID, message: 'Welcome!' }))

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message by userID:', userID, 'Message:', message.utf8Data)
      
      for (let key in clients) {
        clients[key].sendUTF(JSON.stringify({ userID, message: message.utf8Data }))
        console.log('Sent Message to:', key)
      }
    }
  })

  connection.on('close', function(reasonCode, description) {
    console.log('Client has disconnected. Reason:', reasonCode)
  })
})

