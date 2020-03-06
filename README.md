# passport-oauth2-cognito
[Passport](https://github.com/jaredhanson/passport) [Cognito OAuth2 Authorization Code Grant Flow](https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/) [strategy](https://github.com/jaredhanson/passport-strategy) for authenticating against [AWS Cognito](https://aws.amazon.com/cognito/) [User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html). This supports providing congnito specific additional auth parameters. This is subclass of passport-oauth2 strategy.

## Install

    $ npm i @ajayaldo/passport-cognito-oauth2
    
#### Create Strategy

The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user, as well as `options` specifying a
consumer key, consumer secret, and callback URL.
    
    const passport = require('passport'),
    CognitoOAuth2Strategy = require('@ajayaldo/passport-cognito-oauth2');

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function (user, done) {
        done(null, user);
    });
    
    const options = {
        callbackURL: 'http://localhost:4001/auth/callbacks', //Your callback url
        clientDomain: 'https://yourdomain.auth.eu-west-1.amazoncognito.com', //Your cognito user pool domain
        clientID: 'your cognito app client id',
        clientSecret: 'your cognito app client secret',
        region: 'eu-west-1',
        passReqToCallback: true
    };

    //Indicates the provider that the end user should authenticate with. You can provide other custom auth params here
    const customOptions = { identity_provider: 'your idp name' };
   
     async function verify(req, accessToken, refreshToken, profile, done) {
        //Your additional user logic

        let sessionData = {
            username: profile.username
            //additional props
        }

        return done(null, sessionData);
    };
    
    passport.use('cognito', new CognitoOAuth2Strategy(options, verify, customOptions));
    or 
    passport.use('cognito', new CognitoOAuth2Strategy(options, verify)); //go to default cognito login page and let user choose the idp
    
    
    
#### Configure Route to Invoke Auth Requests

Use `passport.authenticate()`, specifying the `'cognito'` strategy

    authenticationRouter
    .route('/auth')
    .get(passport.authenticate('cognito'));

    authenticationRouter
    .route('/auth/callback')
    .get(passport.authenticate('cognito', { failureRedirect: '/', failureFlash: true }));

## Additional Details
A simple working example [here](https://github.com/ajayaldo/cognito-oauth2-passport-example)

Refer [here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html) for more information about configuring cognito app client
