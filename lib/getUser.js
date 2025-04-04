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

    return user;
  } catch (error) {
    console.error("Error validating user:", error);
    return null;
  }
};
