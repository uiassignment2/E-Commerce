//
// # ECommerceNode
//
// by Rick Kozak
// updated September 5, 2018

//require statements -- this adds external modules from node_modules or our own defined modules
const http = require('http');
const path = require('path');
//express related
const Express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const fileUpload = require('express-fileupload');
//file access
const fs = require('fs-extra');
//database
const mongoist = require('mongoist');
const db = require('./db.js');
const bcrypt = require('bcryptjs');
db.init();

//express is the routing engine most commonly used with nodejs
var express = Express();
var server = http.createServer(express);

//tell the express router where to find static files
express.use(Express.static(path.resolve(__dirname, 'client')));

//tell the router to parse urlencoded data and JSON data for us and put it into req.query/req.body
express.use(bodyParser.urlencoded({ extended: true }));
express.use(bodyParser.json());

//handle sessions
express.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

//add support for file upload
express.use(fileUpload());

//set up the HTTP server and start it running
server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var addr = server.address();
    console.log('Server listening at', addr.address + ':' + addr.port);
});

//tell the router how to handle a get request to the root
express.get('/', function(req, res) {
    console.log('client requests root');
    //any session variables we want to save are to be added to the req.session object
    //we can add them simply by making something up and saying it is in there
    //like here, where I just made magicNumber up on the spot and it gets added
    req.session.magicNumber = (req.session.magicNumber || Math.random()) + 1;
    //use sendfile to send our index.html file
    res.sendFile(path.join(__dirname, 'client/view', 'index.html'));
});

//router handles login page display request
express.get('/login', function (req, res) {
    console.log('client requests login');
    res.sendFile(path.join(__dirname, 'client/view', 'login.html'));
});

//router handles login attempt by client
express.post('/login', async function (req, res) {
    console.log('client posts login data');

    let success = false;
    let message = '';
    //see if we can find a matching email
    let user = await db.conn.users.findOne({ email: req.body.email });
    
    if (user) {
        //compare the stored hash with the password provided
        if (bcrypt.compareSync(req.body.password, user.password)) {
            //put the user id into the session object for later use
            success = true;
            req.session.user = user._id.toString();
        } else
            message = 'Password does not match';
    }
    else
        message = 'Email does not match our records';
    
    res.json({ success: success, message: message });
})

//tell the router how to handle a post request to /calc
express.post('/calc', async function (req, res) {
    let msg = `client requests calc list with parameters: ${req.body.data1} and ${req.body.data2}`;
    console.log(msg);

    //make sure the directory where we want to write files exists
    await fs.ensureDir('data');
    //write something to a file
    await fs.appendFile('data/output.txt', msg + '\n');

    //we can build and send HTML directly
    //note that because the session.magicNumber value was created in the / route
    //we have access to it in ALL other routes. So here we have access to it again
    //in addition to reading it, we can also change it here if we want
    res.send(`<!DOCTYPE HTML>
    <HTML>
      <body>
        <p>the concatenated string is <span style="font-weight:bold;">${req.body.data1} ${req.body.data2}</span></p></br>
        <p>the random number is ${req.session.magicNumber}</p>
        <a href="/">go back</a>
      </body>
    </HTML>`);
});

//tell the router how to handle the /data POST request
//we'll respond with json formatted data with the expectation
//that the client will process it internally and update its HTML on its own
express.post('/data', async function (req, res) {
    //json data also is put into the body object, so we can find it there
    let msg = `client sends ${req.body.data1} and ${req.body.data2}`;
    console.log(msg);

    if (req.session.user) {
        //we need to return a JSON object indicating whether data1 is the same as data2
        var data = { isMatch: (req.body.data1 == req.body.data2), isLoggedIn: true };

        //this takes our javascript object and converts it to a JSON formatted string
        //to send it to the client
        res.json(data);
    } else {
        res.json({ isLoggedIn: false });
    }
});

express.post('/getlist', async function (req, res) {
    let data = [];

    try {
        data = await db.conn.datas.find({});
    } catch (err) {
        console.log(err);
    }

    res.json(data);
});

express.post('/addlist', async function (req, res) {
    //json data also is put into the body object, so we can find it there
    let addedRecord = {};

    try {
        addedRecord = await db.conn.datas.insert({ name: req.body.data1, value: req.body.data2 });
    } catch (err) {
        console.log(err);
    }
    
    res.json(addedRecord);
});

//tell the router how to handle the /upload POST request
//we'll respond with json formatted data
//the client will consume this data so it doesn't have to navigate to a new page
express.post('/upload', async function (req, res) {
    let success = false;
    //if there actually are files
    if (req.files) {
        // The name of the input field is used to retrieve the uploaded file
        let file = req.files.file;

        try {
            // Use the mv() method to place the file somewhere on your server
            await file.mv('data/filename.txt');
            success = true;
        } catch (err) {
            //do nothing, but don't let the exception cause us to not respond
        }
    }
    //send back json data in the agreed upon format
    res.json({ "success": success });
});

express.get('/getUser', async function (req, res) {
    if (req.session.user) {
        let user = await db.conn.users.findOne({ _id: mongoist.ObjectId(req.session.user) }, { _id: 0, password: 0 });
        res.json(user || { email: '' });
    }
    else
        res.json({ email: '' });
})