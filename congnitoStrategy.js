const util = require('util');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const AWS = require('aws-sdk');

class CognitoStrategy {
    constructor({ clientDomain, clientID, clientSecret, callbackURL, passReqToCallback, region, scope }, verify, customAuthOptions = {}) {
        const options = {
            clientID,
            clientSecret,
            authorizationURL: `${clientDomain}/oauth2/authorize`,
            tokenURL: `${clientDomain}/oauth2/token`,
            callbackURL,
            passReqToCallback
        };

        if (scope !== undefined) {
            options['scope'] = scope
        }

        this.customAuthOptions = customAuthOptions;

        OAuth2Strategy.call(this, options, verify);
        AWS.config.region = region;
        this.cognitoClient = new AWS.CognitoIdentityServiceProvider();
    }
}

util.inherits(CognitoStrategy, OAuth2Strategy);

CognitoStrategy.prototype.userProfile = function(AccessToken, done) {
    this.cognitoClient.getUser({ AccessToken }, (err, userData) => {
        if (err) {
            return done(err, null);
        }

        const profile = {};
        profile.username = userData.Username;

        for (let index = userData.UserAttributes.length; index--;) {
            let attribute = userData.UserAttributes[index];
            profile[attribute.Name] = attribute.Value;
        }

        done(null, profile);
    });
};

CognitoStrategy.prototype.authorizationParams = function(options) {
    return this.customAuthOptions;
}

module.exports = CognitoStrategy;