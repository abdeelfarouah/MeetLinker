export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export interface Participant {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'away';
}