import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

interface TranscriptionDisplayProps {
  transcript: string;
  isRecording?: boolean;
}

const TranscriptionDisplay = ({ transcript, isRecording = false }: TranscriptionDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    if (scrollRef.current && autoScroll) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [transcript, autoScroll]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const bottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsNearBottom(bottom);
      setAutoScroll(bottom);
    }
  };

  return (
    <AnimatePresence>
      {(transcript || isRecording) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Card 
            ref={scrollRef}
            onScroll={handleScroll}
            className="p-4 max-h-[40vh] overflow-y-auto bg-secondary/50 border-2 border-primary/20 relative scroll-smooth"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <Mic className={`w-4 h-4 ${isRecording ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                Transcription en direct
              </h3>
              {isRecording && (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Enregistrement en cours</span>
                </div>
              )}
            </div>
            
            <div className="relative">
              <p className="text-sm whitespace-pre-line leading-relaxed text-foreground/90">
                {transcript || (isRecording ? 'En attente de parole...' : 'Aucune transcription disponible')}
              </p>
              
              {!isNearBottom && (
                <div className="absolute bottom-0 right-0 p-2">
                  <motion.button
                    onClick={() => {
                      setAutoScroll(true);
                      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
                    }}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ↓ Défiler vers le bas
                  </motion.button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranscriptionDisplay;