/**
 * An enum that specifies the platforms where an Angular application can be run.
 * The enum values correspond to the values of the platform id tokens that the Angular DI system can resolve.
 */
export const enum EApplicationPlatform {
  Browser = 'browser',
  Server = 'server',
  WorkerApp = 'browserWorkerApp',
  WorkerUI = 'browserWorkerUi',
}
