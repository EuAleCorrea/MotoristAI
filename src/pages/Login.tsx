import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [isRegistering, setIsRegistering] = useState(false);
 const [isResettingPassword, setIsResettingPassword] = useState(false);
 const [resetSent, setResetSent] = useState(false);
 const navigate = useNavigate();
 const { user } = useAuth();

  useEffect(() => {
  if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

 const handleAuth = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);
 setIsLoading(true);

 try {
 const { error: authError } = isRegistering
 ? await supabase.auth.signUp({ email, password })
 : await supabase.auth.signInWithPassword({ email, password });

 if (authError) throw authError;

  if (!isRegistering) {
  navigate('/dashboard', { replace: true });
 } else {
 setError('Verifique seu email para confirmar o cadastro.');
 }
 } catch (err: any) {
 setError(err.message || 'Erro ao autenticar');
 } finally {
 setIsLoading(false);
 }
 };

 const handleResetPassword = async () => {
   if (!email.trim()) {
     setError('Digite seu email para receber o link de redefinição.');
     return;
   }
   setError(null);
   setIsLoading(true);
   try {
     const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
       redirectTo: `${window.location.origin}/login`,
     });
     if (resetError) throw resetError;
     setResetSent(true);
   } catch (err: any) {
     setError(err.message || 'Erro ao enviar email de redefinição.');
   } finally {
     setIsLoading(false);
   }
 };

 const handleBackToLogin = () => {
   setIsResettingPassword(false);
   setResetSent(false);
   setError(null);
 };

 if (isResettingPassword) {
   return (
     <div
       className="min-h-screen flex flex-col items-center justify-center px-6"
       style={{ backgroundColor: 'var(--ios-bg)' }}
     >
       <div className="w-full max-w-sm space-y-8">
         <div className="text-center space-y-2">
           <div
             className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
             style={{ backgroundColor: 'var(--ios-accent)' }}
           >
             <span className="text-3xl">🔑</span>
           </div>
           <h1 className="text-ios-large-title font-bold" style={{ color: 'var(--ios-text)' }}>
             Redefinir Senha
           </h1>
           <p className="text-ios-subhead" style={{ color: 'var(--ios-text-secondary)' }}>
             {resetSent
               ? 'Verifique seu email para o link de redefinição.'
               : 'Digite seu email para receber o link.'}
           </p>
         </div>

         {error && (
           <div
             className="p-3 rounded-ios text-ios-subhead"
             style={{
               backgroundColor: 'rgba(255, 59, 48, 0.1)',
               color: 'var(--sys-red)',
             }}
           >
             {error}
           </div>
         )}

         {resetSent ? (
           <div
             className="p-4 rounded-ios text-center"
             style={{
               backgroundColor: 'rgba(52, 199, 89, 0.1)',
               color: 'var(--sys-green)',
             }}
           >
             <Mail className="h-8 w-8 mx-auto mb-2" />
             <p className="text-ios-subhead font-medium">
               Email enviado para <strong>{email}</strong>
             </p>
             <p className="text-ios-footnote mt-2">
               Siga as instruções no email para redefinir sua senha.
             </p>
           </div>
         ) : (
           <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4">
             <div className="relative">
               <Mail
                 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                 style={{ color: 'var(--ios-text-tertiary)' }}
               />
               <input
                 id="reset-email"
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Seu email cadastrado"
                 className="ios-input pl-12"
                 required
                 autoComplete="email"
               />
             </div>
             <button
               type="submit"
               disabled={isLoading}
               className="ios-btn"
               style={{ opacity: isLoading ? 0.6 : 1 }}
             >
               {isLoading ? (
                 <Loader2 className="h-5 w-5 animate-spin" />
               ) : (
                 'Enviar Link'
               )}
             </button>
           </form>
         )}

         <div className="text-center">
           <button
             onClick={handleBackToLogin}
             className="inline-flex items-center gap-1 text-ios-subhead"
             style={{ color: 'var(--ios-accent)', minHeight: '44px' }}
           >
             <ArrowLeft className="h-4 w-4" />
             Voltar ao login
           </button>
         </div>
       </div>
     </div>
   );
 }

 return (
 <div
 className="min-h-screen flex flex-col items-center justify-center px-6"
 style={{ backgroundColor: 'var(--ios-bg)' }}
 >
 <div className="w-full max-w-sm space-y-8">
 {/* Logo + Title */}
 <div className="text-center space-y-2">
 <div
 className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
 style={{ backgroundColor: 'var(--ios-accent)' }}
 >
 <span className="text-3xl">🚗</span>
 </div>
 <h1 className="text-ios-large-title font-bold" style={{ color: 'var(--ios-text)' }}>
 MotoristAI
 </h1>
 <p className="text-ios-subhead" style={{ color: 'var(--ios-text-secondary)' }}>
 {isRegistering ? 'Crie sua conta' : 'Entre na sua conta'}
 </p>
 </div>

 {/* Error */}
 {error && (
 <div
 className="p-3 rounded-ios text-ios-subhead"
 style={{
 backgroundColor: 'rgba(255, 59, 48, 0.1)',
 color: 'var(--sys-red)',
 }}
 >
 {error}
 </div>
 )}

 {/* Form */}
 <form onSubmit={handleAuth} className="space-y-4">
 {/* Email */}
 <div className="relative">
 <Mail
 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
 style={{ color: 'var(--ios-text-tertiary)' }}
 />
 <input
 id="login-email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="Email"
 className="ios-input pl-12"
 required
 autoComplete="email"
 />
 </div>

 {/* Password */}
 <div className="relative">
 <Lock
 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
 style={{ color: 'var(--ios-text-tertiary)' }}
 />
 <input
 id="login-password"
 type={showPassword ? 'text' : 'password'}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Senha"
 className="ios-input pl-12 pr-12"
 required
 autoComplete={isRegistering ? 'new-password' : 'current-password'}
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2"
 style={{ color: 'var(--ios-text-tertiary)', minHeight: '24px' }}
 >
 {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
 </button>
 </div>

 {/* Submit */}
 <button
 type="submit"
 disabled={isLoading}
 className="ios-btn"
 style={{ opacity: isLoading ? 0.6 : 1 }}
 >
 {isLoading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 isRegistering ? 'Criar Conta' : 'Entrar'
 )}
 </button>
 </form>

 {/* Toggle auth mode */}
 <div className="text-center space-y-2">
 <button
 onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
 className="text-ios-subhead"
 style={{ color: 'var(--ios-accent)', minHeight: '44px' }}
 >
 {isRegistering ? 'Já tem conta? Entre' : 'Não tem conta? Cadastre-se'}
 </button>
 {!isRegistering && (
 <div>
 <button
 onClick={() => { setIsResettingPassword(true); setError(null); }}
 className="text-ios-footnote"
 style={{ color: 'var(--ios-text-tertiary)', minHeight: '44px' }}
 >
 Esqueceu sua senha?
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}

export default Login;
