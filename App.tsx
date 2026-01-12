
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { interviewService } from './services/geminiService';
import { Message, InterviewTopic, CompetencyScores } from './types';
import { INITIAL_GREETING } from './constants';
import InterviewerAvatar from './components/InterviewerAvatar';
import { 
  Send, 
  RotateCcw, 
  Terminal,
  TrendingUp,
  Activity,
  ShieldAlert,
  Search,
  Binary,
  Maximize2,
  BrainCircuit,
  LayoutDashboard,
  Zap,
  Target,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

/**
 * Loading state indicator for model thinking.
 */
const ThinkingDots = () => (
  <div className="flex space-x-2 py-2">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
  </div>
);

const App = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'interviewer', content: INITIAL_GREETING }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<InterviewTopic>(InterviewTopic.LEAN_PRODUCTION_TPS);
  const [showMenu, setShowMenu] = useState(false);
  const [scores, setScores] = useState<CompetencyScores>({
    modeling: 20,
    data: 20,
    lean: 20,
    finance: 20,
    leadership: 20,
    optimization: 20
  });
  const [currentSalary, setCurrentSalary] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.aistudio) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parsePerformance = (text: string) => {
    const scoreMatch = text.match(/\[SCORE:\s*([^\]]+)\]/);
    const salaryMatch = text.match(/\[ESTIMATED_SALARY:\s*(\d+)\]/);

    if (scoreMatch) {
      const updates = scoreMatch[1].split(',').map(s => s.trim());
      setScores(prev => {
        const next = { ...prev };
        updates.forEach(u => {
          const match = u.match(/([a-zA-Z]+)([+-])(\d+)/);
          if (match) {
            const [, key, op, val] = match;
            const isAdd = op === '+';
            const value = parseInt(val);
            const k = key.trim().toLowerCase() as keyof CompetencyScores;
            if (next[k] !== undefined) {
              next[k] = Math.min(100, Math.max(0, isAdd ? next[k] + value : next[k] - value));
            }
          }
        });
        return next;
      });
    }

    if (salaryMatch) {
      setCurrentSalary(parseInt(salaryMatch[1]));
    }

    return text.replace(/\[SCORE:[^\]]+\]/g, '').replace(/\[ESTIMATED_SALARY:[^\]]+\]/g, '').trim();
  };

  const handleAISpeak = async (prompt: string, historyForContext: Message[]) => {
    setIsThinking(true);
    let fullResponse = '';
    
    setMessages(prev => [...prev, { role: 'interviewer', content: '' }]);

    try {
      const stream = interviewService.sendMessageStream(prompt, historyForContext);
      for await (const chunk of stream) {
        if (chunk === "ERROR_KEY_NOT_FOUND") {
          setHasKey(false);
          // @ts-ignore
          await window.aistudio.openSelectKey();
          setHasKey(true);
          break;
        }
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].content = fullResponse;
          }
          return newMessages;
        });
      }
      
      const cleanedText = parsePerformance(fullResponse);
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].content = cleanedText;
        }
        return newMessages;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText;
    const history = [...messages]; 
    setInputText('');
    setMessages(prev => [...prev, { role: 'candidate', content: userMsg }]);
    await handleAISpeak(userMsg, history);
  };

  const selectTopic = async (topic: InterviewTopic) => {
    const history = [...messages];
    setCurrentTopic(topic);
    setMessages(prev => [...prev, { role: 'candidate', content: `[战场切换] 部署战术场景: ${topic}` }]);
    await handleAISpeak(`已加载场景『${topic}』。请作为面试官，针对该领域发布首个高难度的实战指令，考核我的能力。`, history);
  };

  const triggerAction = async (actionType: 'answer' | 'deeper' | 'next' | 'reset') => {
    setShowMenu(false);
    let prompt = "";
    switch(actionType) {
      case 'answer': prompt = "请给出针对当前场景的最优全栈解法，包含精益、运筹、自动化及安全视角，以供我学习。"; break;
      case 'deeper': prompt = "请根据我目前的回答，从更底层的系统架构、控制算法、安全机制或管理平衡点抛出一个挑战性追问。"; break;
      case 'next': prompt = "该环节已掌握，请进入面试的下一个难度层级。"; break;
      case 'reset': window.location.reload(); return;
    }
    await handleAISpeak(prompt, [...messages]);
  };

  if (hasKey === false) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center text-slate-100 p-8">
        <div className="max-w-md w-full bg-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl text-center">
          <BrainCircuit className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-tighter">IE Range V2.2 激活</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            全系 IE 知识图谱已加载。请连接付费 API Key 以解锁陆博士的高阶逻辑引擎。
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] mb-4"
          >
            选择付费 API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline flex items-center justify-center space-x-1"
          >
            <span>关于账单配置说明</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen bg-[#020617] flex flex-col font-sans overflow-hidden text-slate-100 selection:bg-blue-500/30 transition-colors duration-1000`}>
      <header className={`flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-blue-500/20 z-[60] backdrop-blur-2xl shadow-xl`}>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]`}>
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">IE RANGE v2.2</h1>
              <div className="flex items-center space-x-2 text-[9px] font-mono text-slate-500">
                <span className="font-bold uppercase tracking-widest text-blue-400">
                  TOTAL_IE_SPECTRUM_ACTIVE
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/50 border border-white/10 px-4 py-1.5 rounded-full flex items-center space-x-3 shadow-inner">
            <TrendingUp size={14} className="text-green-500" />
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1 opacity-60">Competency Worth</span>
              <span className="text-lg font-mono font-bold text-white tracking-tighter leading-none">
                ${currentSalary.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
            <button onClick={() => triggerAction('reset')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all border border-white/5 group">
                <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Sidebar: Highly Detailed Scenario List */}
        <div className="w-full lg:w-64 xl:w-80 bg-slate-950/40 border-r border-white/5 p-6 flex flex-col space-y-8 z-20 overflow-y-auto custom-scrollbar shadow-2xl">
            <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <LayoutDashboard size={12} className="mr-2" />
                  <span>Radar Analytics</span>
                </h3>
                <div className="space-y-4">
                    {(Object.entries(scores) as [string, number][]).map(([key, value]) => (
                        <div key={key} className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter">
                                <span className="text-slate-500">{key}</span>
                                <span className={`text-blue-400 font-mono`}>{value}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]`} 
                                  style={{ width: `${value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-white/5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <Target size={12} className="mr-2" />
                  <span>Tactical Scenarios</span>
                </h3>
                <div className="space-y-1.5">
                    {Object.values(InterviewTopic).map(topic => (
                        <button 
                            key={topic}
                            onClick={() => selectTopic(topic)}
                            className={`w-full text-left text-[9px] p-3 rounded-xl border transition-all font-semibold flex items-start space-x-3 group
                                ${currentTopic === topic 
                                    ? `bg-blue-600/10 border-blue-500/50 text-white shadow-lg` 
                                    : 'border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <div className={`mt-0.5 w-1 h-1 rounded-full transition-all ${currentTopic === topic ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                            <span className="leading-relaxed">{topic}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto bg-slate-900/60 border border-white/5 rounded-2xl p-4 shadow-inner">
               <div className="flex items-center space-x-2 mb-3">
                  <ShieldCheck size={12} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">DR_LU_PROCESSOR</span>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-mono text-slate-600"><span>OT_SECURITY:</span> <span className="text-green-500">MONITORING</span></div>
                  <div className="flex justify-between text-[8px] font-mono text-slate-600"><span>PLC_LOGIC:</span> <span className="text-blue-500">SYNCED</span></div>
                  <div className="flex justify-between text-[8px] font-mono text-slate-600"><span>LEAN_SCAN:</span> <span className="text-emerald-500">ACTIVE</span></div>
               </div>
            </div>
        </div>

        <div className="flex-1 relative flex flex-col items-center justify-center p-8 z-50">
          <div className="relative mb-12 flex flex-col items-center">
            <InterviewerAvatar isThinking={isThinking} onClick={() => setShowMenu(!showMenu)} />
            
            {showMenu && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
                 <div className={`pointer-events-auto w-[280px] bg-slate-900/95 backdrop-blur-3xl border border-blue-500/40 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-5 animate-in zoom-in-95 duration-200`}>
                    <div className="flex items-center justify-between mb-4 px-1 border-b border-white/5 pb-2">
                        <span className={`text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]`}>Tactical Menu</span>
                        <button onClick={() => setShowMenu(false)} className="text-slate-600 hover:text-white transition-colors p-1">✕</button>
                    </div>
                    <div className="space-y-2">
                        <button onClick={() => triggerAction('answer')} className={`w-full text-left p-3 bg-white/5 hover:bg-blue-600/20 rounded-2xl transition-all border border-white/5 group relative overflow-hidden`}>
                            <div className={`absolute top-0 left-0 w-1 h-full bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform`}></div>
                            <div className="flex items-center space-x-3">
                                <Maximize2 size={16} className={`text-blue-500`} />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase leading-tight tracking-tight">告诉答案</p>
                                    <p className="text-[8px] text-slate-500 mt-0.5 uppercase tracking-tighter font-mono italic">Full IE Spectrum Solution</p>
                                </div>
                            </div>
                        </button>
                        
                        <button onClick={() => triggerAction('deeper')} className="w-full text-left p-3 bg-white/5 hover:bg-slate-800 rounded-2xl transition-all border border-white/5 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                            <div className="flex items-center space-x-3">
                                <Zap size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase leading-tight tracking-tight">深入追问</p>
                                    <p className="text-[8px] text-slate-500 mt-0.5 uppercase tracking-tighter font-mono italic">Architecture & Logic Deep-dive</p>
                                </div>
                            </div>
                        </button>

                        <button onClick={() => triggerAction('next')} className="w-full text-left p-3 bg-red-500/5 hover:bg-red-600/20 rounded-2xl transition-all border border-red-500/20 group relative overflow-hidden mt-4">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                            <div className="flex items-center space-x-3">
                                <ShieldAlert size={16} className="text-red-500" />
                                <div>
                                    <p className="text-xs font-bold text-red-400 uppercase leading-tight tracking-tight">下一个挑战</p>
                                    <p className="text-[8px] text-red-700/60 mt-0.5 uppercase tracking-tighter font-mono italic">Escalate Interview Difficulty</p>
                                </div>
                            </div>
                        </button>
                    </div>
                 </div>
              </div>
            )}
          </div>

          <div className="perspective-table absolute bottom-0 w-full flex justify-center h-48 pointer-events-none opacity-20">
            <div className={`table-top w-[90%] bg-gradient-to-t from-[#020617] via-slate-900 border-t border-blue-500/20 h-full rounded-b-[150px]`}></div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] xl:w-[480px] bg-black/80 backdrop-blur-3xl border-l border-white/5 flex flex-col z-30 shadow-[-10px_0_40px_rgba(0,0,0,0.5)]">
          <div className={`p-4 border-b border-white/5 flex items-center bg-slate-900/40 justify-between`}>
             <div className="flex items-center">
                <Terminal size={14} className={`text-blue-500 mr-2`} />
                <span className="text-[9px] font-mono font-bold tracking-[0.3em] text-slate-400 uppercase">
                    TACTICAL_IE_BUFFER_V2.2
                </span>
             </div>
             <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-red-500/20 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-yellow-500/20 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-500/20 rounded-full"></div>
             </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'candidate' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`mb-2 text-[8px] font-mono uppercase tracking-widest flex items-center ${msg.role === 'candidate' ? 'text-blue-500' : 'text-slate-600'}`}>
                    {msg.role === 'candidate' ? 'CANDIDATE_LINK' : 'INTERROGATOR_DR_LU'}
                    <span className="mx-2 opacity-30">•</span>
                    <span className="opacity-50 font-light">{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`max-w-[95%] px-5 py-4 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap font-sans transition-all
                  ${msg.role === 'candidate' 
                    ? `bg-blue-700/20 text-white border border-blue-500/20 shadow-lg` 
                    : 'bg-slate-900/95 text-slate-200 border border-white/10 shadow-2xl relative'}`}>
                  {msg.content || (isThinking && idx === messages.length - 1 ? <ThinkingDots /> : null)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-white/5 bg-slate-950/60 shadow-inner">
            <div className={`bg-black/80 border border-white/5 rounded-2xl p-2 focus-within:border-blue-500/40 transition-all shadow-2xl ring-1 ring-white/5`}>
               <textarea
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                 placeholder="输入你的全栈技术响应（OT 安全、控制逻辑、管理决策）..."
                 className="w-full bg-transparent text-slate-200 text-sm p-4 outline-none resize-none min-h-[100px] custom-scrollbar placeholder:text-slate-700 font-sans leading-relaxed"
                 rows={3}
               />
               <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-4">
                    <span className="text-[9px] text-slate-700 font-mono tracking-tighter uppercase font-bold">READY_TO_EXECUTE</span>
                  </div>
                  <button onClick={handleSend} disabled={!inputText.trim() || isThinking}
                    className={`flex items-center space-x-3 px-10 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all duration-300
                    ${inputText.trim() ? `bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]` : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'}`}>
                    <span>Execute Stream</span>
                    <Send size={14} className={inputText.trim() ? 'animate-pulse' : ''} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .table-top { transform: rotateX(55deg); transform-origin: bottom; }
        .ring-white\/5 { --tw-ring-color: rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
};

export default App;
