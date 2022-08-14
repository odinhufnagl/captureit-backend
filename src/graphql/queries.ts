import { objectToGraphql } from "./helpers";

export const usersQuery = (
  where: Record<string, unknown> | undefined
): string => {
  const whereInput = objectToGraphql(where || {});
  return `
  query {
    users(where: ${whereInput}) {
        notificationToken,
        id,
    
    }
  }
`;
};
