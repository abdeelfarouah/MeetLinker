import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Send } from "lucide-react";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const addEmoji = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2 p-4">
      <div className="flex-1 flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" type="button">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              locale="fr"
              theme="light"
            />
          </PopoverContent>
        </Popover>
        <Input
          value={message}
          onChange={handleInputChange}
          placeholder="Write your message..."
          className="flex-1"
        />
      </div>
      <Button type="submit">
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  );
};

export default MessageInput;