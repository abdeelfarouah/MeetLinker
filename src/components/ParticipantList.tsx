import React from 'react';
import { Users } from 'lucide-react';
import { faker } from '@faker-js/faker';

type Participant = {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'no-response';
};

type ParticipantListProps = {
  participants: Participant[];
};

// Generate a consistent avatar URL for a given seed
const generateConsistentAvatar = (seed: string) => {
  const style = 'avataaars';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <h2 className="font-bold text-lg text-gray-800 dark:text-white">Participants</h2>
      </div>
      
      {participants.length > 0 ? (
        <ul className="space-y-3">
          {participants.map((participant) => {
            // Generate consistent avatar based on participant ID
            const avatarUrl = generateConsistentAvatar(participant.id);
            
            return (
              <li key={participant.id} className="flex items-center gap-3">
                <img 
                  src={avatarUrl}
                  alt={participant.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">
                  {participant.name}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    participant.status === 'online'
                      ? 'bg-green-500'
                      : participant.status === 'offline'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                  title={`Status: ${participant.status}`}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No participants yet
        </p>
      )}
    </div>
  );
};

export default ParticipantList;