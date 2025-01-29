import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface TranscriptionDisplayProps {
  transcript: string;
}

const TranscriptionDisplay = ({ transcript }: TranscriptionDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  if (!transcript) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card ref={scrollRef} className="p-4 mb-4 max-h-40 overflow-y-auto">
        <h3 className="font-semibold mb-2">Transcription en direct</h3>
        <p className="text-sm whitespace-pre-line">{transcript}</p>
      </Card>
    </motion.div>
  );
};

export default TranscriptionDisplay;
