// Money-input helpers shared by the leads and family forms.
//
// formatMoneyInput — display value: group the integer part with thousands
// separators while preserving a decimal the user is mid-typing (e.g. "1000." /
// "1000.5"). It never forces a ".00", so whole numbers show clean ("5,000").
//
// stripMoney — strip separators and any non-numeric (keep digits + a dot) so the
// DB stores a clean number while the field shows grouped digits.

export const formatMoneyInput = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const [intPart, ...rest] = String(v).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length ? `${grouped}.${rest.join("")}` : grouped;
};

export const stripMoney = (v) => String(v ?? "").replace(/[^\d.]/g, "");
