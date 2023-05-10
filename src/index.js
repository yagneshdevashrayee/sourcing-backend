const express = require('express')
require('./db/mongoose')
const router = require('./routers');
var cors = require('cors')
var bodyParser = require("body-parser");

const app = express();

app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3001

app.use(cors());
app.use('/', router);


app.listen(port,() => {
    console.log("Server is running on port: ", port)
})
