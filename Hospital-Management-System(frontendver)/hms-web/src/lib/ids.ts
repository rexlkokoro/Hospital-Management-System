export function generateNextId(
  existingIds: string[],
  prefix: string,
  startNumber: number = 1001,
  padDigits: number = 4
): string {
  let maxNum = 0;
  let found = false;

  for (const id of existingIds) {
    let numStr = id;
    if (prefix && id.startsWith(prefix)) {
      numStr = id.slice(prefix.length);
    }
    const num = parseInt(numStr, 10);
    if (!isNaN(num)) {
      if (!found || num > maxNum) {
        maxNum = num;
        found = true;
      }
    }
  }

  const nextNum = found ? maxNum + 1 : startNumber;
  return prefix ? `${prefix}${nextNum}` : nextNum.toString().padStart(padDigits, "0");
}

