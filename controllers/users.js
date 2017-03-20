const utils = require('../utils.js');
var User = require('../models/User');

// authentication a user
exports.auth = function(request, response) {
  const params = request.body;
  console.log(params);
  const authData = params.authData; // deepstream packs everythin into an authData obj
  const pw = authData.password;
  const username = authData.username;

  console.log(username);
  User.findOne({ "username": username}).exec((err, user) =>  {
      const sendResp = (err, success) => {
        if (err || !success) return next(); //404
        const role = user.role ? user.role : "user" //FIX
        if (success) {
          response.json({
              username,
              clientData: user,
              serverData: { uid: user.uid, role }
          });
        }
      }
      user.comparePassword(pw, sendResp);
  });
}

// create a new user based on the form submission
exports.create = function(request, response) {
    var params = request.body;

    // Create a new user based on form parameters
    var user = new User({
        username: params.username,
        phone: params.phone,
        countryCode: params.countryCode,
        password: params.password,
        uid: utils.getUid()
    });

    user.save().then( (doc) => {
        if (doc !== null) {
            // If the user is created successfully, send them an account
            // verification token
            console.log("save");
            response.json({ user: doc });
//            user.sendAuthyToken(function(err) {
//                if (err) {
//                    request.flash('errors', 'There was a problem sending '
//                        + 'your token - sorry :(');
//                }
//
//                // Send to token verification page
//                response.json({ user: doc });
//            });
        }
    });
};

// Resend a code if it was not received
exports.resend = function(request, response) {
    // Load user model
    User.findById(request.params.id, function(err, user) {
        if (err || !user) {
            return die('User not found for this ID.');
        }

        // If we find the user, let's send them a new code
        user.sendAuthyToken(postSend);
    });

    // Handle send code response
    function postSend(err) {
        if (err) {
            return die('There was a problem sending you the code - please '
                + 'retry.');
        }

        request.flash('successes', 'Code re-sent!');
        response.redirect('/users/'+request.params.id+'/verify');
    }

    // respond with an error
    function die(message) {
        request.flash('errors', message);
        response.redirect('/users/'+request.params.id+'/verify');
    }
};

// Handle submission of verification token
exports.verify = function(request, response) {
    var user;

    // Load user model
    User.findById(request.params.id, function(err, doc) {
        if (err || !doc) {
            return die('User not found for this ID.');
        }

        // If we find the user, let's validate the token they entered
        user = doc;
        user.verifyAuthyToken(request.body.code, postVerify);
    });

    // Handle verification response
    function postVerify(err) {
        if (err) {
            return die('The token you entered was invalid - please retry.');
        }

        // If the token was valid, flip the bit to validate the user account
        user.verified = true;
        user.save(postSave);
    }

    // after we save the user, handle sending a confirmation
    function postSave(err) {
        if (err) {
            return die('There was a problem validating your account '
                + '- please enter your token again.');
        }

        // Send confirmation text message
        var message = 'You did it! Signup complete :)';
        user.sendMessage(message, function(err) {
            if (err) {
                request.flash('errors', 'You are signed up, but '
                    + 'we could not send you a message. Our bad :(');
            }

            // show success page
            request.flash('successes', message);
            response.redirect('/users/'+user._id);
        });
    }

    // respond with an error
    function die(message) {
        request.flash('errors', message);
        response.redirect('/users/'+request.params.id+'/verify');
    }
};

// Show details about the user
exports.showUser = function(request, response, next) {
    // Load user model
    User.findById(request.params.id, function(err, user) {
        if (err || !user) {
            // 404
            return next();
        }

        response.json({ user });
    });
};
