import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { insertTestData } from '@/utils/supabaseTestData';
import { supabase } from '@/lib/supabase';

const TestData = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    console.log('Fetching current data...');
    
    const { data: profilesData } = await supabase.from('profiles').select('*');
    const { data: roomsData } = await supabase.from('rooms').select('*');
    const { data: messagesData } = await supabase.from('messages').select('*');

    setProfiles(profilesData || []);
    setRooms(roomsData || []);
    setMessages(messagesData || []);
  };

  const handleInsertTestData = async () => {
    setIsLoading(true);
    try {
      await insertTestData();
      toast({
        title: "Success",
        description: "Test data has been inserted successfully",
      });
      await fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to insert test data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Supabase Test Data</h1>
        <Button 
          onClick={handleInsertTestData}
          disabled={isLoading}
        >
          {isLoading ? 'Inserting...' : 'Insert Test Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Profiles ({profiles.length})</h2>
          <div className="space-y-2">
            {profiles.map((profile) => (
              <div key={profile.id} className="p-2 bg-muted rounded">
                <p className="font-medium">{profile.username}</p>
                <p className="text-sm text-muted-foreground">{profile.id}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Rooms ({rooms.length})</h2>
          <div className="space-y-2">
            {rooms.map((room) => (
              <div key={room.id} className="p-2 bg-muted rounded">
                <p className="font-medium">{room.name}</p>
                <p className="text-sm text-muted-foreground">Created by: {room.created_by}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Messages ({messages.length})</h2>
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id} className="p-2 bg-muted rounded">
                <p>{message.content}</p>
                <p className="text-sm text-muted-foreground">
                  Room: {message.room_id}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestData;