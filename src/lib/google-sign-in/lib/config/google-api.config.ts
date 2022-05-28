export interface GoogleApiClientConfig {

  /**
   * The app's client ID, found and created in the Google Developers Console.
   */
  client_id: string;

  /**
   * The domains for which to create sign-in cookies. Either a URI, single_host_origin, or none.
   * Defaults to single_host_origin if unspecified.
   */
  cookie_policy?: string;

  /**
   * The scopes to request, as a space-delimited string. Optional if fetch_basic_profile is not set to false.
   */
  scope?: string;


  /**
   * The UX mode to use for the sign-in flow.
   * By default, it will open the consent flow in a popup.
   */
  ux_mode?: 'popup' | 'redirect';

  /**
   * If using ux_mode='redirect', this parameter allows you to override the default redirect_uri that will be used at the end of the consent flow.
   * The default redirect_uri is the current URL stripped of query parameters and hash fragment.
   */
  redirect_uri?: string;

  /**
   * Describes the surface for a particular version of an API.
   */
  discoveryDocs: string[];
}

export class GoogleApiConfig2 {
  protected clientConfig: GoogleApiClientConfig;
  protected mocked: boolean;

  constructor(config: GoogleApiClientConfig) {
    this.clientConfig = config;
  }

  public getMocked(): boolean {
    return this.mocked;
  }

  public getClientConfig(): GoogleApiClientConfig {
    return this.clientConfig;
  }
}
