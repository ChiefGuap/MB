/*
  # Create therapy sessions table

  1. New Tables
    - `therapy_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, nullable)
      - `summary` (text, nullable)
      - `emotions` (text[], stores detected emotions)
      - `transcript` (text[], stores conversation history)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `therapy_sessions` table
    - Add policies for authenticated users to:
      - Read their own sessions
      - Create new sessions
      - Update their own sessions
*/

CREATE TABLE IF NOT EXISTS therapy_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  summary text,
  emotions text[],
  transcript text[],
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own sessions"
  ON therapy_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON therapy_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON therapy_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);