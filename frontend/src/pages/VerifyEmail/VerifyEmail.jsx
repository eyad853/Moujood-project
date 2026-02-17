import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Loadiing from '../../components/Loadiing/Loadiing'
import { useUser } from '../../context/userContext';
import { verifyToken , handleResendEmail } from '../../api/auth';

export default function VerifyEmail() {
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [loading , setLoading]=useState(false)
    const [error , setError]=useState('')
    const location =useLocation()
    const email = location.state?.email;
    const [accountType , setAccountType]=useState(location.state?.accountType)
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const {setUser}=useUser()
    console.log('token',token);
    console.log('email',email);
    console.log('accountType', accountType);
    const calledRef = useRef(false);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);



useEffect(()=>{
  if(token && !calledRef.current){
    verifyToken(setLoading , setUser , setAccountType , setError)
    calledRef.current = true;
  }
},[])

if(loading){
  <div className = "fixed inset-0">
    <Loadiing />
  </div>
}

  if(token && !error && !loading){
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="relative w-full max-w-md animate-fade-in-up">
          <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#007a36] via-[#009842] to-[#00b84f]"></div>
            
            <div className="p-8 md:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="w-full max-w-xs h-auto object-contain"
                />
              </div>

              {/* Success icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#009842] blur-md opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-[#009842]/20 backdrop-blur-sm shadow-md">
                    <svg 
                      className="w-12 h-12 text-[#009842]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#007a36] via-[#009842] to-[#00b84f] bg-clip-text text-transparent">
                Email Verified!
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                Thank you for verifying your email address. Your account is now active and ready to use.
              </p>

              {/* Success message box */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-[#009842]/30 rounded-xl p-6 mb-6 text-center shadow-sm">
                <p className="text-[#007a36] font-semibold mb-2">All set!</p>
                <p className="text-gray-700 text-sm">You can now access all features of your account.</p>
              </div>

              {/* Action button */}
              <Link 
                to={accountType==='user'?"/client/feed":"/business/dashboard"}
                className="w-full bg-gradient-to-r from-[#009842] to-[#007a36] hover:from-[#00b84f] hover:to-[#009842] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:shadow-[#009842]/30 flex items-center justify-center gap-2 group"
              >
                Continue
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // If there's a token but verification failed (error state)
  if(token && error){
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="relative w-full max-w-md animate-fade-in-up">
          <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400"></div>
            
            <div className="p-8 md:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="w-full max-w-xs h-auto object-contain"
                />
              </div>

              {/* Error icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 blur-md opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-50 to-red-50 p-5 rounded-2xl border border-red-500/20 backdrop-blur-sm shadow-md">
                    <svg 
                      className="w-12 h-12 text-red-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-red-600">
                Verification Failed
              </h1>

              {/* Error message */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-sm">
                <p className="text-red-800 text-center font-medium mb-2">Oops! Something went wrong</p>
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={()=>{handleResendEmail(setIsResending , setResendSuccess , setCountdown , setError)}}
                  disabled={isResending || resendSuccess || countdown > 0}
                  className="w-full bg-gradient-to-r from-[#009842] to-[#007a36] hover:from-[#00b84f] hover:to-[#009842] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:shadow-[#009842]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isResending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Resend in {countdown}s
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Request New Verification Email
                    </>
                  )}
                </button>

                <Link 
                  to="/signup_as"
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Default state - no token (show verification instructions)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Main container */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#007a36] via-[#009842] to-[#00b84f]"></div>
          
          <div className="p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="w-full max-w-xs h-auto object-contain"
              />
            </div>

            {/* Email icon with animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#009842] blur-md opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-[#009842]/20 backdrop-blur-sm shadow-md">
                  <svg 
                    className="w-12 h-12 text-[#009842] animate-float" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#007a36] via-[#009842] to-[#00b84f] bg-clip-text text-transparent">
              Check Your Email
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              We've sent a verification link to your email address. Click the link to activate your account and get started.
            </p>

            {/* Email display box */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-[#009842]/30 rounded-xl p-4 mb-6 relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#009842]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="text-[#007a36] text-xs uppercase tracking-wider font-semibold mb-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#009842] rounded-full animate-pulse"></div>
                Sent to
              </div>
              <div className="text-gray-900 font-medium break-all relative">
                {email}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-green-50 border-l-4 border-[#009842] rounded-lg p-5 mb-8 backdrop-blur-sm">
              <h3 className="text-[#007a36] font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What to do next
              </h3>
              <ul className="space-y-2">
                {[
                  'Open your email inbox',
                  'Find the verification email (check spam if needed)',
                  'Click the verification link',
                  'Return here once verified'
                ].map((step, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-[#009842]/10 border border-[#009842]/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#009842]"></div>
                      </div>
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleResendEmail}
                disabled={isResending || resendSuccess || countdown > 0}
                className="w-full bg-gradient-to-r from-[#009842] to-[#007a36] hover:from-[#00b84f] hover:to-[#009842] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:shadow-[#009842]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isResending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : resendSuccess ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email Sent!
                  </>
                ) : countdown > 0 ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resend Verification Email
                  </>
                )}
              </button>

              <Link 
                to={accountType==='user'?"/client_sign_up" :"/business_sign_up"}
                className="w-full bg-white hover:bg-gray-50 text-[#009842] font-semibold py-4 px-6 rounded-xl transition-all duration-300 border-2 border-[#009842]/30 hover:border-[#009842]/50 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group shadow-sm"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Use a Different Email
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#009842]/30"></div>
            <span>Secure verification</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#009842]/30"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}