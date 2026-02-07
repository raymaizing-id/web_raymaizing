// Pricing tiers configuration
const customTiers = [
  { files: 0, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 25, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 50, price: 0, packageName: "Paket Gratis", packageType: "gratis" },
  { files: 100, price: 75000, packageName: "Paket Pro", packageType: "pro" },
  { files: 250, price: 120000, packageName: "Paket Pro", packageType: "pro" },
  { files: 500, price: 180000, packageName: "Paket Pro", packageType: "pro" },
  { files: 750, price: 240000, packageName: "Paket Pro", packageType: "pro" },
  { files: 1000, price: 300000, packageName: "Paket Pro", packageType: "pro" },
  { files: 1500, price: 450000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 2500, price: 600000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 5000, price: 900000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: 10000, price: 1500000, packageName: "Paket Bisnis", packageType: "bisnis" },
  { files: "Unlimited", price: 2000000, packageName: "Paket Bisnis", packageType: "bisnis" },
];

// State
let selectedTier = 3; // Default Pro 100 files
let isAnnual = true;
let isProcessing = false;

// Customer data
const customerData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  city: "",
  postalCode: "",
  agreeToTerms: false,
  subscribeNewsletter: true
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Get tier from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const tier = urlParams.get('tier');
  const annual = urlParams.get('annual');
  
  if (tier) {
    const tierIndex = parseInt(tier);
    if (tierIndex >= 0 && tierIndex < customTiers.length) {
      selectedTier = tierIndex;
    }
  }
  
  if (annual !== null) {
    isAnnual = annual === 'true';
  }
  
  renderForm();
  renderOrderSummary();
  updatePackageName();
});

function updatePackageName() {
  const currentTier = customTiers[selectedTier];
  document.getElementById('packageName').textContent = currentTier.packageName;
}

function calculateAnnualPrice(monthlyPrice) {
  if (monthlyPrice === 0) return 0;
  const yearlyPrice = monthlyPrice * 12;
  const discountedYearlyPrice = Math.round(yearlyPrice * 0.85);
  return Math.round(discountedYearlyPrice / 12);
}

function getDisplayPrice() {
  const currentTier = customTiers[selectedTier];
  return isAnnual ? calculateAnnualPrice(currentTier.price) : currentTier.price;
}

function getTotalPrice() {
  const displayPrice = getDisplayPrice();
  return isAnnual ? displayPrice * 12 : displayPrice;
}

function getSavings() {
  const currentTier = customTiers[selectedTier];
  if (!isAnnual || currentTier.price === 0) return 0;
  const displayPrice = getDisplayPrice();
  return (currentTier.price * 12) - (displayPrice * 12);
}

function renderForm() {
  const form = document.getElementById('subscribeForm');
  form.innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-2">
        <label class="text-sm font-medium">Nama Depan *</label>
        <input
          type="text"
          id="firstName"
          class="input-field"
          placeholder="John"
          required
          onchange="updateCustomerData('firstName', this.value)"
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Nama Belakang *</label>
        <input
          type="text"
          id="lastName"
          class="input-field"
          placeholder="Doe"
          required
          onchange="updateCustomerData('lastName', this.value)"
        />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Email *</label>
      <input
        type="email"
        id="email"
        class="input-field"
        placeholder="john@example.com"
        required
        onchange="updateCustomerData('email', this.value)"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Nomor Telepon *</label>
      <input
        type="tel"
        id="phone"
        class="input-field"
        placeholder="+62 812 3456 7890"
        required
        onchange="updateCustomerData('phone', this.value)"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Nama Perusahaan (Opsional)</label>
      <input
        type="text"
        id="company"
        class="input-field"
        placeholder="PT. Contoh Indonesia"
        onchange="updateCustomerData('company', this.value)"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Alamat Lengkap *</label>
      <input
        type="text"
        id="address"
        class="input-field"
        placeholder="Jl. Contoh No. 123"
        required
        onchange="updateCustomerData('address', this.value)"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-2">
        <label class="text-sm font-medium">Kota *</label>
        <input
          type="text"
          id="city"
          class="input-field"
          placeholder="Jakarta"
          required
          onchange="updateCustomerData('city', this.value)"
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Kode Pos *</label>
        <input
          type="text"
          id="postalCode"
          class="input-field"
          placeholder="12345"
          required
          onchange="updateCustomerData('postalCode', this.value)"
        />
      </div>
    </div>

    <div class="space-y-3 pt-2">
      <div class="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms"
          class="w-4 h-4 rounded border-gray-600 bg-gray-800 mt-1"
          required
          onchange="updateCustomerData('agreeToTerms', this.checked)"
        />
        <label for="terms" class="text-sm leading-relaxed text-gray-300">
          Saya setuju dengan
          <a href="#" class="text-blue-400 hover:underline">Syarat & Ketentuan</a>
          dan
          <a href="#" class="text-blue-400 hover:underline">Kebijakan Privasi</a>
        </label>
      </div>

      <div class="flex items-start space-x-3">
        <input
          type="checkbox"
          id="newsletter"
          class="w-4 h-4 rounded border-gray-600 bg-gray-800 mt-1"
          checked
          onchange="updateCustomerData('subscribeNewsletter', this.checked)"
        />
        <label for="newsletter" class="text-sm leading-relaxed text-gray-300">
          Saya ingin menerima update produk dan penawaran khusus via email
        </label>
      </div>
    </div>
  `;
}

function renderOrderSummary() {
  const currentTier = customTiers[selectedTier];
  const displayPrice = getDisplayPrice();
  const totalPrice = getTotalPrice();
  const savings = getSavings();
  const ppn = Math.round(totalPrice * 0.11);
  const grandTotal = Math.round(totalPrice * 1.11);
  
  const packageIcon = currentTier.packageType === 'gratis' ? '🎉' : 
                      currentTier.packageType === 'pro' ? '⚡' : '🚀';
  
  const badgeClass = currentTier.packageType === 'gratis' ? 'badge-gratis' :
                     currentTier.packageType === 'pro' ? 'badge-pro' : 'badge-bisnis';
  
  const summary = document.getElementById('orderSummary');
  summary.innerHTML = `
    <div class="space-y-4">
      <!-- Package Info -->
      <div class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
        <div class="text-2xl">${packageIcon}</div>
        <div class="flex-1">
          <h3 class="font-semibold">${currentTier.packageName}</h3>
          <p class="text-sm text-gray-400">
            ${typeof currentTier.files === 'number' ? currentTier.files.toLocaleString() : currentTier.files} tokenize per bulan
          </p>
        </div>
        <div class="package-badge ${badgeClass}">
          ${currentTier.packageType === 'pro' ? '⭐ Populer' : 
            currentTier.packageType === 'gratis' ? 'Gratis' : 'Enterprise'}
        </div>
      </div>

      <!-- Billing Cycle -->
      <div class="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
        <span class="text-sm">Siklus Penagihan:</span>
        <div class="flex items-center gap-2">
          <button
            onclick="toggleBillingCycle(false)"
            class="px-3 py-1 rounded text-sm ${!isAnnual ? 'bg-blue-500 text-white' : 'text-gray-400'}"
          >
            Bulanan
          </button>
          <button
            onclick="toggleBillingCycle(true)"
            class="px-3 py-1 rounded text-sm flex items-center gap-1 ${isAnnual ? 'bg-blue-500 text-white' : 'text-gray-400'}"
          >
            Tahunan
            <span class="text-xs bg-green-500 text-white px-1 py-0.5 rounded">-15%</span>
          </button>
        </div>
      </div>

      <div class="border-t border-gray-700 my-4"></div>

      <!-- Price Breakdown -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span>Harga ${isAnnual ? 'Tahunan' : 'Bulanan'}:</span>
          <span>Rp${totalPrice.toLocaleString()}</span>
        </div>
        
        ${savings > 0 ? `
        <div class="flex justify-between text-sm text-green-400">
          <span>Hemat:</span>
          <span>-Rp${savings.toLocaleString()}</span>
        </div>
        ` : ''}
        
        <div class="flex justify-between text-sm">
          <span>PPN (11%):</span>
          <span>Rp${ppn.toLocaleString()}</span>
        </div>
      </div>

      <div class="border-t border-gray-700 my-4"></div>

      <!-- Total -->
      <div class="flex justify-between text-lg font-semibold">
        <span>Total:</span>
        <span class="gradient-text">Rp${grandTotal.toLocaleString()}</span>
      </div>

      ${isAnnual ? `
      <div class="text-xs text-gray-400 text-center">
        Ditagih sekaligus untuk 12 bulan
      </div>
      ` : ''}

      <!-- Payment Methods -->
      <div class="mt-6 p-4 bg-gray-800/30 rounded-lg">
        <h3 class="text-sm font-semibold mb-3">Metode Pembayaran</h3>
        <div class="space-y-2 text-xs text-gray-400">
          <div class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>Kartu Kredit/Debit</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>Transfer Bank</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>E-Wallet (GoPay, OVO, DANA)</span>
          </div>
        </div>
      </div>

      <!-- Payment Button -->
      <button
        onclick="handlePayment()"
        id="paymentBtn"
        class="btn-primary"
        ${!customerData.agreeToTerms ? 'disabled' : ''}
      >
        ${currentTier.price === 0 ? 'Aktifkan Paket Gratis' : `Bayar Sekarang - Rp${grandTotal.toLocaleString()}`}
      </button>

      <!-- Security Notice -->
      <div class="p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <div class="text-xs">
            <p class="font-medium text-green-400 mb-1">Pembayaran Aman</p>
            <p class="text-green-300/70">
              Transaksi diproses melalui Midtrans dengan enkripsi SSL 256-bit.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateCustomerData(field, value) {
  customerData[field] = value;
  
  // Update payment button state
  const paymentBtn = document.getElementById('paymentBtn');
  if (paymentBtn) {
    const isValid = customerData.firstName && customerData.lastName && 
                    customerData.email && customerData.phone && 
                    customerData.address && customerData.city && 
                    customerData.postalCode && customerData.agreeToTerms;
    paymentBtn.disabled = !isValid;
  }
}

function toggleBillingCycle(annual) {
  isAnnual = annual;
  renderOrderSummary();
}

async function handlePayment() {
  const currentTier = customTiers[selectedTier];
  
  if (!customerData.agreeToTerms) {
    alert('Harap setujui syarat dan ketentuan terlebih dahulu');
    return;
  }

  if (currentTier.price === 0) {
    alert('Paket gratis berhasil diaktifkan! Anda akan diarahkan ke dashboard.');
    // TODO: Redirect to dashboard
    return;
  }

  const paymentBtn = document.getElementById('paymentBtn');
  paymentBtn.disabled = true;
  paymentBtn.innerHTML = '<div class="spinner mx-auto"></div> Memproses...';

  try {
    const totalPrice = getTotalPrice();
    const grandTotal = Math.round(totalPrice * 1.11);
    
    // Create transaction data
    const transactionData = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        gross_amount: grandTotal
      },
      customer_details: {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
        billing_address: {
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          address: customerData.address,
          city: customerData.city,
          postal_code: customerData.postalCode,
          country_code: "IDN"
        }
      },
      item_details: [{
        id: `${currentTier.packageType}-${currentTier.files}`,
        price: grandTotal,
        quantity: 1,
        name: `${currentTier.packageName} - ${typeof currentTier.files === 'number' ? currentTier.files.toLocaleString() : currentTier.files} tokenize${isAnnual ? ' (Tahunan)' : ' (Bulanan)'}`
      }]
    };

    console.log('Transaction Data:', transactionData);
    
    // TODO: Send to backend to get snap token
    // const response = await fetch('/api/payment/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(transactionData)
    // });
    // const { snap_token } = await response.json();
    
    // For now, simulate snap token
    const snapToken = 'SIMULATED_SNAP_TOKEN_' + Date.now();
    
    // Open Midtrans payment popup
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function(result) {
          console.log('Payment Success:', result);
          alert('Pembayaran berhasil! Akun Anda akan segera diaktifkan.');
          // TODO: Redirect to success page or dashboard
        },
        onPending: function(result) {
          console.log('Payment Pending:', result);
          alert('Pembayaran sedang diproses. Kami akan mengirim konfirmasi via email.');
        },
        onError: function(result) {
          console.log('Payment Error:', result);
          alert('Terjadi kesalahan dalam pembayaran. Silakan coba lagi.');
        },
        onClose: function() {
          console.log('Payment popup closed');
          paymentBtn.disabled = false;
          paymentBtn.innerHTML = `Bayar Sekarang - Rp${grandTotal.toLocaleString()}`;
        }
      });
    } else {
      alert('Sistem pembayaran sedang dimuat. Silakan coba lagi dalam beberapa saat.');
      paymentBtn.disabled = false;
      paymentBtn.innerHTML = `Bayar Sekarang - Rp${grandTotal.toLocaleString()}`;
    }
    
  } catch (error) {
    console.error('Payment Error:', error);
    alert('Terjadi kesalahan. Silakan coba lagi.');
    paymentBtn.disabled = false;
    const grandTotal = Math.round(getTotalPrice() * 1.11);
    paymentBtn.innerHTML = `Bayar Sekarang - Rp${grandTotal.toLocaleString()}`;
  }
}
