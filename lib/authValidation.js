class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

function parseCredentials(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("A JSON object with email and password is required.");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("A valid email address is required.");
  }

  if (password.length < 8) {
    throw new ValidationError("Password must contain at least 8 characters.");
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new ValidationError("Password must not exceed 72 UTF-8 bytes.");
  }

  return { email, password };
}

module.exports = { ValidationError, parseCredentials };
