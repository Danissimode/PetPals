import { router } from 'expo-router';

export const navigateToUser = (id: string) => {
  router.push(`/user/${id}`);
};
