

// We need to require the dotenv package only when I am in development mode
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}





/* Requiring Modules */
const express = require('express');
const app = express();

const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('mongoose');


const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user')

const authRoutes = require('./routes/authRoutes');






// For Socket
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const { SocketAddress } = require('net');
const io = socketio(server);






// MongoDB connection establish
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));






/* Setting up view engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname , 'public')));

// Define the request body
app.use(express.urlencoded({extended:true}));






sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true
}




// MiddleWares

app.use(session(sessionConfig));
app.use(flash());





// An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
app.use((req, res, next) => {
    // iske baad success wala variable har ek template ke uper applicable hoo jega
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currectUser = req.user;
    next();
});






app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(authRoutes);








const users={}    // we make a users object



io.on('connection', (socket) => {

    // console.log(`Connection Established --> ${socket.id}`);
    
    socket.on('send_msg', (data) => {

        
        //console.log(users[socket.id]);
        // io.emit('recieved_msg', {
        //     msg: data.msg,
        //     // id: socket.id
        //     user: data.user
        // });



        // socket.on('login', (data) => {
        //     users[socket.id] = data.user;      // key value mapping kar di idhar
        // });



    
        socket.emit('recieved_msg_right', {
            msg: data.msg,
            // id: socket.id
            user: data.user
        });

        socket.broadcast.emit('recieved_msg_left', {
            msg: data.msg,
            // id: socket.id
            user: data.user
        });

    });



    









    // For typing functanality
    /*from server side we will emit 'display' event once the user starts typing
    so that on the client side we can capture this event and display 
    '<data.user> is typing...' */
    socket.on('typing', (data)=>{
        if(data.typing==true)
           io.emit('display', data)
        else
           io.emit('display', data)
      })



});




















const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log('server running at port 3000');
})