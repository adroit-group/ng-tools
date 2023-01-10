/**
 * An enum that specifies the platforms where an Angular application can be run.
 * The enum values correspond to the values of the platform id tokens that the Angular DI system can resolve.
 */
export const EApplicationPlatform = {
  browser: 'browser',
  server: 'server',
  browserWorkerApp: 'browserWorkerApp',
  browserWorkerUi: 'browserWorkerUi',
} as const;
