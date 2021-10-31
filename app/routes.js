module.exports = function (app, passport, db, ObjectID) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('cashier.ejs');
    });

    // app.get('/sass', function (req, res) {
    //     res.render('theming-kit.ejs');
    // });

    // PROFILE SECTION =========================
    app.get('/barista', isLoggedIn, function (req, res) {
        // console.log(req)
        db.collection('orders').find().toArray((err, result) => {
            if (err) return console.log(err)
            console.log(req.user + ' this is a Employee');
            res.render('barista.ejs', {
                user: req.user,
                orders: result
            })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // message board routes ===============================================================


    app.post('/orders', (req, res) => {
        // console.log('received from browser', req.body)
        db.collection('orders').insertOne({
            orderArray: req.body.orderArray,
            customerName: req.body.customerName,
            barista: ""
        }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.send({ Status: 'OK' })
        })

    })

    app.put('/orders', (req, res) => {
        db.collection('orders')
            .findOneAndUpdate({
                _id: ObjectID(req.body.id)
            }, {
                $set: {
                    completed: true,
                    barista: req.user.local.email
                }
            }, {
                sort: {
                    _id: -1
                },
                upsert: true
            }, (err, result) => {
                if (err) return res.send(err)
                res.send(result)
            })
    })


    app.delete('/ordersComplete', (req, res) => {
        db.collection('orders').findOneAndDelete({
            completed: true
        }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Order deleted!')
        })
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/barista', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash orders
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/barista', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash orders
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/barista');
        });
    });

};




// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
