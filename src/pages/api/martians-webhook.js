const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_EXT_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { eventType, eventData } = req.body;

    if (eventType === "presentation-request") {
      const response = await fetch(
        `${baseUrl}/credentialsbbs/waci/oob/presentation-proceed?apiKey=${apiKey}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invitationId: eventData.invitationId,
            verifiableCredentials: [eventData.credentialsToPresent[0].data],
          }),
        }
      );
      const data = await response.json();
      console.log("Response from API:", data);
    }

    console.log(
      "EVENTO ENVIADO A LA API: ",
      eventType,
      JSON.stringify(eventData)
    );

    if (!eventData.verified) {
      console.log("Not Verified :(");
      return;
    } else {
      martianOnboard(eventData);

      res.status(200).json("Flujo completado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

const martianOnboard = async (eventData) => {
  console.log(
    "****************************************************************"
  );
  console.log("verifierDID=", eventData.verifierDID);
  console.log("Verifier1 MARTIANS!!", process.env.NEXT_PUBLIC_VERIFIER1);

  console.log("VERIFIED: ", eventData.verified);
  console.log("invitationId: ", eventData.invitationId);

  try {
    if (eventData.verifierDID === process.env.NEXT_PUBLIC_VERIFIER1) {
      console.log("BODY", {
        invitationId: eventData.invitationId,
        verified: eventData.verified,
        rawData: eventData,
      });

      // const response = await fetch(endpoint, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     invitationId: eventData.invitationId,
      //     verified: eventData.verified,
      //     rawData: eventData,
      //   }),
      // });
      // const data = await response.json();
      // console.log(data);
      return;
    }

    console.log("Onboarding the martian...");
    // const onboardingResponse = await fetch(endpoint, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ state: "open" }),
    // });
    // const data = await onboardingResponse.json();
    console.log("Martian onboarded!");
    // console.log("Response: ", data);
  } catch (error) {
    console.log("Error onboarding martian: ", error);
  }
};
