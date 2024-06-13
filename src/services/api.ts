import axios from "axios";

export const api = axios.create({
  // Production
  //   baseURL: "http://",
  // Development
  baseURL: "http://localhost:3333",
});

type SuspiciousMessage = {
  message: string;
  phoneNumber?: string | null;
};

export async function catchSuspiciousMessage({
  message,
  phoneNumber = null,
}: SuspiciousMessage) {
  try {
    const { data } = await api.post("/suspicious_messages/catch", {
      message,
      phone_number: phoneNumber,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

type CreateSuspiciousMessage = SuspiciousMessage & {
  name?: string | null;
  photoUrl?: string | null;
};

export async function createSuspiciousMessage({
  message,
  name = null,
  photoUrl = null,
  phoneNumber = null,
}: CreateSuspiciousMessage) {
  try {
    const { data } = await api.post("/suspicious_messages", {
      message,
      name,
      phone_number: phoneNumber,
      photo_url: photoUrl,
    });

    return data;
  } catch (error) {
    throw error;
  }
}
