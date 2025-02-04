import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker/locale/fr';
import type { Participant } from '@/types/chat';

type User = {
  email: string;
  name: string;
} | null;

export const useParticipants = (currentUser: User) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (currentUser) {
      const currentParticipant: Participant = {
        id: faker.string.uuid(),
        name: currentUser.name,
        image: faker.image.avatar(),
        status: 'online'
      };

      setParticipants([currentParticipant]);
    }
  }, [currentUser]);

  return { participants };
};