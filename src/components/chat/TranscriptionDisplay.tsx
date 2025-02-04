import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

interface TranscriptionDisplayProps {
  transcript: string;
  isRecording?: boolean;
}

const TranscriptionDisplay = ({ transcript, isRecording = false }: TranscriptionDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (scrollRef.current && autoScroll) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [transcript, autoScroll]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isNearBottom);
    }
  };

  if (!transcript && !isRecording) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <Card 
        ref={scrollRef}
        onScroll={handleScroll}
        className="p-4 max-h-40 overflow-y-auto bg-secondary/50 border-2 border-primary/20 relative"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-primary flex items-center gap-2">
            <Mic className={`w-4 h-4 ${isRecording ? 'text-green-500' : 'text-gray-400'}`} />
            Live Transcription
          </h3>
          {isRecording && (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Recording</span>
            </div>
          )}
        </div>
        <p className="text-sm whitespace-pre-line leading-relaxed">
          {transcript || 'Waiting for speech...'}
        </p>
      </Card>
    </motion.div>
  );
};

export default TranscriptionDisplay;