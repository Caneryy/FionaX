export const fixtureAccountId = "GDVEU3DD4KOFECV66VIHWEZOYX4ZKR3WV27L464SIIPOU2IUI3JCZA57";

export const textEntryName = "config";
export const textEntryValue = "hello";
export const textEntryBase64 = "aGVsbG8=";
export const nearLimitName = "n".repeat(60);

export const textEntriesHorizonAccount = {
  account_id: fixtureAccountId,
  data: {
    [textEntryName]: textEntryBase64,
    [nearLimitName]: textEntryBase64
  }
};
