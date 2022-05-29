declare namespace google { }
declare namespace google.accounts { }
declare namespace google.accounts.id {
    export function initialize(config: object);
    export function prompt(any);
}
declare namespace google.accounts.oauth2 {
    export function initTokenClient(config: TokenClientConfig): TokenClient;
    export function revoke(token: string): void;


}

interface TokenClient {
    callback: (response: TokenResponse) => void;
    requestAccessToken(): void;
}

interface TokenResponse {
    access_token: string;
    expires_in: number;
    hd?: string;
    prompt: string;
    token_type: string;
    scopes: string;
    state?: string;
    error?: string;
    error_description?: string;
    error_uri?: string;
}

interface TokenClientConfig {
    client_id: string;
    callback: (response: TokenResponse) => void;
    scope?: string;
    prompt?: string;
    enable_serial_consent?: boolean;
    hint?: string;
    hosted_domain?: string;
    state?: string;
}