/*
# Create vault_entries table (per-user account and password storage)

1. New Tables
- `vault_entries`
  - `id` (uuid, primary key)
  - `user_id` (uuid, owner; defaults to the signed-in user)
  - `title` (text, the label shown for each account)
  - `username` (text, the account name or email)
  - `password` (text, the stored password)
  - `created_at` / `updated_at` (timestamps)

2. Security
- Enable RLS on `vault_entries`.
- Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` only (no anonymous access).
- Each signed-in user can read, add, edit and delete only their own rows.

3. Notes
- Index on `user_id` for fast per-user listing.
- Owner foreign key cascades on account deletion.
*/

CREATE TABLE IF NOT EXISTS vault_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  username text NOT NULL DEFAULT '',
  password text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vault_entries_user_id_idx ON vault_entries (user_id);

ALTER TABLE vault_entries ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON vault_entries TO authenticated;

DROP POLICY IF EXISTS "select_own_vault_entries" ON vault_entries;
CREATE POLICY "select_own_vault_entries" ON vault_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_vault_entries" ON vault_entries;
CREATE POLICY "insert_own_vault_entries" ON vault_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_vault_entries" ON vault_entries;
CREATE POLICY "update_own_vault_entries" ON vault_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_vault_entries" ON vault_entries;
CREATE POLICY "delete_own_vault_entries" ON vault_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
