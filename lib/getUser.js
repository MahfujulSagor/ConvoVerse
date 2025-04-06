import { account } from "./appwrite";

export const getUser = async () => {
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
