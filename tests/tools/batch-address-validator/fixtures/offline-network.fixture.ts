/** Stand-in for Horizon and RPC fixtures. This tool never records a request. */
export const offlineNetworkFixture = {
  horizonRequests: [] as const,
  rpcRequests: [] as const
};
