# Setup Login & Payment System - Raymaizing

## 📋 Overview

Sistem login dan payment telah diimplementasikan untuk web_raymaizing dengan fitur:
- ✅ Halaman Login/Register dengan social auth (Google, Apple, GitHub)
- ✅ Halaman Subscribe dengan integrasi Midtrans
- ✅ API service untuk autentikasi dan payment
- ✅ Pricing tiers dengan slider interaktif
- ✅ Billing cycle (Monthly/Annual) dengan diskon 15%

## 📁 File Structure

```
web_raymaizing/
├── login.html                          # Halaman login/register
├── subscribe.html                      # Halaman berlangganan
├── assets/
│   ├── css/
│   │   └── subscribe-styles.css        # Styling untuk subscribe page
│   └── js/
│       ├── api.js                      # API service layer
│       └── subscribe.js                # Subscribe page logic
└── SETUP_LOGIN_PAYMENT.md             # Dokumentasi ini
```

## 🚀 Quick Start

### 1. Konfigurasi Midtrans

Edit file `subscribe.html` dan ganti `YOUR_CLIENT_KEY_HERE` dengan Client Key Midtrans Anda:

```html
<script src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key="YOUR_CLIENT_KEY_HERE"></script>
```

**Untuk Production:**
```html
<script src="https://app.midtrans.com/snap/snap.js" 
        data-client-key="YOUR_PRODUCTION_CLIENT_KEY"></script>
```

### 2. Konfigurasi API Endpoint

Edit file `assets/js/api.js` dan update API_URL:

```javascript
const API_URL = 'https://your-api-domain.com/api'; // Update dengan URL API Anda
```

### 3. Test Halaman

Buka browser dan akses:
- Login: `http://localhost:8000/login.html`
- Subscribe: `http://localhost:8000/subscribe.html?tier=3&annual=true`

## 🔐 Authentication Flow

### Login/Register

1. User mengakses `login.html`
2. User dapat login dengan:
   - Email & Password
   - Google OAuth
   - Apple OAuth
   - GitHub OAuth
3. Setelah berhasil, token disimpan di localStorage
4. User diarahkan ke dashboard

### API Integration

```javascript
// Login
const result = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const result = await authAPI.register({
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123',
  password_confirmation: 'password123'
});

// Get User
const user = await authAPI.getUser();

// Logout
await authAPI.logout();
```

## 💳 Payment Flow

### Subscribe Process

1. User memilih paket di pricing section
2. Klik "Dapatkan Paket" → redirect ke `subscribe.html`
3. User mengisi informasi pelanggan
4. Klik "Bayar Sekarang"
5. Midtrans Snap popup muncul
6. User memilih metode pembayaran
7. Setelah berhasil, subscription diaktifkan

### Payment Integration

```javascript
// Create transaction
const transactionData = {
  transaction_details: {
    order_id: 'ORDER-123',
    gross_amount: 100000
  },
  customer_details: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '+62812345678'
  }
};

const result = await paymentAPI.createTransaction(transactionData);

// Open Midtrans Snap
window.snap.pay(result.snap_token, {
  onSuccess: function(result) {
    console.log('Payment success:', result);
  },
  onPending: function(result) {
    console.log('Payment pending:', result);
  },
  onError: function(result) {
    console.log('Payment error:', result);
  }
});
```

## 📊 Pricing Tiers

| Tier | Files | Monthly Price | Annual Price (15% off) |
|------|-------|---------------|------------------------|
| Gratis | 0-50 | Rp0 | Rp0 |
| Pro | 100 | Rp75,000 | Rp63,750/bulan |
| Pro | 250 | Rp120,000 | Rp102,000/bulan |
| Pro | 500 | Rp180,000 | Rp153,000/bulan |
| Pro | 750 | Rp240,000 | Rp204,000/bulan |
| Pro | 1000 | Rp300,000 | Rp255,000/bulan |
| Bisnis | 1500 | Rp450,000 | Rp382,500/bulan |
| Bisnis | 2500 | Rp600,000 | Rp510,000/bulan |
| Bisnis | 5000 | Rp900,000 | Rp765,000/bulan |
| Bisnis | 10000 | Rp1,500,000 | Rp1,275,000/bulan |
| Bisnis | Unlimited | Rp2,000,000 | Rp1,700,000/bulan |

## 🔧 Backend Requirements

### API Endpoints yang Diperlukan

#### Authentication
- `POST /api/register` - Register user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get user data

#### Subscription
- `GET /api/subscriptions` - List subscriptions
- `POST /api/subscriptions/create` - Create subscription
- `GET /api/subscriptions/{id}` - Get subscription detail
- `POST /api/subscriptions/{id}/cancel` - Cancel subscription

#### Payment
- `POST /api/payment/create` - Create Midtrans transaction
- `GET /api/payment/verify/{orderId}` - Verify payment
- `GET /api/payment/status/{orderId}` - Get payment status
- `POST /api/payment/notification` - Midtrans webhook

#### Usage
- `GET /api/usage/current` - Get current usage
- `POST /api/usage/track` - Track usage
- `GET /api/usage/history` - Get usage history

### Database Schema

```sql
-- users table
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- subscriptions table
CREATE TABLE subscriptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  package_type ENUM('gratis', 'pro', 'bisnis') NOT NULL,
  file_limit INT NOT NULL,
  billing_cycle ENUM('monthly', 'annual') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- transactions table
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  subscription_id BIGINT NOT NULL,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  gross_amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(50),
  transaction_status ENUM('pending', 'success', 'failed', 'expired') DEFAULT 'pending',
  snap_token VARCHAR(255),
  midtrans_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

-- usage table
CREATE TABLE usage (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  subscription_id BIGINT NOT NULL,
  files_count INT NOT NULL,
  operation_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);
```

## 🔒 Security Considerations

1. **HTTPS Only**: Pastikan menggunakan HTTPS di production
2. **Token Storage**: Token disimpan di localStorage (consider using httpOnly cookies)
3. **CORS**: Configure CORS di backend untuk allow origin dari domain Anda
4. **Input Validation**: Validate semua input di backend
5. **Rate Limiting**: Implement rate limiting untuk API endpoints
6. **Midtrans Webhook**: Verify signature dari Midtrans notification

## 🧪 Testing

### Test Midtrans Sandbox

Gunakan test cards berikut:

**Success:**
- Card: 4811 1111 1111 1114
- CVV: 123
- Exp: 01/25

**Failure:**
- Card: 4911 1111 1111 1113
- CVV: 123
- Exp: 01/25

### Test Flow

1. Buka `login.html` dan test register/login
2. Buka `subscribe.html?tier=3&annual=true`
3. Isi form customer information
4. Klik "Bayar Sekarang"
5. Test dengan test card di atas

## 📝 Next Steps

1. ✅ Setup backend API (Laravel/Node.js/PHP)
2. ✅ Configure Midtrans account
3. ✅ Setup database
4. ✅ Implement Midtrans webhook handler
5. ✅ Add email notifications
6. ✅ Create dashboard page
7. ✅ Add subscription management
8. ✅ Implement usage tracking

## 🆘 Troubleshooting

### Midtrans Snap tidak muncul
- Pastikan Client Key sudah benar
- Check console untuk error
- Pastikan script Midtrans sudah loaded

### API Error 401
- Check token di localStorage
- Pastikan token belum expired
- Verify API endpoint URL

### CORS Error
- Configure CORS di backend
- Allow origin dari domain frontend

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: support@raymaizing.com
- Documentation: https://docs.raymaizing.com

---

**Last Updated:** February 2026
**Version:** 1.0.0
