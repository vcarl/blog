export const toId = string =>
  string
    // This lint rule appears to be broken. These are very much needed
    // eslint-disable-next-line no-useless-escape
    .replace(/[“‘”’'",.<>/?\[\]\\|\{\}=\+\(\)]/g, '')
    .replace(/ /g, '-')
    .toLowerCase();
