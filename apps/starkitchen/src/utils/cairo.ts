// Cairo short strings are ascii characters packed into one felt252. Felt can contain 251 full bits, so we can pack up to 31 characters into one felt.
// These functions are helpers to convert between felt and strings.

/// Convert a felt, represented as a string, to the short string it represents.
export const feltToString = (felt: string) => {
  // Convert the BigInt to a hexadecimal string
  let hexString = BigInt(felt).toString(16);

  // Pad the string to ensure even length (each character is 2 hex digits)
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }

  // Decode the hex string to ASCII characters
  let result = '';
  for (let i = 0; i < hexString.length; i += 2) {
    const charCode = parseInt(hexString.slice(i, i + 2), 16);
    result += String.fromCharCode(charCode);
  }

  return result;
};

/// Convert a string with up to 31 characters to a felt, represented as a string.
export const stringToFelt = (str: string) => {
  // Assert that the string is not too long
  if (str.length > 31) {
    throw new Error('String is too long to be packed into a felt');
  }

  // Encode the string as a hex string
  let hexString = '';
  for (let i = 0; i < str.length; i++) {
    hexString += str.charCodeAt(i).toString(16).padStart(2, '0');
  }

  // Convert the hex string to a BigInt
  return BigInt('0x' + hexString).toString();
};
