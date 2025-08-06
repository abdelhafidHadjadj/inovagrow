-- =================== Setup DB manuel

--@block Extension pour UUID

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--@block-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  password_hash TEXT, -- peut être NULL si auth via Google uniquement
  name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'user', -- user, admin, editor, etc.
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS 
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  user_agent TEXT,
  ip_address TEXT
);




-- PASSWORD RESETS 

CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL, -- token sécurisé envoyé par email
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);

--  EMAIL VERIFICATION 


CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);


-- OAUTH ACCOUNTS (Google, etc.) 
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL, -- ex: google
  provider_id VARCHAR(255) NOT NULL, -- ex: sub de Google
  email VARCHAR(255),
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_id)
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_html TEXT, -- version HTML du contenu
  content_markdown TEXT, -- contenu brut markdown
  content_html TEXT,     -- contenu rendu HTML
  cover_image_url TEXT,  -- URL de l'image de couverture
  meta_title VARCHAR(255),
  meta_description TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS blog_categories (
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, category_id)
);

CREATE TABLE IF NOT EXISTS blog_tags (
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);





-- Index pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);



-- Index utile pour recherche par slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);


-- Index utile pour recherche par slug
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);



-- Index pour jointures rapides
CREATE INDEX IF NOT EXISTS idx_blog_categories_blog_id ON blog_categories(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_category_id ON blog_categories(category_id);

-- Index pour jointures rapides
CREATE INDEX IF NOT EXISTS idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_tags_tag_id ON blog_tags(tag_id);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trigger_update_blog_timestamp
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();




--@block
CREATE TABLE IF NOT EXISTS conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT DEFAULT 'New chat',
  created_at TIMESTAMPTZ DEFAULT now()
);



--@block
CREATE TABLE IF NOT EXISTS chat_messages (
  id         SERIAL PRIMARY KEY,
  convo_id   UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role       TEXT CHECK (role IN ('user','assistant')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
