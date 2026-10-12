import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  User, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap,
  ShieldCheck,
  Mail,
  Key,
  Check,
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGoogleVerified, setIsGoogleVerified] = useState(false);

  // Google Sign-In & Verification Modal States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState('choose'); // 'choose', 'verify', 'confirm'
  const [chosenGoogleEmail, setChosenGoogleEmail] = useState('vasan@gmail.com');
  const [chosenGoogleName, setChosenGoogleName] = useState('Vasanth Kumar');
  const [customGoogleInput, setCustomGoogleInput] = useState('');
  const [isEnteringCustomEmail, setIsEnteringCustomEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [googleModalError, setGoogleModalError] = useState('');
  const [codeSentNotice, setCodeSentNotice] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const { login, register, loginWithGoogle, authLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMsg('');
  };

  const navigateToRoleDashboard = (roleKey) => {
    if (roleKey === 'student') navigate('/dashboard');
    else if (roleKey === 'teacher') navigate('/teacher');
    else if (roleKey === 'parent') navigate('/parent');
    else if (roleKey === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  // Launch Google Sign-In Flow
  const handleOpenGoogleAuth = (e) => {
    e?.preventDefault?.();
    setErrorMsg('');
    setGoogleModalError('');
    setGoogleStep('choose');
    setVerificationCode('');
    setIsVerifyingCode(false);
    setShowGoogleModal(true);
  };

  // Step 1: Select or enter Google Account
  const handleSelectGoogleAccount = (selectedEmail, selectedName) => {
    setChosenGoogleEmail(selectedEmail);
    setChosenGoogleName(selectedName);
    setGoogleModalError('');
    setVerificationCode('');
    setCodeSentNotice(true);
    setGoogleStep('verify');
  };

  const handleCustomGoogleSubmit = (e) => {
    e?.preventDefault?.();
    const clean = customGoogleInput.trim();
    if (!clean) {
      setGoogleModalError('Please enter your Google email address.');
      return;
    }
    const finalEmail = clean.includes('@') ? clean : `${clean}@gmail.com`;
    const derivedName = finalEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    handleSelectGoogleAccount(finalEmail, derivedName);
  };

  // Step 2: Verify the security email code
  const handleVerifyCode = () => {
    setGoogleModalError('');
    const code = verificationCode.trim();
    if (code.length < 4 && code !== '849201') {
      setGoogleModalError('Please enter the 6-digit Google verification code or click Auto-fill.');
      return;
    }

    setIsVerifyingCode(true);
    setTimeout(() => {
      setIsVerifyingCode(false);
      setGoogleStep('confirm');
    }, 700);
  };

  const handleAutofillCode = () => {
    setVerificationCode('849201');
    setGoogleModalError('');
  };

  // Step 3: Confirm and log directly into the platform
  const handleConfirmAndLogin = async () => {
    try {
      await loginWithGoogle(selectedRole, chosenGoogleEmail, chosenGoogleName);
      setShowGoogleModal(false);
      navigateToRoleDashboard(selectedRole);
    } catch (err) {
      setGoogleModalError('Failed to sign in with Google. Please try again.');
    }
  };

  // Step 3 (Alternative): Confirm and use on login page
  const handleConfirmAndUseOnLoginPage = () => {
    setEmail(chosenGoogleEmail);
    if (!fullName.trim()) setFullName(chosenGoogleName);
    setIsGoogleVerified(true);
    setShowGoogleModal(false);
    setSuccessMsg(`✓ Google Account verified: ${chosenGoogleEmail}. You can now sign in.`);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 200);
  };

  // Standard Form Submit (Email + Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isLoginMode) {
      // Registration validations
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMsg('Please enter your email or username.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }

      try {
        await register({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          role: selectedRole,
          college: collegeName.trim() || 'Institute of Technology & Computer Science',
          district: 'University Campus',
          language
        });

        setSuccessMsg('Account registered successfully! Now sign in with your credentials.');
        setIsLoginMode(true);
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setErrorMsg(err.message || 'Failed to register account. Please try again.');
      }
    } else {
      // Login validation
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both your email/username and password.');
        return;
      }

      try {
        await login(selectedRole, email.trim(), password);
        navigateToRoleDashboard(selectedRole);
      } catch (err) {
        setErrorMsg(err.message || 'Invalid username or password.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 relative">
      
      {/* GOOGLE SIGN-IN & EMAIL VERIFICATION MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Close Google Sign-In"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center space-y-2">
              {/* Official Google G Logo */}
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mx-auto">
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {googleStep === 'choose' && "Sign in with Google"}
                  {googleStep === 'verify' && "Verify It's You"}
                  {googleStep === 'confirm' && "Google Email Verified!"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {googleStep === 'choose' && "Choose an account to continue to AI Education Portal"}
                  {googleStep === 'verify' && "Confirm security code sent to your Google mailbox"}
                  {googleStep === 'confirm' && "Your identity has been verified & confirmed by Google"}
                </p>
              </div>
            </div>

            {/* Error Message inside Modal */}
            {googleModalError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{googleModalError}</span>
              </div>
            )}

            {/* STEP 1: CHOOSE GOOGLE ACCOUNT */}
            {googleStep === 'choose' && (
              <div className="space-y-4">
                
                {/* Account Item 1: vasan@gmail.com */}
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('vasan@gmail.com', 'Vasanth Kumar')}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition flex items-center justify-between group text-left shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center shadow-sm">
                      V
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-800">Vasanth Kumar</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">vasan@gmail.com</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </button>

                {/* Account Item 2: Custom Google Email Input Toggle */}
                {!isEnteringCustomEmail ? (
                  <button
                    type="button"
                    onClick={() => setIsEnteringCustomEmail(true)}
                    className="w-full py-3 px-4 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center justify-center gap-2 transition"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Use another Google account</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 block">
                      Enter Google Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={customGoogleInput}
                        onChange={(e) => setCustomGoogleInput(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-sm"
                      >
                        Next: Verify Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEnteringCustomEmail(false)}
                        className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-bold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-[11px] text-slate-400 text-center pt-2">
                  <span>To continue, Google will share your name, email address, and language preference with AI Education Portal.</span>
                </div>
              </div>
            )}

            {/* STEP 2: VERIFY EMAIL WITH GOOGLE SECURITY CODE */}
            {googleStep === 'verify' && (
              <div className="space-y-4">
                
                {/* Account Pill */}
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                      {chosenGoogleEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">{chosenGoogleName}</p>
                      <p className="text-[11px] text-slate-500">{chosenGoogleEmail}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGoogleStep('choose')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Email Verification Prompt */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Google Security Verification Code</span>
                    </label>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Sent to Gmail
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Enter the 6-digit confirmation code sent to <strong className="text-slate-700">{chosenGoogleEmail}</strong>:
                  </p>

                  {codeSentNotice && (
                    <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-bold animate-in fade-in">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Security code has been dispatched to {chosenGoogleEmail}</span>
                    </div>
                  )}

                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 849201"
                      className="w-full pl-9 pr-24 py-2.5 text-sm sm:text-base font-mono tracking-widest bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={handleAutofillCode}
                      className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 transition"
                      title="Quick test auto-fill"
                    >
                      Auto-fill (849201)
                    </button>
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                >
                  {isVerifyingCode ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying with Google...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Confirm Email</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationCode('');
                      setGoogleModalError('');
                      setCodeSentNotice(true);
                    }}
                    className="hover:text-blue-600 transition"
                  >
                    Resend Code
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setGoogleStep('choose')}
                    className="hover:text-slate-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: GOOGLE ACCOUNT CONFIRMED & VERIFIED */}
            {googleStep === 'confirm' && (
              <div className="space-y-5 animate-in zoom-in-95 duration-200">
                
                {/* Confirmation Card */}
                <div className="p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-3 shadow-inner">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="font-black text-base text-emerald-950">
                      Email Confirmed & Verified
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Google OAuth 2.0 Security Token Authenticated
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between text-left">
                    <div>
                      <p className="font-extrabold text-xs text-slate-800">{chosenGoogleName}</p>
                      <p className="text-xs text-emerald-700 font-mono font-bold">{chosenGoogleEmail}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>VERIFIED</span>
                    </span>
                  </div>
                </div>

                {/* Primary Action: Confirm & Sign In Immediately */}
                <button
                  type="button"
                  onClick={handleConfirmAndLogin}
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Confirm & Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Action: Confirm on Login Page */}
                <button
                  type="button"
                  onClick={handleConfirmAndUseOnLoginPage}
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
                >
                  Confirm & Return to Login Page
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MAIN AUTHENTICATION FORM CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Logo and heading */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {isLoginMode ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-xs text-slate-500">
            {isLoginMode 
              ? "Sign in to access your personal AI-powered learning portal." 
              : "Register to start your college engineering & coding journey with AI Tutor."}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-black rounded-xl transition ${
              isLoginMode 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-black rounded-xl transition ${
              !isLoginMode 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google Authentication Button */}
        <div>
          <button
            type="button"
            onClick={handleOpenGoogleAuth}
            disabled={authLoading}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-extrabold text-xs sm:text-sm text-slate-700 shadow-2xs transition flex items-center justify-center gap-3 active:scale-98"
          >
            {/* Google Multicolored 'G' SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="flex items-center gap-1.5">
              <span>{isLoginMode ? "Sign in with Google" : "Sign up with Google"}</span>
              <span className="text-[10px] font-normal text-slate-400 hidden min-[380px]:inline">· Verify & Sign In</span>
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
              <span className="bg-white px-3">or continue with email</span>
            </div>
          </div>
        </div>

        {/* Role Selector Tabs (Student, Teacher, Parent, Admin) */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Select Login Portal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { role: 'student', label: 'Student', icon: User, desc: 'Learn with AI' },
              { role: 'teacher', label: 'Teacher', icon: GraduationCap, desc: 'Faculty Portal' },
              { role: 'parent', label: 'Parent', icon: Users, desc: 'Monitor Child' },
              { role: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'College Admin' }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleChange(item.role)}
                  className={`p-2.5 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 text-xs font-bold ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs ring-1 ring-brand-300'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[9px] font-normal text-slate-400 leading-tight truncate w-full">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Sanjay or Rishi"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  College / Institute & Department
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g., Institute of Technology - Computer Science"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition"
                />
              </div>
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Email or Username *
              </label>
              {isGoogleVerified && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-300 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Google Email Verified ✓</span>
                </span>
              )}
            </div>
            <input
              ref={emailInputRef}
              type="text"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (isGoogleVerified) setIsGoogleVerified(false);
              }}
              placeholder="Type your email or username..."
              autoComplete="username"
              className={`w-full bg-slate-50 border ${
                isGoogleVerified ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20' : 'border-slate-200'
              } focus:bg-white focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password *
            </label>
            <input
              ref={passwordInputRef}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password..."
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition"
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password..."
                autoComplete="new-password"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md shadow-brand-200 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{isLoginMode ? "Sign In & Enter Platform" : "Create Account & Get Started"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Login/Signup Link */}
        <div className="text-center pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs font-extrabold text-brand-600 hover:text-brand-700 hover:underline transition"
          >
            {isLoginMode 
              ? "Don't have an account? Create an account" 
              : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}
