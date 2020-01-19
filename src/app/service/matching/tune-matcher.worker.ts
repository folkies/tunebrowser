import { configure, LogLevel } from '@log4js2/core';
import { expose } from 'comlink';
import { TuneMatcher } from './tune-matcher-impl';

configure({
    level: LogLevel.INFO,
    virtualConsole: false
  });
  

const matcher = new TuneMatcher();

expose(matcher);