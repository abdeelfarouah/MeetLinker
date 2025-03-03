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

// Generate a consistent avatar URL for a given seed
const generateConsistentAvatar = (seed: string) => {
  faker.seed(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  return faker.image.avatar();
};

const generateFakeParticipants = (count: number): Participant[] => {
  return Array.from({ length: count }, (_, index) => {
    const id = faker.string.uuid();
    const avatarSeed = `participant-${index}-${id}`;
    
    return {
      id,
      name: faker.person.fullName(),
      image: generateConsistentAvatar(avatarSeed),
      status: faker.helpers.arrayElement(['online', 'offline', 'no-response'] as const)
    };
  });
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
      
      const fakeParticipants = generateFakeParticipants(5);
      setParticipants([currentUserParticipant, ...fakeParticipants]);

      // Update other participants' status less frequently
      const statusInterval = setInterval(() => {
        setParticipants(prevParticipants => 
          prevParticipants.map(participant => {
            if (participant.id === '0') return participant;
            // Reduce frequency of status changes
            if (Math.random() < 0.2) {
              const statuses: ('online' | 'offline' | 'no-response')[] = ['online', 'offline', 'no-response'];
              const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
              return { ...participant, status: newStatus };
            }
            return participant;
          })
        );
      }, 10000);

      return () => {
        console.log('Cleaning up participant status interval');
        clearInterval(statusInterval);
      };
    }
  }, [currentUser]);

  return { participants };
};