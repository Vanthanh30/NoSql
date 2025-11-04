const account = require('../../models/admin/accounts');
const bcrypt = require('bcrypt');
const cloudinary = require('../../configs/cloudinary');

const createAccount = async (req, res) => {
    try {

        const { fullName, email, password, phone, role_Id } = req.body;

        const existingAccount = await account.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let avatarUrl = null;
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'admin_avatars',
            });
            avatarUrl = uploadResult.secure_url;
        }

        const newAccount = new account({
            fullName,
            email,
            password: hashedPassword,
            phone,
            avatar: avatarUrl,
            role_Id,
        });

        await newAccount.save();

        res.status(201).json({
            message: 'Account created successfully',
            account: newAccount,
        });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const accountData = await account.findById(id);
        if (!accountData) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({
            message: 'Account retrieved successfully',
            account: accountData,
        });
    }
    catch (error) {
        console.error('Error retrieving account:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
const getAccount = async (req, res) => {
    try {
        const accounts = await account.find();
        res.status(200).json({
            message: 'Accounts retrieved successfully',
            accounts: accounts,
        });
    } catch (error) {
        console.error('Error retrieving accounts:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, password, phone, role_Id } = req.body;
        const accountToUpdate = await account.findById(id);
        if (!accountToUpdate) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'admin_avatars',
            });
            accountToUpdate.avatar = uploadResult.secure_url;
        }
        accountToUpdate.fullName = fullName;
        accountToUpdate.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            accountToUpdate.password = hashedPassword;
        }
        accountToUpdate.phone = phone;
        accountToUpdate.role_Id = role_Id;

        await accountToUpdate.save();

        res.status(200).json({
            message: 'Account updated successfully',
            account: accountToUpdate,
        });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}
const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const accountToDelete = await account.findById(id);
        if (!accountToDelete) {
            return res.status(404).json({ message: 'Account not found' });
        }
        await accountToDelete.updateOne({ deleted: true });
        res.status(200).json({
            message: 'Account deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = { createAccount, updateAccount, getAccountById, getAccount, deleteAccount };
