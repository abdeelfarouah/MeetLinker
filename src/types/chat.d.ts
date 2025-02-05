export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
}

export interface Participant {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'no-response';
}