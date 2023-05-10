const express = require('express')
const router = new express.Router();
let UserController = require('../Controller/UserController');
const auth = require("../middleware/auth");
const CandidateController = require('../Controller/CandidateController');

//Login 
router.route('/login').post(UserController.login);

//Register
router.route('/register').post(UserController.register);

//Language
router.post('/like-candidate',auth,CandidateController.likeCandidate);
router.delete('/remove-candidate/:id',auth,CandidateController.removeCandidate);
router.get('/get-candidates',auth,CandidateController.getCandidates);
router.get('/get-next-page',auth,CandidateController.getNextCandidates);

router.post('/search-candidates',auth,CandidateController.searchCandidates);

router.route('/admin-login').post(UserController.adminLogin);
router.get('/get-users',auth,UserController.getUsers);
router.delete('/delete-user/:id',auth,UserController.deleteUser);
router.post('/save-user',auth,UserController.saveUser);
router.get('/get-user/:id',auth,UserController.getUser);
router.post('/update-user/:id',auth,UserController.updateUser);
module.exports = router;

