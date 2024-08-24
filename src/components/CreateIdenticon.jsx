export const generateColorFromHash = (hash, start) => {
  const r = parseInt(hash.substr(start, 2), 16);
  const g = parseInt(hash.substr(start + 2, 2), 16);
  const b = parseInt(hash.substr(start + 4, 2), 16);
  const a = 255; // opacidad completa
  return [r, g, b, a];
};

import React, { useState, useEffect, useRef, useContext } from "react";
import Identicon from "identicon.js";
import { create } from "ipfs-http-client";
import { useActiveAccount } from "thirdweb/react";
import { AppContext } from "@/contexts/AppContext";
import { client } from "@/config/thirdwebClient";
// //TODO
// const client = create({
//   host: "ipfs.openvino.org",
//   protocol: "https",
//   headers: {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
//   },
// });

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_API_KEY;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const CreateIdenticon = ({}) => {
  const activeAccount = useActiveAccount();

  const [image, setImage] = useState(null);

  const { setUri } = useContext(AppContext);

  function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  const onChangeFile = async (e) => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImage(reader.result);
  
        // Forzar una actualización de la imagen en el canvas
        setTimeout(async () => {
          if (canvasRef.current) {
            const dataURL = canvasRef.current.toDataURL();
  
            // Llamar a la función uploadToIpfs para subir la imagen al IPFS
            const url = await uploadToIpfs(dataURL);
            console.log("URL de IPFS:", url);
  
            const data = {
              name: "test",
              description: "test",
              image: url,
            };
  
            const fileUrl = await uploadFileToIpfs(data);
  
            // Asegurarse de que el URI se establece correctamente
            setUri(fileUrl);
            console.log("URI final:", fileUrl);
          }
        }, 100);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.log("Error al cambiar el archivo:", error);
    }
  };
  const uploadFileToIpfs = async (data) => {
    try {
      // Convertir el objeto JSON a una cadena
      const jsonString = JSON.stringify(data);
      const added = await ipfs.add(jsonString);
      const url = `https://trazabilidadideal.infura-ipfs.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.error("Error al subir el archivo a IPFS:", error);
      return undefined;
    }
  };
  
  const [hash, setHash] = useState(activeAccount?.address);
  const [foregroundColor, setForegroundColor] = useState(
    generateColorFromHash(hash, 0)
  );
  const [backgroundColor, setBackgroundColor] = useState(
    generateColorFromHash(hash, 6)
  );
  const canvasRef = useRef(null);

  const options = {
    foreground: foregroundColor,
    background: backgroundColor,
    margin: 0.2,
    size: 128,
    format: "svg",
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Dibujar el Identicon sobre la imagen
        const data = new Identicon(hash, options).toString();
        const identiconImg = new Image();
        identiconImg.src = `data:image/svg+xml;base64,${data}`;
        identiconImg.onload = () => {
          const size = Math.min(canvas.width, canvas.height) / 4; // Tamaño del Identicon
          ctx.drawImage(identiconImg, canvas.width - size - 10, 10, size, size);
        };
      };
    }
  }, [image, hash, options]);

  const uploadToIpfs = async (dataURL) => {
    try {
      // Convertir la dataURL en un Blob
      const blob = dataURLtoBlob(dataURL);

      // Subir el Blob a IPFS
      const added = await ipfs.add(blob);
      const url = `https://trazabilidadideal.infura-ipfs.io/ipfs/${added.path}`;
      console.log("URL:", url);
      return url;
    } catch (error) {
      console.error("Error subiendo a IPFS:", error);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input
        type="file"
        onChange={onChangeFile}
        accept="image/*;capture=camera"
      />
      <div>
        {image && (
          <>
            <img src={image} width={420} height={420} alt="Combined Image" />
          </>
        )}
      </div>
    </div>
  );
};

export default CreateIdenticon;
