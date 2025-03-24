import React from "react";
import { Button } from "../ui/button";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center font-bold text-5xl">The only AI tool you need.</h1>
        <p className="text-center">
          Use top class AI models without the large pricetag.
        </p>
      </div>

      <div>
        <Button className="h-10 w-30 ">Get Started</Button>
      </div>
    </div>
  );
};

export default Landing;
