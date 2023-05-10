const User = require('../models/User');
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = "AUTH_TOKEN";
const UserController = { 
    register: async (req, res) => {
        let password = req.body.password.toString();

        bcrypt.hash(password, 10).then((hash) => {
            const user = new User({
                company: req.body.company,
                email: req.body.email,
                password: hash,
                registered_date: new Date().toISOString().slice(0, 10)

            });
            user.save().then((response) => {

                return res.json({
                    message: "User successfully created!",
                    token: jsonwebtoken.sign({ user }, JWT_SECRET),
                });
                
            }).catch(error => {
                res.status(500).json({
                    error: error.message
                });
            });
        });
    },
    login: async (req, res) => {
        try{
            const user = await User.findOne({"email":req.body.email})
            let password = req.body.password.toString();

            if(!user)
            {
                return res.status(404).send({"error" : "User not found"});
            }
            console.log(user);
            bcrypt.compare(password, user.password)
            .then(result => {
                if(result){
                    return res.json({
                        token: jsonwebtoken.sign({ user }, JWT_SECRET),
                    });
                }
                else{
                    res.status(404).send({"error" : "Invalid Credentials"});    
                }
                })
            .catch(err => {
                res.status(404).send({"error" : "Invalid Credentials"});
            })
            
        }catch (e){
            console.log(e);
            res.status(400).send(e)
        }
    },
    adminLogin: async (req, res) => {
        try{
            

            if(req.body.email != "admin@admin.com" || req.body.password != '12345678')
            {
                return res.status(404).send({"error" : "Invalid Credentials"});    
            }
            
            const user = {
                'name':'Admin',
                'email':'admin@admin.com',
                'type': 'Admin'
            }
            return res.json({
                token: jsonwebtoken.sign({ user }, JWT_SECRET),
            });
            
        }catch (e){
            console.log(e);
            res.status(400).send(e)
        }
    },
    getUsers: async (req, res) => {
        try{
            const users = await User.find({})
            res.status(200).send({users})
        }catch (e){
            console.log(e);
            res.status(400).send(e)
        }
    },
    deleteUser: async (req, res) => {
        try{
            
            const user = await User.findByIdAndDelete(req.params.id);
            if(!user)
            {
                res.status(404).send({"error" : "User not found"});
            }
            res.status(200).send({"message" : "User deleted."});
        }catch (e){
            console.log(e);
            res.status(400).send(e)
        }
    },
    saveUser: async (req, res) => {
        let password = req.body.password.toString();

        bcrypt.hash(password, 10).then((hash) => {
            const user = new User({
                company: req.body.company,
                email: req.body.email,
                password: hash,
                registered_date: new Date().toISOString().slice(0, 10),
                maximum_search_allowed: req.body.maximum_search_allowed,

            });
            user.save().then((response) => {

                return res.json({
                    message: "User successfully created!",
                    token: jsonwebtoken.sign({ user }, JWT_SECRET),
                });
                
            }).catch(error => {
                res.status(500).json({
                    error: error.message
                });
            });
        });
    },
    getUser: async (req, res) => {
        try{
            
            const user = await User.findById(req.params.id);
            if(!user)
            {
                res.status(404).send({"error" : "User not found"});
            }
            res.status(200).send({user})
        }catch (e){
            console.log(e);
            res.status(400).send(e)
        }
    },
    updateUser: async (req, res) => {
        try{
            const updates = Object.keys(req.body);
            const time = new Date().getTime();
            const user = await User.findById(req.params.id)
    
            if(!user)
            {
                res.status(404).send({"error" : "User not found"})
            }

            updates.forEach((update) => user[update] = req.body[update])
            user.save();
            
            res.status(200).send({"message" : "User updated."})
              
        }catch (e){
            console.log(e);
            res.status(400).send(e)
        }
    
    },
}
module.exports = UserController;
