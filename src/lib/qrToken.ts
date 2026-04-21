/**
 * Generates a deterministic 8-character uppercase alphanumeric QR token
 * for a team member.  Short enough to type manually, unique enough for a
 * tournament-scale event.
 *
 * Character set: A-Z + 0-9 (36 chars) → 36^8 ≈ 2.8 trillion combinations.
 */
const QR_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function buildQrToken(
  teamId: string,
  role: 'leader' | 'player' | 'substitute',
  rollNo: string
): string {
  const input = `${teamId}:${role}:${rollNo}`;

  // djb2 variant hash (32-bit unsigned)
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(h, 33) ^ input.charCodeAt(i)) >>> 0;
  }

  // Avalanche to spread bits
  h = (h ^ (h >>> 16)) >>> 0;
  h = (Math.imul(h, 0x45d9f3b)) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;

  // Encode as 8 base-36 digits
  let n = h;
  let result = '';
  for (let i = 0; i < 8; i++) {
    result = QR_CHARS[n % 36] + result;
    n = Math.floor(n / 36);
  }
  return result;
}
