import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSupabaseMessages } from '../../hooks/useSupabaseMessages';
import AuthComponent from '../../components/Auth';
import MessageList from '../../features/chat/components/MessageList';
import MessageInput from '../../features/chat/components/MessageInput';
import { toast } from 'sonner';

const ChatRoom = () => {
  const navigate = useNavigate();
  const [session, setSession] = React.useState(null);
  const roomId = 'default-room'; // You can make this dynamic later

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { messages, isLoading, sendMessage } = useSupabaseMessages(
    roomId,
    session?.user?.id
  );

  if (!session) {
    return <AuthComponent />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} currentUserId={session.user.id} />
      </div>
      <div className="p-4 border-t">
        <MessageInput
          onSendMessage={(content) => {
            sendMessage(content);
          }}
        />
      </div>
    </div>
  );
};

export default ChatRoom;