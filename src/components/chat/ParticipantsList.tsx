import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { faker } from '@faker-js/faker';

type Participant = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
};

interface ParticipantsListProps {
  participants: Participant[];
  currentUser: Participant;
}

// Generate a consistent avatar URL for a given seed
const generateConsistentAvatar = (seed: string) => {
  faker.seed(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  return faker.image.avatar();
};

const ParticipantsList = ({ participants, currentUser }: ParticipantsListProps) => {
  return (
    <Card className="p-4 shadow-sm bg-card">
      <h2 className="font-semibold text-lg mb-4">Participants</h2>
      <div className="space-y-3">
        {participants.map((participant) => {
          const avatarUrl = generateConsistentAvatar(participant.id);
          return (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={avatarUrl} alt={participant.name} />
                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                    {
                      "bg-status-online": participant.status === "online",
                      "bg-status-offline": participant.status === "offline",
                      "bg-status-away": participant.status === "away",
                    }
                  )}
                  aria-label={`Status: ${participant.status}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {participant.name}
                  {participant.id === currentUser.id && " (You)"}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {participant.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ParticipantsList;