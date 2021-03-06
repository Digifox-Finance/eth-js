import { publicKeyCreate } from "secp256k1";
import { keccak256 } from "@ethersproject/solidity";

interface solidityKeccak256Param {
  value: string;
  type: string;
}

export function solidityKeccak256(params: solidityKeccak256Param[]) {
  const types: string[] = [];
  const values: string[] = [];
  if (!Array.isArray(params)) {
    types.push("string");
    values.push(params);
  } else {
    params.forEach((p) => {
      types.push(p.type);
      values.push(p.value);
    });
  }
  return keccak256(types, values);
}
export function removeLeading0x(str: string) {
  if (str.startsWith("0x")) return str.substring(2);
  else return str;
}

export function addLeading0x(str: string) {
  if (!str.startsWith("0x")) return "0x" + str;
  else return str;
}

export function uint8ArrayToHex(arr: any[]) {
  return Buffer.from(arr).toString("hex");
}

export function hexToUnit8Array(str: string) {
  return new Uint8Array(Buffer.from(str, "hex"));
}
function toArrayBuffer(buf: any) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

/**
 * Returns the ethereum public key of a given private key.
 * @param privateKey A private key must be 256 bits wide
 */
export const privateToPublic = function (privateKey: Buffer): Buffer {
  assertIsBuffer(privateKey);

  // skip the type flag and use the X, Y points
  return Buffer.from(publicKeyCreate(new Uint8Array(privateKey), false)).slice(
    1
  );
};

/**
 * Throws if input is not a buffer
 * @param {Buffer} input value to check
 */
export const assertIsBuffer = function (input: Buffer): void {
  if (!Buffer.isBuffer(input)) {
    const msg = `This method only supports Buffer but input was: ${input}`;
    throw new Error(msg);
  }
};
