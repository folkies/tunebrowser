declare namespace google { }
declare namespace google.accounts { }
declare namespace google.accounts.id {
    export function initialize(config: IdConfiguration):void;
    export function prompt(listener: (notification: PromptMomentNotification) => void): void;
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
    login_hint?: string;
    hd?: string;
    state?: string;
}

interface IdConfiguration {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    login_hint?: string;
    hd?: string;
    use_fedcm_for_prompt?: boolean;
}

interface CredentialResponse {
    credential: string;
    select_by: string;
    state: string;
}

interface PromptMomentNotification {
    isDisplayMoment(): boolean;
    getMomentType(): string;

}