import { publicKeyConvert } from "secp256k1";
import { assertIsBuffer } from "../utils";

const assert = require("assert");
const elliptic = require("elliptic");
const secp256k1 = new elliptic.ec("secp256k1"); // eslint-disable-line
const { keccak256, keccak256s } = require("./hash");

const toChecksum = (address) => {
  const addressHash = keccak256s(address.slice(2));

  let checksumAddress = "0x";
  for (let i = 0; i < 40; i++)
    checksumAddress +=
      parseInt(addressHash[i + 2], 16) > 7
        ? address[i + 2].toUpperCase()
        : address[i + 2];
  return checksumAddress;
};

const fromPrivate = (privateKey) => {
  const buffer = new Buffer(privateKey.slice(2), "hex");
  const ecKey = secp256k1.keyFromPrivate(buffer);
  const publicKey = "0x" + ecKey.getPublic(false, "hex").slice(2);
  const publicHash = keccak256(publicKey);
  const address = toChecksum("0x" + publicHash.slice(-40));
  return {
    address: address,
    privateKey: privateKey
  };
};

/**
 * Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param pubKey The two points of an uncompressed key, unless sanitize is enabled
 * @param sanitize Accept public keys in other formats
 */
export const pubToAddress = function (pubKey, sanitize = false) {
  assertIsBuffer(pubKey);
  if (sanitize && pubKey.length !== 64) {
    pubKey = Buffer.from(publicKeyConvert(pubKey, false).slice(1));
  }
  assert(pubKey.length === 64);
  // Only take the lower 160bits of the hash
  return keccak256(pubKey).slice(-20);
};

export { pubToAddress, toChecksum, fromPrivate, pubToAddress };
