import { keccak256 } from "./helpers/hash";
import { concat, random } from "./helpers/bytes";
import { fromPrivate } from "./helpers/account";
import { addLeading0x, privateToPublic } from "./utils";
import { toBuffer } from "./helpers/buffer";

/**
 * create a privateKey from the given entropy or a new one
 * @param  {Buffer} entropy
 * @return {string}
 */
export function createPrivateKey() {
  // @link https://github.com/MaiaVictor/eth-lib/blob/master/lib/account.js#L8
  const innerHex = keccak256(concat(random(32), random(32)));
  const middleHex = concat(concat(random(32), innerHex), random(32));
  const outerHex = keccak256(middleHex);
  return outerHex;
}

/**
 * creates a new object with
 * private-, public-Key and address
 * @param {Buffer?} entropy if provided, will use that as single random-source
 */
export default function createIdentity() {
  const privateKey = createPrivateKey();

  let identity: any = fromPrivate(privateKey);
  identity.publicKey = publicKeyOfPrivateKey(identity.privateKey);
  return identity;
}

/**
 * Generate publicKey from the privateKey.
 * This creates the uncompressed publicKey,
 * where 04 has stripped from left
 * @returns {string}
 */
function publicKeyOfPrivateKey(privateKey: string) {
  privateKey = addLeading0x(privateKey);
  const publicKeyBuffer = privateToPublic(toBuffer(privateKey));
  return publicKeyBuffer.toString("hex");
}
