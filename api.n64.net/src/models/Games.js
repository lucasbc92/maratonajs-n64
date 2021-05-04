const { Schema, model } = require('mongoose');

const GameSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    otherTitles: [String],
    developers: [String],
    publishers: [String],
    genres: [String],
    firstReleased: Date,
    japanRelease: Date,
    usaRelease: Date,
    euroRelease: Date,
}, {collection: 'games', strict: false});

const Game = model('Game', GameSchema);

module.exports = {
    find: (criteria) => {
        const {q, limit, page, fields, orderBy, sortBy = 1 } = criteria;
        
        const offset = page ? (page-1) * limit : 0;
        
        const query = Game.find();
        if(q) {
            const regex = new RegExp(`.*${q}.*`, 'i');
            const searchQuery = { $or: [                
                {title: regex},
                {otherTitles: regex},
                {publishers: regex},
                {developers: regex},
            ]};
            query.find(searchQuery);
        }
        if(limit) query.limit(limit);
        if(page) query.skip(offset);
        if(fields) query.select(fields.split(','));
        if(orderBy) query.sort({
            [orderBy] : sortBy,
        })
        return query.exec();
    },
}