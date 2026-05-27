# 🧸 Toy Story Fan Site - Backend Integration Guide

## 📁 File Structure Overview

```
/workspace/
├── main.html                 # Main fan site page
├── admin-login.html          # Admin login page
├── admin-dashboard.html      # Admin dashboard
├── style.css                 # Main site styles
├── admin-style.css           # Admin panel styles
├── admin-script.js           # Admin panel JavaScript
├── database.sql              # Database schema & seed data
├── config/
│   └── database.php          # Database connection config
└── api/
    ├── login.php             # Login authentication
    ├── logout.php            # Logout handler
    ├── get-stats.php         # Dashboard statistics
    ├── get-movies.php        # Fetch movies
    ├── save-movie.php        # Create/update movie
    ├── delete-movie.php      # Delete movie
    ├── get-characters.php    # Fetch characters
    ├── save-character.php    # Create/update character
    ├── delete-character.php  # Delete character
    ├── search.php            # Search functionality
    └── get-logs.php          # Search logs
```

---

## 🗄️ DATABASE SETUP

### Step 1: Create Database
```bash
mysql -u root -p < database.sql
```

Or manually:
```sql
source /workspace/database.sql;
```

### Step 2: Configure Database Credentials
Edit `config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'toy_story_fan_site');
define('DB_USER', 'your_username');     // Change this
define('DB_PASS', 'your_password');     // Change this
```

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Change the password immediately after first login!**

---

## 🔐 AUTHENTICATION FLOW

### Login Process
1. User enters credentials on `admin-login.html`
2. JavaScript sends POST to `api/login.php`
3. PHP validates against `admins` table
4. Session created on success
5. Redirect to `admin-dashboard.html`

### Session Management
All API endpoints check for valid session:
```php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
```

---

## 📊 API ENDPOINTS

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `api/login.php` | POST | Authenticate admin user |
| `api/logout.php` | GET | Destroy session |

**Login Request:**
```json
{
    "username": "admin",
    "password": "admin123"
}
```

**Login Response:**
```json
{
    "success": true,
    "message": "Login successful! Redirecting...",
    "redirect": "admin-dashboard.html"
}
```

### Dashboard Stats
| Endpoint | Method | Description |
|----------|--------|-------------|
| `api/get-stats.php` | GET | Get dashboard statistics |

**Response:**
```json
{
    "success": true,
    "data": {
        "total_movies": 4,
        "total_characters": 6,
        "last_updated": "2024-01-15 10:30:00",
        "active_sessions": 1
    }
}
```

### Movies CRUD
| Endpoint | Method | Description |
|----------|--------|-------------|
| `api/get-movies.php` | GET | Get all movies (or by ID) |
| `api/save-movie.php` | POST | Create or update movie |
| `api/delete-movie.php` | POST | Delete movie |

**Save Movie Request:**
```json
{
    "title": "Toy Story 5",
    "release_year": 2026,
    "runtime_minutes": 95,
    "rating": "G",
    "tagline": "The adventure continues!",
    "poster_url": "https://..."
}
```

**Delete Movie Request:**
```json
{
    "id": 5
}
```

### Characters CRUD
| Endpoint | Method | Description |
|----------|--------|-------------|
| `api/get-characters.php` | GET | Get all characters (or by ID) |
| `api/save-character.php` | POST | Create or update character |
| `api/delete-character.php` | POST | Delete character |

**Save Character Request:**
```json
{
    "name": "Duke Caboom",
    "role_title": "Canadian Stuntman",
    "quote": "Oh yeah! Duke Caboom rules!",
    "description": "A confident Canadian stuntman action figure...",
    "avatar_url": "https://..."
}
```

### Search & Logs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `api/search.php?q=term` | GET | Search movies & characters |
| `api/get-logs.php?limit=50` | GET | Get search history |

---

## 🔗 FRONTEND INTEGRATION POINTS

### admin-login.html
- Form action removed (handled via AJAX)
- Uses `api/login.php` for authentication
- Shows loading spinner during request
- Displays success/error messages

### admin-dashboard.html
- Tables populated dynamically via:
  - `loadStats()` → `api/get-stats.php`
  - `loadMovies()` → `api/get-movies.php`
  - `loadCharacters()` → `api/get-characters.php`
- Add/Edit forms submit to:
  - `api/save-movie.php`
  - `api/save-character.php`
- Delete buttons call:
  - `api/delete-movie.php`
  - `api/delete-character.php`

### admin-script.js
Key functions already implemented:
```javascript
// Login
await fetch('api/login.php', { method: 'POST', body: JSON.stringify({...}) })

// Load data
loadStats()
loadMovies()
loadCharacters()

// Save data
await fetch('api/save-movie.php', ...)
await fetch('api/save-character.php', ...)

// Delete data
await fetch('api/delete-movie.php', ...)
await fetch('api/delete-character.php', ...)
```

---

## 🎨 CSS INTEGRATION

The admin styles in `admin-style.css` are modular and use existing design variables:

```css
/* Uses existing variables from style.css */
--midnight-blue: #0a1628
--deep-navy: #1a2744
--woody-yellow: #F4C542
--buzz-green: #2ECC71
--warm-gold: #FFD700
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
```

No conflicts with main site styles.

---

## 🚀 DEPLOYMENT CHECKLIST

### Server Requirements
- [ ] PHP 7.4+ with PDO MySQL extension
- [ ] MySQL 5.7+ or MariaDB 10.3+
- [ ] Web server (Apache/Nginx)
- [ ] HTTPS recommended for production

### Setup Steps
1. Upload all files to web server
2. Import `database.sql` into MySQL
3. Update `config/database.php` with credentials
4. Set proper file permissions:
   ```bash
   chmod 644 *.html *.css *.js
   chmod 644 config/database.php
   chmod 644 api/*.php
   ```
5. Test login with default credentials
6. **Change admin password immediately**

### Security Recommendations
1. Change default admin password
2. Use HTTPS in production
3. Implement rate limiting on login
4. Add CSRF protection tokens
5. Sanitize all user inputs (already done via prepared statements)
6. Log failed login attempts
7. Implement session timeout

---

## 🧪 TESTING

### Manual Testing
1. **Login Page**
   - Enter invalid credentials → should show error
   - Enter valid credentials → should redirect to dashboard
   
2. **Dashboard**
   - Verify stats cards show correct counts
   - Check movies table displays all records
   - Check characters table displays all records
   
3. **CRUD Operations**
   - Add new movie → verify appears in table
   - Add new character → verify appears in table
   - Edit existing record → verify changes saved
   - Delete record → verify removed from table
   
4. **Search**
   - Enter search term → verify results appear
   - Check search logs in database

### Browser Console
Check for JavaScript errors during operations.

---

## 📝 CUSTOMIZATION

### Adding New Admin Users
```sql
INSERT INTO admins (username, password_hash) 
VALUES ('newuser', '$2y$10$...hashed_password...');
```

Generate hash with PHP:
```php
echo password_hash('your_password', PASSWORD_DEFAULT);
```

### Changing Password
```sql
UPDATE admins 
SET password_hash = '$2y$10$new_hash_here' 
WHERE username = 'admin';
```

---

## 🆘 TROUBLESHOOTING

### Common Issues

**Database Connection Failed**
- Check credentials in `config/database.php`
- Verify MySQL service is running
- Ensure database exists

**401 Unauthorized Errors**
- Session may have expired
- Check if cookies are enabled
- Verify session_start() is called

**API Returns Empty Data**
- Check database has seed data
- Verify table names match schema
- Check browser console for errors

**Styles Not Loading**
- Verify file paths are correct
- Check browser cache
- Clear cache and reload

---

## 📞 SUPPORT

For issues or questions:
1. Check browser console for JavaScript errors
2. Check PHP error logs
3. Verify database connection
4. Review this integration guide

---

**Built with ❤️ for Toy Story fans everywhere!** 🤠🚀
