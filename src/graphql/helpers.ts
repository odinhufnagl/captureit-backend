export const objectToGraphql = (
  input: Record<string, unknown> | Array<Record<string, unknown>>
): string => {
  const inputJSON = JSON.stringify(input);
  const graphQLInput = inputJSON.replace(/"([^(")"]+)":/g, "$1:");
  return graphQLInput;
};
