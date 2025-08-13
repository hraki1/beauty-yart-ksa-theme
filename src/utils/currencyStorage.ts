// utils/currencyStorage.ts
export function saveUserCurrency(currency: string) {
  localStorage.setItem("currency", currency);
}

export function getSavedUserCurrency(): string | null {
  return localStorage.getItem("currency");
}
