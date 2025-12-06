CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender VARCHAR(20) CHECK (gender IN ('male', 'female')) DEFAULT 'male',
        governorate VARCHAR(100) DEFAULT 'Cairo',
        user_type VARCHAR(20) CHECK (user_type IN ('client', 'super_admin')) DEFAULT 'client',
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        image VARCHAR(150) NOT NULL,
        parent_id INTEGER REFERENCES categories(id)  
      );

      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        category INT REFERENCES categories(id),
        logo VARCHAR(255),
        description TEXT,
        addresses TEXT,
        locations TEXT,
        number VARCHAR(50),
        qr_code VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS offers (
        offer_id SERIAL PRIMARY KEY,
        business_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        offer_price_before DECIMAL(10,2) NOT NULL,
        offer_price_after DECIMAL(10,2),
        category INT REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      );

      CREATE TABLE IF NOT EXISTS scans (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_id INT REFERENCES businesses(id) ON DELETE CASCADE,
        offer_id INT REFERENCES offers(offer_id) ON DELETE CASCADE,
        scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        offer_id INTEGER REFERENCES offers(offer_id),
        user_id INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(offer_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        offer_id INTEGER REFERENCES offers(offer_id),
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        offer_id INTEGER REFERENCES offers(offer_id),
        business_id INT REFERENCES businesses(id),
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        receiver_type VARCHAR(20) CHECK (receiver_type IN ('user', 'business')) NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_points (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_id INT REFERENCES businesses(id),
        offer_id INT REFERENCES offers(offer_id),
        points INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      owner_type VARCHAR(20) CHECK (owner_type IN ('user', 'business')) NOT NULL,
      owner_id INT NOT NULL,
      language VARCHAR(10) DEFAULT 'en',
      notifications BOOLEAN DEFAULT true,
      sounds BOOLEAN DEFAULT true,
      vibrate BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(owner_type, owner_id)
  );

  CREATE TABLE IF NOT EXISTS user_categories (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(user_id, category_id)
);