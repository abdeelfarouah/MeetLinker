import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface TranscriptionDisplayProps {
  transcript: string;
}

const TranscriptionDisplay = ({ transcript }: TranscriptionDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new text appears
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      const isScrolledToBottom = 
        scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight + 100;
      
      if (isScrolledToBottom) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [transcript]);

  if (!transcript) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <Card 
        ref={scrollRef} 
        className="p-4 max-h-40 overflow-y-auto bg-secondary border-2 border-primary/20 relative"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-primary">Live Transcription</h3>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Recording</span>
          </div>
        </div>
        <p className="text-sm whitespace-pre-line leading-relaxed">{transcript}</p>
      </Card>
    </motion.div>
  );
};

export default TranscriptionDisplay;