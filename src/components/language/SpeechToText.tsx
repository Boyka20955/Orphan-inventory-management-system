
import React, { useState, useEffect } from "react";
import { Mic, MicOff, MicVocal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SpeechToTextProps {
  onTranscriptionComplete?: (text: string) => void;
  standalone?: boolean;
  targetLanguage?: "en" | "sw";
}

export function SpeechToText({ 
  onTranscriptionComplete, 
  standalone = false,
  targetLanguage = "en"
}: SpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { language, detectAndTranslate } = useLanguage();

  // Initialize the Web Speech API
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }
  }, [toast]);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure the speech recognition for auto language detection
    recognition.continuous = true;
    recognition.interimResults = true;
    // Use 'auto' for automatic language detection
    recognition.lang = 'auto';

    recognition.onstart = () => {
      toast({
        title: language === "en" ? "Recording started" : "Kurekodi kumeanza",
        description: language === "en" ? "Speak in any language..." : "Ongea kwa lugha yoyote...",
      });
    };

    recognition.onresult = async (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          
          // Show processing state
          setIsProcessing(true);
          
          try {
            // Translate to the target language (English or Swahili)
            const translatedText = await detectAndTranslate(transcript, targetLanguage);
            
            // Update the transcript and notify parent component
            setTranscript(prev => prev + ' ' + translatedText);
            if (onTranscriptionComplete) {
              onTranscriptionComplete(translatedText);
            }
          } catch (error) {
            console.error("Translation error:", error);
            toast({
              title: language === "en" ? "Translation Error" : "Hitilafu ya Tafsiri",
              description: language === "en" ? "Failed to translate the speech." : "Imeshindwa kutafsiri usemi.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      toast({
        title: language === "en" ? "Error" : "Hitilafu",
        description: language === "en" ? `Recognition error: ${event.error}` : `Hitilafu ya utambuzi: ${event.error}`,
        variant: "destructive",
      });
      setIsRecording(false);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      if (isRecording) {
        // If we're still supposed to be recording, restart
        recognition.start();
      }
    };

    // Start the recognition
    recognition.start();

    // Store the recognition instance in a ref to stop it later
    window.currentRecognition = recognition;
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (window.currentRecognition) {
      window.currentRecognition.stop();
      toast({
        title: language === "en" ? "Recording stopped" : "Kurekodi kumesimamishwa",
        description: transcript 
          ? (language === "en" ? "Transcription complete." : "Unakili umekamilika.") 
          : (language === "en" ? "No speech detected." : "Hakuna usemi uliotambuliwa."),
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Render the component based on whether it's standalone or embedded
  if (standalone) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Speech Recognition" : "Utambuzi wa Sauti"}
          </CardTitle>
          <CardDescription>
            {targetLanguage === "en" 
              ? (language === "en" ? "Speak in any language, and it will be translated to English" : "Ongea kwa lugha yoyote, na itatafsiriwa kwa Kiingereza") 
              : (language === "en" ? "Speak in any language, and it will be translated to Swahili" : "Ongea kwa lugha yoyote, na itatafsiriwa kwa Kiswahili")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                className="rounded-full"
                onClick={toggleRecording}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <MicVocal className="h-5 w-5 animate-pulse" />
                ) : isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
              <span className="text-sm">
                {isProcessing 
                  ? (language === "en" ? "Processing..." : "Inachakata...") 
                  : isRecording 
                  ? (language === "en" ? "Recording..." : "Inarekodi...") 
                  : (language === "en" ? "Click to start recording" : "Bofya kuanza kurekodi")}
              </span>
            </div>
            
            {transcript && (
              <div className="mt-2 p-4 bg-background rounded-md text-sm border">
                <p className="whitespace-pre-wrap">{transcript}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Original inline component rendering
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className={`rounded-full p-2 ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
          onClick={toggleRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <MicVocal className="h-5 w-5 animate-pulse" />
          ) : isRecording ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        <span className="text-sm">
          {isProcessing ? "Processing..." : isRecording ? "Recording..." : "Record speech in any language"}
        </span>
      </div>
      
      {transcript && (
        <div className="mt-2 p-2 bg-background rounded-md text-sm border">
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}

// Add TypeScript support for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    currentRecognition: any;
  }
}
