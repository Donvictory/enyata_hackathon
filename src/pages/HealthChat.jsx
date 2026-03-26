import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Textarea } from "../Components/ui/textarea";
import { Alert, AlertDescription } from "../Components/ui/alert";
import {
  saveChatMessage,
  getChatMessages,
  getUserProfile,
  getTodaysCheckIn,
} from "../lib/storage";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  User,
  AlertTriangle,
  Home,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useAskCompanion } from "../hooks/use-chat";
import { useMe } from "../hooks/use-auth";

export function HealthChat() {
  const navigate = useNavigate();
  const { data: profile } = useMe();
  const askCompanion = useAskCompanion();
  const [messages, setMessages] = useState(() => getChatMessages());
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Initialized from storage
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateLocalAIResponse = (userMessage) => {
    const profile = getUserProfile();
    const todayData = getTodaysCheckIn();
    const lowerMessage = userMessage.toLowerCase();

    // Check-in context awareness
    if (
      lowerMessage.includes("how am i doing") ||
      lowerMessage.includes("status")
    ) {
      if (!todayData) {
        return `I don't have your vitals for today yet, ${profile?.name || "Friend"}. Why don't you complete a Daily Check-in so I can give you an accurate status update? 📊`;
      }

      let statusMsg = `Based on your check-in today, ${profile?.name || "Friend"}: `;
      if (todayData.resilienceScore >= 80) {
        statusMsg +=
          "Your resilience tank is looking strong! 🔋 Your sleep and activity levels are excellent.";
      } else if (todayData.resilienceScore >= 50) {
        statusMsg +=
          "You're in a stable zone, but there's room for improvement. Watch your sleep and stress levels.";
      } else {
        statusMsg +=
          "Your resilience is currently low. I notice high stress or low rest in your data. Please prioritize recovery today. 🫂";
      }

      if (todayData.waterIntake < 5)
        statusMsg +=
          " Also, don't forget to drink more water - you're below target today! 💧";

      return statusMsg;
    }

    if (lowerMessage.includes("fever") || lowerMessage.includes("hot")) {
      return "I see you're experiencing fever. In Nigeria, fever can be a sign of malaria, especially if accompanied by chills and body aches. Have you been experiencing any other symptoms? It's important to get tested and see a doctor soon. Don't self-medicate with antimalarials without proper testing. 🌡️";
    }

    if (lowerMessage.includes("malaria")) {
      return "Malaria is common in Nigeria, especially during rainy season. If you suspect malaria, please visit a nearby clinic for a rapid diagnostic test (RDT). Don't assume it's malaria without testing - symptoms can overlap with other conditions. Stay hydrated and avoid self-medication.";
    }

    if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("overwhelmed")
    ) {
      const stressAdvice =
        todayData?.stressLevel >= 7
          ? `I notice you logged a high stress level of ${todayData.stressLevel}/10 today. `
          : "";
      return `${stressAdvice}${profile?.name || "Friend"}, Lagos life can be stressful with traffic and work pressure. Consider taking short breaks, even 5-minute walks. Have you tried deep breathing exercises? Your mental health is as important as physical health. Would you like some stress management tips specific to Nigerian work culture?`;
    }

    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      const sleepContext = todayData
        ? `You logged ${todayData.hoursSlept} hours of sleep last night. `
        : "";
      return `${sleepContext}Sleep is crucial for your resilience tank! Poor sleep affects everything - from your immune system to stress levels. Try to maintain a consistent sleep schedule even with power outages. Avoid screens 1 hour before bed. How are you feeling today after that rest?`;
    }

    if (lowerMessage.includes("headache") || lowerMessage.includes("head")) {
      return "Headaches can have many causes - dehydration (very common in Lagos heat), stress, lack of sleep, or eye strain. Have you been drinking enough water? When did it start? If it's severe or persistent, especially with fever, please see a doctor as it could indicate malaria or hypertension.";
    }

    if (lowerMessage.includes("tired") || lowerMessage.includes("fatigue")) {
      return "Fatigue in Nigeria often relates to inadequate sleep, stress, poor nutrition, or underlying conditions like anemia or malaria. Are you getting enough rest? Eating balanced meals? Check your recent check-ins - have you noticed any patterns? If fatigue persists for more than 2 weeks, please consult a doctor.";
    }

    if (lowerMessage.includes("water") || lowerMessage.includes("hydration")) {
      const waterStatus = todayData
        ? `You've had ${todayData.waterIntake} glasses so far today. `
        : "";
      return `${waterStatus}In Nigeria's heat, you should aim for at least 8-10 glasses of water daily. Dehydration can cause headaches, fatigue, and affect your resilience. Keep a water bottle handy, even in go-slow! 💧`;
    }

    if (lowerMessage.includes("exercise") || lowerMessage.includes("gym")) {
      return "Exercise is excellent for your health! Even with Lagos traffic and busy schedules, try to get 30 minutes of activity daily. It doesn't have to be gym - walking, dancing to afrobeats, using stairs instead of elevators all count. What kind of activities do you enjoy?";
    }

    if (lowerMessage.includes("diet") || lowerMessage.includes("food")) {
      return "Nigerian diet can be very healthy if balanced! Include more vegetables, fruits, lean proteins (fish, chicken). Reduce fried foods and excessive carbs. Jollof rice is life, but moderation is key 😄. Local fruits like oranges, pawpaw, and watermelon are great. Are you watching your portions?";
    }

    if (
      lowerMessage.includes("blood pressure") ||
      lowerMessage.includes("hypertension")
    ) {
      return "Hypertension is very common in Nigeria and often called the 'silent killer'. If you haven't checked your BP recently, please do so at any pharmacy or clinic. Reduce salt intake, manage stress, exercise regularly, and avoid excessive alcohol. Do you have a family history of hypertension?";
    }

    if (lowerMessage.includes("doctor") || lowerMessage.includes("hospital")) {
      return "I can help you find nearby doctors and hospitals! Use the 'Find Doctors & Hospitals' feature in the app. Before your visit, export your DriftCare Health Report so your doctor can see your patterns over the last 7 days. This helps them make better diagnoses. 🏥";
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! I'm here anytime you need health guidance. Remember, I'm here to support you, but always consult a licensed healthcare professional for medical decisions. Stay healthy! 💚";
    }

    return `${profile?.name || "Friend"}, I'm here to help with health questions! I can discuss symptoms, provide context about common Nigerian health issues, remind you about healthy habits, and guide you to professional care when needed. What's on your mind today? 😊`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveChatMessage(userMessage);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    let aiReply = "";

    try {
      // 1. Try backend AI (has full user context + check-in history)
      aiReply = await askCompanion.mutateAsync(currentInput);
      setIsOffline(false);
    } catch (err) {
      console.warn(
        "Backend AI unavailable, using local fallback:",
        err.message,
      );
      // 2. Fall back to local rule engine
      aiReply = generateLocalAIResponse(currentInput);
      setIsOffline(true);
      toast.warning("Companion is offline — using local responses.", {
        icon: "📡",
        duration: 3000,
      });
    }

    const assistantMessage = {
      id: `msg-${Date.now()}-ai`,
      role: "assistant",
      content: aiReply,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    saveChatMessage(assistantMessage);
    setIsTyping(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const _audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        toast.info("Voice message captured! Analyzing your audio...");
        setInput("Voice record analyze: " + new Date().toLocaleTimeString());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started...");
    } catch {
      toast.error(
        "Microphone access denied. Please enable microphone permissions.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Bot className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">
                Companion
                {profile?.name ? (
                  <span className="font-normal text-gray-500 text-sm ml-1">
                    — chatting with {profile.name.split(" ")[0]}
                  </span>
                ) : null}
              </h1>
              <p className="text-xs flex items-center gap-1">
                {isOffline ? (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-500 font-semibold">
                      Offline Mode
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-600">
                      Online & Ready to Help
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 space-y-4"
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 inline-block max-w-sm">
                  <Bot className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h2 className="font-semibold text-lg text-gray-900">
                    Hello! I'm your Companion.
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    I can help answer questions about common symptoms, explain
                    health terms, and provide context for your tracked health
                    metrics.
                  </p>
                  <p className="text-xs text-emerald-600 mt-4 font-medium italic">
                    "How many glasses of water should I drink in this Lagos
                    heat?"
                  </p>
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                      message.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-emerald-50 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === "assistant" ? (
                        <Bot className="w-3 h-3 opacity-50" />
                      ) : (
                        <User className="w-3 h-3 opacity-50" />
                      )}
                      <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">
                        {message.role === "assistant" ? "Companion" : "You"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={`text-[10px] mt-2 opacity-50 text-right`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-emerald-500 p-4 max-w-2xl mx-auto"
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                </div>
                <span className="text-xs font-semibold">
                  Companion is thinking...
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-emerald-100 pb-24">
        <div className="max-w-2xl mx-auto">
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800 py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-[10px] leading-tight font-medium">
              Not a medical diagnosis. For emergencies, please call 112 or visit
              a hospital.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="min-h-[44px] max-h-32 pr-12 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                type="button"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                className={`absolute right-3 bottom-3 p-1 rounded-full transition-colors ${
                  isRecording
                    ? "text-red-500 bg-red-50 animate-pulse outline-red-500"
                    : "text-gray-400 hover:text-emerald-500"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="rounded-xl h-11 px-5"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
