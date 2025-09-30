/*
  # Initial Schema Setup for NaijaLaw AI Chat

  1. New Tables
    - `users` - User accounts with role-based access and memory storage
    - `plans` - Subscription plans (Free, Pro, Enterprise) with features and pricing
    - `subscriptions` - User subscription records with Paystack integration
    - `transactions` - Payment transaction history with split payment info
    - `documents` - Legal document storage with embeddings for RAG
    - `chats` - Chat messages with session management and source citations
    - `admin_notifications` - System notifications for different user roles

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure admin functions and user data isolation

  3. Features
    - JSON fields for flexible feature storage and user memory
    - Full-text search capabilities for documents
    - Proper indexing for performance
    - Audit trails for transactions and subscriptions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create enum types
CREATE TYPE user_role AS ENUM ('free', 'pro', 'enterprise', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
CREATE TYPE plan_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE document_type AS ENUM ('pdf', 'docx', 'txt');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  role user_role DEFAULT 'free',
  subscription_id uuid,
  memory jsonb DEFAULT '{}',
  preferences jsonb DEFAULT '{}',
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier plan_tier NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'NGN',
  features jsonb NOT NULL DEFAULT '{}',
  limits jsonb NOT NULL DEFAULT '{}',
  split_account text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plans(id),
  status subscription_status DEFAULT 'pending',
  paystack_subscription_code text,
  paystack_customer_code text,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  next_payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),
  plan_id uuid NOT NULL REFERENCES plans(id),
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'NGN',
  paystack_reference text UNIQUE NOT NULL,
  paystack_transaction_id text,
  split_info jsonb,
  status text DEFAULT 'pending',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type document_type NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  content text,
  metadata jsonb DEFAULT '{}',
  embeddings vector(1536),
  uploaded_by uuid REFERENCES users(id),
  is_public boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message text NOT NULL,
  role message_role NOT NULL,
  sources jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  target_roles user_role[] DEFAULT '{free,pro,enterprise}',
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_paystack_ref ON transactions(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_embeddings ON documents USING ivfflat (embeddings vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_session_id ON chats(session_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);

-- Add foreign key constraint for users.subscription_id
ALTER TABLE users ADD CONSTRAINT fk_users_subscription 
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for plans table
CREATE POLICY "Plans are readable by all authenticated users"
  ON plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage plans"
  ON plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for subscriptions table
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for transactions table
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for documents table
CREATE POLICY "Users can read public documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can upload documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Admins can manage all documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for chat_sessions table
CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for chats table
CREATE POLICY "Users can manage own chats"
  ON chats
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for admin_notifications table
CREATE POLICY "Users can read notifications for their role"
  ON admin_notifications
  FOR SELECT
  TO authenticated
  USING (
    is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ANY(target_roles)
    )
  );

CREATE POLICY "Admins can manage notifications"
  ON admin_notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_notifications_updated_at BEFORE UPDATE ON admin_notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();