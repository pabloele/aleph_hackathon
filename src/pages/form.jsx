import React from "react";
import NewExperience from "@/components/NewExperience";
import Image from "next/image";
const FormPage = () => {
  return (
    <div
      className="d-flex flex-col "
      style={{
        height: "100%",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "url('/bg-mars.webp')",
      }}
    >
      
        <Image style={{
          top: "0px",
          left: "-120px",
          position: "absolute",
          transform:"rotate(130deg)"
        }} src="/alien1.png" alt="bg-mars" width={300} height={300} />


<Image style={{
          bottom: "-30px",
          right: "-100px",
          position: "absolute",
          overflowX:"hidden",
          transform:"rotate(-40deg)"

        }} src="/alien2.png" alt="bg-mars" width={300} height={300} />
      <NewExperience />
    </div>
  );
};

export default FormPage;
