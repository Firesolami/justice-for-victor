const User = require('../models/User');
const security = require('../utils/security');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+hasSigned');
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found.'
            });
        }
        if (user.hasSigned) {
            return res.status(400).json({
                status: 'error',
                message: 'User has already signed.'
            });
        }
        user.hasSigned = true;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User signed successfully.'
        });
    } catch (error) {
        next(error);
    }
};
