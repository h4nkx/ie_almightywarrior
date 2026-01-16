
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { interviewService } from './services/geminiService';
import { Message, InterviewTopic, CompetencyScores } from './types';
import { INITIAL_GREETING, INITIAL_SCORES, INITIAL_SALARY } from './constants';
import InterviewerAvatar from './components/InterviewerAvatar';
import { 
  Send, 
  RotateCcw, 
  Terminal,
  TrendingUp,
  BrainCircuit,
  LayoutDashboard,
  Target,
  Database,
  BarChart3,
  Lightbulb,
  Cpu,
  Coins,
  Users,
  Maximize2,
  Zap
} from 'lucide-react';

const ThinkingDots = () => (
  <div className="flex space-x-2 py-2">
    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
  </div>
);

const App = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'interviewer', content: INITIAL_GREETING }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<InterviewTopic>(InterviewTopic.IT_IE_MES_ERP_INTEGRATION);
  const [showMenu, setShowMenu] = useState(false);
  const [scores, setScores] = useState<CompetencyScores>(INITIAL_SCORES);
  const [currentSalary, setCurrentSalary] = useState(INITIAL_SALARY); 
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parsePerformance = (text: string) => {
    const scoreMatch = text.match(/\[SCORE:\s*([^\]]+)\]/);
    const salaryDeltaMatch = text.match(/\[SALARY_DELTA:\s*([+-])(\d+)\]/);

    if (scoreMatch) {
      const updates = scoreMatch[1].split(',').map(s => s.trim());
      setScores(prev => {
        const next = { ...prev };
        updates.forEach(u => {
          const match = u.match(/([a-zA-Z]+)([+-])(\d+)/);
          if (match) {
            const [, key, op, val] = match;
            const k = key.trim().toLowerCase() as keyof CompetencyScores;
            if (next[k] !== undefined) {
              const change = parseInt(val);
              next[k] = Math.min(100, Math.max(0, op === '+' ? next[k] + change : next[k] - change));
            }
          }
        });
        return next;
      });
    }

    if (salaryDeltaMatch) {
      const op = salaryDeltaMatch[1];
      const delta = parseInt(salaryDeltaMatch[2]);
      setCurrentSalary(prev => Math.max(0, op === '+' ? prev + delta : prev - delta));
    }

    return text.replace(/\[SCORE:[^\]]+\]/g, '').replace(/\[SALARY_DELTA:[^\]]+\]/g, '').trim();
  };

  const handleAISpeak = async (prompt: string, historyForContext: Message[]) => {
    setIsThinking(true);
    let fullResponse = '';
    setMessages(prev => [...prev, { role: 'interviewer', content: '' }]);

    try {
      const stream = interviewService.sendMessageStream(prompt, historyForContext);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }
      
      const cleanedText = parsePerformance(fullResponse);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = cleanedText;
        return newMessages;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isThinking || isResetting) return;
    const userMsg = inputText;
    const history = [...messages]; 
    setInputText('');
    setMessages(prev => [...prev, { role: 'candidate', content: userMsg }]);
    await handleAISpeak(userMsg, history);
  };

  const selectTopic = async (topic: InterviewTopic) => {
    if (isThinking || isResetting) return;
    const history = [...messages];
    setCurrentTopic(topic);
    setMessages(prev => [...prev, { role: 'candidate', content: `[评估领域切换] 当前选定场景: ${topic}` }]);
    await handleAISpeak(`已加载案例场景『${topic}』。请开始你的逻辑陈述。`, history);
  };

  const triggerAction = async (actionType: 'answer' | 'deeper') => {
    setShowMenu(false);
    let prompt = "";
    switch(actionType) {
      case 'answer': prompt = "请给出针对当前场景的行业最优解法方案建议。"; break;
      case 'deeper': prompt = "请针对当前方案的技术实现细节进行深度拆解。"; break;
    }
    await handleAISpeak(prompt, [...messages]);
  };

  const handleReset = () => {
    if (isResetting) return;
    setIsResetting(true);
    
    setTimeout(() => {
      setMessages([{ role: 'interviewer', content: INITIAL_GREETING }]);
      setScores(INITIAL_SCORES);
      setCurrentSalary(INITIAL_SALARY);
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }, 800);
  };

  const getCompIcon = (key: string) => {
    switch(key) {
      case 'modeling': return <BarChart3 size={14} />;
      case 'data': return <Database size={14} />;
      case 'lean': return <Lightbulb size={14} />;
      case 'finance': return <Coins size={14} />;
      case 'leadership': return <Users size={14} />;
      case 'optimization': return <Cpu size={14} />;
      default: return <Terminal size={14} />;
    }
  };

  return (
    <div className={`h-screen w-screen bg-[#020617] flex flex-col font-sans overflow-hidden text-slate-100 selection:bg-blue-500/30 relative transition-all duration-700`}>
      
      {/* Reset Smooth Overlay */}
      <div className={`absolute inset-0 z-[100] bg-[#020617] transition-all duration-1000 pointer-events-none flex flex-col items-center justify-center ${isResetting ? 'opacity-100' : 'opacity-0 scale-105'}`}>
        <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-blue-400 font-mono text-[10px] tracking-[1em] animate-pulse uppercase">Initializing Expert Environment...</div>
        </div>
      </div>

      <header className={`flex items-center justify-between px-6 py-3 bg-slate-900/60 border-b border-blue-500/10 z-[60] backdrop-blur-3xl shadow-2xl transition-all duration-700 ${isResetting ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/20">
              <BrainCircuit className="text-blue-400 w-5 h-5" />
            </div>
            <h1 className="text-xs font-black text-white tracking-[0.3em] uppercase">IE EXPERT AUDIT V2.0</h1>
          </div>
          
          <div className="bg-black/40 border border-white/5 px-4 py-1.5 rounded-full flex items-center space-x-3 shadow-inner">
            <TrendingUp size={14} className="text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1 opacity-60">Offer Evaluation</span>
              <span className="text-base font-mono font-bold text-white tracking-tighter leading-none">${currentSalary.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleReset} 
            disabled={isResetting}
            title="重置面试流程"
            className={`p-3 rounded-2xl border transition-all duration-500 active:scale-90 shadow-lg relative overflow-hidden group ${
              isResetting 
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 cursor-wait' 
              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-500/30 hover:shadow-blue-500/10'
            }`}
          >
            <RotateCcw 
              size={16} 
              className={`${isResetting ? 'animate-spin-fast' : 'group-hover:rotate-180 transition-transform duration-700 ease-in-out'}`} 
            />
            {!isResetting && <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-700"></div>}
            {isResetting && <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>}
          </button>
        </div>
      </header>

      <main className={`flex-1 flex overflow-hidden relative transition-all duration-1000 ${isResetting ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
        {/* Sidebar */}
        <div className="w-80 xl:w-[420px] bg-slate-950/20 border-r border-white/5 p-8 flex flex-col space-y-10 z-20 overflow-y-auto custom-scrollbar">
            <section className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center opacity-70">
                  <LayoutDashboard size={12} className="mr-2" />
                  <span>Competency Profile</span>
                </h3>
                <div className="space-y-5">
                    {Object.entries(scores).map(([key, value]) => (
                        <div key={key} className="space-y-2 group">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest transition-colors group-hover:text-blue-400">
                                <div className="flex items-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                   <span className="mr-2 opacity-50">{getCompIcon(key)}</span>
                                   <span>{key}</span>
                                </div>
                                <span className="text-blue-500 font-mono">{value}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800/30 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className={`h-full transition-all duration-1000 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]`} 
                                  style={{ width: `${value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center opacity-70">
                  <Target size={12} className="mr-2" />
                  <span>Case Study Domains</span>
                </h3>
                <div className="space-y-2 pb-6">
                    {Object.values(InterviewTopic).slice(0, 16).map(topic => (
                        <button 
                          key={topic} 
                          onClick={() => selectTopic(topic)} 
                          className={`w-full text-left text-[10px] p-3.5 rounded-xl border transition-all font-semibold flex items-start space-x-3 group active:scale-[0.98] ${currentTopic === topic ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-lg' : 'border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/5 hover:text-slate-300'}`}
                        >
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${currentTopic === topic ? 'bg-blue-500 animate-pulse' : 'bg-slate-800'}`}></div>
                            <span className="leading-tight">{topic}</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>

        {/* Center: Interviewer */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 z-10">
          <div className="relative mb-12 flex flex-col items-center">
            <InterviewerAvatar isThinking={isThinking} onClick={() => setShowMenu(!showMenu)} />
            {showMenu && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
                 <div className="pointer-events-auto w-[280px] bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl p-5 ring-1 ring-blue-500/20 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between mb-4 px-1 border-b border-white/5 pb-2">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Expert Options</span>
                        <button onClick={() => setShowMenu(false)} className="text-slate-600 hover:text-white p-1">✕</button>
                    </div>
                    <div className="space-y-2">
                        <button onClick={() => triggerAction('answer')} className="w-full text-left p-3.5 bg-white/5 hover:bg-blue-600/10 rounded-2xl transition-all border border-white/5 flex items-center space-x-3">
                            <Maximize2 size={16} className="text-blue-500" />
                            <p className="text-xs font-bold text-white uppercase tracking-wider">查看最优解决方案</p>
                        </button>
                        <button onClick={() => triggerAction('deeper')} className="w-full text-left p-3.5 bg-white/5 hover:bg-slate-800 rounded-2xl transition-all border border-white/5 flex items-center space-x-3">
                            <Zap size={16} className="text-amber-500" />
                            <p className="text-xs font-bold text-white uppercase tracking-wider">深度技术细节拆解</p>
                        </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
          <div className="perspective-table absolute bottom-0 w-full flex justify-center h-48 pointer-events-none opacity-20">
            <div className="table-top w-[90%] bg-gradient-to-t from-[#020617] via-slate-800/30 border-t border-blue-500/10 h-full rounded-b-[150px]"></div>
          </div>
        </div>

        {/* Right: Chat Terminal */}
        <div className="w-[450px] xl:w-[550px] bg-slate-950/60 backdrop-blur-3xl border-l border-white/5 flex flex-col z-30 shadow-2xl relative">
          <div className="p-4 border-b border-white/5 flex items-center bg-black/20 justify-between">
             <div className="flex items-center text-slate-500 space-x-2">
                <Terminal size={14} className="text-blue-500" />
                <span className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase">Interview_Stream</span>
             </div>
             <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
             </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'candidate' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-700`}>
                <div className={`mb-3 text-[8px] font-mono uppercase tracking-widest ${msg.role === 'candidate' ? 'text-blue-500' : 'text-slate-500'}`}>
                    {msg.role === 'candidate' ? 'USR_CANDIDATE' : 'SYS_DR_XU'}
                </div>
                <div className={`max-w-[95%] px-6 py-4 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap shadow-xl border ${msg.role === 'candidate' ? 'bg-blue-600/5 text-slate-100 border-blue-500/20' : 'bg-slate-900/40 text-slate-200 border-white/5 shadow-blue-900/10'}`}>
                  {msg.content || (isThinking && idx === messages.length - 1 ? <ThinkingDots /> : null)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-t border-white/5 bg-black/20">
            <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-3 focus-within:border-blue-500/40 transition-all shadow-2xl flex flex-col">
               <textarea
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                 placeholder="输入你的技术汇报..."
                 className="bg-transparent text-slate-200 text-sm p-4 outline-none resize-none min-h-[100px] custom-scrollbar placeholder:opacity-20"
                 disabled={isThinking || isResetting}
               />
               <div className="flex justify-end p-2 border-t border-white/5 mt-2">
                  <button 
                    onClick={handleSend} 
                    disabled={!inputText.trim() || isThinking || isResetting} 
                    className={`group flex items-center space-x-3 px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${inputText.trim() && !isResetting ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                  >
                    <span>提交汇报</span>
                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
        .perspective-table { perspective: 2000px; }
        .table-top { transform: rotateX(70deg); transform-origin: bottom; }
        
        @keyframes soft-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); filter: brightness(1); }
          50% { opacity: 1; transform: scale(1.05); filter: brightness(1.3); }
        }
        .animate-soft-pulse {
          animation: soft-pulse 4s ease-in-out infinite;
        }

        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(1080deg); }
        }
        .animate-spin-fast {
          animation: spin-fast 1.2s cubic-bezier(0.65, 0, 0.35, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
