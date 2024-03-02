# Learner Credential Wallet Mock _(@digitalcredentials/lcw-mock)_

[![Build status](https://img.shields.io/github/actions/workflow/status/digitalcredentials/lcw-mock/main.yml?branch=main)](https://github.com/digitalcredentials/lcw-mock/actions?query=workflow%3A%22Node.js+CI%22)
[![NPM Version](https://img.shields.io/npm/v/@digitalcredentials/lcw-mock.svg)](https://npm.im/@digitalcredentials/lcw-mock)

> A Typescript/Javascript library that plays the part normally played by the [Learner Credential Wallet (LCW)](https://lcw.app) in the exchange between a wallet and an issuer like [DCC Exchange Coordinator](https://github.com/digitalcredentials/workflow-coordinator).

> Given a deeplink that normally opens the LCW, the lcw-mock will parse the link, construct a DIDAuth containing the value of the 'challenge' parameter from the deeplink along with the holder's DID, sign the DIDAuth, and POST it to the value of the `vc_request_url` from the deeplink.
> 
> For use in the browser, Node.js, and React Native.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Background

Makes it easier to test credential issuance - specifically the DIDAuth exchange between the LCW and the issuer - without having to use the LCW on a real phone or an emulator.

## Security

TBD

## Install

- Node.js 18+ is recommended.

### NPM

To install via NPM:

```
npm install @digitalcredentials/lcw-mock
```

### Development

To install locally (for development):

```
git clone https://github.com/digitalcredentials/lcw-mock.git
cd lcw-mock
npm install
```

## Usage

There are two methods available:


#### mockLCW(deeplink, did)

The `did` is optional. If not supplied a fake did (did:key:z6MkqJAUa299LgRoKiaHtFG6KWVK1iUddAM5oUHsGRto9hfz) will be used.

1. Parses the deeplink, which should look similar to:

``` https://lcw.app/request.html?issuer=issuer.example.com&auth_type=bearer&challenge=f78e1e08-a2df-46ca-bb0b-6b08e3036815&vc_request_url=http://issuer.dcconsortium.org/exchange/68546cc1-9220-42c1-b0a5-78d429ed289b/f78e1e08-a2df-46ca-bb0b-6b08e3036815```

2. Using the value of the `challenge` query parameter from the deeplink, and the supplied did (or a fake if not supplied) constructs a signed DIDAuth like so:

```
{
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "type": [
      "VerifiablePresentation"
    ],
    "holder": "did:key:z6MkqJAUa299LgRoKiaHtFG6KWVK1iUddAM5oUHsGRto9hfz",
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-02-23T21:27:59Z",
      "verificationMethod": "did:key:z6MkqJAUa299LgRoKiaHtFG6KWVK1iUddAM5oUHsGRto9hfz#z6MkqJAUa299LgRoKiaHtFG6KWVK1iUddAM5oUHsGRto9hfz",
      "proofPurpose": "authentication",
      "challenge": "f78e1e08-a2df-46ca-bb0b-6b08e3036815",
      "proofValue": "z5J8qBwNT3dC7kuqAkXFEDWgx1NeCcd2Rcn5dyNbhWsZdJQVsUgGDfd8ZdUo2S3maEucuJ2vqgCDJRB6fqSxhd6jM"
    }
  }
```

3. Posts the signed DIDAuth to the value of the `vc_request_url` query parameter from the deeplink.

#### getDIDAuth(deeplink, did)

The `did` is optional. If not supplied a fake did will be used.

Same as `mockLCW` except it doesn't post the DIDAuth the vc_request_url, and instead simply returns it.

This DIDAuth can then be separately posted to the issuer exchange endpoint (from the value of the vc_request_url query parameter).

## Contribute

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT License](LICENSE.md) © 2023 Digital Credentials Consortium.
