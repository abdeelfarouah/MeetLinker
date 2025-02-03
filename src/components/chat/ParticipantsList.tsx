import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

interface ParticipantsListProps {
  participants: Participant[];
  currentUser: Participant;
}

const ParticipantsList = ({ participants, currentUser }: ParticipantsListProps) => {
  const getStatusColor = (status: Participant['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'away':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="space-y-4 p-4">
        <h3 className="font-semibold text-lg mb-4">Participants</h3>
        <div className="space-y-3">
          {[currentUser, ...participants].map((participant) => (
            <div
              key={participant.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Badge 
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(participant.status)}`}
                  variant="secondary"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {participant.name} {participant.id === currentUser.id && ' (Vous)'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {participant.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ParticipantsList;