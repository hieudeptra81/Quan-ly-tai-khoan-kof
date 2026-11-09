import { useState, type FormEvent } from 'react';
import { Loader2, Lock, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Mode = 'signin' | 'signup';

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Email hoặc mật khẩu không đúng.',
  'User already registered': 'Email này đã được đăng ký. Hãy đăng nhập.',
  'Password should be at least 6 characters.': 'Mật khẩu cần có ít nhất 6 ký tự.',
  'Unable to validate email address: invalid format': 'Email không hợp lệ.',
};

const PASSWORD_PATTERN = /^\d{6}$/;

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === 'signup';

  const switchMode = () => {
    setMode(isSignUp ? 'signin' : 'signup');
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    if (isSignUp && !PASSWORD_PATTERN.test(password)) {
      setError('Mật khẩu phải gồm đúng 6 chữ số.');
      return;
    }

    setSubmitting(true);
    const trimmedEmail = email.trim();
    const message = isSignUp
      ? await signUp(trimmedEmail, password)
      : await signIn(trimmedEmail, password);

    if (message) {
      setError(ERROR_MESSAGES[message] ?? 'Đã xảy ra lỗi, vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/25">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Két Mật Khẩu</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isSignUp ? 'Tạo tài khoản để bắt đầu lưu trữ mật khẩu của bạn.' : 'Đăng nhập để xem và quản lý tài khoản của bạn.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@example.com"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Mật khẩu</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                inputMode="numeric"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? 'Gồm đúng 6 chữ số' : 'Nhập mật khẩu'}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            type="button"
            onClick={switchMode}
            className="font-semibold text-teal-700 transition hover:text-teal-800 hover:underline"
          >
            {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
          </button>
        </p>
      </div>
    </div>
  );
}
