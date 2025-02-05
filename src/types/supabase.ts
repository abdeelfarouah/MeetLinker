export type Message = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  room_id: string;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url: string;
  updated_at: string;
};

export type Room = {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
};