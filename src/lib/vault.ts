import { supabase } from '@/lib/supabase';

export interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  logged_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface VaultEntryInput {
  title: string;
  username: string;
  password: string;
}

export type VaultEntryPatch = Partial<VaultEntryInput> & Partial<Pick<VaultEntry, 'logged_in'>>;

const COLUMNS = 'id, title, username, password, logged_in, created_at, updated_at';

export async function fetchEntries(): Promise<VaultEntry[]> {
  const { data, error } = await supabase
    .from('vault_entries')
    .select(COLUMNS)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    throw new Error('Không thể tải danh sách tài khoản. Vui lòng thử lại.');
  }
  return data ?? [];
}

export async function createEntry(input: VaultEntryInput): Promise<VaultEntry> {
  const { data, error } = await supabase
    .from('vault_entries')
    .insert(input)
    .select(COLUMNS)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Không thể lưu tài khoản. Vui lòng thử lại.');
  }
  return data;
}

export async function updateEntry(
  id: string,
  input: VaultEntryPatch,
): Promise<VaultEntry> {
  const { data, error } = await supabase
    .from('vault_entries')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(COLUMNS)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Không thể cập nhật tài khoản. Vui lòng thử lại.');
  }
  return data;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from('vault_entries').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Không thể xoá tài khoản. Vui lòng thử lại.');
  }
}

export async function deleteAllEntries(): Promise<void> {
  const { error } = await supabase
    .from('vault_entries')
    .delete()
    .not('id', 'is', null);

  if (error) {
    console.error(error);
    throw new Error('Không thể xoá tất cả tài khoản. Vui lòng thử lại.');
  }
}
