import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // res.status(200).json({ status: "ok", message: "Sensor Api UP"
  // if (req.method !== "GET") {
  //   res.setHeader("Allow", ["GET"]);
  //   return res.status(405).end(`Method ${req.method} Not Allowed`);
  // }

  const { invitationId } = req.query;
  console.log(invitationId);

  // Se obtiene el invitationId de los parámetros de la ruta
  const filePath = path.join(process.cwd(), "data", "invitations.json");

  try {
    // Leer y parsear el archivo de invitaciones
    const fileData = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf8")
      : null;
    const invitations = fileData ? JSON.parse(fileData).invitations : [];

    // Encontrar la invitación por su invitationId
    const invitation = invitations.find(
      (inv) => inv.invitationId === invitationId
    );
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Devolver el walletID asociado
    return res.status(200).json({ walletID: invitation.walletID });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
