export function queryStringFromJson(object: {[key: string]: any}) {
  return Object.keys(object)
    .reduce((acc, key) => {
      const value = object[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);

      return `${acc}&${encodedKey}=${encodedValue}`;
    }, '')
    .slice(1);
}
