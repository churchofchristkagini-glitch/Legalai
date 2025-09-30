/*
  # Seed Initial Data for NaijaLaw AI Chat

  1. Subscription Plans
    - Free tier with basic features
    - Pro tier with advanced features
    - Enterprise tier with full features

  2. Admin User
    - Default admin account for system management

  3. Sample Documents
    - Nigerian Constitution and key legal documents

  4. Admin Notifications
    - Welcome messages and system announcements
*/

-- Insert subscription plans
INSERT INTO plans (name, tier, price, currency, features, limits) VALUES
(
  'Free Plan',
  'free',
  0.00,
  'NGN',
  '{
    "ai_queries": true,
    "basic_search": true,
    "document_upload": true,
    "chat_sessions": true,
    "mobile_access": true
  }',
  '{
    "monthly_queries": 100,
    "storage_gb": 5,
    "documents": 10,
    "chat_sessions": 50
  }'
),
(
  'Pro Plan',
  'pro',
  15000.00,
  'NGN',
  '{
    "ai_queries": true,
    "advanced_search": true,
    "internet_search": true,
    "citation_generator": true,
    "case_summarizer": true,
    "headnote_generator": true,
    "case_brief_generator": true,
    "case_comparison": true,
    "statute_navigator": true,
    "export_pdf": true,
    "export_docx": true,
    "collaboration": true,
    "priority_support": true
  }',
  '{
    "monthly_queries": -1,
    "storage_gb": 50,
    "documents": 500,
    "chat_sessions": -1,
    "team_members": 5
  }'
),
(
  'Enterprise Plan',
  'enterprise',
  50000.00,
  'NGN',
  '{
    "ai_queries": true,
    "advanced_search": true,
    "internet_search": true,
    "citation_generator": true,
    "case_summarizer": true,
    "headnote_generator": true,
    "case_brief_generator": true,
    "case_comparison": true,
    "statute_navigator": true,
    "precedent_finder": true,
    "precedent_timeline": true,
    "statute_evolution": true,
    "team_collaboration": true,
    "role_permissions": true,
    "shared_folders": true,
    "ai_drafting": true,
    "offline_mode": true,
    "voice_input": true,
    "analytics_dashboard": true,
    "white_label": true,
    "export_pdf": true,
    "export_docx": true,
    "dedicated_support": true
  }',
  '{
    "monthly_queries": -1,
    "storage_gb": -1,
    "documents": -1,
    "chat_sessions": -1,
    "team_members": -1
  }'
);

-- Insert admin user (password should be changed immediately)
-- Note: In production, this should be created through Supabase Auth
INSERT INTO users (email, name, password_hash, role, memory, preferences) VALUES
(
  'admin@naijalaw.ai',
  'System Administrator',
  '$2b$10$rQZ8qVZ8qVZ8qVZ8qVZ8qO', -- placeholder hash, replace with actual
  'admin',
  '{
    "setup_completed": false,
    "last_login": null,
    "preferences_set": false
  }',
  '{
    "theme": "light",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "system": true
    },
    "dashboard": {
      "default_view": "overview",
      "charts_enabled": true
    }
  }'
);

-- Insert sample legal documents
INSERT INTO documents (title, type, file_url, content, metadata, is_public, tags) VALUES
(
  'Constitution of the Federal Republic of Nigeria 1999',
  'pdf',
  '/documents/constitution-1999.pdf',
  'The Constitution of the Federal Republic of Nigeria 1999 is the supreme law of Nigeria...',
  '{
    "year": 1999,
    "category": "constitutional_law",
    "jurisdiction": "federal",
    "language": "english",
    "pages": 200,
    "chapters": 8
  }',
  true,
  ARRAY['constitution', 'fundamental_rights', 'federal_structure', 'governance']
),
(
  'Evidence Act 2011',
  'pdf',
  '/documents/evidence-act-2011.pdf',
  'An Act to repeal the Evidence Act Cap. E14 Laws of the Federation of Nigeria 2004...',
  '{
    "year": 2011,
    "category": "evidence_law",
    "jurisdiction": "federal",
    "language": "english",
    "sections": 258
  }',
  true,
  ARRAY['evidence', 'procedure', 'admissibility', 'testimony']
),
(
  'Criminal Code Act',
  'pdf',
  '/documents/criminal-code-act.pdf',
  'An Act to establish a Code of Criminal Law for the Southern States of Nigeria...',
  '{
    "category": "criminal_law",
    "jurisdiction": "southern_states",
    "language": "english",
    "chapters": 45
  }',
  true,
  ARRAY['criminal_law', 'offences', 'punishment', 'procedure']
),
(
  'Companies and Allied Matters Act 2020',
  'pdf',
  '/documents/cama-2020.pdf',
  'An Act to repeal the Companies and Allied Matters Act Cap. C20 Laws of the Federation...',
  '{
    "year": 2020,
    "category": "corporate_law",
    "jurisdiction": "federal",
    "language": "english",
    "parts": 8
  }',
  true,
  ARRAY['corporate_law', 'companies', 'business', 'registration']
);

-- Insert admin notifications
INSERT INTO admin_notifications (message, target_roles, expires_at) VALUES
(
  'Welcome to NaijaLaw AI Chat! Start by exploring our comprehensive database of Nigerian legal documents and case law.',
  ARRAY['free', 'pro', 'enterprise'],
  now() + interval '30 days'
),
(
  'New Feature: Advanced case comparison is now available for Pro and Enterprise users. Compare cases side-by-side with AI-powered analysis.',
  ARRAY['pro', 'enterprise'],
  now() + interval '14 days'
),
(
  'System Maintenance: Scheduled maintenance on Sunday 2AM - 4AM WAT. Some features may be temporarily unavailable.',
  ARRAY['free', 'pro', 'enterprise', 'admin'],
  now() + interval '7 days'
);

-- Create a sample chat session and messages for demo purposes
DO $$
DECLARE
  admin_user_id uuid;
  sample_session_id uuid;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id FROM users WHERE email = 'admin@naijalaw.ai';
  
  -- Create sample chat session
  INSERT INTO chat_sessions (user_id, title, metadata) 
  VALUES (
    admin_user_id, 
    'Welcome Chat Session',
    '{"demo": true, "created_by": "system"}'
  ) RETURNING id INTO sample_session_id;
  
  -- Insert sample chat messages
  INSERT INTO chats (user_id, session_id, message, role, sources, metadata) VALUES
  (
    admin_user_id,
    sample_session_id,
    'Hello! Welcome to NaijaLaw AI Chat. How can I assist you with Nigerian legal research today?',
    'assistant',
    '[]',
    '{"demo": true, "system_message": true}'
  ),
  (
    admin_user_id,
    sample_session_id,
    'What are the fundamental rights guaranteed under the Nigerian Constitution?',
    'user',
    '[]',
    '{"demo": true}'
  ),
  (
    admin_user_id,
    sample_session_id,
    'The Nigerian Constitution of 1999 guarantees several fundamental rights in Chapter IV (Sections 33-46). These include:\n\n1. **Right to Life** (Section 33)\n2. **Right to Dignity of Human Person** (Section 34)\n3. **Right to Personal Liberty** (Section 35)\n4. **Right to Fair Hearing** (Section 36)\n5. **Right to Private and Family Life** (Section 37)\n6. **Right to Freedom of Thought, Conscience and Religion** (Section 38)\n7. **Right to Freedom of Expression and the Press** (Section 39)\n8. **Right to Peaceful Assembly and Association** (Section 40)\n9. **Right to Freedom of Movement** (Section 41)\n10. **Right to Freedom from Discrimination** (Section 42)\n11. **Right to Acquire and Own Immovable Property** (Section 43)\n\nThese rights are enforceable by the courts and form the foundation of civil liberties in Nigeria.',
    'assistant',
    '[
      {
        "title": "Constitution of the Federal Republic of Nigeria 1999",
        "section": "Chapter IV, Sections 33-46",
        "type": "constitutional_provision",
        "relevance": "primary_source"
      }
    ]',
    '{"demo": true, "citations_included": true}'
  );
END $$;