
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Dumbbell, 
  Trash2, 
  ArrowRight, 
  Info, 
  Moon, 
  Sun,
  RefreshCcw,
  Sparkles,
  Activity
} from 'lucide-react';
import { TiltWrapper } from './components/TiltWrapper';
import { BMIHistory } from './components/BMIHistory';
import { BMIRecord, BMIResult, BMICategory } from './types';
import { CATEGORIES } from './constants';

// Fix: Use a casted motion component to bypass typing errors where motion props are not recognized
const MotionDiv = motion.div as any;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: 'Male',
    height: 170,
    weight: 65,
  });
  
  const [result, setResult] = useState<BMIResult | null>(null);
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Fetch records on mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      // In a real environment, this calls the local server.
      // For demo purposes, we fallback to localStorage if server is unavailable.
      const response = await fetch('/api/bmi').catch(() => null);
      if (response && response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        const local = localStorage.getItem('bmi_records');
        if (local) setRecords(JSON.parse(local));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Simulate thinking/animation time
    setTimeout(async () => {
      const heightInMeters = formData.height / 100;
      const bmiValue = formData.weight / (heightInMeters * heightInMeters);
      let category: BMICategory = 'Normal';

      if (bmiValue < 18.5) category = 'Underweight';
      else if (bmiValue >= 18.5 && bmiValue <= 24.9) category = 'Normal';
      else if (bmiValue >= 25 && bmiValue <= 29.9) category = 'Overweight';
      else category = 'Obese';

      const idealLow = 18.5 * (heightInMeters * heightInMeters);
      const idealHigh = 24.9 * (heightInMeters * heightInMeters);

      const newResult: BMIResult = {
        value: Number(bmiValue.toFixed(2)),
        category,
        color: CATEGORIES[category].color,
        tip: CATEGORIES[category].tip,
        idealRange: { min: Number(idealLow.toFixed(1)), max: Number(idealHigh.toFixed(1)) }
      };

      setResult(newResult);
      setIsCalculating(false);

      // Save record
      const newRecord: BMIRecord = {
        id: Date.now(),
        name: formData.name || 'User',
        age: formData.age,
        gender: formData.gender as any,
        height: formData.height,
        weight: formData.weight,
        bmi: newResult.value,
        category: newResult.category,
        created_at: new Date().toISOString()
      };

      try {
        const response = await fetch('/api/bmi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        }).catch(() => null);

        if (response && response.ok) {
          fetchRecords();
        } else {
          // Fallback to local storage if no server
          const updated = [newRecord, ...records].slice(0, 10);
          setRecords(updated);
          localStorage.setItem('bmi_records', JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    }, 800);
  };

  const resetForm = () => {
    setFormData({ name: '', age: 25, gender: 'Male', height: 170, weight: 65 });
    setResult(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans`}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[120px] animate-gradient ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-300'}`}></div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[120px] animate-gradient ${isDarkMode ? 'bg-pink-600' : 'bg-pink-300'}`}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform">
            <Dumbbell className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter">VITALIZE <span className="text-indigo-500">BMI</span></h1>
        </div>

        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-xl glass hover:scale-110 transition-all flex items-center justify-center`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-10 lg:py-20 flex flex-col items-center">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start w-full max-w-6xl">
          
          {/* Form Side */}
          <TiltWrapper className="w-full">
            <MotionDiv 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden ${isDarkMode ? 'dark-glass' : 'glass bg-white/40'}`}
            >
              {/* Header inside card */}
              <div className="mb-10">
                <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
                  Health Assessment
                </h2>
                <p className="text-gray-400">Discover your body composition with our precise 3D calculator.</p>
              </div>

              <form onSubmit={calculateBMI} className="space-y-6">
                <div className="relative group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 px-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900/40 border border-white/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600 text-lg font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 px-1">Age</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-900/40 border border-white/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
                    />
                  </div>
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 px-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-900/40 border border-white/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium appearance-none"
                    >
                      <option className="bg-slate-900" value="Male">Male</option>
                      <option className="bg-slate-900" value="Female">Female</option>
                      <option className="bg-slate-900" value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 px-1">Height (cm)</label>
                    <input 
                      type="number"
                      required
                      min="50"
                      max="250"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-900/40 border border-white/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
                    />
                  </div>
                  <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 px-1">Weight (kg)</label>
                    <input 
                      type="number"
                      required
                      min="10"
                      max="300"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-900/40 border border-white/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    disabled={isCalculating}
                    className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-lg shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <RefreshCcw className="animate-spin w-6 h-6" />
                    ) : (
                      <>
                        Calculate BMI
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 hover:bg-slate-800 transition-all active:scale-95"
                  >
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </button>
                </div>
              </form>
            </MotionDiv>
          </TiltWrapper>

          {/* Results Side */}
          <div className="w-full flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {!result ? (
                <MotionDiv 
                  key="empty"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center h-full text-center p-10"
                >
                  <div className="w-32 h-32 mb-8 bg-indigo-500/10 rounded-full flex items-center justify-center relative">
                    <Calculator className="w-16 h-16 text-indigo-500 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-dashed animate-[spin_10s_linear_infinite]"></div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Ready to Analyze?</h3>
                  <p className="text-gray-400 max-w-sm">Enter your details and click calculate to see your health statistics and personalized tips.</p>
                </MotionDiv>
              ) : (
                <MotionDiv 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden ${isDarkMode ? 'dark-glass' : 'glass bg-white/40'}`}
                >
                  {/* Category Glow Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-40 ${CATEGORIES[result.category].shadow.replace('shadow-', 'bg-')}`}></div>

                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Your Result</h3>
                      <p className="text-gray-400">Analysis for {formData.name}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-black uppercase text-indigo-400">Live Insight</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mb-10">
                    <MotionDiv 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                      className="text-8xl font-black mb-2 font-mono tracking-tighter"
                    >
                      {result.value}
                    </MotionDiv>
                    <MotionDiv 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className={`text-2xl font-extrabold uppercase tracking-widest ${result.color} drop-shadow-[0_0_15px_currentColor]`}
                    >
                      {result.category}
                    </MotionDiv>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-4 bg-slate-900/60 rounded-full mb-10 relative p-1 overflow-hidden">
                    <div className="flex h-full w-full gap-1">
                      <div className="flex-1 bg-blue-500/40 rounded-l-full"></div>
                      <div className="flex-1 bg-green-500/40"></div>
                      <div className="flex-1 bg-yellow-500/40"></div>
                      <div className="flex-1 bg-red-500/40 rounded-r-full"></div>
                    </div>
                    {/* Animated Pointer */}
                    <MotionDiv 
                      initial={{ left: '0%' }}
                      animate={{ left: `${Math.min(Math.max((result.value - 10) * 2, 0), 95)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-1 bottom-1 w-2 bg-white rounded-full shadow-[0_0_10px_white] z-10"
                    ></MotionDiv>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-5 rounded-3xl bg-slate-900/40 border border-white/5">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Ideal Weight</p>
                      <p className="text-xl font-bold">{result.idealRange.min} - {result.idealRange.max} <span className="text-sm text-gray-400">kg</span></p>
                    </div>
                    <div className="p-5 rounded-3xl bg-slate-900/40 border border-white/5">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Target BMI</p>
                      <p className="text-xl font-bold">18.5 - 24.9</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4">
                    <div className="mt-1">
                      <Info className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-indigo-200">Health Recommendation</h4>
                      <p className="text-sm text-indigo-200/70 leading-relaxed">{result.tip}</p>
                    </div>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>

            {/* Quick Stats Card */}
            <div className={`p-6 rounded-[2rem] flex items-center justify-between group ${isDarkMode ? 'dark-glass' : 'glass bg-white/40'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Total Analyzed</h4>
                  <p className="text-sm text-gray-400">Global tracking active</p>
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {records.length > 0 ? records.length : '0'}
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <BMIHistory records={records} loading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-sm">© 2024 Vitalize Health Systems. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
