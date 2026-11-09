import { useCallback, useEffect, useState } from 'react';
import { KeyRound, Loader2, LogOut, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import DeleteAllEntriesDialog from '@/components/DeleteAllEntriesDialog';
import DeleteEntryDialog from '@/components/DeleteEntryDialog';
import EntryCard from '@/components/EntryCard';
import EntryFormModal from '@/components/EntryFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEntries, type VaultEntry } from '@/lib/vault';

type ActiveDialog =
  | { type: 'create' }
  | { type: 'edit'; entry: VaultEntry }
  | { type: 'delete'; entry: VaultEntry }
  | { type: 'deleteAll' }
  | null;

export default function VaultDashboard() {
  const { session, signOut } = useAuth();
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<ActiveDialog>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setEntries(await fetchEntries());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const upsertEntry = (saved: VaultEntry) => {
    setEntries((prev) =>
      prev.some((entry) => entry.id === saved.id)
        ? prev.map((entry) => (entry.id === saved.id ? saved : entry))
        : [...prev, saved],
    );
    setDialog(null);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    setDialog(null);
  };

  const clearAllEntries = () => {
    setEntries([]);
    setDialog(null);
  };

  const closeDialog = useCallback(() => setDialog(null), []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <KeyRound className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold text-slate-900">Két Mật Khẩu</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-sm text-slate-500 sm:block" title={session?.user.email}>
              {session?.user.email}
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tài khoản của bạn</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              {loading ? 'Đang tải...' : `${entries.length} tài khoản đã lưu`}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {entries.length > 0 && (
              <button
                type="button"
                onClick={() => setDialog({ type: 'deleteAll' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Xoá tất cả
              </button>
            )}
            <button
              type="button"
              onClick={() => setDialog({ type: 'create' })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
            >
              <Plus className="h-4 w-4" />
              Thêm tài khoản
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          </div>
        )}

        {!loading && loadError && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
            <p role="alert" className="text-sm text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadEntries()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        )}

        {!loading && !loadError && entries.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Chưa có tài khoản nào</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Thêm tài khoản đầu tiên để lưu tên đăng nhập và mật khẩu an toàn trong két của bạn.
            </p>
            <button
              type="button"
              onClick={() => setDialog({ type: 'create' })}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              Thêm tài khoản
            </button>
          </div>
        )}

        {!loading && !loadError && entries.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => setDialog({ type: 'edit', entry })}
                onDelete={() => setDialog({ type: 'delete', entry })}
                onUpdated={upsertEntry}
              />
            ))}
          </div>
        )}
      </main>

      {dialog?.type === 'create' && (
        <EntryFormModal onClose={closeDialog} onSaved={upsertEntry} />
      )}
      {dialog?.type === 'edit' && (
        <EntryFormModal entry={dialog.entry} onClose={closeDialog} onSaved={upsertEntry} />
      )}
      {dialog?.type === 'delete' && (
        <DeleteEntryDialog entry={dialog.entry} onClose={closeDialog} onDeleted={removeEntry} />
      )}
      {dialog?.type === 'deleteAll' && (
        <DeleteAllEntriesDialog
          count={entries.length}
          onClose={closeDialog}
          onDeleted={clearAllEntries}
        />
      )}
    </div>
  );
}
