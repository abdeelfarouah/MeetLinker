export interface Message {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  created_at: string;
  profiles?: Profile;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  profiles?: Profile;
}

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'updated_at'>;
        Update: Partial<Profile>;
      };
      rooms: {
        Row: Room;
        Insert: Omit<Room, 'id' | 'created_at'>;
        Update: Partial<Room>;
      };
    };
  };
};