var express = require('express');
var router = express.Router();
var passport = require('passport');
var Cart = require('../models/cart');

var monk = require('monk');
var db = monk('localhost:27017/mariopizza');

/* Menu home - get all pizzas */
router.get('/', function (req, res) {
    var collection = db.get('menu');
    collection.find({ category: 'pizza' }, function (err, items) {
        if (err) throw err;
        res.render('template/menu', { items: items, user: req.user });
    });
});

/* pizza */
router.get('/pizzas', function (req, res) {
    var collection = db.get('menu');
    collection.find({ category: 'pizza' }, function (err, items) {
        if (err) throw err;
        res.render('menuPaging', { items: items, user: req.user });
    });
});

/* burger */
router.get('/burgers', function (req, res) {
    var collection = db.get('menu');
    collection.find({ category: 'burger' }, function (err, items) {
        if (err) throw err;
        res.render('menuPaging', { items: items, user: req.user });
    });
});

/* pasta */
router.get('/pastas', function (req, res) {
    var collection = db.get('menu');
    collection.find({ category: 'pasta' }, function (err, items) {
        if (err) throw err;
        res.render('menuPaging', { items: items, user: req.user });
    });
});

/* drink */
router.get('/drinks', function (req, res) {
    var collection = db.get('menu');
    collection.find({ category: 'drink' }, function (err, items) {
        if (err) throw err;
        res.render('menuPaging', { items: items, user: req.user });
    });
});

/* search and fiter */
router.post('/search', function (req, res) {

    if (req.body.search || req.body.filter) {
        const regex1 = new RegExp(escapeRegex(req.body.search), 'gi');
        const regex2 = new RegExp(escapeRegex(req.body.filter), 'gi');
        var collection = db.get('menu');

        collection.find({ title: regex1, category: regex2 }, function (err, items) {
            if (err) throw err;
            res.render('menuPaging', { items: items, user: req.user });
        });
    }
});

/*Admin*/
router.post('/', function(req, res){
    var collection = db.get('menu');
    collection.insert({
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        activeflag: req.body.activeflag
    }, function(err, menu){
        if (err) throw err;

        res.redirect('/menu');
    });
});

router.get('/new', function(req, res) {
    res.render('template/new', { user: req.user });
    
});

router.get('/:id/edit', function(req, res) {
    var collection = db.get('menu');
    collection.findOne({_id: req.params.id}, function(err, item){
        console.log("indexxx hiiiiiiiiiii");
        if (err) throw err;
        //console.log(item);
        res.render('template/edit',{item:item, user: req.user});
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('menu');
    collection.findOneAndUpdate({ _id: req.params.id},
        { $set:
            {
                title: req.body.title,
                image: req.body.image,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category
            }
    }).then((updateDoc) => {})
    res.redirect('/menu')
});

/* show a dish (same as show.ejs in vidzy)*/
router.get('/:id', function(req, res) {
    var collection = db.get('menu');
    //collection.find({ category: 'pizza' }, function (err, items1) {
      //  if (err) throw err;
        collection.findOne({_id: req.params.id}, function(err, item){
        if (err) throw err;
        res.render('template/show', { item: item, user: req.user });
    
    });
});
/*edit a dish*/
router.put('/:id', function(req, res){
    var collection = db.get('menu');
    collection.findOneAndUpdate({ _id: req.params.id},
        { $set:
            {
                title: req.body.title,
                image: req.body.image,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category
            }
    }).then((updateDoc) => {})
    res.redirect('/menu')
});

/* delete a particular dish*/
router.delete('/:id', function(req, res){
    var collection = db.get('menu');
    collection.findOneAndUpdate({ _id: req.params.id},
        { $set:
            {
                activeflag:"0"
            }},
            function( err, result ) {
        if ( err ) throw err;
    })
    res.redirect('/menu')
});



/* Pushing Toppings into DB */
router.post('/topping', function (req, res) {


    var collection = db.get('topping');
    console.log(req.body);
    collection.insert({
        toppings: req.body.veggies,
        crust: req.body.optradio,
        quantity: req.body.quantity,
        size: req.body.optradio1
    }, function (err, result) {
        if (err) throw err;

        res.redirect('/menu');
    });
});

router.post('/addCart/:id', function (req, res) {
    let quantityVal = parseInt(req.body.quantity);
    let basepriceVal = parseFloat(req.body.itemPrice);
    let totalpriceVal = basepriceVal * quantityVal;
    let dateandtimeVal = new Date().getTime();
    console.log("quantity " + quantityVal);
    var collection = db.get('carts');
    console.log(req.body);
    console.log(parseInt(req.body.itemPrice));
    var cart = new Cart(
        {
            user_id: req.params.id,
            items: [
                {
                    name: req.body.itemName,
                    toppings: req.body.veggies,
                    crust: req.body.optradio,
                    size: req.body.optradio1,
                    quantity: quantityVal,
                    baseprice: basepriceVal,
                    totalprice: totalpriceVal
                }
            ],
            dateandtime: dateandtimeVal

        }
    );

    console.log(cart);

    Cart.findOneAndUpdate(
        { user_id: req.params.id }, // find a document with that filter
        {
            "$push": {
                "items": {
                    name: req.body.itemName,
                    toppings: req.body.veggies,
                    crust: req.body.optradio,
                    size: req.body.optradio1,
                    quantity: quantityVal,
                    baseprice: basepriceVal,
                    totalprice: totalpriceVal
                },
                dateandtime: dateandtimeVal
            }
        },
        { upsert: true, new: true, runValidators: true }, // options
        function (err, doc) { // callback
            if (err) {
                // handle error
            } else {

            }
        }
    );


    var servResp = {};
    servResp.success = true;
    servResp.redirect = true;
    servResp.redirectURL = "http://localhost:3000/menu";
    res.send(servResp);


});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;