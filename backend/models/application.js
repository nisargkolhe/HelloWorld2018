var mongoose = require('mongoose');

var appSchema = new mongoose.Schema({

        id: Number,
        uid: String,
        class_year: String,
        grad_year: String,
        major: String,
        referral: String,
        hackathon_count: Number,
        dietary_restrictions: String,
        shirt_size: String,
        website: String,
        longanswer_1: String,
        longanswer_2: String,
        status: String,
        emailSent: {type: Boolean, default: false},
        created_at:Date,
        updated_at:Date,
       // resume: File,
        status_internal: String,
        status_public: String,
        
});
    
var Application = mongoose.model('Application', appSchema);
module.exports = Application;