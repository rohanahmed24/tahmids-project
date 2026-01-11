import mysql, { RowDataPacket } from 'mysql2/promise';

// Types for better type safety
// used directly in class

interface SamplePost {
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  featured: boolean;
  views: number;
  date: string;
  accent_color: string;
}

// Configuration with validation
class DatabaseSetup {
  private connection: mysql.Connection | null = null;

  private validateEnvironment(): void {
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.warn("Missing environment variables: " + missingVars.join(', '));
      console.warn('Using default values - not recommended for production!');
    }
  }

  private async createConnection(): Promise<mysql.Connection> {
    this.validateEnvironment();

    const port = parseInt(process.env.DB_PORT || '3306');
    if (isNaN(port) || port <= 0 || port > 65535) {
      throw new Error(`Invalid DB_PORT: ${process.env.DB_PORT} `);
    }

    return await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'project_1',
      charset: 'utf8mb4',
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : undefined
    });
  }

  private async createUsersTable(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  image VARCHAR(500),
  email_verified TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email(email),
  INDEX idx_role(role)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
  `);
  }

  private async createPostsTable(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS posts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    subtitle VARCHAR(500),
    content LONGTEXT,
    excerpt TEXT,
    category VARCHAR(100) NOT NULL,
    author_id INT,
    author VARCHAR(255) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    cover_image VARCHAR(500),
    video_url VARCHAR(500),
    topic_slug VARCHAR(500),
    accent_color VARCHAR(7) DEFAULT '#3B82F6',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_slug(slug),
    INDEX idx_category(category),
    INDEX idx_featured(featured),
    INDEX idx_published(published),
    INDEX idx_date(date),
    FULLTEXT idx_search(title, content, excerpt)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
    `);
  }

  private async createMediaTable(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS media(
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      size INT NOT NULL,
      path VARCHAR(500) NOT NULL,
      alt_text VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_filename(filename),
      INDEX idx_mime_type(mime_type)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
      `);
  }

  private async createSessionsTable(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions(
        id VARCHAR(255) PRIMARY KEY,
        user_id INT NOT NULL,
        expires TIMESTAMP NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_session_token(session_token),
        INDEX idx_user_id(user_id)
      ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
        `);
  }

  private async createAccountsTable(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts(
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          type VARCHAR(50) NOT NULL,
          provider VARCHAR(50) NOT NULL,
          provider_account_id VARCHAR(255) NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INT,
          token_type VARCHAR(50),
          scope TEXT,
          id_token TEXT,
          session_state VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_provider_account(provider, provider_account_id),
          INDEX idx_user_id(user_id)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
          `);
  }

  private async createSettingsTable(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS settings(
            id INT AUTO_INCREMENT PRIMARY KEY,
            key_name VARCHAR(100) UNIQUE NOT NULL,
            value TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_key_name(key_name)
          ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
            `);
  }

  private async createAllTables(): Promise<void> {
    const tables = [
      { name: 'users', fn: () => this.createUsersTable() },
      { name: 'posts', fn: () => this.createPostsTable() },
      { name: 'media', fn: () => this.createMediaTable() },
      { name: 'sessions', fn: () => this.createSessionsTable() },
      { name: 'accounts', fn: () => this.createAccountsTable() },
      { name: 'settings', fn: () => this.createSettingsTable() }
    ];

    for (const table of tables) {
      try {
        await table.fn();
        console.log(`✅ Table '${table.name}' created successfully`);
      } catch (error) {
        console.error(`❌ Failed to create table '${table.name}': `, error);
        throw error;
      }
    }
  }

  private async createDefaultAdmin(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    const adminEmail = 'admin@wisdomia.com';
    const [existingAdmin] = await this.connection.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [adminEmail]
    );

    if (Array.isArray(existingAdmin) && existingAdmin.length === 0) {
      await this.connection.execute(
        'INSERT INTO users (email, name, role) VALUES (?, ?, ?)',
        [adminEmail, 'Admin User', 'admin']
      );
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  }

  private getSamplePosts(): SamplePost[] {
    return [
      {
        title: "Welcome to Wisdomia - Your Digital Magazine",
        slug: "welcome-to-wisdomia",
        subtitle: "Exploring stories that matter in our interconnected world",
        content: "Welcome to Wisdomia, a platform dedicated to storytelling and editorial content. We bring you carefully curated articles across politics, mystery, crime, history, news, and science. Our mission is to provide thoughtful, well-researched content that informs and inspires our readers.",
        excerpt: "Welcome to Wisdomia, a platform dedicated to storytelling and editorial content.",
        category: "News",
        author: "Editorial Team",
        featured: true,
        views: 1250,
        date: "2024-01-12",
        accent_color: "#3B82F6"
      },
      {
        title: "The Future of Digital Journalism",
        slug: "future-of-digital-journalism",
        subtitle: "How technology is reshaping news and storytelling",
        content: "Digital journalism continues to evolve with new technologies and changing reader habits. This article explores the trends shaping the future of news, from AI-assisted reporting to immersive storytelling techniques.",
        excerpt: "Digital journalism continues to evolve with new technologies and changing reader habits.",
        category: "News",
        author: "Sarah Johnson",
        featured: true,
        views: 890,
        date: "2024-01-11",
        accent_color: "#10B981"
      },
      {
        title: "Mysteries of Ancient Civilizations",
        slug: "mysteries-of-ancient-civilizations",
        subtitle: "Uncovering secrets from our distant past",
        content: "Archaeological discoveries continue to reveal fascinating insights about ancient civilizations and their sophisticated societies. From the pyramids of Egypt to the lost cities of the Maya, we explore the enduring mysteries that captivate researchers and the public alike.",
        excerpt: "Archaeological discoveries continue to reveal fascinating insights about ancient civilizations.",
        category: "History",
        author: "Dr. Michael Chen",
        featured: false,
        views: 1456,
        date: "2024-01-10",
        accent_color: "#F59E0B"
      }
    ];
  }

  private async insertSamplePosts(): Promise<void> {
    if (!this.connection) throw new Error('No database connection');

    const [existingPosts] = await this.connection.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM posts');
    const postCount = Array.isArray(existingPosts) && existingPosts.length > 0
      ? existingPosts[0].count : 0;

    if (postCount === 0) {
      const samplePosts = this.getSamplePosts();

      for (const post of samplePosts) {
        await this.connection.execute(`
          INSERT INTO posts(title, slug, subtitle, content, excerpt, category, author, featured, views, date, accent_color)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
          post.title, post.slug, post.subtitle, post.content, post.excerpt,
          post.category, post.author, post.featured, post.views, post.date, post.accent_color
        ]);
      }
      console.log('✅ Sample posts inserted');
    } else {
      console.log('ℹ️ Posts already exist, skipping sample data');
    }
  }

  async setup(): Promise<void> {
    try {
      console.log('🔄 Setting up MariaDB database...');

      this.connection = await this.createConnection();

      await this.createAllTables();
      await this.createDefaultAdmin();
      await this.insertSamplePosts();

      console.log('🚀 MariaDB setup complete!');
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
        this.connection = null;
      }
    }
  }
}

// Main setup function for backward compatibility
async function setupProductionDatabase(): Promise<void> {
  const setup = new DatabaseSetup();
  await setup.setup();
}

if (require.main === module) {
  setupProductionDatabase().catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

export { setupProductionDatabase, DatabaseSetup };