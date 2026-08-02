import React, { useState } from 'react'
import { FaArrowLeft, FaXmark } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import Diet from './Diet';

// Lightweight ripple, spawned from the real click position on the primary CTA.
function createRipple(event: React.MouseEvent<HTMLButtonElement>) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple-span';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 600);
}

const CHECKLIST_ITEMS = [
  'يتم حساب السعرات تلقائياً',
  'يمكنك تعديل النظام في أي وقت',
  'يعتمد على بياناتك الشخصية',
];

const HOW_IT_WORKS_STEPS = [
  'بنسألك عن طولك ووزنك وهدفك.',
  'بنحسب احتياجك اليومي من السعرات والبروتين تلقائياً.',
  'تقدر تعدّل الوجبات والمقادير براحتك في أي وقت.',
];

const FoodPage = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const IsThere_A_Diet: string | null = localStorage.getItem('Diet') || null;
  const IsValid = IsThere_A_Diet ? (JSON.parse(IsThere_A_Diet) && IsThere_A_Diet.length > 130) : null;

  return (
    <div className='relative show-first page-fade-in min-h-screen max-w-screen p-5 flex flex-col gap-5'>
      <style>{`
        @keyframes pageFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .page-fade-in { animation: pageFadeIn 320ms cubic-bezier(0.22,1,0.36,1); }

        @keyframes slideUpIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUpIn 350ms cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-illustration { animation: floatY 5s ease-in-out infinite; }

        @keyframes checklistIn {
          from { opacity: 0; transform: translateX(6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .checklist-item { animation: checklistIn 300ms cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes gradientDrift {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-3%, 2%) scale(1.06); }
          100% { transform: translate(0,0) scale(1); }
        }
        .gradient-drift { animation: gradientDrift 18s ease-in-out infinite; }

        .btn-press { transition: transform 150ms cubic-bezier(0.22,1,0.36,1), filter 150ms ease; }
        .btn-press:active { transform: scale(0.96); }

        .ripple-span {
          position: absolute;
          border-radius: 9999px;
          background: rgba(255,255,255,0.55);
          transform: scale(0);
          animation: rippleAnim 600ms ease-out;
          pointer-events: none;
        }
        @keyframes rippleAnim { to { transform: scale(2.6); opacity: 0; } }

        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-fade-in { animation: modalFadeIn 0.3s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .page-fade-in, .slide-up, .float-illustration, .checklist-item, .gradient-drift, .modal-fade-in {
            animation: none !important;
          }
          .btn-press { transition: none !important; }
        }
      `}</style>

      {IsValid ? (
        <div className='relative min-h-screen w-full flex flex-col gap-5 '>
          <Diet />
        </div>
      ) : (
        <div className='relative min-h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden'>
          {/* Ambient halo — same palette as before, now drifting slowly instead of pulsing */}
          <div className="absolute top-10 z-0 w-full h-[400px] gradient-drift blur-[100px] bg-gradient-to-r from-blue-600 to-teal-500 opacity-70" />

          <div className='relative z-10 w-full max-w-sm flex flex-col items-center gap-8 py-8'>
            {/* Illustration */}
            <div className="slide-up">
              <svg
                viewBox="0 0 220 180"
                className="float-illustration w-36 h-36"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="bowlGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                <ellipse cx="110" cy="152" rx="66" ry="10" fill="#0ea5e9" opacity="0.12" />
                <path d="M40 92 Q40 142 110 142 Q180 142 180 92 Z" fill="url(#bowlGrad)" />
                <ellipse cx="110" cy="90" rx="70" ry="16" fill="#fde68a" />
                <circle cx="85" cy="84" r="14" fill="#4ade80" />
                <circle cx="120" cy="78" r="16" fill="#fb7185" />
                <circle cx="147" cy="88" r="12" fill="#fbbf24" />
                <path d="M93 56 Q98 42 93 28" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.45" />
                <path d="M114 52 Q119 38 114 24" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.45" />
              </svg>
            </div>

            {/* Title + subtitle */}
            <div className="slide-up flex flex-col gap-2 text-center" style={{ animationDelay: '60ms' }}>
              <h1 className="dark:text-white text-gray-800 text-3xl font-black">
                ابدأ رحلتك الغذائية 🍽️
              </h1>
              <p className="dark:text-gray-300 text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                أنشئ أول نظام غذائي مخصص لك خلال أقل من دقيقة.
              </p>
            </div>

            {/* Helper checklist card */}
            <div
              className="slide-up w-full dark:bg-black/20 bg-white/70 dark:border-2 dark:border-gray-600/20 border border-gray-200/70 backdrop-blur-sm rounded-3xl p-5 flex flex-col gap-3"
              style={{ animationDelay: '120ms' }}
            >
              {CHECKLIST_ITEMS.map((item, i) => (
                <div
                  key={item}
                  className="checklist-item flex items-center gap-2.5"
                  style={{ animationDelay: `${180 + i * 70}ms` }}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-bold">
                    ✔
                  </span>
                  <span className="text-sm dark:text-gray-200 text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Primary CTA + secondary action */}
            <div className="slide-up w-full flex flex-col items-center gap-3" style={{ animationDelay: '180ms' }}>
              <button
                onMouseDown={createRipple}
                onClick={() => navigate('/MKADiet')}
                className="btn-press relative overflow-hidden flex items-center justify-center gap-2 bg-linear-120 from-orange-400 to-amber-300 px-8 py-4 text-white w-full rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/20 outline-swealing2"
              >
                ابدأ إنشاء نظامي <FaArrowLeft />
              </button>
              <button
                onClick={() => setShowHowItWorks(true)}
                className="text-sm font-semibold dark:text-gray-400 text-gray-500 hover:dark:text-gray-200 hover:text-gray-700 transition-colors underline-offset-4 hover:underline"
              >
                كيف يعمل النظام؟
              </button>
            </div>

            {/* Motivation card */}
            <div
              className="slide-up w-full dark:bg-black/20 bg-white/70 dark:border-2 dark:border-gray-600/20 border border-gray-200/70 backdrop-blur-sm rounded-3xl p-5"
              style={{ animationDelay: '240ms' }}
            >
              <p className="text-sm font-bold dark:text-white text-gray-800 mb-2">⭐ لماذا أبدأ؟</p>
              <ul className="flex flex-col gap-1.5 text-sm dark:text-gray-300 text-gray-600">
                <li>• يوفر عليك حساب السعرات يدوياً</li>
                <li>• يساعدك على الوصول لهدفك</li>
                <li>• ينظم وجباتك تلقائياً</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* "How it works" explanation modal */}
      {showHowItWorks && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/40 bg-black/20 backdrop-blur-sm p-4 modal-fade-in"
          onClick={() => setShowHowItWorks(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark:bg-gray-900/90 bg-white dark:border-2 dark:border-gray-600/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold dark:text-white text-gray-800">كيف يعمل النظام؟</h3>
              <button onClick={() => setShowHowItWorks(false)} className="text-gray-400 hover:text-gray-200">
                <FaXmark size={18} />
              </button>
            </div>
            <ol className="flex flex-col gap-3">
              {HOW_IT_WORKS_STEPS.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm dark:text-gray-300 text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setShowHowItWorks(false)}
              className="btn-press w-full mt-5 py-3 rounded-xl font-bold text-sm dark:bg-gray-700/70 bg-slate-100 dark:text-gray-200 text-slate-700"
            >
              تمام، فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodPage
