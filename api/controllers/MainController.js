/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var MainController = {
	index: function (req, res) {
		console.log("Sending view stuff - lalala");
		res.view();
	}, 

	signup: function (req, res) {
		var username = req.param('username');
	    var password = req.param('password');
	    // Users.findByUsername(username)...
	    // In v0.9.0 the find method returns an empty array when no results are found
	    // when only one result is needed use findOne.
	    Users.findOne({username: username}).exec(function findOneCB(err, usr){
	    	console.log(err, usr);
	    	if (err) {
                res.send(500, { error: "DB Error" });
            } else if (usr) {
                res.send(400, {error: "Username already Taken"});
            } else {
                var hasher = require("password-hash");
                password = hasher.generate(password);
                
                Users.create({username: username, password: password}, function(error, user) {
	                if (error) {
	                    res.send(500, {error: "DB Error"});
	                } else {
	                	console.log("user created");
	                    req.session.user = user;
	                    res.send(user);
	                }
            	});
	    	}
	    });
	}, 

	login: function (req, res) {
		var username = req.param("username");
		var password = req.param("password");

		Users.findOne({username: username}).exec(function findOneCB(err, usr){
			if(err){
				res.send(500, { error: "DB Error" });
			} else {
				if (usr) {
					var hasher = require("password-hash");
					if(hasher.verify(password, usr.password)){
						req.session.user = usr;
						res.send(usr);
					} else {
						res.send(400, { error: "Wrong password" });
					}
				} else {
					res.send(404, { error: "User not found" })
				}
			}
		});
	}, 

	chat: function(req, res) {
		if (req.session.user) {
			res.view({username: req.session.user.username});
		} else {
			console.log('redirecting');
			res.redirect('/');
		}
	}
};

module.exports = MainController;

