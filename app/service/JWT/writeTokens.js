require('dotenv').config();
const {User} = require('../../models');

const writeRefreshToken = async (userId, refreshtoken) => {

    try {
        User.update({
            refreshToken: refreshtoken,
        }, {
            where: {id: userId},
        });

    } catch (e) {
        console.log(e);
        throw new Error("Error when updating a token");
    }

    return refreshtoken;
};

const writeAccessToken = async (userId, accesstoken) => {

    try {
        User.update({
            accessToken: accesstoken,
        }, {
            where: {id: userId},
        }, {
            logging: false
        });

    } catch (e) {
        console.log(e);
        throw new Error("Error when updating a token");
    }

    return accesstoken;
};

module.exports = {writeRefreshToken, writeAccessToken};
