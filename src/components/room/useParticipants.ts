import { useState, useEffect } from 'react';

type User = {
  email: string;
  name: string;
};

type Participant = {
  id: string;
  name: string;
  isActive: boolean;
};

export const useParticipants = (currentUser: User | null) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (currentUser) {
      setParticipants([
        {
          id: '1',
          name: currentUser.name,
          isActive: true,
        },
      ]);
    }
  }, [currentUser]);

  return { participants };
};