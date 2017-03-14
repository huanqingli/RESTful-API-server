/**
 * Created by Muc on 17/3/7.
 */
const express = require('express');
const Users = require('../models/users');
const router = express.Router();
const jwt = require('jsonwebtoken');

const config = require('../config');
const authenticate = require('../middleware/authenticate');

router.post('/register', (req, res, next) => {
    var user = {
        username: req.body.username,
        password: req.body.password,
    };
    Users.findOne({ username: user.username }, function (err, users) {
        if (err) { return res.json({success:false,err:err}); }
        if (!users) {
            var User = new Users(user);
            User.save(function (err) {
                if(err)return res.json({success:false,err:err});
                return res.json({success:true});
            });
        }else{
            return res.json({success:false,err:"用户已存在"});
        }
    });

});
//本地登录拿token
router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    Users.findOne({ username: username }, function (err, user) {
        if (err) { return res.json({success:false, message:err}); }
        if (!user) { return res.json({success:false, message:"用户名或密码错误"}); }
        if (user.password!=password) { return res.json({success:false, message:"用户名或密码错误"}); }
        const token=jwt.sign(user, config.token.key, { expiresIn: config.token.exp});
        res.json({token:token});
        req.user = user;
    });

});
//使用资源前验证
router.get('/me', authenticate, (req, res) =>  {
    const user = jwt.decode(req.headers.authorization.split(' ')[1])._doc;
    res.json(user);
    });


module.exports = router;