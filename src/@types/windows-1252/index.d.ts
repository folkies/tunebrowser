declare module "windows-1252" {

    export interface Options {
        mode?: 'fatal' | 'html';
    }

    export function decode(bytes: string, options?: Options): string;
    export function encode(bytes: string, options?: Options): string;
    export const version: string;
    export const labels: string;
}
