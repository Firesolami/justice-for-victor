const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const users = await User.find({ hasSigned: true });

        return res.status(200).json({
            status: 'success',
            count: users.length,
        });
    } catch (error) {
        next(error);
    }
};