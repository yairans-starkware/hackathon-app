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
