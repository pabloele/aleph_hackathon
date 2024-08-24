const { default: axios } = require("axios");

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const websocket = process.env.NEXT_PUBLIC_HACKATHON_WEBSOCKET;
const webhookURL = process.env.NEXT_PUBLIC_HACKATHON_WEBHOOK;
const apiKey = process.env.NEXT_PUBLIC_EXT_API_KEY;
const didMethod = "did:quarkid";

console.log(baseUrl);
console.log(websocket);
console.log(webhookURL);
console.log(apiKey);

async function getIssuanceQR(params) {
  const result = await axios.put(
    `${baseUrl}/credentialsbbs/wacioob?apiKey=${apiKey}`,
    params
  );
  return result.data;
}

async function getPresentationQR(params) {
  console.log(params);
  console.log(
    `${baseUrl}/credentialsbbs/waci/oob/presentation?apiKey=${apiKey}`
  );

  const result = await axios.put(
    process.env.NEXT_PUBLIC_CREATE_PRESENTATION_ENDPOINT,
    params
  );
  console.log(result.data);

  return result.data;
}

async function interpretWACIFlow(params) {
  const uri = `${baseUrl}/credentialsbbs/waci?apiKey=${apiKey}`;
  console.log(uri);
  const result = await axios.put(uri, params);
  return result.data;
}

async function createDID() {
  const result = await axios.put(`${baseUrl}/dids/quarkid/?apikey=${apiKey}`, {
    websocket,
    webhookURL,
    didMethod,
  });

  return { did: result.data.did };
}

module.exports = {
  getIssuanceQR,
  getPresentationQR,
  interpretWACIFlow,
  createDID,
};
