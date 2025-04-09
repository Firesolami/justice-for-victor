const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const security = require('../utils/security');

const userSchema = new mongoose.Schema(
    {
        matricNo: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        matricNoHash: {
            type: String,
            required: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        hasSigned: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('matricNo') || !this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.matricNo = security.encrypt(this.matricNo);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
