import * as OAuth2Strategy from 'passport-oauth2';
import { CognitoOAuth2Options } from './types';
import { VerifyFunctionWithRequest } from 'passport-oauth2';
export declare class CognitoStrategy extends OAuth2Strategy {
    private readonly cognitoClient;
    private readonly customAuthOptions;
    constructor(options: CognitoOAuth2Options, verify: VerifyFunctionWithRequest<any, any>, customAuthOptions?: {});
    userProfile(accessToken: string, done: Function): Promise<void>;
    authorizationParams(options: CognitoOAuth2Options): {
        clientDomain: string;
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        passReqToCallback: boolean;
        region: string;
        scope?: string[];
        scopeSeparator?: string;
        state?: string;
        pkce?: boolean;
        sessionKey?: string;
        trustProxy?: boolean;
        skipUserProfile?: boolean;
        customHeaders?: Record<string, string>;
        store?: OAuth2Strategy.StateStore;
    };
}
