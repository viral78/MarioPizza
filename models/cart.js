var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Cart = new Schema({
    user_id: String,
    items: [{
        name: String,
        toppings: [String],
        crust: String,
        size: String,
        quantity: Number,
        baseprice: Number,
        totalprice: Number
    }],
    dateandtime: Date


});


module.exports = mongoose.model('Cart', Cart);