const mongoose = require('mongoose');

const car = new mongoose.Schema({
    model:{type:String, required:true},
    brand:{type:String, required:true},
    owner:{type:mongoose.Schema.ObjectId, ref:'User', required:true},
    manufactured:{type:Number, required:true},// will store timeStamp of the manufactured date
    color:{type:String},
    fuel:{type:String},
    range:{type:Number}, // how many kilometers it can go
    price:{type:Number }, // for simplicity, we make the price to be a number,
    seats:{type:Number},
    mileage:{type:Number, required:true}, // the kms the car has on it life.
    location:{type:String, required:true},
    condition:{type:String, enum:['excellent', 'good', 'fair', 'poor']},
    damaged:[{
        part:{type:String},
        date:{type:Number},
        level:{type:String, enum:['minor', 'major','unrepairable']}
    }],
    history:[{
        owner:{type:mongoose.Schema.ObjectId, ref:'User', required:true},
        paid:{type:Number},
        date:{type:Number}
    }],
    created:{type:Date, default:Date.now, immutable:true},
    modified:{type:Date}
});

module.exports = mongoose.model('Car', car);