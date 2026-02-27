import { useState, useEffect } from 'react';
import { api } from './api';

import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import LoginDrawer from './components/LoginDrawer';

const App = () => {
	const [lang, setLang] = useState('ar');
	const [view, setView] = useState('store');
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [cart, setCart] = useState([]);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState('الكل');
	const [orders, setOrders] = useState([]);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [user, setUser] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [isReviewSystemActive, setIsReviewSystemActive] = useState(true);
	const [customers, setCustomers] = useState([]);
	const [storeSettings, setStoreSettings] = useState({
		name: 'Mora scent',
		logo: 'M',
		email: 'info@morascent.com',
		whatsapp: '01550294614',
		currency: 'ج.م',
		defaultLanguage: 'ar',
		taxPercentage: 14,
		policy: 'سياسة المتجر',
		aiDevelopmentEnabled: true,
	});
	const [coupons, setCoupons] = useState([]);
	const [shippingCompanies, setShippingCompanies] = useState([]);
	const [shippingZones, setShippingZones] = useState([]);

	useEffect(() => {
		document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
		document.documentElement.lang = lang;
	}, [lang]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [productsData, categoriesData, settingsData, reviewsData, couponsData, shippingCompaniesData, shippingZonesData] = await Promise.all([
					api.getProducts(),
					api.getCategories(),
					api.getSettings(),
					api.getReviews(),
					api.getCoupons(),
					api.getShippingCompanies(),
					api.getShippingZones(),
				]);
				setProducts(productsData);
				setCategories(categoriesData);
				if (settingsData && settingsData.length > 0) setStoreSettings(settingsData[0]);
				setReviews(reviewsData);
				setCoupons(couponsData);
				setShippingCompanies(shippingCompaniesData);
				setShippingZones(shippingZonesData);

				const token = localStorage.getItem('token');
				if (token) {
					const userData = await api.getUser();
					setUser(userData);
					if (userData.is_staff) {
						const [ordersData, customersData] = await Promise.all([api.getOrders(), api.getCustomers()]);
						setOrders(ordersData);
						setCustomers(customersData);
					}
				}
			} catch (error) {
				console.error('Failed to fetch initial data:', error);
			}
		};
		fetchData();
	}, []);

	const handleLogin = async (credentials) => {
		try {
			let userData;
			if (credentials.mode === 'signup') {
				const [first_name, ...last_name_parts] = credentials.name.split(' ');
				userData = await api.register({ username: credentials.email, email: credentials.email, password: credentials.password, first_name: first_name, last_name: last_name_parts.join(' ') });
			} else {
				userData = await api.login(credentials.email, credentials.password);
			}
			setUser(userData);
			setIsLoginOpen(false);
			if (userData.is_staff) {
				const [ordersData, customersData] = await Promise.all([api.getOrders(), api.getCustomers()]);
				setOrders(ordersData);
				setCustomers(customersData);
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const handleLogout = async () => {
		try {
			await api.logout();
			setUser(null);
			setOrders([]);
			setCustomers([]);
			setIsLoginOpen(false);
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const addToCart = (product) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
			return [...prev, { ...product, quantity: 1 }];
		});
		setIsCartOpen(true);
	};

	const updateQuantity = (id, delta) => setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)));
	const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

	const filteredProducts = products.filter((p) => {
		const catMatch = activeCategory === 'الكل' || p.category_name === activeCategory || p.category_en === activeCategory;
		const nameMatch = (lang === 'ar' ? p.name : p.nameEn).toLowerCase().includes(searchQuery.toLowerCase());
		return catMatch && nameMatch;
	});

	const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const handleAddReview = async (reviewData) => {
		try {
			const newReview = await api.addReview(reviewData);
			setReviews((prev) => [...prev, newReview]);
		} catch (error) {
			alert(error.message);
		}
	};

	const handleOrderSubmit = async (orderData) => {
		try {
			const newOrder = await api.createOrder({ ...orderData, items: cart, subtotal: cartTotal });
			setOrders((prev) => [newOrder, ...prev]);
			setCart([]);
			setIsCheckoutOpen(false);
		} catch (error) {
			alert(error.message);
		}
	};

	if (view === 'admin') {
		return (
			<AdminDashboard
				orders={orders}
				setOrders={setOrders}
				products={products}
				setProducts={setProducts}
				categories={categories}
				setCategories={setCategories}
				customers={customers}
				setCustomers={setCustomers}
				onClose={() => setView('store')}
				lang={lang}
				isReviewSystemActive={isReviewSystemActive}
				setIsReviewSystemActive={setIsReviewSystemActive}
				storeSettings={storeSettings}
				setStoreSettings={setStoreSettings}
				coupons={coupons}
				setCoupons={setCoupons}
				shippingCompanies={shippingCompanies}
				setShippingCompanies={setShippingCompanies}
				shippingZones={shippingZones}
				setShippingZones={setShippingZones}
				api={api}
			/>
		);
	}

	return (
		<div className={`min-h-screen bg-neutral-50 font-sans text-neutral-900 ${lang === 'en' ? 'font-sans' : ''}`}>
			<Header
				lang={lang}
				setLang={setLang}
				cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
				isSearchOpen={isSearchOpen}
				setIsSearchOpen={setIsSearchOpen}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onOpenCart={() => setIsCartOpen(true)}
				onOpenLogin={() => setIsLoginOpen(true)}
				products={products}
				user={user}
				onLogin={handleLogin}
				onLogout={handleLogout}
				storeSettings={storeSettings}
			/>
			<CartDrawer
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
				cart={cart}
				lang={lang}
				updateQuantity={updateQuantity}
				removeFromCart={removeFromCart}
				total={cartTotal}
				onCheckout={() => {
					setIsCartOpen(false);
					setIsCheckoutOpen(true);
				}}
			/>
			<LoginDrawer isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} lang={lang} user={user} onLogin={handleLogin} onLogout={handleLogout} orders={orders} />
			{isCheckoutOpen && (
				<CheckoutModal
					lang={lang}
					user={user}
					onClose={() => setIsCheckoutOpen(false)}
					total={cartTotal}
					cart={cart}
					onOrderSubmit={handleOrderSubmit}
					storeSettings={storeSettings}
					coupons={coupons}
					shippingZones={shippingZones}
				/>
			)}
			{selectedProduct && (
				<ProductDetail
					product={selectedProduct}
					lang={lang}
					onClose={() => setSelectedProduct(null)}
					onAddToCart={(p) => {
						addToCart(p);
						setSelectedProduct(null);
					}}
					reviews={reviews.filter((r) => r.product === selectedProduct.id)}
					onAddReview={handleAddReview}
					user={user}
					isReviewSystemActive={isReviewSystemActive}
				/>
			)}
			<main>
				<Hero lang={lang} />
				<div id='collection' className='max-w-7xl mx-auto px-4 py-16'>
					<div className='text-center mb-12'>
						<h3 className='text-3xl font-serif font-bold text-neutral-900 mb-4'>{lang === 'ar' ? 'مجموعات Mora scent المميزة' : 'Mora scent Special Collections'}</h3>
						<div className='w-24 h-1 bg-[#D4AF37] mx-auto mb-2'></div>
						<div className='flex flex-wrap justify-center gap-4'>
							{categories.map((cat) => (
								<button
									key={cat.id}
									onClick={() => setActiveCategory(lang === 'ar' ? cat.ar : cat.en)}
									className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.ar || activeCategory === cat.en ? 'bg-[#1a1a1a] text-white' : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[#D4AF37]'}`}
								>
									{lang === 'ar' ? cat.ar : cat.en}
								</button>
							))}
						</div>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
						{filteredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								lang={lang}
								onAddToCart={addToCart}
								onViewDetails={(p) => setSelectedProduct(p)}
								reviews={reviews.filter((r) => r.product === product.id)}
								isReviewSystemActive={isReviewSystemActive}
							/>
						))}
					</div>
				</div>
			</main>
			<Footer lang={lang} onAdminClick={() => setView('admin')} storeSettings={storeSettings} />
			<ChatWidget lang={lang} products={products} storeSettings={storeSettings} />
		</div>
	);
};

export default App;
