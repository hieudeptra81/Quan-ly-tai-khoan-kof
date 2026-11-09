import { useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
import Modal from '@/components/Modal';
import { deleteEntry, type VaultEntry } from '@/lib/vault';

interface DeleteEntryDialogProps {
  entry: VaultEntry;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export default function DeleteEntryDialog({ entry, onClose, onDeleted }: DeleteEntryDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteEntry(entry.id);
      onDeleted(entry.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
      setDeleting(false);
    }
  };

  return (
    <Modal title="Xoá tài khoản" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <TriangleAlert className="h-5 w-5" />
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Bạn có chắc muốn xoá <span className="font-semibold text-slate-900">{entry.title}</span>?
            Hành động này không thể hoàn tác.
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Xoá
          </button>
        </div>
      </div>
    </Modal>
  );
}
