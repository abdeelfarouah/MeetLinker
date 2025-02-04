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

// Generate a unique AI-generated face URL
const generateAIFace = () => {
  // Using DiceBear API for consistent, unique avatars
  const style = 'avataaars'; // or 'human', 'bottts', 'gridy', etc.
  const seed = faker.string.uuid();
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
        image: generateAIFace(),
        status: faker.helpers.arrayElement(['online', 'offline', 'no-response'] as const)
      };
    });

    // Add current user if available
    if (currentUser) {
      const currentUserId = faker.string.uuid();
      fakeParticipants.unshift({
        id: currentUserId,
        name: currentUser.name,
        image: generateAIFace(),
        status: 'online'
      });
    }

    setParticipants(fakeParticipants);
  }, [currentUser]);

  console.log('Generated participants:', participants); // Debug log

  return { participants };
};