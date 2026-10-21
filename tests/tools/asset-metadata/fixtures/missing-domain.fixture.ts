import { ISSUER_ACCOUNT_ID } from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";

export const HORIZON_ACCOUNT_WITHOUT_DOMAIN = {
  id: ISSUER_ACCOUNT_ID,
  account_id: ISSUER_ACCOUNT_ID,
  sequence: "1"
};

export const HORIZON_ACCOUNT_BLANK_DOMAIN = {
  id: ISSUER_ACCOUNT_ID,
  account_id: ISSUER_ACCOUNT_ID,
  home_domain: "   ",
  sequence: "1"
};
