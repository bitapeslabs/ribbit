Rationale of Storage of Seed Phrase in Memory:
The wallet seed has to be stored directly in memory somehow so it can be used
to generate BIP32 keys. This persistance is a risk because if the memory region
is somehow exposed, the seed is stored in memory as a raw string. To mitigate
we store the encrypted seed and decrypt with a password.

This leads to another issue though: now we are also storing the user's
password in memory which is also a big security no-no. To mitigate this, we could
hash the password (what we actually store in memoery) and keep the seed phrase
encrypted with the hash of this password. This would also not be full proof
because the password hash (the decryption key) is still stored in memory anyhow.

The solution:
Every time the user logs in we decrypt the seed with the raw password and
create a "SESSION_PASSWORD" which is used to create a session encryption of
the key. This session password (completely random) is stored in memor along
with the seed.

The password itself is never stored in memory, and SESSION_PASSWORD
is only a window of access to the seed during the session. The seed is yes still
accessible in memory but the path to access it is much more convoluted then
just having the raw seed in memory.

What is Lilypad?
"Lilypad" is like metamask's keyring - it is in charge of managing account addresses,
their names, their PROTOCOLS and their keys.

This redux slice that manages the state of everything that is needed for lilypad, specifically

- The seed phrase -> passed unencrypted and encrypted here
- The session password -> created here on encryption and stored on the state. This means that when the wallet
  is locked, the session password is destroyed and the seed is no longer accessible without decrypting it
  again with the raw password.
- The protocol salt -> passed to seedFromMnemonic to generate the seed, with the password being set to ""+protocolSalt. When
  a new protocol salt is passed, a BIP32 seed is generated (by decrypting seed with session password) and then encrypted
  with the sessionPassword and stored in the state - which can later be accessed through lilypad.

Functions:
setSeedphrase(seedphrase: string[])
setProtocol(protocolHash: string)
setAddressType (addressType: addressType) -> doesnt propagate any changes on slice, is used for UI
createAccount (name: string, addressType: addressType) -> creates an account with the given name and address type
updateAccountName: (id: string)

states exposed ->
encryptedBIP39Phrase: string
sessionPassword: string
encryptedBIP32Seed: string
protocolSalt: string
addressType: addressType
accounts: Account[]

when protocolSalt is updated, accounts (if any) would be loaded from the browser store. An Account[] should look like this:

addressType = "PWSH" | "P2PKH" | "P2WPKH" | "P2WPKH-P2SH" | "P2WSH" | "P2WSH-P2SH" | "P2TR" blah blah blah
{
id: hash(P2PK) -> p2pk was the first address type on Bitcoin, so using the hash of this as the id seems appropriate
name: string
addresses: {
[type: string]: addressType
}
encryptedPrivKey: string -> encrypted with sessionPassword
}

BITCOIN DEFAULT PROTOCOL SALT IS: "" so that its compatible with other wallets (protocolSalt is a ribbit specific thing)
