// utils/borrowerUtils.js

function validateBorrowerData(data) {
  const errors = [];
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("Name is required and must be a non-empty string");
  }
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push("Email format is invalid");
  }
  // Contact can be any string, but we can add length checks if needed
  if (data.contact && typeof data.contact !== "string") {
    errors.push("Contact must be a string");
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateBorrowerData };