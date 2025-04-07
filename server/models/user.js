const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: { type: String, immutable: true, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    validated: { type: Boolean, default: false },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now, immutable: true },
    modified: { type: Date },
    interests: [{
        brand: { type: String },
        type: { type: String }
    }],
    owner: [{
        brand: { type: String },
        type: { type: String }
    }],
    needs: {
        price: { type: String, enum: ['affordable', 'medium', 'premium', 'luxury'], default: 'affordable' },
        fuel: { type: String, enum: ['gas', 'petrolium', 'diesel', 'electric', 'hydrogen'], default: 'petrolium' },
        brand: [{ type: String, enum: ['chevrolet', 'gazelle', 'honda', 'toyota', 'ravon', 'hyundai', 'byd', 'tesla', 'ford', 'khan'] }],
        color: { type: String, enum: ['yellow', 'blue', 'white', 'black', 'pink', 'red', 'grey', 'silver', 'green'] },
    }
});

module.exports = mongoose.model('User', user);