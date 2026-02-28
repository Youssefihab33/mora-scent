import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage, useAsync } from 'react-use';
import { api } from './api';

// MUI Components
import { Box, Container, Grid, Typography, Button, CircularProgress } from '@mui/material';

// Custom Components
import ThemeCustomization from './components/ThemeCustomization';
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

/**
 * Main App Component refactored with MUI and react-use.
 * Handles overall state management, routing (view-based), and data fetching.
 */
const App = () => {
	// State management using react-use hooks where appropriate
	const [lang, setLang] = useLocalStorage('mora-scent-lang', 'ar');
	const [view, setView] = useState('store');
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [cart, setCart] = useLocalStorage('mora-scent-cart', []);
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

	// Sync document direction and language
	useEffect(() => {
		document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
		document.documentElement.lang = lang;
	}, [lang]);

	// Fetch initial data using react-use's useAsync
	const initialData = useAsync(async () => {
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
			throw error;
		}
	}, []);

	// Handle Authentication Logic
	const handleLogin = async (credentials) => {
		try {
			let userData;
			if (credentials.mode === 'signup') {
				const [first_name, ...last_name_parts] = credentials.name.split(' ');
				userData = await api.register({
					username: credentials.email,
					email: credentials.email,
					password: credentials.password,
					first_name: first_name,
					last_name: last_name_parts.join(' '),
				});
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

	// Cart Operations
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

	// Filtered Products based on search and category
	const filteredProducts = useMemo(() => {
		return products.filter((p) => {
			const catMatch = activeCategory === 'الكل' || activeCategory === 'All' || p.category_name === activeCategory || p.category_en === activeCategory;
			const name = (lang === 'ar' ? p.name : p.nameEn) || '';
			const nameMatch = name.toLowerCase().includes(searchQuery.toLowerCase());
			return catMatch && nameMatch;
		});
	}, [products, activeCategory, searchQuery, lang]);

	const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// Order & Review Handling
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

	// Conditional View Rendering (Admin/Store)
	if (view === 'admin') {
		return (
			<ThemeCustomization lang={lang}>
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
			</ThemeCustomization>
		);
	}

	return (
		<ThemeCustomization lang={lang}>
			<Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
				<Header
					lang={lang}
					setLang={setLang}
					cartCount={cart.reduce((a, b) => a + (b.quantity || 0), 0)}
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

				<Box component='main' sx={{ flexGrow: 1 }}>
					<Hero lang={lang} />
					<Container id='collection' maxWidth='lg' sx={{ py: 8 }}>
						<Box sx={{ textAlign: 'center', mb: 6 }}>
							<Typography variant='h3' gutterBottom>
								{lang === 'ar' ? 'مجموعات Mora scent المميزة' : 'Mora scent Special Collections'}
							</Typography>
							<Box sx={{ width: 100, height: 4, bgcolor: 'primary.main', mx: 'auto', mb: 4 }} />
							<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
								<Button
									variant={activeCategory === 'الكل' || activeCategory === 'All' ? 'contained' : 'outlined'}
									color='secondary'
									onClick={() => setActiveCategory(lang === 'ar' ? 'الكل' : 'All')}
								>
									{lang === 'ar' ? 'الكل' : 'All'}
								</Button>
								{categories.map((cat) => (
									<Button
										key={cat.id}
										variant={activeCategory === (lang === 'ar' ? cat.ar : cat.en) ? 'contained' : 'outlined'}
										color='secondary'
										onClick={() => setActiveCategory(lang === 'ar' ? cat.ar : cat.en)}
									>
										{lang === 'ar' ? cat.ar : cat.en}
									</Button>
								))}
							</Box>
						</Box>

						{initialData.loading ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
								<CircularProgress color='primary' />
							</Box>
						) : (
							<Grid container spacing={4}>
								{filteredProducts.map((product) => (
									<Grid item key={product.id} xs={12} sm={6} md={3}>
										<ProductCard
											product={product}
											lang={lang}
											onAddToCart={addToCart}
											onViewDetails={(p) => setSelectedProduct(p)}
											reviews={reviews.filter((r) => r.product === product.id)}
											isReviewSystemActive={isReviewSystemActive}
										/>
									</Grid>
								))}
							</Grid>
						)}
					</Container>
				</Box>

				<Footer lang={lang} onAdminClick={() => setView('admin')} storeSettings={storeSettings} />
				<ChatWidget lang={lang} products={products} storeSettings={storeSettings} />
			</Box>
		</ThemeCustomization>
	);
};

export default App;
