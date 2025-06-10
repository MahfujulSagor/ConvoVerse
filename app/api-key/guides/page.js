import Image from "next/image";
import Link from "next/link";
import React from "react";
import Landing from "@/public/openrouterLanding.jpg";
import SignIn from "@/public/OpenRouterSignInPage.jpg";
import Api from "@/public/OpenRouterApi.jpg";
import ApiGen from "@/public/OpenRouterApiGen.jpg";
import ApiDone from "@/public/OpenRouterApiDone.jpg";

const Guides = () => {
  return (
    <div className="w-full min-h-screen max-w-[1200px] mx-auto border my-8 p-4 rounded-lg ">
      <p className="text-3xl">
        ✅ Step-by-Step to Get an API Key from OpenRouter:
      </p>

      <div className="Step-1 py-10 ">
        <h1 className="text-xl font-medium">1. Go to the OpenRouter Website</h1>
        <ul className="py-2 flex flex-col gap-4 px-8">
          <li>
            {" "}
            Visit:{" "}
            <Link href={"https://openrouter.ai"} target="_blank" className="text-blue-400">
              OpenRouter
            </Link>
          </li>
          <div className="inline-block mx-auto rounded-xl overflow-hidden border border-red-500/60">
            <Image src={Landing} width={1000} height={1000} alt="" />
          </div>
        </ul>
      </div>

      <div className="Step-2 py-10">
        <h1 className="text-xl font-medium">2. SignUp or Login</h1>
        <ul className="py-2 flex flex-col gap-4 list-disc px-8 ">
          <li>
            Click on <strong>Sign In</strong> at the top right.
          </li>
          <li>
            <h1 className="font-semibold">You can sign in using:</h1>
            <ul className="flex flex-col list-disc px-8">
              <li className="pl-4 mt-2">Google</li>
              <li className="pl-4 mt-2">GitHub</li>
              <li className="pl-4 mt-2">Email link (they&apos;ll email you a login link) </li>
            </ul>
          </li>

          <div className="inline-block rounded-xl mx-auto overflow-hidden border border-red-500/60">
            <Image src={SignIn} width={400} height={400} alt="" />
          </div>
        </ul>
      </div>

      <div className="Step-3 py-10">
        <h1 className="text-xl font-medium">3. Access API Key Settings</h1>
        <ul className="py-2 flex flex-col gap-4 list-disc px-8">
          <li>
            After signing in, click on your profile picture or avatar in the top
            right corner.
          </li>
          <li>Select &quot;API Keys&quot; from the dropdown menu.</li>
          <li>
            Or go directly to:{" "}
            <Link
              href={"https://openrouter.ai/settings/keys"}
              className="text-blue-400"
              target="_blank"
            >
              Api Keys
            </Link>
          </li>

          <div className="inline-block rounded-xl mx-auto overflow-hidden border border-red-500/60">
            <Image src={Api} width={1000} height={1000} alt="" />
          </div>
        </ul>
      </div>

      <div className="Step-4 py-10">
        <h1 className="text-xl font-medium py-2 ">4. Generate an API Key</h1>
        <ul className="w-full flex flex-col gap-4 list-disc px-8 ">
          <li>Click the &quot;Create API Key&quot; button.</li>
          <li>Optionally, name your key (e.g., “My App”).</li>

          <div className="rounded-xl mx-auto overflow-hidden inline-block border border-red-500/60">
            <Image src={ApiGen} width={400} height={400} alt="" />
          </div>

          <li>Copy the generated API key. <b className="text-rose-400">It will be shown only once</b></li>
          <div className="mx-auto rounded-xl overflow-hidden inline-block border border-red-500/60">
            <Image src={ApiDone} width={400} height={400} alt="" />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Guides;
