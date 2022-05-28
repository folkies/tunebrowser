declare namespace google { }
declare namespace google.accounts { }
declare namespace google.accounts.id {
  export function initialize(config: object);
  export function prompt(any);
}
declare namespace google.accounts.oauth2 {
  export function initTokenClient(config: object): TokenClient;
  export function revoke(token: string): void;

  
}

interface TokenClient {
    callback: any;
    requestAccessToken(): void;
}
