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

// Build safe ORDER BY / LIMIT / OFFSET clauses from jsonplaceholder-style query
// params (_sort, _order, _limit, _page). The sort column is whitelisted (column
// names cannot be parameterized) and limit/offset are validated integers, so the
// returned strings are safe to concatenate.
function parseListOptions(query = {}, { allowedSort = [], defaultSort = 'id' } = {}) {
  const sortCol = query._sort && allowedSort.includes(query._sort) ? query._sort : defaultSort;
  const order = String(query._order || '').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const orderClause = ` ORDER BY ${sortCol} ${order}`;

  let limitClause = '';
  const limitRaw = parseId(query._limit);
  if (limitRaw) {
    const limit = Math.min(limitRaw, 100); // cap so a client cannot ask for everything at once
    const page = parseId(query._page) || 1;
    const offset = (page - 1) * limit;
    limitClause = ` LIMIT ${limit} OFFSET ${offset}`;
  }

  return { orderClause, limitClause };
}

module.exports = { parseId, parseBool01, parseListOptions };
