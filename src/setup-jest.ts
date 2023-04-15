import 'jest-preset-angular/setup-jest';

import { configure, LogLevel } from '@log4js2/core';

configure({
  level: LogLevel.INFO,
  virtualConsole: false
});
