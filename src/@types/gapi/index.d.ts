interface GapiRuntime {
    load(apiName: string, callback: () => void): void;
    client: {
        init(options: object): Promise<void>;
        setToken(token: { access_token: string }): void;
    };
}

declare const gapi: GapiRuntime;
