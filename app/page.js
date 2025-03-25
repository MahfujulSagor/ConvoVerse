import Landing from "@/components/landing/landing";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto" >
      <Nav/>
      <Landing/>
    </div>
  );
}
