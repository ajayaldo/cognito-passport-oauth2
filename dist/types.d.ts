import { StateStore } from "passport-oauth2";
export interface CognitoOAuth2Options {
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
    store?: StateStore;
}
export interface CustomAuthOptions {
    [key: string]: any;
}
