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

export interface SupabaseMessage {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface Participant {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'no-response';
}