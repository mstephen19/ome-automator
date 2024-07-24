/**
 * Thrown when the script was stopped due to user input in the extension
 * or reaching `stopAfterMins`.
 */
export class StoppedError extends Error {}

/**
 * Thrown when status changes (e.g. "connected" -> "searching")
 */
export class StatusError extends Error {}

/**
 * Thrown when an operation times out & the sequence must be restarted.
 */
export class TimeoutError extends Error {}
