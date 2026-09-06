import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, Home, User, UtensilsCrossed, Package, 
  MapPin, History, LogOut, CheckCircle2, Clock, 
  Search, Plus, Edit, Trash2, Settings, BarChart2,
  Users, X, Key, ShieldCheck, CreditCard, QrCode, Banknote,
  Phone, Lock, AlertCircle, Sparkles, Check, RefreshCw
} from 'lucide-react';

const API_BASE = "http://localhost:8080/api";

const INITIAL_FOODS = [
  { id: 1, name: 'Chicken Rice', category: 'FOOD', price: 100, description: 'Flavorful seasoned basmati rice served with spiced chicken.', available: true, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Meals', category: 'FOOD', price: 80, description: 'Full authentic South Indian thali meal with rice and curries.', available: true, imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Curd Rice', category: 'FOOD', price: 50, description: 'Tempered curd rice with mustard seeds, curry leaves, and pickle.', available: true, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Veg Biriyani', category: 'FOOD', price: 60, description: 'Aromatic spiced rice layered with assorted seasonal vegetables.', available: true, imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=500&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Parota', category: 'FOOD', price: 20, description: 'Flaky, layered golden-brown flatbread served with salna (2 pcs).', available: true, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Biscuit', category: 'SNACKS', price: 10, description: 'Crisp butter baked biscuits, packaged.', available: true, imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Ice Cream', category: 'SNACKS', price: 30, description: 'Rich creamy dessert cup in various flavors.', available: true, imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=60' },
  { id: 8, name: 'Chocolates', category: 'SNACKS', price: 20, description: 'Classic dairy chocolate bar.', available: true, imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=60' },
  { id: 9, name: 'Tea', category: 'BEVERAGES', price: 15, description: 'Freshly brewed hot milk tea with cardamom aromatics.', available: true, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60' },
  { id: 10, name: 'Coffee', category: 'BEVERAGES', price: 20, description: 'Hot South Indian traditional filter decoction coffee.', available: true, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60' },
  { id: 11, name: 'Juice', category: 'BEVERAGES', price: 40, description: 'Chilled seasonal freshly squeezed fruit juice.', available: true, imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60' }
];

// const INITIAL_USERS = [
//   { role: 'STUDENT', name: 'Keerthika', mobile: '9876543210', password: '123', department: 'CSE', year: '3rd Year' },
//   { role: 'STAFF', staffId: 'STF101', name: 'Kumar', mobile: '9123456780', password: '123', department: 'CSE' }
// ];

// Single reusable sidebar nav button — used for both the student/staff menu
// and the admin menu, so the two lists stay visually and behaviorally in sync.
function SidebarLink({ icon: Icon, label, active, accent, onClick }) {
  const activeClasses = accent === 'indigo'
    ? 'bg-indigo-950 text-white shadow-md shadow-indigo-950/20'
    : 'bg-blue-950 text-white shadow-md shadow-blue-950/20';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer ${
        active ? activeClasses : 'text-slate-600 hover:bg-slate-100 hover:translate-x-0.5'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" /> {label}
    </button>
  );
}

export default function App() {
  const [view, setView] = useState('WELCOME'); 
  const [userRole, setUserRole] = useState(null); 
  const [authMode, setAuthMode] = useState('LOGIN'); 

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('canteen_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminCreds, setAdminCreds] = useState(() => {
    const saved = localStorage.getItem('canteen_admin_creds');
    return saved ? JSON.parse(saved) : { id: 'admin', pwd: 'admin123' };
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('canteen_registered_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [foods, setFoods] = useState(() => {
    const saved = localStorage.getItem('canteen_foods');
    return saved ? JSON.parse(saved) : INITIAL_FOODS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('canteen_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  // Pre-Order & Checkout State
  const [selectedFoodForOrder, setSelectedFoodForOrder] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
  const [foodQuantities, setFoodQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ name: '', mobile: '', department: '', year: '', staffId: '' });

  // Admin Modal States
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [foodFormData, setFoodFormData] = useState({
    name: '',
    category: 'FOOD',
    price: '',
    description: '',
    imageUrl: '',
    available: true
  });

  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('ALL');
  const [adminUserSearch, setAdminUserSearch] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Persistence to localStorage
  useEffect(() => { localStorage.setItem('canteen_foods', JSON.stringify(foods)); }, [foods]);
  useEffect(() => { localStorage.setItem('canteen_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('canteen_registered_users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('canteen_admin_creds', JSON.stringify(adminCreds)); }, [adminCreds]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('canteen_user', JSON.stringify(currentUser));
      if (currentUser.role === 'STUDENT') setView('STUDENT_PORTAL');
      else if (currentUser.role === 'STAFF') setView('STAFF_PORTAL');
      else if (currentUser.role === 'ADMIN') setView('ADMIN_PORTAL');
    } else {
      localStorage.removeItem('canteen_user');
    }
  }, [currentUser]);

  // Two-way continuous background sync with Spring Boot / MySQL
  useEffect(() => {
    const syncDatabase = async () => {
      try {
        const [fRes, oRes, uRes] = await Promise.all([
          fetch(`${API_BASE}/foods`).catch(() => null),
          fetch(`${API_BASE}/orders`).catch(() => null),
          fetch(`${API_BASE}/users`).catch(() => null)
        ]);

        if (fRes && fRes.ok) {
          const fData = await fRes.json();
          if (fData && fData.length > 0) setFoods(fData);
        }
        if (oRes && oRes.ok) {
          const oData = await oRes.json();
          if (oData) setOrders(oData);
        }
        if (uRes && uRes.ok) {
          const uData = await uRes.json();
          if (uData && uData.length > 0) setRegisteredUsers(uData);
        }
      } catch (err) {
        // Fallback to local storage
      }
    };

    syncDatabase();
    const interval = setInterval(syncDatabase, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setView('WELCOME');
    setActiveTab('DASHBOARD');
    setAuthError('');
  };

  const handleConfirmOrder = async () => {
    if (!selectedFoodForOrder || !currentUser) return;
    setIsProcessingPayment(true);

    const newOrder = {
      id: Date.now(),
      userType: currentUser.role,
      customerName: currentUser.name,
      department: currentUser.department,
      year: currentUser.year || null,
      staffId: currentUser.staffId || null,
      foodName: selectedFoodForOrder.name,
      price: selectedFoodForOrder.price,
      quantity: orderQuantity,
      totalAmount: selectedFoodForOrder.price * orderQuantity,
      paymentMethod: selectedPaymentMethod,
      orderDate: new Date().toLocaleDateString('en-GB'),
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PLACED'
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const savedOrder = await res.json();
        setOrders(prev => [savedOrder, ...prev.filter(o => o.id !== savedOrder.id)]);
      } else {
        setOrders(prev => [newOrder, ...prev]);
      }
    } catch (e) {
      setOrders(prev => [newOrder, ...prev]);
    }

    setTimeout(() => {
      setIsProcessingPayment(false);
      setSelectedFoodForOrder(null);
      setOrderQuantity(1);
      setActiveTab('MY_ORDERS');
    }, 800);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    if (!foodFormData.name || !foodFormData.price) return;

    if (editingFoodId) {
      const updatedFood = { ...foodFormData, id: editingFoodId, price: parseFloat(foodFormData.price) };
      setFoods(prev => prev.map(f => f.id === editingFoodId ? updatedFood : f));
      fetch(`${API_BASE}/foods/${editingFoodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFood)
      }).catch(() => {});
    } else {
      const newFood = {
        id: Date.now(),
        ...foodFormData,
        price: parseFloat(foodFormData.price),
        imageUrl: foodFormData.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60'
      };
      setFoods(prev => [newFood, ...prev]);
      fetch(`${API_BASE}/foods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFood)
      }).catch(() => {});
    }

    setFoodModalOpen(false);
    setEditingFoodId(null);
  };

  const GlobalHeader = ({ subtitle = "Food Pre-Order System" }) => (
    <header className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(view === 'STUDENT_PORTAL' || view === 'STAFF_PORTAL' || view === 'ADMIN_PORTAL') && (
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-white/15 active:scale-90 transition-transform cursor-pointer"
              title="Toggle Sidebar"
            >
              <MenuIcon className="w-6 h-6 text-amber-400" />
            </button>
          )}
          <div>
            <h1 className="text-lg md:text-2xl font-black tracking-wide text-white drop-shadow-md">
              ROEVER ENGINEERING COLLEGE
            </h1>
            <p className="text-[11px] md:text-xs font-black tracking-wider text-amber-400 uppercase">
              SMART CANTEEN <span className="text-slate-300 font-semibold">| {subtitle}</span>
            </p>
          </div>
        </div>
        {currentUser && (
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-black bg-white/15 px-4 py-1.5 rounded-full border border-white/20 shadow-inner">
              {currentUser.name} ({currentUser.role})
            </span>
          </div>
        )}
      </div>
    </header>
  );

  /* ========================================================================== */
  /* 1. WELCOME PAGE                                                            */
  /* ========================================================================== */
  if (view === 'WELCOME') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased view-enter">
        <GlobalHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl -z-0 pointer-events-none" />
              <div className="relative z-10">
                <span className="text-xs font-black text-blue-900 bg-blue-100/90 px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" /> Campus Smart Dining
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight tracking-tight">
                  Instant Pre-Ordering, Zero Queue.
                </h2>
                <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  Smart Canteen is a digital food pre-order system designed to make canteen ordering simple and convenient. 
                  Students and staff can select food items, place pre-orders and track their order status without waiting in a long queue.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
                <div className="p-4 bg-slate-50 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-slate-200/60 flex items-start gap-3">
                  <UtensilsCrossed className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Easy Food Ordering</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Explore available menu</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-slate-200/60 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Quick Pre-Order</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Instant checkout flow</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-slate-200/60 flex items-start gap-3">
                  <Users className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Less Waiting Time</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Skip counter lines</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-slate-200/60 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Status Tracking</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Live visual stages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - User Selection */}
            <div className="lg:col-span-5 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200 flex flex-col justify-center">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">Welcome to Smart Canteen</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Select Your User Type to Continue</p>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => setUserRole('STUDENT')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    userRole === 'STUDENT' ? 'border-blue-900 bg-blue-50/70 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl filter drop-shadow">👨‍🎓</span>
                    <div>
                      <h4 className="font-black text-slate-800 tracking-wide">STUDENT</h4>
                      <p className="text-xs text-slate-500">Undergraduate & postgraduate scholars</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${userRole === 'STUDENT' ? 'border-blue-900 bg-blue-900' : 'border-slate-300'}`}>
                    {userRole === 'STUDENT' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                <div 
                  onClick={() => setUserRole('STAFF')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    userRole === 'STAFF' ? 'border-blue-900 bg-blue-50/70 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl filter drop-shadow">👨‍🏫</span>
                    <div>
                      <h4 className="font-black text-slate-800 tracking-wide">STAFF</h4>
                      <p className="text-xs text-slate-500">Faculty & campus staff members</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${userRole === 'STAFF' ? 'border-blue-900 bg-blue-900' : 'border-slate-300'}`}>
                    {userRole === 'STAFF' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>

              <button
                disabled={!userRole}
                onClick={() => {
                  setAuthError('');
                  setAuthMode('LOGIN');
                  if (userRole === 'STUDENT') setView('STUDENT_AUTH');
                  if (userRole === 'STAFF') setView('STAFF_AUTH');
                }}
                className={`w-full mt-8 py-3.5 px-6 rounded-2xl font-black tracking-wider transition-all duration-200 shadow-lg active:scale-95 ${
                  userRole 
                    ? 'bg-blue-950 hover:bg-blue-900 text-white cursor-pointer hover:shadow-blue-950/20' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                SUBMIT
              </button>

              <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setView('ADMIN_LOGIN')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-amber-500" /> Administrative Canteen Login
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ========================================================================== */
  /* 2. STUDENT LOGIN & REGISTER DEDICATED VIEW                                 */
  /* ========================================================================== */
  if (view === 'STUDENT_AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased view-enter">
        <GlobalHeader subtitle="STUDENT" />
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex items-center justify-center">
          <div className="bg-white w-full p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 transition-all">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 relative">
              <button 
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer ${authMode === 'LOGIN' ? 'bg-white text-blue-950 shadow-md scale-[1.01]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Student Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer ${authMode === 'REGISTER' ? 'bg-white text-blue-950 shadow-md scale-[1.01]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                New Student Register
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'LOGIN' ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setAuthError('');
                const fd = new FormData(e.target);
                const name = fd.get('name')?.toString().trim();
                const password = fd.get('password')?.toString().trim();

                const student = registeredUsers.find(u => 
                  u.role === 'STUDENT' && 
                  u.name.toLowerCase() === name?.toLowerCase() &&
                  u.password === password
                );

                if (student) {
                  setCurrentUser(student);
                } else {
                  // Fallback: check backend login API
                  try {
                    const res = await fetch(`${API_BASE}/users/login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ role: 'STUDENT', name, password })
                    });
                    if (res.ok) {
                      const user = await res.json();
                      setCurrentUser(user);
                      return;
                    }
                  } catch (err) {}
                  setAuthError('Invalid Student Name or Password. Please verify or register.');
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      name="name" 
                      placeholder="Enter registered student name"
                      required 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="password"
                      name="password" 
                      placeholder="Enter password"
                      required 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-black text-sm tracking-wide transition shadow-lg active:scale-95 cursor-pointer mt-2"
                >
                  SIGN IN TO CANTEEN
                </button>
              </form>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setAuthError('');
                const fd = new FormData(e.target);
                const name = fd.get('name')?.toString().trim();
                const mobile = fd.get('mobile')?.toString().trim();
                const password = fd.get('password')?.toString().trim();
                const dept = fd.get('dept')?.toString();
                const year = fd.get('year')?.toString();

                if (mobile.length !== 10 || isNaN(mobile)) {
                  setAuthError('Please enter a valid 10-digit mobile number.');
                  return;
                }

                // Front-end instant duplicate check
                const mobileExists = registeredUsers.some(u => u.mobile === mobile);
                if (mobileExists) {
                  setAuthError('This mobile number is already registered! Please sign in.');
                  return;
                }

                const userObj = { role: 'STUDENT', name, mobile, password, department: dept, year };

                // Push to database API
                try {
                  const res = await fetch(`${API_BASE}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userObj)
                  });
                  if (!res.ok) {
                    const msg = await res.text();
                    setAuthError(msg || 'This mobile number is already registered!');
                    return;
                  }
                  const saved = await res.json();
                  setRegisteredUsers(prev => [saved, ...prev]);
                  setCurrentUser(saved);
                } catch (err) {
                  // Fallback local persistence
                  setRegisteredUsers(prev => [userObj, ...prev]);
                  setCurrentUser(userObj);
                }
              }} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Full Name</label>
                  <input 
                    name="name" 
                    placeholder="e.g. Keerthika"
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="tel"
                      maxLength="10"
                      name="mobile" 
                      placeholder="10-digit mobile number"
                      required 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Set Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="password"
                      name="password" 
                      placeholder="Create your password"
                      required 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                    <select 
                      name="dept" 
                      required 
                      defaultValue=""
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-xs bg-white font-medium"
                    >
                      <option value="" disabled>Select Dept</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Year</label>
                    <select 
                      name="year" 
                      required 
                      defaultValue=""
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-xs bg-white font-medium"
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-black text-sm tracking-wide transition shadow-lg active:scale-95 cursor-pointer mt-2"
                >
                  REGISTER STUDENT ACCOUNT
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => setView('WELCOME')}
              className="w-full text-xs font-bold text-slate-400 hover:text-slate-700 text-center block pt-4 cursor-pointer"
            >
              ← Back to Selection
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ========================================================================== */
  /* 3. STAFF LOGIN & REGISTER DEDICATED VIEW                                   */
  /* ========================================================================== */
  if (view === 'STAFF_AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased view-enter">
        <GlobalHeader subtitle="STAFF" />
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex items-center justify-center">
          <div className="bg-white w-full p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 transition-all">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 relative">
              <button 
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer ${authMode === 'LOGIN' ? 'bg-white text-blue-950 shadow-md scale-[1.01]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Staff Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer ${authMode === 'REGISTER' ? 'bg-white text-blue-950 shadow-md scale-[1.01]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                New Staff Register
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'LOGIN' ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setAuthError('');
                const fd = new FormData(e.target);
                const name = fd.get('name')?.toString().trim();
                const password = fd.get('password')?.toString().trim();

                const staff = registeredUsers.find(u => 
                  u.role === 'STAFF' && 
                  u.name.toLowerCase() === name?.toLowerCase() &&
                  u.password === password
                );

                if (staff) {
                  setCurrentUser(staff);
                } else {
                  try {
                    const res = await fetch(`${API_BASE}/users/login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ role: 'STAFF', name, password })
                    });
                    if (res.ok) {
                      const user = await res.json();
                      setCurrentUser(user);
                      return;
                    }
                  } catch (err) {}
                  setAuthError('Invalid Staff Name or Password. Please verify or register.');
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Staff Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      name="name" 
                      placeholder="Enter registered staff name"
                      required 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="password"
                      name="password" 
                      placeholder="Enter staff password"
                      required 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-black text-sm tracking-wide transition shadow-lg active:scale-95 cursor-pointer mt-2"
                >
                  SIGN IN AS STAFF
                </button>
              </form>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setAuthError('');
                const fd = new FormData(e.target);
                const staffId = fd.get('staffId')?.toString().trim();
                const name = fd.get('name')?.toString().trim();
                const mobile = fd.get('mobile')?.toString().trim();
                const password = fd.get('password')?.toString().trim();
                const dept = fd.get('dept')?.toString();

                if (mobile.length !== 10 || isNaN(mobile)) {
                  setAuthError('Please enter a valid 10-digit mobile number.');
                  return;
                }

                const mobileExists = registeredUsers.some(u => u.mobile === mobile);
                if (mobileExists) {
                  setAuthError('This mobile number is already registered! Please sign in.');
                  return;
                }

                const userObj = { role: 'STAFF', staffId, name, mobile, password, department: dept };

                try {
                  const res = await fetch(`${API_BASE}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userObj)
                  });
                  if (!res.ok) {
                    const msg = await res.text();
                    setAuthError(msg || 'This mobile number is already registered!');
                    return;
                  }
                  const saved = await res.json();
                  setRegisteredUsers(prev => [saved, ...prev]);
                  setCurrentUser(saved);
                } catch (err) {
                  setRegisteredUsers(prev => [userObj, ...prev]);
                  setCurrentUser(userObj);
                }
              }} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Staff ID</label>
                  <input 
                    name="staffId" 
                    placeholder="e.g. STF101"
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Staff Full Name</label>
                  <input 
                    name="name" 
                    placeholder="e.g. Kumar"
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="tel"
                      maxLength="10"
                      name="mobile" 
                      placeholder="10-digit mobile number"
                      required 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Set Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="password"
                      name="password" 
                      placeholder="Create your staff password"
                      required 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                  <select 
                    name="dept" 
                    required 
                    defaultValue=""
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm bg-white font-medium"
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl font-black text-sm tracking-wide transition shadow-lg active:scale-95 cursor-pointer mt-2"
                >
                  REGISTER STAFF ACCOUNT
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => setView('WELCOME')}
              className="w-full text-xs font-bold text-slate-400 hover:text-slate-700 text-center block pt-4 cursor-pointer"
            >
              ← Back to Selection
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ========================================================================== */
  /* 4. ADMIN LOGIN                                                             */
  /* ========================================================================== */
  if (view === 'ADMIN_LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased view-enter">
        <GlobalHeader subtitle="ADMIN LOGIN" />
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex items-center justify-center">
          <div className="bg-white w-full p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Admin Portal</h2>
                <p className="text-xs text-slate-500 font-medium">Control food items, live orders, & reports</p>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const id = fd.get('id')?.toString().trim();
              const pwd = fd.get('pwd')?.toString().trim();
              if (id === adminCreds.id && pwd === adminCreds.pwd) {
                setCurrentUser({ role: 'ADMIN', name: 'Administrator' });
                setView('ADMIN_PORTAL');
              } else {
                setAuthError(`Invalid credentials. Default: ${adminCreds.id} / ${adminCreds.pwd}`);
              }
            }} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin ID</label>
                <input 
                  name="id" 
                  defaultValue="admin"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                <input 
                  type="password"
                  name="pwd" 
                  defaultValue="admin123"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm tracking-wide transition shadow-lg active:scale-95 cursor-pointer mt-2"
              >
                SIGN IN AS ADMIN
              </button>

              <button
                type="button"
                onClick={() => setView('WELCOME')}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-700 text-center block pt-2 cursor-pointer"
              >
                ← Return to Selection
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  /* ========================================================================== */
  /* 5. MAIN PORTALS (STUDENT, STAFF & ADMIN)                                   */
  /* ========================================================================== */
  const userOrders = orders.filter(o => 
    o.customerName === currentUser?.name && o.userType === currentUser?.role
  );
  const activeUserOrders = userOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const completedUserOrders = userOrders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');

  const filteredFoods = foods.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased">
      <GlobalHeader subtitle={currentUser?.role === 'STUDENT' ? 'STUDENT PORTAL' : currentUser?.role === 'STAFF' ? 'STAFF PORTAL' : 'ADMIN PORTAL'} />

      <div className="flex-1 flex overflow-hidden">
        {/* COLLAPSIBLE SIDEBAR */}
        <aside 
          className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col justify-between z-20 ${
            sidebarOpen ? 'w-64 min-w-[16rem]' : 'w-0 -translate-x-full overflow-hidden'
          }`}
        >
          <div className="p-4 space-y-1">
            <div className="px-3.5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </div>

            {(currentUser?.role !== 'ADMIN' ? [
              { tab: 'DASHBOARD', icon: Home, label: 'Dashboard' },
              { tab: 'PROFILE', icon: User, label: 'My Profile', onClick: () => { setActiveTab('PROFILE'); setIsEditingProfile(false); } },
              { tab: 'MENU', icon: UtensilsCrossed, label: 'Food Menu' },
              { tab: 'MY_ORDERS', icon: Package, label: `My Orders (${activeUserOrders.length})` },
              { tab: 'TRACKING', icon: MapPin, label: 'Status Tracking' },
              { tab: 'HISTORY', icon: History, label: 'Order History' },
            ] : [
              { tab: 'ADMIN_DASHBOARD', icon: Home, label: 'Dashboard' },
              { tab: 'ADMIN_FOODS', icon: UtensilsCrossed, label: 'Food Management' },
              { tab: 'ADMIN_ORDERS', icon: Package, label: 'Order Controls' },
              { tab: 'ADMIN_USERS', icon: Users, label: `Users (${registeredUsers.length})` },
              { tab: 'ADMIN_REPORTS', icon: BarChart2, label: 'Reports' },
              { tab: 'ADMIN_SETTINGS', icon: Settings, label: 'Settings' },
            ]).map(({ tab, icon: Icon, label, onClick }) => (
              <SidebarLink
                key={tab}
                icon={Icon}
                label={label}
                active={activeTab === tab}
                accent={currentUser?.role === 'ADMIN' ? 'indigo' : 'blue'}
                onClick={onClick || (() => setActiveTab(tab))}
              />
            ))}
          </div>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout Session
            </button>
          </div>
        </aside>

        {/* EXPANDABLE RIGHT CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 transition-all">
          {/* USER DASHBOARD */}
          {activeTab === 'DASHBOARD' && currentUser?.role !== 'ADMIN' && (
            <div className="space-y-6 max-w-6xl mx-auto view-enter">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  Welcome, {currentUser?.name}!
                </h2>
                <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">
                  Ready to pre-order fresh food at Roever Engineering College Smart Canteen?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Available Foods</p>
                    <p className="text-3xl font-black text-slate-800 mt-1">{foods.filter(f => f.available).length}</p>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl text-xl">🍔</div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Active Orders</p>
                    <p className="text-3xl font-black text-blue-600 mt-1">{activeUserOrders.length}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-900 rounded-2xl text-xl">📦</div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Completed Orders</p>
                    <p className="text-3xl font-black text-green-600 mt-1">{completedUserOrders.length}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl text-xl">📜</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h3 className="text-xl md:text-2xl font-black">Pre-Order Food In Real-Time</h3>
                  <p className="text-blue-200 text-xs md:text-sm mt-1">Select food, choose UPI or counter cash, and collect immediately when ready.</p>
                </div>
                <button
                  onClick={() => setActiveTab('MENU')}
                  className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-black px-6 py-3 rounded-2xl transition shadow-md whitespace-nowrap text-xs cursor-pointer active:scale-95"
                >
                  Explore Food Menu
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 mb-4">Featured Food Items</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {foods.slice(0, 3).map(item => (
                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between card-enter">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                            <span className="text-sm font-black text-blue-900">₹{item.price}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">{item.description}</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('MENU')}
                          className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-blue-950 hover:text-white text-slate-800 font-black text-xs rounded-xl transition cursor-pointer"
                        >
                          Order in Menu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USER PROFILE */}
          {activeTab === 'PROFILE' && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm view-enter">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">My Profile</h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setProfileFormData({
                        name: currentUser.name || '',
                        mobile: currentUser.mobile || '',
                        department: currentUser.department || 'CSE',
                        year: currentUser.year || '1st Year',
                        staffId: currentUser.staffId || ''
                      });
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const updated = {
                    ...currentUser,
                    name: profileFormData.name.trim(),
                    mobile: profileFormData.mobile.trim(),
                    department: profileFormData.department,
                    ...(currentUser.role === 'STUDENT' ? { year: profileFormData.year } : { staffId: profileFormData.staffId.trim() })
                  };
                  setCurrentUser(updated);
                  setRegisteredUsers(prev => prev.map(u => 
                    (u.role === updated.role && (u.staffId === updated.staffId || u.name === currentUser.name))
                      ? updated : u
                  ));

                  if (currentUser.id) {
                    fetch(`${API_BASE}/users/${currentUser.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updated)
                    }).catch(() => {});
                  }
                  setIsEditingProfile(false);
                }} className="space-y-4">
                  {currentUser.role === 'STAFF' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Staff ID</label>
                      <input 
                        value={profileFormData.staffId}
                        onChange={(e) => setProfileFormData({ ...profileFormData, staffId: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input 
                      value={profileFormData.name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                    <input 
                      type="tel"
                      maxLength="10"
                      value={profileFormData.mobile}
                      onChange={(e) => setProfileFormData({ ...profileFormData, mobile: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                    <select
                      value={profileFormData.department}
                      onChange={(e) => setProfileFormData({ ...profileFormData, department: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white font-medium"
                    >
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {currentUser.role === 'STUDENT' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Year</label>
                      <select
                        value={profileFormData.year}
                        onChange={(e) => setProfileFormData({ ...profileFormData, year: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white font-medium"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-blue-950 text-white font-black text-xs rounded-xl cursor-pointer shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3.5">
                  {currentUser?.role === 'STAFF' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Staff ID</span>
                      <p className="text-base font-black text-slate-800 mt-0.5">{currentUser.staffId}</p>
                    </div>
                  )}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {currentUser?.role === 'STUDENT' ? 'Student Name' : 'Staff Name'}
                    </span>
                    <p className="text-base font-black text-slate-800 mt-0.5">{currentUser?.name}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Mobile Number</span>
                    <p className="text-base font-black text-slate-800 mt-0.5">{currentUser?.mobile || 'Not configured'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Department</span>
                    <p className="text-base font-black text-slate-800 mt-0.5">{currentUser?.department}</p>
                  </div>
                  {currentUser?.role === 'STUDENT' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Year</span>
                      <p className="text-base font-black text-slate-800 mt-0.5">{currentUser?.year}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FOOD MENU */}
          {activeTab === 'MENU' && (
            <div className="max-w-6xl mx-auto space-y-6 view-enter">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Food Menu</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Direct food selection with instant pre-order checkout.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Search Food..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-900 w-48 md:w-60 bg-white shadow-sm font-medium"
                    />
                  </div>

                  <div className="flex bg-slate-200 p-1 rounded-2xl text-xs font-black">
                    {['ALL', 'FOOD', 'SNACKS', 'BEVERAGES'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${selectedCategory === cat ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredFoods.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold text-sm">No food items found matching criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFoods.map(item => {
                    const currentQty = foodQuantities[item.id] || 1;
                    return (
                      <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between card-enter">
                        <div className="relative">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-44 object-cover" />
                          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-xl text-xs font-black text-blue-950 shadow-md">
                            ₹{item.price}
                          </span>
                          {!item.available && (
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg">
                                Currently Unavailable
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                              {item.category}
                            </span>
                            <h3 className="font-black text-base text-slate-900 mt-1">{item.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{item.description}</p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                              <button
                                disabled={!item.available}
                                onClick={() => setFoodQuantities({ ...foodQuantities, [item.id]: Math.max(1, currentQty - 1) })}
                                className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition disabled:opacity-30 cursor-pointer"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 text-xs font-black text-slate-800">{currentQty}</span>
                              <button
                                disabled={!item.available}
                                onClick={() => setFoodQuantities({ ...foodQuantities, [item.id]: currentQty + 1 })}
                                className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition disabled:opacity-30 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              disabled={!item.available}
                              onClick={() => {
                                setSelectedFoodForOrder(item);
                                setOrderQuantity(currentQty);
                                setSelectedPaymentMethod('UPI');
                              }}
                              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black tracking-wider transition shadow-sm active:scale-95 ${
                                item.available 
                                  ? 'bg-blue-950 hover:bg-blue-900 text-white cursor-pointer' 
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              PRE-ORDER
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MY ORDERS */}
          {activeTab === 'MY_ORDERS' && (
            <div className="max-w-4xl mx-auto space-y-6 view-enter">
              <div>
                <h2 className="text-2xl font-black text-slate-900">My Orders</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Live updates on foods currently being pre-ordered or prepared.</p>
              </div>

              {activeUserOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold text-sm">No active orders found.</p>
                  <button 
                    onClick={() => setActiveTab('MENU')}
                    className="mt-4 px-5 py-2.5 bg-blue-950 text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    Browse Food Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeUserOrders.map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-slate-900 text-base">{order.foodName} × {order.quantity}</h3>
                          <span className="bg-blue-50 text-blue-900 text-xs px-2.5 py-0.5 rounded-full font-black">
                            ₹{order.totalAmount}
                          </span>
                          {order.paymentMethod && (
                            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-black uppercase">
                              {order.paymentMethod}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          Placed on {order.orderDate} at {order.orderTime}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-amber-100 text-amber-800">
                          {order.status}
                        </span>
                        <button
                          onClick={() => setActiveTab('TRACKING')}
                          className="text-xs font-bold text-blue-800 hover:text-blue-950 underline cursor-pointer"
                        >
                          View Status Tracker →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDER STATUS TRACKING */}
          {activeTab === 'TRACKING' && (
            <div className="max-w-3xl mx-auto space-y-6 view-enter">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Order Status Tracking</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Track preparation progress of active orders in real time.</p>
              </div>

              {activeUserOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold text-sm">No orders currently in progress to track.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {activeUserOrders.map(order => {
                    const steps = [
                      { key: 'PLACED', label: 'Order Placed' },
                      { key: 'RECEIVED', label: 'Order Received' },
                      { key: 'PREPARING', label: 'Preparing' },
                      { key: 'READY', label: 'Ready for Pickup' },
                      { key: 'COMPLETED', label: 'Completed' }
                    ];

                    const stepIndices = { PLACED: 0, RECEIVED: 1, PREPARING: 2, READY: 3, COMPLETED: 4 };
                    const currentIdx = stepIndices[order.status] ?? 0;

                    return (
                      <div key={order.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                          <div>
                            <h3 className="text-lg font-black text-slate-900">{order.foodName}</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Qty: {order.quantity} | Total: ₹{order.totalAmount} • Mode: {order.paymentMethod || 'Counter'}</p>
                          </div>
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">
                            {order.orderTime}
                          </span>
                        </div>

                        <div className="py-4">
                          <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0" />
                            <div 
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 transition-all duration-700 ease-out z-0" 
                              style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((step, idx) => {
                              const isPassed = idx <= currentIdx;
                              const isCurrent = idx === currentIdx;

                              return (
                                <div key={step.key} className="flex flex-col items-center relative z-10">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 shadow-sm ${
                                    isPassed ? 'bg-green-600 text-white scale-110' : 'bg-slate-200 text-slate-500'
                                  } ${isCurrent ? 'ring-4 ring-green-100 animate-pulse' : ''}`}>
                                    {isPassed ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-[10px] md:text-[11px] font-bold mt-2 text-center max-w-[70px] ${
                                    isCurrent ? 'text-green-700 font-black' : isPassed ? 'text-slate-800' : 'text-slate-400'
                                  }`}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {order.status === 'READY' && (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-pulse">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>Your food is prepared! Please proceed to the smart canteen pickup counter.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ORDER HISTORY */}
          {activeTab === 'HISTORY' && (
            <div className="max-w-4xl mx-auto space-y-6 view-enter">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Order History</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Previous completed and collected orders.</p>
              </div>

              {completedUserOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold text-sm">No previous order records found.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-700 uppercase">
                      <tr>
                        <th className="p-4">Food</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {completedUserOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-900">{order.foodName}</td>
                          <td className="p-4">{order.quantity}</td>
                          <td className="p-4 font-black text-slate-900">₹{order.totalAmount}</td>
                          <td className="p-4 text-xs font-black uppercase">{order.paymentMethod || 'Counter'}</td>
                          <td className="p-4 text-xs font-medium">{order.orderDate}</td>
                          <td className="p-4">
                            <span className={`text-xs px-3 py-1 rounded-xl font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* ADMIN PORTAL                                                     */}
          {/* ================================================================ */}
          {currentUser?.role === 'ADMIN' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* ADMIN DASHBOARD */}
              {activeTab === 'ADMIN_DASHBOARD' && (
                <div className="space-y-6 view-enter">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Admin Control Center</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Live operational statistics & orders.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Today's Orders</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-black text-amber-600 uppercase">Pending</span>
                      <p className="text-2xl font-black text-amber-600 mt-1">{orders.filter(o => o.status === 'PLACED').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-black text-blue-600 uppercase">Preparing</span>
                      <p className="text-2xl font-black text-blue-600 mt-1">{orders.filter(o => o.status === 'PREPARING').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-black text-purple-600 uppercase">Ready Pickup</span>
                      <p className="text-2xl font-black text-purple-600 mt-1">{orders.filter(o => o.status === 'READY').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-black text-green-600 uppercase">Completed</span>
                      <p className="text-2xl font-black text-green-600 mt-1">{orders.filter(o => o.status === 'COMPLETED').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">Total Sales</span>
                      <p className="text-2xl font-black text-emerald-600 mt-1">₹{orders.reduce((acc, o) => acc + o.totalAmount, 0)}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 text-base mb-4">Recent Pre-Orders</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-700">
                          <tr>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Food & Qty</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {orders.slice(0, 5).map(o => (
                            <tr key={o.id}>
                              <td className="p-3 font-bold text-slate-900">{o.customerName}</td>
                              <td className="p-3 font-semibold">{o.userType}</td>
                              <td className="p-3">{o.foodName} × {o.quantity}</td>
                              <td className="p-3 font-black text-slate-900">₹{o.totalAmount}</td>
                              <td className="p-3 uppercase font-bold text-[10px]">{o.paymentMethod || 'Counter'}</td>
                              <td className="p-3">
                                <span className="px-2.5 py-0.5 rounded-lg font-bold text-[10px] bg-slate-100 text-slate-800">
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN FOOD MENU */}
              {activeTab === 'ADMIN_FOODS' && (
                <div className="space-y-6 view-enter">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Food Menu & Items</h2>
                      <p className="text-xs text-slate-500 font-medium">Add, edit food items, adjust prices, or change food image URLs.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingFoodId(null);
                        setFoodFormData({
                          name: '',
                          category: 'FOOD',
                          price: '',
                          description: '',
                          imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60',
                          available: true
                        });
                        setFoodModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-blue-950 text-white rounded-2xl text-xs font-bold hover:bg-blue-900 transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Food Item
                    </button>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-700 uppercase">
                        <tr>
                          <th className="p-4">Item</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Availability</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {foods.map(food => (
                          <tr key={food.id} className="hover:bg-slate-50/60">
                            <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                              <img src={food.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                              <div>
                                <p>{food.name}</p>
                                <p className="text-xs font-normal text-slate-400 line-clamp-1">{food.description}</p>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-black uppercase text-indigo-700">{food.category}</td>
                            <td className="p-4 font-black text-slate-900">₹{food.price}</td>
                            <td className="p-4">
                              <button
                                onClick={async () => {
                                  const updatedStatus = !food.available;
                                  setFoods(prev => prev.map(f => f.id === food.id ? { ...f, available: updatedStatus } : f));
                                  try {
                                    await fetch(`${API_BASE}/foods/${food.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ ...food, available: updatedStatus })
                                    });
                                  } catch (e) {}
                                }}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  food.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {food.available ? '🟢 Available' : '🔴 Unavailable'}
                              </button>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingFoodId(food.id);
                                  setFoodFormData({
                                    name: food.name,
                                    category: food.category,
                                    price: food.price,
                                    description: food.description,
                                    imageUrl: food.imageUrl,
                                    available: food.available
                                  });
                                  setFoodModalOpen(true);
                                }}
                                className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition cursor-pointer"
                                title="Edit Food Details & Image"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Remove ${food.name} from menu?`)) {
                                    setFoods(prev => prev.filter(f => f.id !== food.id));
                                    try {
                                      await fetch(`${API_BASE}/foods/${food.id}`, { method: 'DELETE' });
                                    } catch (e) {}
                                  }
                                }}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition cursor-pointer"
                                title="Delete Food Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN ALL ORDERS MANAGEMENT */}
              {activeTab === 'ADMIN_ORDERS' && (
                <div className="space-y-6 view-enter">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Order Management</h2>
                      <p className="text-xs text-slate-500 font-medium">Update kitchen progress states that trigger live student & staff trackers.</p>
                    </div>

                    <div className="flex gap-3">
                      <input
                        placeholder="Search Customer..."
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="px-4 py-2 border rounded-2xl text-xs w-44 bg-white"
                      />
                      <select 
                        value={adminStatusFilter} 
                        onChange={(e) => setAdminStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-2xl text-xs bg-white font-bold"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="PLACED">Placed</option>
                        <option value="RECEIVED">Received</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY">Ready</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 uppercase font-black text-slate-700">
                        <tr>
                          <th className="p-4">Customer</th>
                          <th className="p-4">User Type</th>
                          <th className="p-4">Academic Details</th>
                          <th className="p-4">Food & Qty</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Date / Time</th>
                          <th className="p-4">Live Status</th>
                          <th className="p-4">Advance Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders
                          .filter(o => o.customerName.toLowerCase().includes(adminSearch.toLowerCase()))
                          .filter(o => adminStatusFilter === 'ALL' || o.status === adminStatusFilter)
                          .map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/60">
                              <td className="p-4 font-bold text-slate-900">{order.customerName}</td>
                              <td className="p-4 font-semibold">{order.userType}</td>
                              <td className="p-4">
                                {order.department} {order.year ? `(${order.year})` : order.staffId ? `[${order.staffId}]` : ''}
                              </td>
                              <td className="p-4">{order.foodName} × {order.quantity}</td>
                              <td className="p-4 font-black text-slate-900">₹{order.totalAmount}</td>
                              <td className="p-4 uppercase font-bold text-[10px]">{order.paymentMethod || 'Counter'}</td>
                              <td className="p-4">{order.orderDate} {order.orderTime}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-xl font-black text-[10px] ${
                                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  order.status === 'READY' ? 'bg-purple-100 text-purple-800' :
                                  order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'RECEIVED' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <select 
                                  value={order.status}
                                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                  className="border border-slate-300 rounded-xl p-1.5 text-xs bg-white focus:outline-none font-bold cursor-pointer"
                                >
                                  <option value="PLACED">Placed</option>
                                  <option value="RECEIVED">Order Received</option>
                                  <option value="PREPARING">Preparing</option>
                                  <option value="READY">Ready for Pickup</option>
                                  <option value="COMPLETED">Completed</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN USER MANAGEMENT */}
              {activeTab === 'ADMIN_USERS' && (
                <div className="space-y-6 view-enter">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Registered Campus Users</h2>
                      <p className="text-xs text-slate-500 font-medium">Live roster of students and staff registered on the smart canteen portal.</p>
                    </div>

                    <input
                      placeholder="Search by name or department..."
                      value={adminUserSearch}
                      onChange={(e) => setAdminUserSearch(e.target.value)}
                      className="px-4 py-2 border rounded-2xl text-xs w-64 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-slate-900 text-base">🎓 Registered Students</h3>
                        <span className="text-xs bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-full">
                          {registeredUsers.filter(u => u.role === 'STUDENT').length} Total
                        </span>
                      </div>
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {registeredUsers
                          .filter(u => u.role === 'STUDENT')
                          .filter(u => u.name.toLowerCase().includes(adminUserSearch.toLowerCase()) || u.department.toLowerCase().includes(adminUserSearch.toLowerCase()))
                          .map((student, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-slate-800">{student.name}</p>
                                <p className="text-slate-500 font-medium">Dept: {student.department} | {student.year} • 📱 {student.mobile || 'N/A'}</p>
                              </div>
                              <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-lg">Student</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-slate-900 text-base">👨‍🏫 Registered Staff</h3>
                        <span className="text-xs bg-indigo-50 text-indigo-800 font-bold px-3 py-1 rounded-full">
                          {registeredUsers.filter(u => u.role === 'STAFF').length} Total
                        </span>
                      </div>
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {registeredUsers
                          .filter(u => u.role === 'STAFF')
                          .filter(u => u.name.toLowerCase().includes(adminUserSearch.toLowerCase()) || u.department.toLowerCase().includes(adminUserSearch.toLowerCase()) || (u.staffId && u.staffId.toLowerCase().includes(adminUserSearch.toLowerCase())))
                          .map((staff, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-slate-800">{staff.name}</p>
                                <p className="text-slate-500 font-medium">ID: {staff.staffId} | Dept: {staff.department} • 📱 {staff.mobile || 'N/A'}</p>
                              </div>
                              <span className="bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-lg">Staff</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN REPORTS */}
              {activeTab === 'ADMIN_REPORTS' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 view-enter">
                  <h3 className="font-black text-slate-900 text-xl">Sales & Dining Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Student Pre-Orders</p>
                      <p className="text-3xl font-black text-slate-800 mt-2">{orders.filter(o => o.userType === 'STUDENT').length}</p>
                    </div>
                    <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Staff Pre-Orders</p>
                      <p className="text-3xl font-black text-slate-800 mt-2">{orders.filter(o => o.userType === 'STAFF').length}</p>
                    </div>
                    <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Most Popular Item</p>
                      <p className="text-2xl font-black text-blue-900 mt-2">Chicken Rice</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN SETTINGS */}
              {activeTab === 'ADMIN_SETTINGS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 view-enter">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-900 text-lg">System Configuration</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">College Name</label>
                      <input disabled value="ROEVER ENGINEERING COLLEGE" className="w-full mt-1.5 p-3 bg-slate-100 rounded-xl border text-sm font-bold text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">Canteen Unit</label>
                      <input disabled value="SMART CANTEEN" className="w-full mt-1.5 p-3 bg-slate-100 rounded-xl border text-sm font-bold text-slate-700" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-900 text-lg">Admin Security Credentials</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">Admin ID</label>
                      <input disabled value={adminCreds.id} className="w-full mt-1.5 p-3 bg-slate-100 rounded-xl border text-sm font-bold text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">Update Password</label>
                      <input 
                        type="password"
                        placeholder="Enter new password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full mt-1.5 p-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold" 
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (newAdminPassword.trim().length >= 4) {
                          setAdminCreds(prev => ({ ...prev, pwd: newAdminPassword.trim() }));
                          setNewAdminPassword('');
                          alert('Admin password updated successfully!');
                        } else {
                          alert('Password must be at least 4 characters long.');
                        }
                      }}
                      className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition cursor-pointer shadow-sm"
                    >
                      Save New Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ==================================================================== */}
      {/* DIRECT PRE-ORDER MODAL WITH DUMMY UPI QR SCANNER & ANIMATION         */}
      {/* ==================================================================== */}
      {selectedFoodForOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 modal-backdrop-enter">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-5 transition-all modal-panel-enter">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Confirm Food Pre-Order</h3>
                <p className="text-xs text-slate-400 font-medium">Instant pre-order and payment</p>
              </div>
              <button 
                onClick={() => setSelectedFoodForOrder(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{currentUser?.name} ({currentUser?.role})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Food Item:</span>
                <span className="font-bold text-slate-900">{selectedFoodForOrder.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Quantity & Price:</span>
                <span className="font-bold text-slate-900">{orderQuantity} × ₹{selectedFoodForOrder.price}</span>
              </div>
              <div className="flex justify-between py-2.5 bg-blue-50/80 px-3.5 rounded-xl text-sm">
                <span className="font-black text-slate-800">Total Payable:</span>
                <span className="font-black text-blue-900 text-lg">₹{selectedFoodForOrder.price * orderQuantity}</span>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <div 
                  onClick={() => setSelectedPaymentMethod('UPI')}
                  className={`p-3 border-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition ${
                    selectedPaymentMethod === 'UPI' ? 'border-blue-900 bg-blue-50 text-blue-950 font-black shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-blue-900" />
                  <span className="text-[10px]">UPI / QR</span>
                </div>

                <div 
                  onClick={() => setSelectedPaymentMethod('CASH')}
                  className={`p-3 border-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition ${
                    selectedPaymentMethod === 'CASH' ? 'border-blue-900 bg-blue-50 text-blue-950 font-black shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">Cash Counter</span>
                </div>

                <div 
                  onClick={() => setSelectedPaymentMethod('CAMPUS_CARD')}
                  className={`p-3 border-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition ${
                    selectedPaymentMethod === 'CAMPUS_CARD' ? 'border-blue-900 bg-blue-50 text-blue-950 font-black shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">Campus Card</span>
                </div>
              </div>
            </div>

            {/* DUMMY UPI QR SCANNER BOX (DISPLAYED WHEN UPI IS SELECTED) */}
            {selectedPaymentMethod === 'UPI' && (
              <div className="p-4 bg-gradient-to-b from-slate-50 to-blue-50/50 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center space-y-2.5 relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-xs font-black text-blue-950">
                  <QrCode className="w-4 h-4 text-blue-800" />
                  Scan with any UPI App (GPay / PhonePe / Paytm)
                </div>

                {/* Animated QR frame */}
                <div className="relative p-2.5 bg-white rounded-2xl shadow-inner border border-slate-200 group">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=roevercanteen@upi&pn=RoeverCanteen&am=${selectedFoodForOrder.price * orderQuantity}&cu=INR`} 
                    alt="UPI QR Scanner" 
                    className="w-32 h-32 rounded-lg object-contain mx-auto"
                  />
                  {/* Pulsing scanning line */}
                  <div className="absolute inset-x-2 top-2 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-md animate-bounce" />
                </div>

                <div className="text-[11px] font-bold text-slate-600">
                  Total Amount to Scan: <span className="font-black text-blue-900 text-sm">₹{selectedFoodForOrder.price * orderQuantity}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  UPI VPA: <span className="font-bold text-slate-700">roevercanteen@upi</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={isProcessingPayment}
                onClick={() => setSelectedFoodForOrder(null)}
                className="w-full py-3 rounded-2xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isProcessingPayment}
                onClick={handleConfirmOrder}
                className="w-full py-3 rounded-2xl font-black text-xs text-white bg-blue-950 hover:bg-blue-900 transition shadow-lg cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  selectedPaymentMethod === 'UPI' ? 'Paid & Place Order' : 'Confirm Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADMIN FOOD MODAL (ADD & EDIT FOOD ITEMS WITH IMAGE URL)              */}
      {/* ==================================================================== */}
      {foodModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop-enter">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4 modal-panel-enter">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingFoodId ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setFoodModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Food Name</label>
                <input 
                  value={foodFormData.name}
                  onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
                  required
                  placeholder="e.g. Chicken Rice"
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={foodFormData.category}
                    onChange={(e) => setFoodFormData({ ...foodFormData, category: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-black"
                  >
                    <option value="FOOD">FOOD</option>
                    <option value="SNACKS">SNACKS</option>
                    <option value="BEVERAGES">BEVERAGES</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input 
                    type="number"
                    value={foodFormData.price}
                    onChange={(e) => setFoodFormData({ ...foodFormData, price: e.target.value })}
                    required
                    placeholder="e.g. 100"
                    className="w-full p-2.5 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Food Image URL</label>
                <input 
                  value={foodFormData.imageUrl}
                  onChange={(e) => setFoodFormData({ ...foodFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={foodFormData.description}
                  onChange={(e) => setFoodFormData({ ...foodFormData, description: e.target.value })}
                  placeholder="Short description of the food item..."
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setFoodModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 font-bold text-slate-600 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-950 font-black text-white rounded-xl cursor-pointer shadow-md"
                >
                  Save Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}