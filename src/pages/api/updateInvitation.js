import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { invitationId } = req.body;
  const filePath = path.join(process.cwd(), "data", "invitations.json");

  try {
    // Leer y parsear el archivo de invitaciones
    const fileData = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf8")
      : null;
    const invitations = fileData ? JSON.parse(fileData).invitations : [];

    // Encontrar la invitación y actualizar su status a "allowed"
    const invitation = invitations.find(
      (inv) => inv.invitationId === invitationId
    );
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    invitation.status = "allowed";
    fs.writeFileSync(filePath, JSON.stringify({ invitations }, null, 2));

    return res.status(200).json({ message: "Invitation updated to allowed" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
