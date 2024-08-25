import fs from "fs";
import path from "path";

export default function handler(req, res) {
  console.log("API: checkAddressStatus");

  if (req.method === "POST") {
    const { walletID } = req.body;
    console.log(walletID);

    const filePath = path.join(process.cwd(), "data", "invitations.json");

    let invitations = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, "utf8");
        invitations = fileData ? JSON.parse(fileData).invitations : [];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return res
          .status(500)
          .json({ error: "Error parsing invitations data" });
      }
    }

    console.log(invitations);

    const isAllowed = invitations.some(
      (inv) => inv.walletID === walletID && inv.status === "allowed"
    );

    if (isAllowed) {
      return res.status(200).json({ allowed: true });
    } else {
      return res.status(200).json({ allowed: false });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
