import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Fingerprint } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AuthCardProps {
  type: 'login' | 'register' | 'reset';
  email: string;
  setEmail: (email: string) => void;
  password?: string;
  setPassword?: (password: string) => void;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  onToggleMode: () => void;
  onForgotPassword?: () => void;
  onGoogleLogin?: () => void;
  onBiometricLogin?: () => void;
  biometricType?: string;
  resetSent?: boolean;
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "file:text-foreground placeholder:text-white/30 selection:bg-primary selection:text-primary-foreground bg-white/5 border-white/10 flex h-10 w-full min-w-0 rounded-lg border px-3 py-1 text-base shadow-sm transition-all duration-300 outline-none focus:border-white/20 focus:bg-white/10 text-white md:text-sm pl-10",
        className
      )}
      {...props} />
  )
}

export function AuthCard({
  type,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  onSubmit,
  error,
  onToggleMode,
  onForgotPassword,
  onGoogleLogin,
  onBiometricLogin,
  biometricType = 'Digital',
  resetSent
}: AuthCardProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center px-6">
      {/* Background gradient effect - MotoristAI Blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0057FF]/30 via-[#002B7F]/40 to-black" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Glow spots */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#0057FF]/10 blur-[80px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative group"
        >
          {/* Card Border Light Effect */}
          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
             <motion.div 
                className="absolute top-0 left-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ left: ["-50%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             />
          </div>

          {/* Glass card background */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.05] shadow-2xl overflow-hidden">
            
            {/* Logo and header */}
            <div className="text-center space-y-2 mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-32 h-32 mb-2 flex items-center justify-center"
              >
                <img 
                  src="/assets/img/login_logo.png" 
                  alt="MotoristAI Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,87,255,0.3)]"
                />
              </motion.div>

              <h1 className="text-2xl font-bold text-white tracking-tight">
                MotoristAI
              </h1>
              
              <p className="text-white/60 text-sm">
                {type === 'login' ? 'Entre na sua conta para continuar' : 
                 type === 'register' ? 'Crie sua conta gratuita agora' : 
                 'Redefina sua senha de acesso'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                  focusedInput === "email" ? "text-[#0057FF]" : "text-white/40"
                )} />
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  required
                />
              </div>

              {/* Password - Only for login and register */}
              {(type === 'login' || type === 'register') && (
                <div className="relative">
                  <Lock className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    focusedInput === "password" ? "text-[#0057FF]" : "text-white/40"
                  )} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword?.(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword?.(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Forgot Password Link - Only for login */}
              {type === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-white/40 hover:text-[#0057FF] transition-colors"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || (type === 'reset' && resetSent)}
                className={cn(
                  "w-full h-11 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg",
                  isLoading || (type === 'reset' && resetSent)
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-white text-black hover:bg-white/90 shadow-white/10"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : type === 'reset' && resetSent ? (
                  "E-mail enviado!"
                ) : (
                  <>
                    {type === 'login' ? 'Entrar' : type === 'register' ? 'Criar Conta' : 'Enviar Link'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Social Login Divider */}
            {(type === 'login' || type === 'register') && (onGoogleLogin || onBiometricLogin) && (
              <div className="mt-6 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-transparent text-white/30 uppercase tracking-widest">Ou continue com</span>
                  </div>
                </div>

                {/* Botão de Digital — só aparece no Android quando disponível */}
                {onBiometricLogin && type === 'login' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={onBiometricLogin}
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl border border-[#0057FF]/40 bg-[#0057FF]/10 flex items-center justify-center gap-3 text-[#4D8CFF] transition-all duration-300 hover:border-[#0057FF]/70 hover:bg-[#0057FF]/20 relative overflow-hidden"
                  >
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-[#0057FF]/30"
                      animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <Fingerprint className="w-6 h-6" />
                    <span className="font-medium text-sm">Entrar com {biometricType}</span>
                  </motion.button>
                )}

                {/* Botão Google */}
                {onGoogleLogin && (
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onGoogleLogin}
                    className="w-full h-11 rounded-lg border border-white/10 flex items-center justify-center gap-3 text-white/80 transition-all duration-300 hover:border-white/20"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google</span>
                  </motion.button>
                )}
              </div>
            )}

            {/* Footer / Toggle */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-3">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {type === 'login' ? (
                  <>Não tem uma conta? <span className="text-[#0057FF] font-medium">Cadastre-se</span></>
                ) : type === 'register' ? (
                  <>Já tem uma conta? <span className="text-[#0057FF] font-medium">Faça login</span></>
                ) : (
                  <><span className="text-[#0057FF] font-medium">Voltar para o login</span></>
                )}
              </button>
              
              <p className="text-[10px] text-white/30 px-4 leading-relaxed">
                Ao continuar, você concorda com nossos{' '}
                <Link to="/terms" className="underline hover:text-white/60">Termos de Uso</Link> e{' '}
                <Link to="/privacy" className="underline hover:text-white/60">Privacidade</Link>.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
