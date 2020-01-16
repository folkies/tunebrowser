import { Injectable } from '@angular/core';

@Injectable()
export class AudioContextProvider {

    private instance: AudioContext;

    async audioContext(): Promise<AudioContext> {
        if (!this.instance) {
            const _AudioContext = window['AudioContext'] || window['webkitAudioContext'];
            this.instance = new _AudioContext();

            if (this.instance.state === 'suspended') {
                await this.instance.resume();
            }
        }
        return this.instance;
    }
}