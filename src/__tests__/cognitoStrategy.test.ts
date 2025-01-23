import { CognitoStrategy } from '../cognitoStrategy';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { mockClient } from 'aws-sdk-client-mock';

const cognitoMockClient = mockClient(CognitoIdentityProviderClient);

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('CognitoStrategy', () => {
  const mockOptions = {
    clientID: 'test-client-id',
    clientSecret: 'test-client-secret',
    clientDomain: 'https://test.auth.region.amazoncognito.com',
    callbackURL: 'http://localhost:3000/callback',
    region: 'us-east-1',
    passReqToCallback: true,
  };

  const mockVerify = jest.fn();
  const mockCustomAuthOptions = { prompt: 'login' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct options', () => {
      const strategy = new CognitoStrategy(mockOptions, mockVerify, mockCustomAuthOptions);
      expect(strategy).toBeInstanceOf(CognitoStrategy);
    });
  });

  describe('userProfile', () => {
    it('should fetch user profile successfully', async () => {
      const strategy = new CognitoStrategy(mockOptions, mockVerify);

      const mockUserData = {
        UserAttributes: [
          { Name: 'email', Value: 'test@example.com' }
        ]
      };

      cognitoMockClient.commandCalls(GetUserCommand, {
        AccessToken: 'test-access-token',
      });
      cognitoMockClient.on(GetUserCommand).resolves(mockUserData);

      const doneMock = jest.fn();
      await strategy.userProfile('test-access-token', doneMock);

      expect(doneMock).toHaveBeenCalledWith(null, mockUserData);
    });
  }
  );

  it('should handle errors when fetching user profile', async () => {
    const strategy = new CognitoStrategy(mockOptions, mockVerify);

    cognitoMockClient.commandCalls(GetUserCommand, {
      AccessToken: 'test-access-token',
    });
    cognitoMockClient.on(GetUserCommand).rejects(new Error('test-error'));

    const doneMock = jest.fn();
    await strategy.userProfile('test-access-token', doneMock);
    expect(doneMock).toHaveBeenCalledWith(new Error('test-error'), null);

  });

  describe('authorizationParams', () => {
    it('should merge custom auth options with provided options', () => {
      const strategy = new CognitoStrategy(mockOptions, mockVerify, mockCustomAuthOptions);
      const result = strategy.authorizationParams(mockOptions);

      expect(result).toEqual({
        ...mockOptions,
        ...mockCustomAuthOptions
      });
    });
  });
});