const util = require('util');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const AWS = require('aws-sdk');

class CognitoStrategy {
    constructor({ clientDomain, clientID, clientSecret, callbackURL, passReqToCallback, region, scope, scopeSeparator, state, pkce, sessionKey, trustProxy, skipUserProfile, customHeaders, store }, verify, customAuthOptions = {}) {
        
        const options = {
            clientID,
            clientSecret,
            authorizationURL: `${clientDomain}/oauth2/authorize`,
            tokenURL: `${clientDomain}/oauth2/token`,
            callbackURL,
            passReqToCallback,
            state,
            pkce,
            sessionKey,
            proxy: trustProxy,
            skipUserProfile,
            scope,
            scopeSeparator,
            customHeaders,
            store
        };

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

        done(null, userData);
    });
}

CognitoStrategy.prototype.authorizationParams = function(options) {
    return this.customAuthOptions;
}

module.exports = CognitoStrategy;