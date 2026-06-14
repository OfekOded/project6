// Parse a value that must be a POSITIVE INTEGER (route :id, userId, postId...).
// Returns the number, or null if it is not a valid positive integer.
// Rejects: undefined, null, '', 'abc', '1.5', '-3', '0'.
function parseId(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Parse a boolean-as-0/1 flag (e.g. the todos `completed` filter).
// Returns 0 or 1, or null if the value is anything else.
function parseBool01(value) {
  if (value === '0' || value === 0) return 0;
  if (value === '1' || value === 1) return 1;
  return null;
}

module.exports = { parseId, parseBool01 };
