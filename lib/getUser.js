import { account } from "./appwrite";

export const getUser = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  try {
    const user = await account.get();
    if (!user) {
      console.error("User Not Found");
      return null;
    }

    // const response = await fetch("/api/auth/validate-token", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${token}`,
    //   },
    // });

    // if (!response.ok) throw new Error("Invalid token");

    // const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error validating JWT:", error);
    // localStorage.removeItem("auth_token");
    return null;
  }
};
