const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    company : {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique:true,
    },
    password: {
      type: String,
      required: true
    },
    maximum_search_allowed:{
        type:Number,
        default:100,
    },
    searches_done:{
      type: Number,
      default:0,
    },
    registered_date: {
      type: Date,
    },
})

const User = mongoose.model("User",UserSchema)

module.exports = User