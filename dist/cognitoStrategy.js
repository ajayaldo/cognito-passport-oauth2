"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoStrategy = void 0;
const OAuth2Strategy = require("passport-oauth2");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const client_cognito_identity_provider_2 = require("@aws-sdk/client-cognito-identity-provider");
class CognitoStrategy extends OAuth2Strategy {
    constructor(options, verify, customAuthOptions = {}) {
        const oauthOption = {
            clientID: options.clientID,
            clientSecret: options.clientSecret,
            authorizationURL: `${options.clientDomain}/oauth2/authorize`,
            tokenURL: `${options.clientDomain}/oauth2/token`,
            callbackURL: options.callbackURL,
            passReqToCallback: true,
            state: options.state,
            pkce: options.pkce,
            sessionKey: options.sessionKey,
            proxy: options.trustProxy,
            skipUserProfile: options.skipUserProfile,
            scope: options.scope,
            scopeSeparator: options.scopeSeparator,
            customHeaders: options.customHeaders,
            store: options.store,
        };
        super(oauthOption, verify);
        this.cognitoClient = new client_cognito_identity_provider_2.CognitoIdentityProviderClient({ region: options.region });
        this.customAuthOptions = customAuthOptions;
        this.authorizationParams = this.authorizationParams.bind(this);
        this.userProfile = this.userProfile.bind(this);
    }
    userProfile(accessToken, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUserCommand = new client_cognito_identity_provider_1.GetUserCommand({ AccessToken: accessToken });
            try {
                const userData = yield this.cognitoClient.send(getUserCommand);
                done(null, userData);
            }
            catch (err) {
                done(err, null);
            }
        });
    }
    authorizationParams(options) {
        return Object.assign(Object.assign({}, this.customAuthOptions), options);
    }
}
exports.CognitoStrategy = CognitoStrategy;
