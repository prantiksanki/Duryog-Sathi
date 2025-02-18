const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require("mongoose") ; 
const positionModel = require("./model/position")
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 80;
// Handle socket connections
io.on('connection', (socket) => {
    console.log('A new user connected', socket.id);

    // Store user role when they register
    socket.on('register', (role) => {
        socket.role = role;
        console.log(`User ${socket.id} registered as ${role}`);
    });

    // Handle alerts and send only to relevant users
    socket.on('alert', (msg) => {
        console.log('Message from client:', msg);

        for (let [id, clientSocket] of io.sockets.sockets) {
            if ((msg === 'police_call' && clientSocket.role === 'police') ||
                (msg === 'fire_call' && clientSocket.role === 'fire') || 
                (msg === 'ndrf_call' && clientSocket.role === 'ndrf')||
                (msg === 'army_call' && clientSocket.role === 'army')||
                (msg === 'hospital_call' && clientSocket.role === 'hospital')) 
            {
                    
                clientSocket.emit(msg, `${msg.replace('_', ' ')} has been triggered`);
            }
        }
    });

    socket.on('position', ({ lati, long , latiDis, longDis, key}) => {
        console.log(`Position update for user ${socket.id}: ${lati}, ${long}`);
        io.emit(`position_${key}`, { id: socket.id, lati, long,latiDis, longDis });
    });
    

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Serve static files from the "public" folder
app.use(express.static(path.resolve('./static')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const connect = mongoose.connect("mongodb://localhost:27017/duryog_sathi")
.then(() => {console.log('Connected database')})
.catch((error) =>
{
    console.log('Error connecting to database', error)
})



// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/police',async (req, res) =>
{
const allPositions = await positionModel.find({authority : "police"})
// console.log(allPositions) ; 
    res.render('police' , {
        allPositions,
    })
});
app.get('/fire', (req, res) => res.render('fire'));
app.get('/hospital', (req, res) => res.render('hospital'));
app.get('/ndrf', (req, res) => res.render('ndrf'));
app.get('/army', (req, res) => res.render('army'));

app.post ('/getpos', async (req,res) =>
{
    const {la, lg, key} = req.body ; 
    console.log(la, lg,key)
    const posAdd = await positionModel.create(
        {
            lat:la,
            lng:lg,
            authority:key, 
        }
    )
})



// Start the server
server.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});
