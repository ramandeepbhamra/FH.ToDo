/**
 * Abstract idle/inactivity service.
 * Program against this — not against a concrete implementation.
 * To swap the underlying library, change the `useClass` binding in app.config.ts.
 */
export abstract class IdleService {
  abstract start(): void;
  abstract stop(): void;
}
