const express = require('express');
const router = express.Router();

// Game model
const Games = require('../../models/Game');

// @route POST api/game
// @desc create a game object to hold game data
// @access Public
router.post('/', (req, res) => {
    const newGame = new Games({
        level: req.body.level
    });

    newGame.save()
    .then(game => res.json({game: game._id, level: game.level}));
});

// @route PUT api/game
// @desc update existing game object to update game data
// @access Public
router.put('/', (req, res) => {
    const {card1, card2} =  req.body;
    var roundData = {};
        roundData[card1] = card2;
    Games.findByIdAndUpdate(
        req.body.game,        
        { "$push": { "roundData": roundData } },
        { "new": true, "upsert": true },
        (err, result) => {            
            if(err){                
                res.send({success: false, err})
            }
            else{                
                res.json({success: true, match: card1 === card2, card1, card2})
            }
        }
    )    
});

module.exports = router