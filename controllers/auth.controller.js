const config = require('../config/auth.config');
const { UserModel } = require('../models/Models');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res) => {
    if (req.body.username === undefined || 
        req.body.password === undefined) {
            return res.status(400).send({
                message: 'Username or password missing from body.'
            });
        }

    bcrypt.hash(req.body.password, config.saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send({
                message: err.message
            });
        }

        const user = new UserModel({
            username: req.body.username,
            password: hash
        });

        user.save((err, user) => {
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }

            return res.status(201).send({
                message: `Registered user ${user.username} succesfully`
            });
        });
    });
}

exports.authorizeSignup = (req, res, next) => {
    if (req.headers.user == config.user && req.headers.pass == config.pass) {
        return next();
    }

    res.status(401).send({ message: 'Authentication failed.' });
}

exports.signIn = (req, res) => {
    UserModel.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) {
            return res.status(500).send({
                message: err.message
            });
        }

        if (!user) {
            return res.status(404).send({
                message: 'User not found.'
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, same) => {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    success: false
                });
            }

            if (!same) {
                return res.status(401).send({
                    message: 'Login failed, password is incorrect',
                    success: false
                });
            }

            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: "1d"
            });

            res.status(200).send({
                message: "Login successful",
                success: true,
                token: token
            });
        });
    });
}

exports.verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: 'Token not found in request'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                message: err.message
            });
        }
        console.log('Token verified successfully');
        next();
    });
}

exports.grantAccess = (req, res) => {
    return res.status(200).send(true);
}