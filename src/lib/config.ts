const parsedEntryFee = Number(import.meta.env.VITE_ENTRY_FEE_INR);

export const ENTRY_FEE_INR = Number.isFinite(parsedEntryFee) && parsedEntryFee > 0 ? parsedEntryFee : 100;
export const UPI_ID = (import.meta.env.VITE_UPI_ID || "").trim();
export const UPI_PAYEE_NAME = (import.meta.env.VITE_UPI_PAYEE_NAME || "Hyper Arena").trim();
export const UTR_LENGTH = 12;
export const TEAM_ID_PREFIX_LENGTH = 8;
