const generateToken = function () {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < characters.length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}
module.exports = generateToken;