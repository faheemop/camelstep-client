import { API_ROOT } from "../config";
import { getCookie, setCookie } from "./cookieHelpers";

export const initializeGuestSession = async () => {
  const existing = getCookie("guest_session_token");
  if (existing) return existing;

  try {
    const res = await fetch(`${API_ROOT}/backend/api/v1/guest/session`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Network error during guest session creation");

    const data = await res.json();
    // console.log("Guest Session API Response:", data);

    const token = data?.guest_session_token; // ✅ FIXED HERE

    if (!token) {
      throw new Error("Guest session creation failed - missing token");
    }

    // Optional: use expiration if available
    setCookie("guest_session_token", token, {
      expiryIn: data.guest_session_token_expire_in || 3600,
    });

    return token;
  } catch (error) {
    console.error("Failed to init guest session:", error);
    throw error;
  }
};
