import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { mockLCW, getDIDAuth } from '../src'

const mock = new MockAdapter(axios)

const challenge = 'f78e1e08-a2df-46ca-bb0b-6b08e3036815'
const vcRequestURL = 'https://issuer.dcconsortium.org/exchange/68546cc1-9220-42c1-b0a5-78d429ed289b/f78e1e08-a2df-46ca-bb0b-6b08e3036815'
const deeplink = `https://lcw.app/request.html?issuer=issuer.example.com&auth_type=bearer&challenge=${challenge}&vc_request_url=${vcRequestURL}`

describe('LCWMock', () => {
  describe('getDIDAuth', () => {
    it('generates didAuth', async () => {
      const didAuth = await getDIDAuth(challenge)
      expect(didAuth.proof.proofValue.length).to.be.greaterThan(3)
      expect(didAuth.proof.challenge).to.equal(challenge)
      expect(didAuth.type).to.eql(['VerifiablePresentation'])
    })
  })

  describe('mockLCW', () => {
    it.only('calls the deeplink with a DIDAuth', async () => {
      mock
        .onPost(vcRequestURL, {
          asymmetricMatch: function (didAuth: any) {
            return didAuth.proof.challenge === challenge &&
              didAuth.proof.proofValue != null
          }
        })
        .reply(200, { name: 'thisWouldBeTheReturnedVC' })
      const response = await mockLCW(deeplink)
      expect(response.name).to.equal('thisWouldBeTheReturnedVC')
    })
  })
})
