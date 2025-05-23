"server only"

import { PinataSDK } from "pinata"


// export const api = createAutoDriveApi({
//   apiKey: `${process.env.AUTONOMYS_API_KEY}`,
//   network: "taurus"
// })
 

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})
export const secrets = {
    jwt:`${process.env.PINATA_JWT}`,
    gateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
  }
