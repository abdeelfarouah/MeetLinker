import { Card } from "@/components/ui/card";

interface TranscriptionDisplayProps {
  transcript: string;
}

const TranscriptionDisplay = ({ transcript }: TranscriptionDisplayProps) => {
  if (!transcript) return null;

  return (
    <Card className="p-4 mb-4 max-h-40 overflow-y-auto">
      <h3 className="font-semibold mb-2">Transcription en direct</h3>
      <p className="text-sm">{transcript}</p>
    </Card>
  );
};

export default TranscriptionDisplay;