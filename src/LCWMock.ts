import axios from 'axios'
import { signPresentation, createPresentation } from '@digitalcredentials/vc'
import { Ed25519VerificationKey2020 } from '@digitalcredentials/ed25519-verification-key-2020'
import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020'
import { securityLoader } from '@digitalcredentials/security-document-loader'

const holderDID = 'did:key:z6MkvL5yVCgPhYvQwSoSRQou6k6ZGfD5mNM57HKxufEXwfnP'

const documentLoader = securityLoader().build()
let suite: any = null

const getSuite = async (): Promise<any> => {
  if (suite === null) {
    const key = await Ed25519VerificationKey2020.generate(
      {
        seed: new Uint8Array([
          217, 87, 166, 30, 75, 106, 132, 55,
          32, 120, 171, 23, 116, 73, 254, 74,
          230, 16, 127, 91, 2, 252, 224, 96,
          184, 172, 245, 157, 58, 217, 91, 240
        ]),
        controller: holderDID
      }
    )
    suite = new Ed25519Signature2020({ key })
  }
  return suite
}

export const getDIDAuth = async (challenge: string): Promise<any> => {
  const presentation = createPresentation({ holderDID })
  const suite = await getSuite()
  const didAuth = await signPresentation({ presentation, suite, challenge, documentLoader })
  return didAuth
}

export const mockLCW = async (deepLink: string): Promise<any> => {
  const parsedDeepLink = new URL(deepLink)
  const vcRequestUrl = parsedDeepLink.searchParams.get('vc_request_url') as string // should be http://localhost:4004/exchange?challenge=VOclS8ZiMs&auth_type=bearer
  const challenge = parsedDeepLink.searchParams.get('challenge') as string // the challenge that the exchange service generated
  const didAuth = await getDIDAuth(challenge)
  const response = await axios.post(vcRequestUrl, didAuth)
  return response.data
}
