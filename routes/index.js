var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var Cart = require('../models/cart');
var ObjectId = require('mongoose').Types.ObjectId;

var monk = require('monk');
var db = monk('localhost:27017/mariopizza');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("here i am");
  res.render('template/index', { user: req.user });
});

/* Login, Signup, Logout */
router.get('/register', function (req, res) {
  res.render('register', { user: req.user });
});

router.post('/register', function (req, res) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function (err, account) {
    if (err) {
      return res.render('register', {
        user: req.user, info: "Sorry, that username already exists. Try a different one."
      });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.get('/login', function (req, res) {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/');
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});



/* About */
router.get('/about', function (req, res) {
  res.render('template/about', { user: req.user });
});

/* Contact */
router.get('/contact', function (req, res) {
  res.render('template/contact', { user: req.user });
});

/* Past Orders */
router.get('/orderHistory/:id', function (req, res) {
  var collection = db.get('orders');
  collection.find({ user_id: req.params.id }, function (err, orders) {
    if (err) throw err;
    res.render('orderHistory', { orders: orders, user: req.user });
  });
});

/* Show cart */
router.get('/showCart/:id', function (req, res) {
  var collection = db.get('carts');
  console.log(req.params.id);
  collection.find({ user_id: req.params.id }, function (err, cart) {
    if (err) throw err;
    //console.log("here cart is " + cart[0]);
    var finalPrice=0;
    if(typeof cart !== 'undefined' && cart){ 
    for(let cart1 of cart[0].items){
      finalPrice+=cart1['totalprice'];
    }}
    collection.findOneAndUpdate({ user_id: req.params.id},
        { $set:
            {
                finalPrice:finalPrice
            }},
            function( err, result ) {
        if ( err ) throw err;
        console.log(result);
    res.render('cart', { cart: result, user: req.user});
    });
  });
});

/* Edit cart item */

router.get('/editCartItem/:id', function (req, res) {
  console.log("User id is " + req.user.id);
  console.log("Item id is " + req.params.id);
  Cart.findOne({ user_id: req.user.id, "items._id": req.params.id }, { "items.$": 1 }, (err, result) => {
    if (result.items[0].crust == "NA") {
      res.render("cartOtherEdit", { result: result, user: req.user });
    } else {
      res.render("cartEdit", { result: result, user: req.user })
    }

  });

});

router.get('/editCart/:id', function (req, res) {
  var collection = db.get('carts');
  console.log("hi deval");
  console.log(req.params.id);

  var finalPrice=0;    
    for(let cart1 of cart[0].items){
      finalPrice+=cart1['totalprice'];
    }
    collection.findOneAndUpdate({ user_id: req.params.id},
        { $set:
            {
                finalPrice:finalPrice
            }},
            function( err, result ) {
        if ( err ) throw err;
    //collection.find({ user_id: req.params.id }, function (err, cart) {
    //if (err) throw err;
    //console.log("here cart is " + cart.items);

    res.render('cart', { cart: result, user: req.user });
  //});
    })
  
});


router.post('/saveEdit', function (req, res) {
  let quantity = parseInt(req.body.quantity);
  let totalpriceVal = parseFloat(req.body.itemPrice) * quantity;

  if (req.body.itemCrust != "NA") {
    console.log("inside not equal to");
    Cart.update({ user_id: req.user.id, "items._id": req.body.itemId },
      {
        '$set': {
          "items.$.toppings": req.body.veggies,
          "items.$.crust": req.body.optradio,
          "items.$.size": req.body.optradio1,
          "items.$.quantity": quantity,
          "items.$.totalprice": totalpriceVal
        }
      }, (err, result) => {
        let uid = req.user.id;
        res.redirect("/showCart/" + uid)
      });
  } else {
    console.log("inside equal to");
    Cart.update({ user_id: req.user.id, "items._id": req.body.itemId },
      {
        '$set': {
          "items.$.quantity": quantity,
          "items.$.totalprice": totalpriceVal
        }
      }, (err, result) => {
        let uid = req.user.id;
        res.redirect("/showCart/" + uid)
      });
  }
});


/* Delete cart item */
router.get('/deleteCartItem/:id', function (req, res) {
  let itemId = req.params.id;
  let userId = req.user.id;

  Cart.update({ user_id: userId },
    {
      $pull:
      {
        items:
        {
          _id: itemId
        }
      }
    },
    { multi: true },
    function (err, status) {
      res.redirect("/showCart/" + userId);
    });

});

/* Checkout and order */
router.get('/checkout', function (req, res) {
  let userId = req.user.id;
  var collection = db.get('carts');
  var collection2 = db.get('orders');

  collection.findOne({ user_id: userId }, function (err, userCart) {
    if (err) throw err;
    collection2.insert(userCart, function (err, order) {
      if (err) throw err;
      collection.remove(userCart, function (err, removedCart) {
        if (err) throw err;
        res.redirect("/");
      });

    });

  });
});


module.exports = router;
