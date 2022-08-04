
const rowToJson = (row) => {
  return JSON.parse(row);
};

const checkPermission = (groups, desired) => {
  for (let i = 0; i < desired.length; i++) {
    if (groups.includes('admin') || groups.includes(desired[i])) {
      return true;
    }
  }
  return false;
};

export { rowToJson, checkPermission, };