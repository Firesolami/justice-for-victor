const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BUCCMatric = require('../models/BuccMatric');
const security = require('../utils/security');

exports.signup = async (req, res, next) => {
    try {
        const { matricNo, password } = req.body;

        if (!matricNo || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide matric number and password.'
            });
        }

        const validMatricNo = await BUCCMatric.findOne({
            matricNumber: matricNo
        });
        if (!validMatricNo) {
            return res.status(400).json({
                status: 'error',
                message: 'Even non-BUCC love Victor. No vex sha. Only BUCC allowed.'
            });
        }

        const matricNoHash = security.hash(matricNo);
        const existingUser = await User.findOne({ matricNoHash });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Hmm, this user might already exist. Idk sha'
            });
        }

        const user = await User.create({
            matricNo,
            password,
            matricNoHash
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { matricNo, password } = req.body;

        if (!matricNo || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide matric number and password.'
            });
        }

        const matricNoHash = security.hash(matricNo);
        const user = await User.findOne({ matricNoHash }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid matric number or password.'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        next(error);
    }
};
