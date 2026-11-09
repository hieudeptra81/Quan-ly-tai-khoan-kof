import { useState, type FormEvent } from 'react';
import { Check, CircleCheck, Circle, Eye, EyeOff, Loader2, Pencil, Trash2, UserRound, X } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { updateEntry, type VaultEntry } from '@/lib/vault';

interface EntryCardProps {
  entry: VaultEntry;
  onEdit: () => void;
  onDelete: () => void;
  onUpdated: (entry: VaultEntry) => void;
}

const MASK = '•'.repeat(10);

export default function EntryCard({ entry, onEdit, onDelete, onUpdated }: EntryCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(entry.title);
  const [savingTitle, setSavingTitle] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [togglingLogin, setTogglingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleToggleLogin = async () => {
    setTogglingLogin(true);
    setLoginError(null);
    try {
      const saved = await updateEntry(entry.id, { logged_in: !entry.logged_in });
      onUpdated(saved);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setTogglingLogin(false);
    }
  };

  const startTitleEdit = () => {
    setTitleDraft(entry.title);
    setTitleError(null);
    setEditingTitle(true);
  };

  const cancelTitleEdit = () => {
    setEditingTitle(false);
    setTitleError(null);
  };

  const handleTitleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = titleDraft.trim();
    if (!nextTitle) {
      setTitleError('Tiêu đề không được để trống.');
      return;
    }
    if (nextTitle === entry.title) {
      cancelTitleEdit();
      return;
    }

    setSavingTitle(true);
    try {
      const saved = await updateEntry(entry.id, { title: nextTitle });
      onUpdated(saved);
      setEditingTitle(false);
    } catch (err) {
      setTitleError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setSavingTitle(false);
    }
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        {editingTitle ? (
          <form onSubmit={handleTitleSave} className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') cancelTitleEdit();
                }}
                aria-label="Tiêu đề tài khoản"
                autoFocus
                className="min-w-0 flex-1 rounded-lg border border-teal-500 px-3 py-1.5 text-base font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
              />
              <button
                type="submit"
                disabled={savingTitle}
                aria-label="Lưu tiêu đề"
                className="rounded-lg bg-teal-600 p-2 text-white transition hover:bg-teal-700 disabled:opacity-60"
              >
                {savingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={cancelTitleEdit}
                aria-label="Huỷ sửa tiêu đề"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {titleError && <p role="alert" className="text-xs text-red-600">{titleError}</p>}
          </form>
        ) : (
          <h3 className="min-w-0 flex-1 truncate pt-1.5 text-base font-semibold text-slate-900" title={entry.title}>
            {entry.title}
          </h3>
        )}

        {!editingTitle && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={startTitleEdit}
              aria-label="Sửa tiêu đề"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Xoá tài khoản"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              <UserRound className="h-3.5 w-3.5" />
              Tài khoản
            </span>
            <CopyButton value={entry.username} label="tài khoản" />
          </div>
          <p className="truncate text-sm text-slate-900" title={entry.username}>
            {entry.username || <span className="text-slate-400">Chưa có</span>}
          </p>
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleToggleLogin}
            disabled={togglingLogin}
            aria-pressed={entry.logged_in}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              entry.logged_in
                ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            {togglingLogin ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : entry.logged_in ? (
              <CircleCheck className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            {entry.logged_in ? 'Đã đăng nhập' : 'Chưa đăng nhập'}
          </button>
          {loginError && <p role="alert" className="text-xs text-red-600">{loginError}</p>}
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              Mật khẩu
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={!entry.password}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
              <CopyButton value={entry.password} label="mật khẩu" />
            </div>
          </div>
          <p className="truncate font-mono text-sm text-slate-900">
            {!entry.password ? (
              <span className="font-sans text-slate-400">Chưa có</span>
            ) : showPassword ? (
              entry.password
            ) : (
              MASK
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
      >
        <Pencil className="h-4 w-4" />
        Sửa tài khoản
      </button>
    </article>
  );
}
