import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleSignIn from "@/components/GoogleSignIn";
import GithubSignIn from "@/components/GithubSignIn";

const GetStarted = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
      <Card className="w-[500px] mx-4">
        <CardHeader>
          <CardTitle className={"text-center font-bold text-3xl"}>Get Started</CardTitle>
          <CardDescription className={"text-center font-semibold "}>
            Explore LLM without big pricetag.
          </CardDescription>
        </CardHeader>
        <CardContent className={"flex flex-col gap-2"}>
          <GoogleSignIn/>
          <GithubSignIn/>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetStarted;
