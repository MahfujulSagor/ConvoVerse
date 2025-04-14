import React, { useState } from "react";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import { Coins } from "lucide-react";
import { useAppwrite } from "@/context/appwrite-context";

const Balance = () => {
  const { session, refreshSession } = useAppwrite();
  const [loading, setLoading] = useState(false);

  const handleBalanceClick = async () => {
    setLoading(true);
    try {
      await refreshSession();
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleBalanceClick}
        className="border border-dashed rounded-4xl mr-8 cursor-pointer"
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <BeatLoader color="oklch(0.985 0 0)" />
          </div>
        ) : (
          <div className="flex justify-between items-center gap-2 md:text-base text-sm">
            <div className="font-medium">
              <Coins color="#cdcdcd" />
            </div>
            <div className="font-medium text-teal-400">
              {session ? session.credits : 0.0}
            </div>
          </div>
        )}
      </Button>
    </>
  );
};

export default Balance;
