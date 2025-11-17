import crypto from "crypto";

type SignatureParts = {
  timestamp: string | null;
  signatures: string[];
};

function parseSignatureHeader(header: string | null): SignatureParts {
  if (!header) {
    return { timestamp: null, signatures: [] };
  }

  const entries = header.split(",");
  const result: SignatureParts = { timestamp: null, signatures: [] };

  for (const entry of entries) {
    const [key, value] = entry.split("=");
    if (key === "t") {
      result.timestamp = value;
    }
    if (key?.startsWith("v") && value) {
      result.signatures.push(value);
    }
  }

  return result;
}

function timingSafeEqual(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

export function verifyStripeSignature(payload: string, signatureHeader: string | null, secret: string): boolean {
  const { timestamp, signatures } = parseSignatureHeader(signatureHeader);

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const toleranceSeconds = 5 * 60;
  const now = Math.floor(Date.now() / 1000);
  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber) || Math.abs(now - timestampNumber) > toleranceSeconds) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return signatures.some((signature) => timingSafeEqual(expectedSignature, signature));
}
