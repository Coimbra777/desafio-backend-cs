const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim();
}

function isBlankString(value: unknown) {
  return normalizeOptionalString(value) === "";
}

function isValidEmail(value: string) {
  return basicEmailRegex.test(value);
}

export { isBlankString, isValidEmail, normalizeOptionalString };
