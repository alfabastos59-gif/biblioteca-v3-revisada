/**
 * Replaces an administrator's existing PIN with the newly entered value.
 * There is intentionally no password history: when a new PIN is provided,
 * the old value is discarded and cannot be used for authentication anymore.
 * An empty value during profile editing keeps the current PIN unchanged.
 */
export function replaceAdminPin(currentPin: string | undefined, requestedPin: string): string | undefined {
  const nextPin = requestedPin.trim();
  return nextPin.length > 0 ? nextPin : currentPin;
}

export function isAdminPinValid(storedPin: string | undefined, requestedPin: string): boolean {
  return Boolean(storedPin) && storedPin === requestedPin;
}
