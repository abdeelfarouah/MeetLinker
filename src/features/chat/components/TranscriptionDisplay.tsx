import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Languages } from "lucide-react";

interface TranscriptionDisplayProps {
  transcript: string;
  isRecording?: boolean;
  currentLanguage?: string;
  availableLanguages?: Record<string, string>;
  onLanguageChange?: (language: string) => void;
}

const TranscriptionDisplay = ({ 
  transcript, 
  isRecording = false,
  currentLanguage = 'fr-FR',
  availableLanguages = {},
  onLanguageChange
}: TranscriptionDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    if (scrollRef.current && autoScroll) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
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
          <Card className="relative overflow-hidden bg-gray-100 border-2 border-primary/20">
            {/* Header avec contrôles */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-gray-100 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                    Transcription en direct
                  </h3>
                  {isRecording && (
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                
                {onLanguageChange && (
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <Select
                      value={currentLanguage}
                      onValueChange={onLanguageChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(availableLanguages).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Zone de transcription avec effet prompteur */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="max-h-[40vh] overflow-y-auto relative scroll-smooth pt-20 pb-16"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
              }}
            >
              <div className="p-6 space-y-2">
                <p className="text-lg whitespace-pre-line leading-relaxed text-primary font-medium text-center px-8">
                  {transcript || (isRecording ? 'En attente de parole...' : 'Aucune transcription disponible')}
                </p>
              </div>
            </div>

            {/* Overlay du bas avec bouton de défilement */}
            {!isNearBottom && (
              <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center bg-gradient-to-t from-gray-100 to-transparent">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setAutoScroll(true);
                    scrollRef.current?.scrollTo({ 
                      top: scrollRef.current.scrollHeight, 
                      behavior: 'smooth' 
                    });
                  }}
                  className="text-xs opacity-80 hover:opacity-100"
                >
                  ↓ Défiler vers le bas
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranscriptionDisplay;