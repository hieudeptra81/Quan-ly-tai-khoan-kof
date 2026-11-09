import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { createEntry, updateEntry, type VaultEntry } from '@/lib/vault';

interface EntryFormModalProps {
  entry?: VaultEntry;
  onClose: () => void;
  onSaved: (entry: VaultEntry) => void;
}

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15';

export default function EntryFormModal({ entry, onClose, onSaved }: EntryFormModalProps) {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [username, setUsername] = useState(entry?.username ?? '');
  const [password, setPassword] = useState(entry?.password ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(entry);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề cho tài khoản.');
      return;
    }

    setSaving(true);
    setError(null);
    const input = { title: title.trim(), username: username.trim(), password };

    try {
      const saved = entry ? await updateEntry(entry.id, input) : await createEntry(input);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Sửa tài khoản' : 'Thêm tài khoản'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="entry-title" className="text-sm font-medium text-slate-700">Tiêu đề</label>
          <input
            id="entry-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Gmail công việc"
            className={INPUT_CLASS}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="entry-username" className="text-sm font-medium text-slate-700">Tài khoản</label>
          <input
            id="entry-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên đăng nhập hoặc email"
            autoComplete="off"
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="entry-password" className="text-sm font-medium text-slate-700">Mật khẩu</label>
          <input
            id="entry-password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            autoComplete="off"
            spellCheck={false}
            className={`${INPUT_CLASS} font-mono`}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Lưu thay đổi' : 'Thêm'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
