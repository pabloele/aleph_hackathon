import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { invitationId, walletID, status } = req.body;
    const filePath = path.join(process.cwd(), "data", "invitations.json");

    let invitations = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, "utf8");
        invitations = JSON.parse(fileData).invitations;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        invitations = [];
      }
    }

    // Crear una nueva invitación
    const newInvitation = { invitationId, walletID, status };

    // Agregar la nueva invitación al array
    invitations.push(newInvitation);

    // Escribir el archivo con la nueva lista de invitaciones
    fs.writeFileSync(filePath, JSON.stringify({ invitations }, null, 2));

    res.status(200).json({ message: "Invitation saved successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
