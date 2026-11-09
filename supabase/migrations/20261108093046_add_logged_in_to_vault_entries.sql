/*
# Add login status to vault_entries

1. Modified Tables
- `vault_entries`
  - New column `logged_in` (boolean, default false): marks whether the user is currently logged in to that account.

2. Security
- No policy or grant changes. The existing owner-only policies and table grants already cover the new column.

3. Notes
- Existing rows get `logged_in = false` automatically, so no data is changed or lost.
*/

ALTER TABLE vault_entries ADD COLUMN IF NOT EXISTS logged_in boolean NOT NULL DEFAULT false;
