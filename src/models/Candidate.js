const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    user: {
      type: String,
      required: true,
    },
    title : {
      type: String,
      required: true
    },
    link: {
      type: String
    },
    snippet: {
      type: String
    },
    snippet_highlighted_words : [{
      type: String
    }],
    rich_snippet:{
      type: Object,
    }
})

const Candidate = mongoose.model("Candidate",CandidateSchema)

module.exports = Candidate