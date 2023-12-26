const util = require('util');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const {
    GetUserCommand,
    CognitoIdentityProviderClient,
  } =require('@aws-sdk/client-cognito-identity-provider');
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
        this.cognitoClient = new CognitoIdentityProviderClient({region});
    }
}

util.inherits(CognitoStrategy, OAuth2Strategy);

CognitoStrategy.prototype.userProfile = async function(AccessToken, done) {
    const getUserCommand = new GetUserCommand({ AccessToken });

    try {
        const userData = await this.cognitoClient.send(getUserCommand);
        done(null, userData);
    } catch (err) {
        done(err, null);
    }
}

CognitoStrategy.prototype.authorizationParams = function(options) {
    let mergedOptions = { ...this.customAuthOptions, ...options };
    
    return mergedOptions;
}

module.exports = CognitoStrategy;