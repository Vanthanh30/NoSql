const mongoose = require('mongoose');
const generateToken = require('../../helpers/generateToken');
const Schema = mongoose.Schema;
const AdminAccountSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generateToken()
    },
    phone: String,
    avatar: String,
    role_Id: String,
    status: {
        type: String,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, { timestamps: true });
const AdminAccount = mongoose.model('adminAccount', AdminAccountSchema);
module.exports = AdminAccount;