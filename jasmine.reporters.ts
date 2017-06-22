import { SpecReporter } from 'jasmine-spec-reporter';
import { logger } from './server/core/logger';

// Setup reporters
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayPending: true
  },
  summary: {
    displayDuration: true
  }
}));

// Disable logs
if (!process.env.JASMINE_ENABLE_LOGGER) {
  Object.keys(logger.transports).forEach(transport => logger.remove(<any>transport));
}
