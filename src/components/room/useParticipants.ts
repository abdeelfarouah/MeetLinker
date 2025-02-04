import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

type User = {
  email: string;
  name: string;
};

type Participant = {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'no-response';
};

const generateConsistentAvatar = (seed: string) => {
  faker.seed(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  return faker.image.avatar();
};

export const useParticipants = (currentUser: User | null) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (currentUser) {
      const hostAvatarSeed = `host-${currentUser.email}`;
      
      const currentUserParticipant: Participant = {
        id: '0',
        name: `${currentUser.name} (Host)`,
        image: generateConsistentAvatar(hostAvatarSeed),
        status: 'online'
      };
      
      setParticipants([currentUserParticipant]);
    }
  }, [currentUser]);

  return { participants };
};