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
  isHost?: boolean;
};

// Generate a consistent avatar URL for a given seed
const generateConsistentAvatar = (seed: string) => {
  const style = 'avataaars';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

export const useParticipants = (currentUser: User | null) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Generate 5 fake participants plus the current user
    const fakeParticipants: Participant[] = Array.from({ length: 5 }, () => {
      const id = faker.string.uuid();
      return {
        id,
        name: faker.person.fullName(),
        image: generateConsistentAvatar(id),
        status: faker.helpers.arrayElement(['online', 'offline', 'no-response'] as const)
      };
    });

    // Add current user if available
    if (currentUser) {
      const currentUserId = faker.string.uuid();
      fakeParticipants.unshift({
        id: currentUserId,
        name: currentUser.name,
        image: generateConsistentAvatar(currentUserId),
        status: 'online',
        isHost: true // Mark current user as host
      });
    }

    setParticipants(fakeParticipants);

    // Update participants status randomly every 5 seconds
    const statusInterval = setInterval(() => {
      setParticipants(prevParticipants => 
        prevParticipants.map(participant => {
          // Don't change host status
          if (participant.isHost) return participant;
          
          if (Math.random() < 0.1) {
            const statuses: ('online' | 'offline' | 'no-response')[] = ['online', 'offline', 'no-response'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return { ...participant, status: newStatus };
          }
          return participant;
        })
      );
    }, 5000);

    return () => clearInterval(statusInterval);
  }, [currentUser]);

  console.log('Generated participants:', participants); // Debug log

  return { participants };
};