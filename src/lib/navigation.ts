import { useRouter } from 'expo-router';

export const navigateToUser = (userId: string) => {
  const router = useRouter();
  router.push(`/user/${userId}`);
};

export const navigateToAnimal = (animalId: string) => {
  const router = useRouter();
  router.push(`/animal/${animalId}`);
};
