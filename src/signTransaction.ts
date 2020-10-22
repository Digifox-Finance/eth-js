import { Transaction } from "ethereumjs-tx";

import {
  toAddress as addressByPublicKey,
  publicKeyOfPrivateKey
} from "./publicKey";

export default function signTransaction(rawTx: any, privateKey: string) {
  // check if privateKey->address matches rawTx.from
  const publicKey = publicKeyOfPrivateKey(privateKey);
  const address = addressByPublicKey(publicKey);
  if (address != rawTx.from)
    throw new Error(
      "EthCrypto.signTransaction(): rawTx.from does not match the address of the privateKey"
    );

  const privateKeyBuffer = Buffer.from(privateKey.replace(/^.{2}/g, ""), "hex");

  const tx = new Transaction(rawTx);
  tx.sign(privateKeyBuffer);
  const serializedTx = tx.serialize().toString("hex");
  return serializedTx;
}
