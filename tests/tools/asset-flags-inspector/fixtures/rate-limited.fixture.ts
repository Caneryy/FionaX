export const rateLimitedStatus = 429;

export const rateLimitedHorizonError = {
  type: "https://stellar.org/horizon-errors/rate_limit_exceeded",
  title: "Rate limit exceeded",
  status: rateLimitedStatus,
  detail: "The rate limit for the requesting IP address is over its alloted limit."
};
