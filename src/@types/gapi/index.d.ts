declare namespace gapi {
    function load(apiName: string, callback: () => void): void;

    namespace client {
        function init(options: object): Promise<void>;
        function setToken(token: { access_token: string }): void;
    }
}
