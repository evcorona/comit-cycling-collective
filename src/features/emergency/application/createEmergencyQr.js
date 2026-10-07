import { formatEmergencyData } from "../domain/formatEmergencyData";
export async function createEmergencyQr(data, encodeImage) {
  const text = formatEmergencyData(data);
  const image = await encodeImage(text);
  return { image, text, data: { ...data } };
}
