const mongoose = require('mongoose')
const mongodb = require('mongodb')

mongoose.connect('mongodb+srv://bhavindivecha:bhavin@sourcing.donwenv.mongodb.net/Sourcing?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})