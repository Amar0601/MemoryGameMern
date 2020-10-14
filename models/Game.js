const mongoose = require('mongoose');
const { v4: uuid }  = require('uuid');

// Create schema for saving game data
const GameSchema = new mongoose.Schema({    
	level: {
        type: String,
        required: true
    },	
    roundData: {
        type: []        
    }
});

module.exports = Item = mongoose.model('Games', GameSchema);