export const requestFailedStatus = 500;

export const requestFailedHorizonError = {
  type: "https://stellar.org/horizon-errors/server_error",
  title: "Internal Server Error",
  status: requestFailedStatus,
  detail: "Horizon could not complete the account lookup."
};
