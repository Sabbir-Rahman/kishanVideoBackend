import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  path: '/kishan/video',
})



const PORT = process.env.PORT || 7000

app.get("/", (req, res) => {
    res.send(`Server running on ${PORT}`)
})

io.on("connection", (socket) => {

  socket.emit('me', socket.id)
  
  socket.on('disconnect', () => {
      socket.broadcast.emit("callended")
  })
  
  socket.on("calluser", ({ userToCall, signalData, from, name}) => {
      io.to(userToCall).emit("calluser", {signal:signalData,from,name})
  })

  socket.on("answercall", (data)=> {
      io.to(data.to).emit("callaccepted", data.signal)
  })
});

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

