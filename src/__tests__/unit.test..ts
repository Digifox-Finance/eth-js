import { createWallet, signTransaction } from "../index";

const assert = require("assert");

describe(".createWallet()", () => {
  it("should create an identity", () => {
    const ident = createWallet();
    assert.equal(typeof ident.privateKey, "string");
    assert.equal(typeof ident.publicKey, "string");
    assert.equal(typeof ident.address, "string");
  });
  it("2 identities should never be equal", () => {
    const ident = createWallet();
    const ident2 = createWallet();
    assert.notEqual(ident.privateKey, ident2.privateKey);
  });
});

describe(".signTransaction()", () => {
  describe("positive", () => {
    it("should sign our transaction", () => {
      const ident = createWallet();
      const rawTx = {
        from: ident.address,
        to: "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0",
        value: 1000000000000000000,
        gasPrice: 5000000000,
        gasLimit: 21000
      };
      const signed = signTransaction(rawTx, ident.privateKey);
      assert.equal(typeof signed, "string");
    });
  });
  describe("negative", () => {
    it("should throw on non-key", () => {
      const ident = createWallet();
      const rawTx = {
        from: ident.address,
        to: "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0",
        value: 1000000000000000000,
        gasPrice: 5000000000,
        gasLimit: 21000
      };
      const ident2 = createWallet();
      assert.throws(() => signTransaction(rawTx, ident2.privateKey));
    });
  });
});
