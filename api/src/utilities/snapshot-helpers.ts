type ids = {
  id: string;
};

/**
 *
 * @param storedVersion this is id array as its currently stored in the database
 * @param incomingVersion this is id array as the incoming request has it
 * @returns returns the set of ids that need to be removed from the database since they exist in the storedVersion but are missing in the incomingVersion
 */
export const toRemoveHelper = (
  storedVersion: ids[],
  incomingVersion: ids[],
): ids[] => {
  return storedVersion?.reduce((acc, curr) => {
    if (!incomingVersion?.some((elem) => elem.id === curr.id)) {
      acc.push({ id: curr.id });
    }
    return acc;
  }, []);
};

/**
 *
 * @param storedVersion this is id array as its currently stored in the database
 * @param incomingVersion this is id array as the incoming request has it
 * @returns returns the set of ids that need to be add to the database since they exist in the incomingVersion but are missing in the storedVersion
 */
export const toAddHelper = (
  storedVersion: ids[],
  incomingVersion: ids[],
): ids[] => {
  return incomingVersion?.reduce((acc, curr) => {
    if (!storedVersion?.some((elem) => elem.id === curr.id)) {
      acc.push({ id: curr.id });
    }
    return acc;
  }, []);
};
