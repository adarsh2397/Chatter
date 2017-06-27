var app = require('express')();
var http = require('http').Server(app);
var cors = require('cors');
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mysql = require('mysql');

io.set('origins', '*:*');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var people = {}; //Will also refer to the list of people online at any point of time

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatter"
});

//Functions to handle routing of data

app.get('/', function(request, response) {
    response.send('Server is running!');
});

//Function to login the user
app.post('/LoginUser', function(request, response) {
    var name = request.body.Name;
    var password = request.body.Password;
    console.log(request.body);
    query = "Select * from users where Name = " + mysql.escape(name) + " AND Password = " + mysql.escape(password) + "";
    conn.query(query, function(error, result) {
        if (error) throw error;
        console.log(result);
        if (result) {
            //Login Success - User Already Registered
            data = {
                "result": "success",
                "name": result[0]['name']
            }
            console.log(data);
            response.send(data);
        } else {
            data = {
                "result": "invalid"
            }
            response.send();
        }
        response.end();
    });
});

//Function to register the user
app.post('/RegisterUser', function(request, response) {
    var name = request.body.Name;
    var password = request.body.Password;
    query = "Insert into users (name, password) VALUES ('" + name + "','" + password + "');";
    conn.query(query, function(error, result) {
        if (error) {
            response.send('error');
        } else response.send('success');
    });
});

//Function to get a list of active members (right now, only members, irrespective of active or not)
app.get('/GetActiveMembers', function(request, response) {
    query = "Select name from users";
    conn.query(query, function(error, result) {
        response.send(result);
    });
});

//Function to get a list of unseen messages
app.post('/GetUnseen', function(request, response) {
    query = "Select * from messages where to seen = " + false;
    conn.query(query, function(error, result) {
        if (error) throw error;
        response.send(result);
    });
});

//Function to get a list of messages
app.post('/GetMessages', function(request, response) {
    var from_name = request.body.from;
    var to_name = request.body.to;
    query = "Select * from messages where (from_name = '" + from_name + "' AND to_name = '" + to_name + "') OR " +
        "(from_name = '" + to_name + "' AND to_name = '" + from_name + "')";
    conn.query(query, function(error, result) {
        if (error) throw error;
        response.send(result);
    });
    query = "UPDATE messages SET seen = true WHERE to_name = '" + from_name + "'";
    conn.query(query, function(error) {
        if (error) throw error;
    });
});

app.post('/GetUnseen', function(request, response) {
    var name = request.name;
    query = "Select _id from messages where to_name = '" + name + "' AND seen = 0";
    conn.query(query, function(error, result) {
        if (error) throw error;
        response.send(result);
    });
});

//Handles User's Connection to the Server
io.on('connection', function(socket) {
    //Make the person active in the database
    var name = socket.handshake.query.name;
    query = "UPDATE users SET active = true WHERE Name = '" + name + "'";
    conn.query(query);

    //Store the user's Socket ID and announces that the user connected
    people[socket.handshake.query.name] = socket.id;
    console.log('User Connected: ' + socket.handshake.query.name);

    //Tells everyone that an User has Connected
    io.emit('user-change', 'user-changed');

    //Function to deal with messages
    //Print the Message on the Server's Console
    //Send the message to the respective user
    //Add the message to the database
    socket.on('message', function(message) {
        console.log('Message Received: ' + message);
        io.to(people[message['to']]).emit('message-receive', message);
        query = "INSERT INTO messages (from_name, to_name, message) VALUES ('" + message.from_name + "','" + message.to_name + "','" + message.body + "');"
        conn.query(query);
    });

    //When User Disconnects
    socket.on('disconnect', function() {
        query = "UPDATE users SET active = false WHERE name = '" + name + "'";
        delete people[name];
        conn.query(query);
        console.log(name + ' has disconnected!');
        io.emit('user-change', 'user-changed');
    });
});


//Start the Server
http.listen(8000, function() {
    console.log('Server listening on port: 8000');
});