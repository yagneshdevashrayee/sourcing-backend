const User = require('../models/User');
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = "AUTH_TOKEN";


module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Not Authorized" });
        }
    
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const { user } = jsonwebtoken.verify(token, JWT_SECRET);
        if(user)
        {
            next();
        }
        else{
            return res.status(401).json({ error: "Not Authorized" });
        }

    } catch (error) {
        res.status(400).send("Invalid token");
    }
}