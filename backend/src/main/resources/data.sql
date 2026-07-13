INSERT INTO folders (id, name) VALUES (1, 'Backend');
INSERT INTO folders (id, name) VALUES (2, 'Frontend');

INSERT INTO documents (id, title, content, folder_id) VALUES
                                                          (1, 'Authentication', 'This document covers how authentication works across the OnboardAI backend.', 1),
                                                          (2, 'JWT', 'JWT is used to issue stateless tokens after login.', 1),
                                                          (3, 'React Basics', 'Covers components, props, and state fundamentals.', 2);