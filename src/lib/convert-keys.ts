/**
 * Converts a snake_case string to camelCase
 * Special case: "_id" becomes "id"
 */
function toCamelCase(str: string): string {
  // Special case: "_id" -> "id"
  if (str === '_id') {
    return 'id';
  }

  // Handle snake_case conversion
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a camelCase string to snake_case
 * Special case: "id" becomes "_id"
 */
function toSnakeCase(str: string): string {
  // Special case: "id" -> "_id"
  if (str === 'id') {
    return '_id';
  }

  // Handle camelCase conversion to snake_case
  // Insert underscore before uppercase letters and convert to lowercase
  return str.replace(/[A-Z]/g, (letter, index) => {
    // Don't add underscore at the beginning
    return index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`;
  });
}

/**
 * Recursively converts all keys in an object or array from snake_case to camelCase
 * Special handling: "_id" is converted to "id"
 *
 * @param obj - The object or array to convert
 * @returns The converted object or array with camelCase keys
 */
export function convertKeysToCamelCase<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item)) as T;
  }

  // Handle objects
  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      converted[camelKey] = convertKeysToCamelCase(value);
    }

    return converted as T;
  }

  // Return primitives as-is
  return obj;
}

/**
 * Recursively converts all keys in an object or array from camelCase to snake_case
 * Special handling: "id" is converted to "_id"
 *
 * @param obj - The object or array to convert
 * @returns The converted object or array with snake_case keys
 */
export function convertKeysToSnakeCase<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item)) as T;
  }

  // Handle objects
  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = toSnakeCase(key);
      converted[snakeKey] = convertKeysToSnakeCase(value);
    }

    return converted as T;
  }

  // Return primitives as-is
  return obj;
}
