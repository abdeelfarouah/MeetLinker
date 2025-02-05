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

  // Generate initial participants only once when currentUser changes
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
        isHost: true
      });
    }

    setParticipants(fakeParticipants);

    // Only update non-host participants' status every 10 seconds instead of 5
    const statusInterval = setInterval(() => {
      setParticipants(prevParticipants => 
        prevParticipants.map(participant => {
          if (participant.isHost) return participant;
          
          // Reduce frequency of status changes (20% chance instead of 100%)
          if (Math.random() < 0.2) {
            const statuses: ('online' | 'offline' | 'no-response')[] = ['online', 'offline', 'no-response'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return { ...participant, status: newStatus };
          }
          return participant;
        })
      );
    }, 10000); // Increased interval from 5s to 10s

    return () => {
      console.log('Cleaning up participant status interval');
      clearInterval(statusInterval);
    };
  }, [currentUser]); // Only re-run when currentUser changes

  return { participants };
};