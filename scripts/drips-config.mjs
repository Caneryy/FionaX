/**
 * Active Drips publication target for this repository.
 *
 * For a repository approved for the Stellar Wave Program, Drips observes the
 * required GitHub label and adds the issue to the Program. GitHub-label
 * additions receive default Trivial complexity until edited in Drips.
 */
export const dripsConfig = Object.freeze({
  programId: "fdc01c95-806f-4b6a-998b-a6ed37e0d81b",
  programSlug: "stellar",
  programName: "Stellar Wave",
  repositoryId: "1279520245",
  repository: "LorenoXYZ/FionaX",
  requiredLabels: ["Stellar Wave"],
  /** The 2026 season contains twenty independent issues. */
  batchSize: 20
});
