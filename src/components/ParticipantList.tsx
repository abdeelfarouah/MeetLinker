import React from 'react';
import { Users } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Participant = {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'no-response';
  isHost?: boolean;
};

type ParticipantListProps = {
  participants: Participant[];
};

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  const host = participants.find(p => p.isHost);
  const otherParticipants = participants.filter(p => !p.isHost);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <h2 className="font-bold text-lg text-gray-800 dark:text-white">
          Participants ({participants.length})
        </h2>
      </div>
      
      {participants.length > 0 ? (
        <ul className="space-y-3">
          {/* Display host first */}
          {host && (
            <li key={host.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage 
                    src={host.image} 
                    alt={host.name} 
                  />
                  <AvatarFallback>
                    {host.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    host.status === 'online'
                      ? 'bg-status-online'
                      : host.status === 'offline'
                      ? 'bg-status-offline'
                      : 'bg-status-away'
                  }`}
                  title={`Status: ${host.status}`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {host.name}
                </span>
                <span className="text-xs text-gray-500">Host</span>
              </div>
            </li>
          )}

          {/* Display other participants */}
          {otherParticipants.map((participant) => (
            <li key={participant.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage 
                    src={participant.image} 
                    alt={participant.name} 
                  />
                  <AvatarFallback>
                    {participant.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    participant.status === 'online'
                      ? 'bg-status-online'
                      : participant.status === 'offline'
                      ? 'bg-status-offline'
                      : 'bg-status-away'
                  }`}
                  title={`Status: ${participant.status}`}
                />
              </div>
              <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">
                {participant.name}
              </span>
            </li>
          ))}
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