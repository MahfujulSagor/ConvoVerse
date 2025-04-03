export const getUser = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  try {
    const response = await fetch("/api/auth/validate-jwt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Invalid token");

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error validating JWT:", error);
    localStorage.removeItem("auth_token");
    return null;
  }
};
