const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const IgController = require('./app/Controller/InstagramController');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    console.log('inside the middleware:: ', Date.now());
    next();
});

app.get('/testing1', (req, res)=>{
    console.log('Inside the testing route.');
});

app.get('/testing', IgController.testing);

app.post('/accept/follow/request',IgController.acceptFollowRequest );;
console.log('Inside the index.js');

const server = app.listen(3050, ()=>{
    console.log('Server started on the port: 3050');
});