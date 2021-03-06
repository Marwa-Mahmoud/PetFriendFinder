const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, owner) {
    const Owner = owner;
    const LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            let generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            Owner.findOne({
                where: {
                    email: email
                }
            }).then(function(owner) {
                if(owner) {
                    return done(null, false, {
                        message: 'There is already an account associated with that email address'
                    });
                }else{
                    let ownerPassowrd = generateHash(password);

                    let data = {
                        email: email,
                        password: ownerPassowrd,
                        name: req.body.name,
                        picture: 'https://api.adorable.io/avatars/285/' + email + '.png',
                        location: req.body.location,
                        gender: req.body.gender,
                        age: req.body.age,
                        bio: req.body.bio
                    };

                    Owner.create(data).then(function(newOwner, created) {
                        if(!newOwner) {
                            return done(null, false);
                        }

                        if(newOwner) {
                            return done(null, newOwner);
                        }
                    });
                }
            });
        }
    ));

    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            let Owner = owner;
            let isValidPassword = function(ownerpass, password) {
                return bCrypt.compareSync(password, ownerpass);
            };

            Owner.findOne({
                where: {
                    email: email
                }
            }).then(function(owner) {
                if(!owner) {
                    return done(null, false, {
                        message: 'No user with email address: ' + email
                    });
                }
                if(!isValidPassword(owner.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                }

                let ownerinfo = owner.get();
                return done(null, ownerinfo);
            }).catch(function(err) {
                console.log('Error:', err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ))

    passport.serializeUser(function(owner, done) {
        done(null, owner.id);
    });

    passport.deserializeUser(function(id, done) {
        Owner.findById(id).then(function(owner) {
            if(owner) {
                done(null, owner.get());
            }else{
                done(owner.errors, null);
            }
        });
    });
}