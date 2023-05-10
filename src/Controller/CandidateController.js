const Candidate = require('../models/Candidate');
const User = require('../models/User');
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = "AUTH_TOKEN";
const API_KEY = 'A6E641C4EDB346B58C819731B4A661FA';
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(API_KEY);
const axios = require('axios');


const CandidateController = { 
    likeCandidate: async (req, res) => {

        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const { user } = jsonwebtoken.verify(token, JWT_SECRET);
        
        const candidateFind = await Candidate.findOne({user:user._id,title:req.body.title});

        if(candidateFind)
        {
            return res.status(500).json({ error: "Candidate already liked" });
        }

        const candidate = new Candidate(req.body);
        
        candidate.user = user._id;

        try {
            await candidate.save();
            res.status(200).send({ "message": "Candidate added.",candidate:candidate });
        } catch (e) {
            res.status(400).send(e);
        }
    },
    removeCandidate: async (req, res) => {
        try{
            const candidate = await Candidate.findByIdAndDelete(req.params.id);
            if(!candidate)
            {
                res.status(404).send({"error" : "Candidate not found"})
            }
            res.status(200).send({"message" : "Candidate removed."})
        }catch (e){
            res.status(400).send(e)
        }
    
    
    },
    getCandidates: async (req, res) => {
        try{
            const authHeader = req.headers.authorization;
            const token = authHeader.split(" ")[1];
            const { user } = jsonwebtoken.verify(token, JWT_SECRET);
            const candidates = await Candidate.find({user:user._id});
            
            res.status(200).send({candidates})
        }catch (e){
            res.status(400).send(e)
        }
    
    },
    searchCandidates: async (req, res) => {
        try{
            console.log(111);
            const authHeader = req.headers.authorization;
            const token = authHeader.split(" ")[1];
            const { user } = jsonwebtoken.verify(token, JWT_SECRET);
            
            const date = new Date(user.registered_date);
            date.setDate(30);
            const userDetails = await User.findById(user._id);

            const todayDate = new Date().toISOString().slice(0, 10);
            if(todayDate > date.toISOString().slice(0, 10))
            {
                console.log(11);
                userDetails.registered_date = todayDate;
                userDetails.searches_done = 0;
                // userDetails.save();
            }
            else{
                
                if((userDetails.searches_done + 1) > userDetails.maximum_search_allowed ){
                    return res.status(404).send({"error" : "Your search limit is over, try after "+ date.toISOString().slice(0, 10)});
                }
            }
            
            userDetails.searches_done = userDetails.searches_done + 1;
            console.log(userDetails);
            await userDetails.save();
            
            let searchString = "";

            if(req.body.type == "linkedin"){
                searchString = 'site:linkedin.com inurl:in OR inurl:pub -inurl:dir ';
            }
            if(req.body.type == "github"){
                searchString = 'site:github.com ';
            }

            const searchQuery = searchString.concat('"'+ req.body.jobTitle+'"', ' AND ', '(','"' + req.body.keywords.split(',').join('" OR "') + '\"' , ')', ' AND ', '"', req.body.city, '"', ' AND ', '"', req.body.country, '"');
            console.log(searchQuery);

            const params = {
                api_key: "86F80994CC48407DA1E2EE95C3AB8CB9",
                q: searchQuery,
            };

            axios.get('https://api.scaleserp.com/search', { params })
                .then(response => {

                    res.status(200).send({response:response.data});
                    console.log(response.data)
                }).catch(error => {
                    // catch and print the error
                    console.log(error);
                });
            

            
        }catch (e){
            res.status(400).send(e)
        }
    
    },
    getNextCandidates: async (req, res) => {
        console.log(req.query.q);

        const params = {
            api_key: "86F80994CC48407DA1E2EE95C3AB8CB9",
            q: req.query.q,
            id: req.query.id,
            page: req.query.page
        };
        axios.get('https://api.scaleserp.com/search', { params })
            .then(response => {

            res.status(200).send({response:response.data});
            console.log(response.data)
        }).catch(error => {
            // catch and print the error
            console.log("error");
            console.log(error);
        });
    }
}
module.exports = CandidateController;
