import React, { useState } from 'react';
import { Language } from '../../types';
import { ApiService } from '../../services/api';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  hindiText?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Namaste! I am Voice Saathi, your conversational assistant grounded strictly in official NSFDC schemes. How can I assist with concessional credit today?',
      hindiText: 'नमस्ते! मैं आवाज़ साथी हूँ, आधिकारिक एनएसएफडीसी योजनाओं में आपकी सहायता के लिए तैयार। आज आपको किस योजना की जानकारी चाहिए?'
    }
  ]);
  const [queryInput, setQueryInput] = useState('');

  const quickPrompts = [
    {
      q: 'How much loan can I get for Dairy under TLS?',
      a: 'Under the Term Loan Scheme (TLS), Scheduled Caste entrepreneurs can obtain up to ₹50.0 Lakh with 90% NSFDC financing at 6.50% p.a. interest rate and 6 months moratorium buffer.'
    },
    {
      q: 'What is the Mahila Samriddhi Yojana 50% subsidy?',
      a: 'Mahila Samriddhi Yojana (MSY) provides up to ₹1.40 Lakh micro-credit with a 50% capital subsidy (up to ₹60,000 maximum) at an ultra-low 4.00% interest rate by nominating a female family member.'
    },
    {
      q: 'Which Channel Partner near Mohanlalganj is best?',
      a: 'Uttar Pradesh SC Finance & Dev Corp (UPSCFDC) at Mohanlalganj Tehsil is 3.2 km away, has ₹1.82 Crore available quota, < 4.2% NPA health, and provides ~7-day fast sanction.'
    },
    {
      q: 'Why is District Cooperative Bank paused?',
      a: 'District Cooperative Bank currently has an elevated NPA rate. To protect citizens from sanction delays or loan rejections, Pragati automatically safely reroutes cases to accredited channel partners like UPSCFDC.'
    }
  ];

  const handleSendQuery = async (text: string, customAnswer?: string) => {
    if (!text.trim()) return;

    const newMsgs: Message[] = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    setQueryInput('');

    if (customAnswer) {
      setTimeout(() => {
        setMessages([...newMsgs, { sender: 'assistant', text: customAnswer }]);
      }, 350);
      return;
    }

    let spokenAnswer = '';
    try {
      const res = await ApiService.askAssistant(text, language);
      spokenAnswer = res.answer;
      setMessages([...newMsgs, { sender: 'assistant', text: res.answer }]);
    } catch {
      const lower = text.toLowerCase();
      let fallbackReply = 'Under official NSFDC guidelines, SC citizens with family income up to ₹5.00 Lakh are eligible for subsidized credit with 4% to 6.5% interest through State SCAs and RRBs.';
      if (lower.includes('dairy') || lower.includes('term loan') || lower.includes('tls')) {
        fallbackReply = quickPrompts[0].a;
      } else if (lower.includes('mahila') || lower.includes('subsidy') || lower.includes('women')) {
        fallbackReply = quickPrompts[1].a;
      }
      spokenAnswer = fallbackReply;
      setMessages([...newMsgs, { sender: 'assistant', text: fallbackReply }]);
    }

    if ('speechSynthesis' in window && spokenAnswer) {
      try {
        const utterance = new SpeechSynthesisUtterance(spokenAnswer);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore
      }
    }
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate listening
      setTimeout(() => {
        setIsListening(false);
        handleSendQuery('Tell me about Mahila Samriddhi Yojana 50% subsidy', quickPrompts[1].a);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-5 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#dae2fd] text-[#0037b0] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191c1e]">Pragati Voice Saathi • आवाज़ सहायता</h3>
              <p className="text-[10px] text-slate-500">Government Concessional Credit Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1 max-h-64 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0037b0] text-white rounded-br-xs'
                    : 'bg-[#f2f4f6] text-[#191c1e] rounded-bl-xs border border-slate-100'
                }`}
              >
                <p>{m.text}</p>
                {m.hindiText && (
                  <p className="text-[11px] text-slate-500 mt-1 border-t border-slate-200/60 pt-1">
                    {m.hindiText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts Chips */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Suggested Prompts / त्वरित प्रश्न
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(item.q, item.a)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-[#f2f4f6] hover:bg-[#dae2fd] text-[#191c1e] hover:text-[#0037b0] text-[11px] font-medium border border-slate-200 transition-colors"
              >
                {item.q}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Mic & Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={queryInput}
            onChange={e => setQueryInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendQuery(queryInput)}
            placeholder="Ask in English or Hindi (बोलें या लिखें)..."
            className="flex-1 bg-[#f2f4f6] px-3.5 py-2.5 rounded-full text-xs text-[#191c1e] placeholder:text-slate-400 focus:outline-none focus:bg-white border border-transparent focus:border-[#0037b0]"
          />

          <button
            onClick={toggleMic}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-[#0037b0] text-white hover:bg-[#1d4ed8]'
            }`}
            title="Speech input"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isListening ? 'graphic_eq' : 'mic'}
            </span>
          </button>

          <button
            onClick={() => handleSendQuery(queryInput)}
            className="w-11 h-11 rounded-full bg-[#0f172a] text-white flex items-center justify-center hover:bg-slate-800 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
