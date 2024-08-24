export const generateColorFromHash = (hash, start) => {
  const r = parseInt(hash.substr(start, 2), 16);
  const g = parseInt(hash.substr(start + 2, 2), 16);
  const b = parseInt(hash.substr(start + 4, 2), 16);
  const a = 255; // opacidad completa
  return [r, g, b, a];
};

import React, { useState, useEffect, useRef } from "react";
import Identicon from "identicon.js";
import { create } from "ipfs-http-client";
import { generateHash } from "../utils";
// //TODO
// const client = create({
//   host: "ipfs.openvino.org",
//   protocol: "https",
//   headers: {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
//   },
// });

const projectId = process.env.NEXT_PROJECT_ID;
const projectSecret = process.env.NEXT_API_KEY;
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

  const [image, setImage] = useState(null);

  const onChangeFile = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const [hash, setHash] = useState(
    "3453e22133e1b6d3e14fcbb5348dff0842edd3676d503e79f4d8f2d900d2cd16"
  );
  const [foregroundColor, setForegroundColor] = useState(
    generateColorFromHash(hash, 0)
  );
  const [backgroundColor, setBackgroundColor] = useState(
    generateColorFromHash(hash, 6)
  );


  const canvasRef = useRef(null);

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    const newHash = await generateHash(inputValue);
    setHash(newHash);

    setForegroundColor(generateColorFromHash(newHash, 0));
    setBackgroundColor(generateColorFromHash(newHash, 6));
  };

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

      // Cargar la imagen en el canvas
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
          ctx.drawImage(
            identiconImg,
            canvas.width - size - 10, 
            10,                      
            size,                    
            size                    
          );
          
        };
      };
    }
  }, [image, hash, options]);

  const uploadToIpfs = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        try {
          const added = await ipfs.add(blob);
          const url = `https://trazabilidadideal.infura-ipfs.io/ipfs/${added.path}`;
          console.log("Imagen subida a IPFS:", url);
        } catch (error) {
          console.error("Error subiendo a IPFS:", error);
        }
      }, "image/png");
    }
  };

  const data = new Identicon(hash, options).toString();
  const identiconUrl = `data:image/svg+xml;base64,${data}`;

  return (
    <div>
      {/* <p>{hash}</p> */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {/* <input
        type="text"
        onChange={handleInputChange}
        placeholder="Enter a text"
      /> */}
      <input type="file" onChange={onChangeFile} />

      <div>
        {image && (
          <>
            <p>Vista Previa:</p>
            <img
              src={canvasRef.current?.toDataURL()}
              width={420}
              height={420}
              alt="Combined Image"
            />
      
          </>
        )}
      </div>
    </div>
  );
};

export default CreateIdenticon;
