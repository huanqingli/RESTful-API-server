/**
 * Created by Muc on 17/3/10.
 */
const jwt = require('jsonwebtoken');

const config = require('../config');
const Users = require('../models/users');

function authenticate(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if(!token) { req.authInfo = {success:false, message:"请在header中携带bearer token"}; next();}
    jwt.verify(token, config.token.key, function (err, decoded) {
        if(err){ req.authInfo = {success:false,  message:"非法token或已过期"}; next(); }
        const user = decoded._doc;
        Users.findOne(user, function (err, user) {
            if (err) { req.authInfo = {success:false,  message:err}; next(); }
            if (!user) { req.authInfo = {success:false,  message:"非法用户"}; next(); }
            req.authInfo = {success:true, message:"合法token"}; next();
        });

    });
}

module.exports = authenticate;