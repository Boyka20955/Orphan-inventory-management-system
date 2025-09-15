
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { SpeechToText } from "@/components/language/SpeechToText";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff } from "lucide-react";

const VoiceTranslation = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscript(text);
  };

  const translations = {
    en: {
      title: "Voice Translation",
      description: "Speak in any language and see it translated to English in real-time",
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      results: "Translation Results",
      noResults: "Your translation will appear here...",
      speakPrompt: "Speak in any language...",
    },
    sw: {
      title: "Tafsiri ya Sauti",
      description: "Ongea kwa lugha yoyote na uone ikitafsiriwa kwa Kiingereza moja kwa moja",
      startRecording: "Anza Kurekodi",
      stopRecording: "Simamisha Kurekodi",
      results: "Matokeo ya Tafsiri",
      noResults: "Tafsiri yako itaonekana hapa...",
      speakPrompt: "Ongea kwa lugha yoyote...",
    },
  };

  const text = translations[language as keyof typeof translations];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <p className="text-muted-foreground mt-1">{text.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Speech Input" : "Ingizo la Sauti"}</CardTitle>
            <CardDescription>
              {text.speakPrompt}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SpeechToText
              onTranscriptionComplete={handleTranscriptionComplete}
              standalone={true}
              targetLanguage="en"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{text.results}</CardTitle>
            <CardDescription>
              {language === "en" ? "English translation" : "Tafsiri ya Kiingereza"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-32 p-4 bg-muted/30 rounded-md border">
              {transcript ? (
                <p className="whitespace-pre-wrap">{transcript}</p>
              ) : (
                <p className="text-muted-foreground">{text.noResults}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceTranslation;
