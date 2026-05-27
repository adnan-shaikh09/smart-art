-- Smart Art Database Schema
-- Auto-initialized by Docker on first run

CREATE DATABASE IF NOT EXISTS smartart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartart_db;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  short_desc VARCHAR(300),
  icon VARCHAR(100),
  image_url VARCHAR(500),
  features JSON,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  is_featured TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  client_business VARCHAR(150),
  client_location VARCHAR(100),
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  avatar_url VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  business_name VARCHAR(150),
  service_type VARCHAR(100),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stats table (for animated counters)
CREATE TABLE IF NOT EXISTS stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value INT NOT NULL,
  suffix VARCHAR(20),
  icon VARCHAR(100),
  sort_order INT DEFAULT 0
);

-- =============================================
-- Default Data Inserts
-- =============================================

-- Default admin (password: Admin@123)
INSERT INTO admins (username, email, password, name) VALUES
('admin', 'atik@smartart.in', '$2b$10$rQnJ7n8XKpT.XL9mC1IiZO5mYg2gP3k0YWz1Uq4DqE8RvF6LhKp2i', 'Atik Shaikh');

-- Default services
INSERT INTO services (title, description, short_desc, icon, features, sort_order) VALUES
(
  'CNC Cutting Signage',
  'Precision CNC cutting technology delivers flawless signage with intricate designs for shops, malls, and commercial spaces. Our state-of-the-art machinery ensures every cut is pixel-perfect, creating stunning dimensional letters and logos.',
  'High-precision CNC cut signs for commercial establishments',
  'cnc',
  '["Custom shapes & designs", "Multi-material support", "Dimensional lettering", "Weather-resistant finish", "Fast turnaround time"]',
  1
),
(
  'Laser Cutting & Engraving',
  'Ultra-precise laser cutting creates stunning intricate patterns and custom designs on various materials including acrylic, wood, metal, and more. Perfect for decorative panels, logos, and artistic installations.',
  'Intricate laser-cut designs on multiple materials',
  'laser',
  '["Acrylic, wood & metal", "Micro-detail precision", "Custom patterns & logos", "Etching & engraving", "Architectural installations"]',
  2
),
(
  'LED Backlit Name Boards',
  'Illuminate your brand 24/7 with our stunning LED backlit name boards. Energy-efficient LEDs ensure your signage stands out day and night with vibrant, consistent lighting that enhances brand visibility.',
  'Glowing LED illuminated signs for maximum visibility',
  'led',
  '["Energy efficient LEDs", "IP65 weatherproof", "Custom color options", "Day & night visibility", "5 year warranty"]',
  3
),
(
  'Hospital & Clinic Boards',
  'Professional, clean, and clear signage for healthcare facilities. We create directional boards, department signs, room indicators, and exterior name boards that meet healthcare standards with easy-to-read designs.',
  'Professional signage solutions for healthcare facilities',
  'hospital',
  '["ADA compliant options", "Braille integration", "Directional systems", "Room & department signs", "Hygienic materials"]',
  4
),
(
  'Restaurant & Hotel Boards',
  'Make a lasting first impression with premium restaurant and hotel signage. From elegant entrance boards to menu displays and interior décor elements, we craft signage that tells your brand story.',
  'Elegant branding boards for F&B and hospitality',
  'restaurant',
  '["Menu board systems", "Entrance signage", "Interior decor elements", "Illuminated displays", "Brand-consistent designs"]',
  5
),
(
  'Shop & Retail Signage',
  'Drive foot traffic and boost brand recognition with eye-catching retail signage. From storefront fascia to window graphics, aisle markers, and promotional displays, we cover all your retail signage needs.',
  'Eye-catching retail & storefront sign solutions',
  'shop',
  '["Storefront fascia boards", "Window graphics", "Aisle markers", "Promotional displays", "Brand identity boards"]',
  6
);

-- Default gallery entries
INSERT INTO gallery (title, description, category, is_featured, sort_order) VALUES
('CNC Acrylic Shop Board', 'Premium acrylic CNC cut board for a clothing boutique in Nashik', 'cnc', 1, 1),
('LED Illuminated Restaurant Sign', 'Glowing amber LED backlit sign for a fine dining restaurant', 'led', 1, 2),
('Laser Cut Metal Logo', 'Intricate stainless steel laser cut logo for a corporate office', 'laser', 1, 3),
('Hospital Name Board', 'Clean professional signage system for Nashik City Hospital', 'hospital', 0, 4),
('Hotel Entrance Board', 'Luxury 3D carved entrance board for Hotel Grand Nashik', 'restaurant', 1, 5),
('Retail Chain Signage', 'Complete signage solution for a multi-outlet retail chain', 'shop', 0, 6);

-- Default testimonials
INSERT INTO testimonials (client_name, client_business, client_location, rating, message) VALUES
('Rajesh Sharma', 'Sharma Medical Center', 'Nashik, MH', 5, 'Smart Art transformed our clinic entrance completely. The LED board they created is not just a sign – it is a landmark. Professional team, perfect execution, and delivered ahead of schedule!'),
('Priya Desai', 'Spice Garden Restaurant', 'Nashik, MH', 5, 'Our restaurant sign from Smart Art gets compliments from every customer. The laser-cut design is breathtaking, and Atik bhai personally ensured everything was perfect. Highly recommended!'),
('Vikram Patil', 'VP Electronics', 'Nashik, MH', 5, 'The CNC cut board they made for our shop has literally doubled our foot traffic. The quality is outstanding, and the pricing was very fair. Smart Art is the best in Nashik!'),
('Sunita Joshi', 'Little Stars School', 'Nashik, MH', 5, 'We needed creative, colorful boards for our school and Smart Art delivered beyond expectations. The kids love the entrance, parents are impressed, and we could not be happier!'),
('Arun Mehta', 'Hotel Saffron Palace', 'Nashik, MH', 5, 'The entrance board and interior signage Smart Art created for our hotel is absolutely world-class. Every guest asks about it. Worth every rupee invested!');

-- Default stats
INSERT INTO stats (label, value, suffix, icon, sort_order) VALUES
('Projects Completed', 1200, '+', 'projects', 1),
('Happy Clients', 850, '+', 'clients', 2),
('Years Experience', 8, '+', 'years', 3),
('Cities Served', 12, '+', 'cities', 4);

-- Default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('site_name', 'Smart Art', 'text'),
('owner_name', 'Atik Shaikh', 'text'),
('phone_primary', '+91 98765 43210', 'text'),
('phone_secondary', '+91 87654 32109', 'text'),
('email', 'info@smartart.in', 'text'),
('address', 'Smart Art Studio, Near Mahamarga Bus Stand, Nashik, Maharashtra - 422001', 'text'),
('business_hours', 'Mon-Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 4:00 PM', 'text'),
('tagline', 'Crafting Identity. Illuminating Brands.', 'text'),
('about_short', 'Nashik''s premier signage studio specializing in CNC cutting, laser engraving, and LED illuminated boards for businesses across all industries.', 'text'),
('google_maps_url', 'https://maps.google.com/?q=Nashik,Maharashtra,India', 'text'),
('whatsapp', '+919876543210', 'text');

-- Additional settings for email notifications
INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type) VALUES
('admin_notify_email', 'atik@smartart.in', 'text'),
('smtp_host', '', 'text'),
('smtp_port', '587', 'text'),
('smtp_user', '', 'text'),
('smtp_pass', '', 'password'),
('smtp_from_name', 'Smart Art Website', 'text');
