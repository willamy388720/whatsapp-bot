import axios from "axios";

export const api = axios.create({
  // Production
  //   baseURL: "http://",
  // Development
  baseURL: "http://localhost:3333",
});

type SuspiciousMessage = {
  message: string;
  name?: string | null;
  photoUrl?: string | null;
  phoneNumber?: string | null;
};
export async function catchSuspiciousMessage({
  message,
  name = null,
  photoUrl = null,
  phoneNumber = null,
}: SuspiciousMessage) {
  try {
    const { data } = await api.post("/suspicious_messages/catch", {
      message,
      name,
      photo_url: photoUrl,
      phone_number: phoneNumber,
    });

    return data;
  } catch (error) {
    throw error;
  }
}
