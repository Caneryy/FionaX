export const accountNotFoundStatus = 404;

export const accountNotFoundHorizonError = {
  type: "https://stellar.org/horizon-errors/not_found",
  title: "Resource Missing",
  status: accountNotFoundStatus,
  detail: "The resource at the url requested was not found. This usually occurs due to a bad or stale link."
};
