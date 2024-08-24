import React from "react";
import NewExperience from "@/components/NewExperience";

const FormPage = () => {
  return (
    <div
      className="d-flex flex-col "
      style={{
        height: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "url('/bg-mars.webp')",
      }}
    >
      <NewExperience />
    </div>
  );
};

export default FormPage;
