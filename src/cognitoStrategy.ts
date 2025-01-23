
import OAuth2Strategy from 'passport-oauth2';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoOAuth2Options, CustomAuthOptions } from './types';

export class CognitoStrategy extends OAuth2Strategy {
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly customAuthOptions: CustomAuthOptions;

  constructor(
    options: CognitoOAuth2Options,
    verify: Function,
    customAuthOptions = {}
  ) {

    const oauthOption = {
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      authorizationURL: `${options.clientDomain}/oauth2/authorize`,
      tokenURL: `${options.clientDomain}/oauth2/token`,
      callbackURL: options.callbackURL,
      passReqToCallback: options.passReqToCallback,
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

    super(options, verify);

    this.cognitoClient = new CognitoIdentityProviderClient({ region: options.region });
    this.customAuthOptions = customAuthOptions;
    this.authorizationParams = this.authorizationParams.bind(this);
    this.userProfile = this.userProfile.bind(this);
  }

  async userProfile(accessToken: string, done: Function): Promise<void> {
    const getUserCommand = new GetUserCommand({ AccessToken: accessToken });

    try {
      const userData = await this.cognitoClient.send(getUserCommand);
      done(null, userData);
    } catch (err) {
      done(err, null);
    }
  }

  authorizationParams(options: CognitoOAuth2Options) {
    return { ...this.customAuthOptions, ...options };
  }
}