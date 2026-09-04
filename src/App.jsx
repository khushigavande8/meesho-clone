import { useEffect, useState } from 'react';
import { useCart } from './context/CartContext';
import { ShoppingBag, Search, Star, X, Plus, Minus, Tag, Truck, Heart, User, CheckCircle, CreditCard, MapPin } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals & Drawers States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'privacy' | 'terms' | null
  const [wishlist, setWishlist] = useState([]);

  // Checkout Form State
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    pincode: ''
  });

  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  // Filter Logic (Search & Category)
  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search.trim() !== '') {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  // Wishlist Handler
  const toggleWishlist = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsOrderPlaced(true);
    setTimeout(() => {
      setIsOrderPlaced(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      // Reset form
      setAddress({ name: '', phone: '', street: '', city: '', pincode: '' });
    }, 2500);
  };

  const categories = ['all', "men's clothing", "women's clothing", 'jewelery', 'electronics'];
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-pink-600 tracking-tight">Meesho</span>
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">Pro</span>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Try searching for Saree, Watch, Shoes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-1.5 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="hidden md:inline">Profile</span>
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex items-center gap-1.5 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
            >
              <Heart className="w-5 h-5 text-gray-600" />
              <span className="hidden md:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition font-medium text-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((total, item) => total + item.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="border-t bg-white border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Hero Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="bg-white/20 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">Special Festival Sale</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2">Lowest Prices Everyday!</h2>
            <p className="text-sm text-pink-100 mt-1">Get up to 70% Off on Top Brands + Free Delivery on first order</p>
          </div>
          <button className="bg-white text-pink-600 px-6 py-2.5 rounded-xl font-bold hover:bg-pink-50 transition shadow-md whitespace-nowrap text-sm">
            Shop Now
          </button>
        </div>
      </section>

      {/* 3. Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Products For You</h3>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((item) => {
              const isWishlisted = wishlist.some((w) => w.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition duration-200 flex flex-col group relative"
                >
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow hover:scale-110 transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>

                  <div className="relative p-4 h-48 flex items-center justify-center bg-white group-hover:scale-105 transition duration-300">
                    <img src={item.image} alt={item.title} className="max-h-full object-contain" />
                    <div className="absolute top-2 left-2 bg-pink-100 text-pink-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Tag className="w-3 h-3" /> 20% OFF
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-1 border-t border-gray-50 bg-gray-50/50">
                    <h4 className="text-xs font-medium text-gray-700 line-clamp-2 h-8">{item.title}</h4>

                    <div className="flex items-center gap-1 mt-2">
                      <span className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        {item.rating?.rate || '4.2'} <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <span className="text-[10px] text-gray-400">({item.rating?.count || 120})</span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-gray-900">₹{Math.floor(item.price * 80)}</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{Math.floor(item.price * 80 * 1.2)}</span>
                    </div>

                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                      <Truck className="w-3 h-3 text-green-600" /> Free Delivery
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="mt-3 w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg text-xs transition shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-600" /> Shopping Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border border-gray-100 rounded-lg shadow-sm bg-white">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                      <p className="text-xs font-bold text-gray-900 mt-1">₹{Math.floor(item.price * 80)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded">
                          <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-gray-100 text-gray-600">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.qty}</span>
                          <button onClick={() => addToCart(item)} className="p-1 hover:bg-gray-100 text-gray-600">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between text-sm font-bold text-gray-800 mb-4">
                  <span>Total Amount</span>
                  <span className="text-pink-600">₹{Math.floor(totalPrice * 80)}</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm shadow-md transition"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Checkout Modal Window */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pink-600" /> Delivery & Payment Details
              </h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isOrderPlaced ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-gray-800">Order Placed Successfully!</h4>
                <p className="text-xs text-gray-500">Thank you for shopping with us. Your items will be delivered soon.</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {/* Shipping Details */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Shipping Address</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="col-span-2 p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="House No., Street Name"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="col-span-2 p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Payment Method</h4>
                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer text-xs transition ${paymentMethod === 'cod' ? 'border-pink-600 bg-pink-50/50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-pink-600"
                        />
                        <span className="font-semibold text-gray-800">Cash on Delivery (COD)</span>
                      </div>
                      <Truck className="w-4 h-4 text-pink-600" />
                    </label>

                    <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer text-xs transition ${paymentMethod === 'upi' ? 'border-pink-600 bg-pink-50/50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-pink-600"
                        />
                        <span className="font-semibold text-gray-800">UPI / GPay / PhonePe</span>
                      </div>
                      <CreditCard className="w-4 h-4 text-pink-600" />
                    </label>
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center text-xs border">
                  <span className="font-medium text-gray-600">Total Payable Amount:</span>
                  <span className="text-base font-extrabold text-pink-600">₹{Math.floor(totalPrice * 80)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm shadow-md transition"
                >
                  Place Order Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. Wishlist Slide-Over Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" /> My Wishlist ({wishlist.length})
              </h2>
              <button onClick={() => setIsWishlistOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">Your wishlist is empty.</div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border border-gray-100 rounded-lg shadow-sm bg-white items-center">
                    <img src={item.image} alt={item.title} className="w-14 h-14 object-contain" />
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                      <p className="text-xs font-bold text-gray-900 mt-1">₹{Math.floor(item.price * 80)}</p>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(item);
                        toggleWishlist(item);
                      }}
                      className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-xs font-semibold hover:bg-pink-700 transition"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Profile Popup Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">User Profile</h3>
              <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-xl">
                JD
              </div>
              <div>
                <h4 className="font-bold text-gray-900">John Doe</h4>
                <p className="text-xs text-gray-500">+91 9876543210</p>
              </div>
            </div>
            <div className="space-y-2 border-t pt-4">
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">My Orders</button>
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Saved Addresses</button>
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-red-600">Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Footer Section */}
      <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-pink-500">Meesho</span>
                <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-semibold">Pro</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                India's favorite online shopping platform. Lowest prices on fashion, electronics, and daily essentials.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-pink-400 transition">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('about')} className="hover:text-pink-400 transition">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="hover:text-pink-400 transition">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('terms')} className="hover:text-pink-400 transition">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Customer Care</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>Help Center</li>
                <li>Track Order</li>
                <li>Return & Refund</li>
                <li>Contact Support</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Contact Us</h4>
              <p className="text-xs text-gray-400">Email: support@meeshoclone.com</p>
              <p className="text-xs text-gray-400 mt-1">Toll Free: 1800-123-4567</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© {new Date().getFullYear()} MeeshoClone. Built with React & Tailwind CSS.</p>
            <p>Designed for Technical Interview Showcase</p>
          </div>
        </div>
      </footer>

      {/* 9. Footer Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800 capitalize">
                {activeModal === 'about' && 'About Us'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms & Conditions'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              {activeModal === 'about' && (
                <>
                  <p>Welcome to MeeshoClone! We are a leading e-commerce platform dedicated to offering top-quality products at unbeatable prices.</p>
                  <p>Built with modern web technologies like React.js and Tailwind CSS, our platform ensures high speed, seamless UI, and responsive performance across all devices.</p>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>Your privacy is important to us. This platform stores minimum essential data locally in your browser session for cart management.</p>
                  <p>We do not share or sell your personal details to third parties. All mock checkout transactions are strictly for demonstration purposes.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>By accessing MeeshoClone, you agree to follow standard terms of usage. All product listings and prices are mock representations generated via open APIs.</p>
                  <p>Returns and exchanges are subject to mock demo terms within 7 days of delivery.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}