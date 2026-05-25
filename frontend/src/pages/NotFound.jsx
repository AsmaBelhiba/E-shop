import { Link } from 'react-router-dom';
import { Home, Compass, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Container */}
      <div className="max-w-xl w-full text-center space-y-10 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Animated Icon Group */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-32 h-32 bg-white text-blue-600 rounded-[2.5rem] shadow-xl flex items-center justify-center border border-gray-100 relative z-10 hover:rotate-12 transition-transform duration-500">
            <Compass size={56} className="animate-spin-slow" />
          </div>
          {/* Subtle floating background icons */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white text-purple-500 rounded-2xl shadow-lg border border-gray-50 flex items-center justify-center animate-bounce-subtle">
            <HelpCircle size={20} />
          </div>
          {/* Glowing pulse ring */}
          <div className="absolute inset-0 bg-blue-400/20 rounded-[2.5rem] scale-110 blur-xl animate-pulse pointer-events-none" />
        </div>

        {/* 404 Text */}
        <div className="space-y-4">
          <h1 className="text-9xl font-black text-gray-900 tracking-tighter leading-none italic select-none">
            4<span className="text-blue-600">0</span>4
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
            Page Not Found
          </h2>
          <p className="text-gray-400 font-medium text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-200/50 transition-all active:scale-95 group"
          >
            <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Floating coordinates details for geeky aesthetics */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-gray-300 font-bold select-none tracking-widest hidden sm:block">
        SYS_STATUS: 404_NOT_FOUND // PORT: 5173
      </div>
    </div>
  );
};

export default NotFound;
