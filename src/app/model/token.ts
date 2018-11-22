class OAuthCreds {
  accessToken: string;
  instanceURL: string;

  constructor(token: string, loginURL: string) {
    this.accessToken = token;
    this.instanceURL = loginURL;
  }
}
