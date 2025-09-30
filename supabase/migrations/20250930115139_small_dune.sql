@@ .. @@
 -- Insert admin notifications
 INSERT INTO admin_notifications (message, target_roles, is_active, expires_at) VALUES
-  ('Welcome to NaijaLaw AI Chat! Start exploring Nigerian legal research with AI assistance.', ARRAY['free', 'pro', 'enterprise'], true, null),
-  ('New Pro features available: Citation Generator and Case Summarizer!', ARRAY['free'], true, '2024-12-31 23:59:59+00'),
-  ('Enterprise users can now access the AI Drafting Assistant.', ARRAY['pro', 'enterprise'], true, null);
+  ('Welcome to NaijaLaw AI Chat! Start exploring Nigerian legal research with AI assistance.', ARRAY['free', 'pro', 'enterprise']::user_role[], true, null),
+  ('New Pro features available: Citation Generator and Case Summarizer!', ARRAY['free']::user_role[], true, '2024-12-31 23:59:59+00'),
+  ('Enterprise users can now access the AI Drafting Assistant.', ARRAY['pro', 'enterprise']::user_role[], true, null);