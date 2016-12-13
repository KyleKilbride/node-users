// server.js

// Set up
// =========================================================================

var express = require('express');
var app = express();                        // define app using express
var bodyParser = require('body-parser');

// body parser will recieve data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set PORT
var port = process.env.PORT || 8080;

// Data base set up
// ==========================================================================
var mongoose = require('mongoose');
// External database
mongoose.connect('mongodb://localhost:27017/user_db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    console.log('Successfully connected to the Database');
});

var User = require('./app/models/user');

// Routes for the API
//===========================================================================

// Create instance of express Router
var router = express.Router();
// For consistency all routes will be prefixed with /api
app.use('/api', router);
// Example for each time the API is called (Middleware)
// Powerful to use to do validation of incoming requests as well
// as statistical data analytics. 
// As well as authentication
router.use(function(req, res, next){
    console.log(`API has processed data:: name: ${req.body.name} email: ${req.body.email}`);
    //go to the next routes
    next(); 
});

// Test rout
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the API'});
});

// Routes that end with /users
router.route('/users')
    .post(function(req, res){
        var user = new User(); // new user model
        user.name = req.body.name;
        user.email = req.body.email;
        user.save(function(err){
            if(err){
                console.log('Error: Could not save data');
                res.send(err);
            }
            res.json({message: 'User created!'});
        });
    })
    .get(function(req, res){
        
        User.find(function(err, users){
            if(err)
                res.send(err);

            res.json(users);
        });
    });

router.route('/users/:user_id')
    .get(function(req,res){
        User.find(function(err, user){
            if(err)
                res.send(err);
        });
    })
    .put(function(req, res){
        
        User.findById(req.params.user_id, function(err, user){
            if(err)
                res.send(err);

            user.name = req.body.name;
            user.email = req.body.email;

            user.save(function(err){
                if(err)
                    res.send(err);
                    res.json({ message: 'User Updated!'});
            });
            

        });
    });
    

//============================================================================

// start the server on port 8080
app.listen(port);
console.log(`server started on port ${port}`);