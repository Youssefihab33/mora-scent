import React, { useState, useRef, useMemo } from 'react';
import {
	Box,
	Container,
	Typography,
	Button,
	Tabs,
	Tab,
	Grid,
	Paper,
	Stack,
	IconButton,
	Avatar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Switch,
	Divider,
	Badge,
	Tooltip,
	InputAdornment,
	Card,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import BlockIcon from '@mui/icons-material/Block';
import DescriptionIcon from '@mui/icons-material/Description';
import RestoreIcon from '@mui/icons-material/Restore';
import SettingsIcon from '@mui/icons-material/Settings';
import MailIcon from '@mui/icons-material/Mail';
import ChatIcon from '@mui/icons-material/Chat';
import LanguageIcon from '@mui/icons-material/Language';
import PercentIcon from '@mui/icons-material/Percent';
import SecurityIcon from '@mui/icons-material/Security';
import MemoryIcon from '@mui/icons-material/Memory';
import LockIcon from '@mui/icons-material/Lock';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import HistoryIcon from '@mui/icons-material/History';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { useTitle } from 'react-use';

/**
 * AdminDashboard component migrated to MUI.
 * Central hub for store management including products, orders, customers, and settings.
 * Refactored for better readability and consistent theme usage.
 */
const AdminDashboard = ({
	orders,
	setOrders,
	products,
	setProducts,
	categories,
	setCategories,
	customers,
	setCustomers,
	onClose,
	lang,
	isReviewSystemActive,
	setIsReviewSystemActive,
	storeSettings,
	setStoreSettings,
	coupons,
	setCoupons,
	shippingCompanies,
	setShippingCompanies,
	shippingZones,
	setShippingZones,
	api,
}) => {
	useTitle(lang === 'ar' ? 'لوحة التحكم | Mora scent' : 'Dashboard | Mora scent');

	const [activeTab, setActiveTab] = useState('stats');
	const [editingId, setEditingId] = useState(null);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [newCoupon, setNewCoupon] = useState({
		code: '',
		discountType: 'percentage',
		discountValue: 0,
		minOrderValue: 0,
		expiryDate: '',
		usageLimit: 100,
		isActive: true,
	});
	const [newCat, setNewCat] = useState({ ar: '', en: '' });
	const [newProduct, setNewProduct] = useState({
		category_name: categories[0]?.ar || '',
		category_en: categories[0]?.en || '',
		image: '',
		images: [],
		name: '',
		nameEn: '',
		price: 0,
		description: '',
		descriptionEn: '',
		stock: 0,
	});

	const mainImageRef = useRef(null);
	const currency = lang === 'ar' ? 'ج.م' : 'EGP';

	// Helper: Change Active Tab
	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	// --- Category Management ---
	const handleAddCategory = () => {
		if (!newCat.ar || !newCat.en) return;
		setCategories((prev) => [...prev, { ...newCat, id: Date.now() }]);
		setNewCat({ ar: '', en: '' });
	};

	const removeCategory = (id) => {
		setCategories((prev) => prev.filter((c) => c.id !== id));
	};

	// --- Product Management ---
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			setNewProduct((prev) => ({ ...prev, image: reader.result }));
		};
		reader.readAsDataURL(file);
	};

	const handleAddOrUpdateProduct = async () => {
		if (!newProduct.name || !newProduct.price || !newProduct.image) {
			alert(lang === 'ar' ? 'أكمل البيانات' : 'Complete details');
			return;
		}

		try {
			if (editingId !== null) {
				const updated = await api.updateProduct(editingId, newProduct);
				setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
			} else {
				const created = await api.createProduct(newProduct);
				setProducts((prev) => [...prev, created]);
			}
			resetProductForm();
		} catch (error) {
			// Fallback for demo/missing API methods during migration
			if (editingId !== null) {
				setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...newProduct, id: editingId } : p)));
			} else {
				setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
			}
			resetProductForm();
		}
	};

	const resetProductForm = () => {
		setEditingId(null);
		setNewProduct({
			category_name: categories[0]?.ar,
			category_en: categories[0]?.en,
			image: '',
			images: [],
			name: '',
			nameEn: '',
			price: 0,
			description: '',
			descriptionEn: '',
			stock: 0,
		});
	};

	// --- Stats Calculations ---
	const stats = useMemo(() => {
		const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
		const lowStockCount = products.filter((p) => p.stock <= 5).length;
		return { totalRevenue, totalOrders: orders.length, totalProducts: products.length, lowStockCount };
	}, [orders, products]);

	// --- DataGrid Columns Definition ---
	const orderColumns = [
		{ field: 'id', headerName: 'ID', width: 150, headerAlign: 'center', align: 'center', renderCell: (params) => <Typography sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{params.value}</Typography> },
		{ field: 'customer_name', headerName: lang === 'ar' ? 'العميل' : 'Customer', width: 200, flex: 1, valueGetter: (value, row) => row.customer_name || row.customer?.name },
		{ field: 'total', headerName: lang === 'ar' ? 'الإجمالي' : 'Total', width: 130, renderCell: (params) => <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{params.value} {currency}</Typography> },
		{
			field: 'status',
			headerName: lang === 'ar' ? 'الحالة' : 'Status',
			width: 130,
			renderCell: (params) => (
				<Chip
					label={params.value}
					size='small'
					sx={{
						fontWeight: 800,
						bgcolor: params.value === 'جديد' ? 'info.light' : params.value === 'مكتمل' ? 'success.light' : 'warning.light',
						color: params.value === 'جديد' ? 'info.dark' : params.value === 'مكتمل' ? 'success.dark' : 'warning.dark',
					}}
				/>
			),
		},
		{
			field: 'action',
			headerName: lang === 'ar' ? 'إجراء' : 'Action',
			width: 180,
			renderCell: (params) => (
				<FormControl size='small' fullWidth sx={{ mt: 1 }}>
					<Select
						value={params.row.status}
						onChange={(e) => {
							const newStatus = e.target.value;
							setOrders((prev) => prev.map((order) => (order.id === params.row.id ? { ...order, status: newStatus } : order)));
						}}
						sx={{ borderRadius: 2, fontSize: '0.75rem' }}
					>
						<MenuItem value="جديد">{lang === 'ar' ? 'جديد' : 'New'}</MenuItem>
						<MenuItem value="قيد التجهيز">{lang === 'ar' ? 'قيد التجهيز' : 'Processing'}</MenuItem>
						<MenuItem value="تم الشحن">{lang === 'ar' ? 'تم الشحن' : 'Shipped'}</MenuItem>
						<MenuItem value="مكتمل">{lang === 'ar' ? 'مكتمل' : 'Completed'}</MenuItem>
						<MenuItem value="ملغي">{lang === 'ar' ? 'ملغي' : 'Cancelled'}</MenuItem>
					</Select>
				</FormControl>
			),
		},
	];

	const customerColumns = [
		{
			field: 'name',
			headerName: lang === 'ar' ? 'العميل' : 'Customer',
			width: 250,
			flex: 1,
			renderCell: (params) => (
				<Stack direction='row' spacing={2} alignItems='center' sx={{ height: '100%' }}>
					<Avatar sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 'bold' }}>{params.value.charAt(0)}</Avatar>
					<Box>
						<Typography variant='subtitle2' fontWeight='bold'>{params.value}</Typography>
						<Typography variant='caption' color='text.secondary'>ID: {params.row.id}</Typography>
					</Box>
				</Stack>
			),
		},
		{
			field: 'contact',
			headerName: lang === 'ar' ? 'التواصل' : 'Contact',
			width: 250,
			renderCell: (params) => (
				<Box sx={{ mt: 1 }}>
					<Typography variant='body2' fontWeight='bold'>{params.row.phone}</Typography>
					<Typography variant='caption' display='block'>{params.row.email}</Typography>
				</Box>
			),
		},
		{ field: 'order_count', headerName: lang === 'ar' ? 'الطلبات' : 'Orders', width: 120, valueGetter: (value, row) => row.order_count || row.orderCount },
		{
			field: 'total_spent',
			headerName: lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent',
			width: 150,
			renderCell: (params) => (
				<Typography sx={{ fontWeight: 800, color: 'primary.main', mt: 1.5 }}>
					{params.row.total_spent || params.row.totalSpent} {currency}
				</Typography>
			),
		},
		{
			field: 'actions',
			headerName: lang === 'ar' ? 'الإجراءات' : 'Actions',
			width: 120,
			renderCell: (params) => (
				<IconButton
					color={params.row.isBlocked ? 'error' : 'default'}
					onClick={() => setCustomers(prev => prev.map(cust => cust.id === params.row.id ? { ...cust, isBlocked: !cust.isBlocked } : cust))}
				>
					<BlockIcon sx={{ fontSize: 18 }} />
				</IconButton>
			),
		},
	];

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#fcfcfc' }}>
			{/* Admin Header */}
			<Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 2.5, position: 'sticky', top: 0, zIndex: 1100 }}>
				<Container maxWidth='xl'>
					<Stack direction='row' justifyContent='space-between' alignItems='center'>
						<Stack direction='row' spacing={2} alignItems='center'>
							<Avatar sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 800 }}>M</Avatar>
							<Typography variant='h5' sx={{ fontWeight: 700, color: 'primary.main', display: { xs: 'none', sm: 'block' } }}>
								{lang === 'ar' ? 'إدارة Mora scent' : 'Mora scent Admin'}
							</Typography>
						</Stack>
						<Button
							variant='outlined'
							color='inherit'
							onClick={onClose}
							startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
							sx={{ borderRadius: 10, borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
						>
							{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
						</Button>
					</Stack>
				</Container>
			</Box>

			<Container maxWidth='xl' sx={{ py: 6 }}>
				{/* Navigation Tabs */}
				<Paper sx={{ mb: 6, borderRadius: 4, overflow: 'hidden' }}>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						variant='scrollable'
						scrollButtons='auto'
						textColor='primary'
						indicatorColor='primary'
						sx={{ px: 2 }}
					>
						<Tab value='stats' label={lang === 'ar' ? 'الإحصائيات' : 'Stats'} icon={<TrendingUpIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='orders' label={lang === 'ar' ? 'الطلبات' : 'Orders'} icon={<AssignmentIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='products' label={lang === 'ar' ? 'المنتجات' : 'Products'} icon={<ShoppingBagIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='categories' label={lang === 'ar' ? 'الفئات' : 'Categories'} icon={<AccountTreeIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='customers' label={lang === 'ar' ? 'العملاء' : 'Customers'} icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='shipping' label={lang === 'ar' ? 'الشحن' : 'Shipping'} icon={<LocalShippingIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='coupons' label={lang === 'ar' ? 'الكوبونات' : 'Coupons'} icon={<LocalActivityIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='security' label={lang === 'ar' ? 'الأمان' : 'Security'} icon={<LockIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
						<Tab value='settings' label={lang === 'ar' ? 'الإعدادات' : 'Settings'} icon={<SettingsIcon sx={{ fontSize: 18 }} />} iconPosition='start' />
					</Tabs>
				</Paper>

				{/* TAB CONTENT: STATS */}
				{activeTab === 'stats' && (
					<Stack spacing={4}>
						<Grid container spacing={4}>
							<Grid item xs={12} md={4}>
								<Card sx={{ borderRadius: 6, textAlign: 'center', p: 2 }}>
									<CardContent>
										<Avatar sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', color: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
											<AssignmentIcon sx={{ fontSize: 32 }} />
										</Avatar>
										<Typography variant='overline' color='text.secondary' fontWeight='bold'>{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</Typography>
										<Typography variant='h3' fontWeight='bold'>{stats.totalOrders}</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={4}>
								<Card sx={{ borderRadius: 6, textAlign: 'center', p: 2 }}>
									<CardContent>
										<Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 64, height: 64, mx: 'auto', mb: 2 }}>
											<AccountBalanceWalletIcon sx={{ fontSize: 32 }} />
										</Avatar>
										<Typography variant='overline' color='text.secondary' fontWeight='bold'>{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</Typography>
										<Typography variant='h3' fontWeight='bold'>
											{stats.totalRevenue.toLocaleString()} <Typography component='span' variant='h6'>{currency}</Typography>
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={4}>
								<Card sx={{ borderRadius: 6, textAlign: 'center', p: 2 }}>
									<CardContent>
										<Avatar sx={{ bgcolor: 'info.light', color: 'info.dark', width: 64, height: 64, mx: 'auto', mb: 2 }}>
											<ShoppingBagIcon sx={{ fontSize: 32 }} />
										</Avatar>
										<Typography variant='overline' color='text.secondary' fontWeight='bold'>{lang === 'ar' ? 'عدد المنتجات' : 'Total Products'}</Typography>
										<Typography variant='h3' fontWeight='bold'>{stats.totalProducts}</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>

						<Grid container spacing={4}>
							{/* Recent Orders Table */}
							<Grid item xs={12} lg={6}>
								<Paper sx={{ p: 4, borderRadius: 6 }}>
									<Typography variant='h6' sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
										<AccessTimeIcon sx={{ color: '#D4AF37' }} /> {lang === 'ar' ? 'أحدث الطلبات' : 'Recent Orders'}
									</Typography>
									<TableContainer>
										<Table size='small'>
											<TableHead>
												<TableRow>
													<TableCell fontWeight='bold'>{lang === 'ar' ? 'العميل' : 'Customer'}</TableCell>
													<TableCell fontWeight='bold'>{lang === 'ar' ? 'الإجمالي' : 'Total'}</TableCell>
													<TableCell fontWeight='bold'>{lang === 'ar' ? 'الحالة' : 'Status'}</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{orders.slice(0, 5).map((o) => (
													<TableRow key={o.id}>
														<TableCell>{o.customer_name || o.customer?.name}</TableCell>
														<TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{o.total} {currency}</TableCell>
														<TableCell>
															<Chip label={o.status} size='small' color='info' variant='outlined' sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</Paper>
							</Grid>
							{/* Low Stock Alerts */}
							<Grid item xs={12} lg={6}>
								<Paper sx={{ p: 4, borderRadius: 6 }}>
									<Typography variant='h6' sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, color: 'error.main' }}>
										<WarningAmberIcon /> {lang === 'ar' ? 'تنبيهات المخزون' : 'Inventory Alerts'}
									</Typography>
									<Stack spacing={2}>
										{products.filter(p => p.stock <= 5).slice(0, 5).map(p => (
											<Paper key={p.id} variant='outlined' sx={{ p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'error.light', borderColor: 'error.main', opacity: 0.8 }}>
												<Stack direction='row' spacing={2} alignItems='center'>
													<Avatar variant='rounded' src={p.image} />
													<Box>
														<Typography variant='subtitle2' fontWeight='bold'>{lang === 'ar' ? p.name : p.nameEn}</Typography>
														<Typography variant='caption'>{lang === 'ar' ? 'المخزون حرج' : 'Critical Stock'}</Typography>
													</Box>
												</Stack>
												<Typography variant='h6' fontWeight='bold' color='error.dark'>{p.stock}</Typography>
											</Paper>
										))}
										{stats.lowStockCount === 0 && (
											<Typography variant='body2' align='center' color='text.secondary' sx={{ py: 4 }}>
												{lang === 'ar' ? 'المخزون سليم حالياً' : 'Inventory is healthy'}
											</Typography>
										)}
									</Stack>
								</Paper>
							</Grid>
						</Grid>
					</Stack>
				)}

				{/* TAB CONTENT: ORDERS */}
				{activeTab === 'orders' && (
					<Paper sx={{ height: 600, width: '100%', borderRadius: 6, overflow: 'hidden' }}>
						<DataGrid
							rows={orders}
							columns={orderColumns}
							pageSizeOptions={[5, 10, 25]}
							initialState={{
								pagination: { paginationModel: { pageSize: 10 } },
							}}
							onRowClick={(params) => setSelectedOrder(params.row)}
							sx={{
								border: 'none',
								'& .MuiDataGrid-columnHeaders': {
									bgcolor: 'grey.50',
									fontWeight: 800,
								},
								'& .MuiDataGrid-cell:focus': {
									outline: 'none',
								},
							}}
							disableRowSelectionOnClick
						/>
					</Paper>
				)}

				{/* TAB CONTENT: PRODUCTS */}
				{activeTab === 'products' && (
					<Grid container spacing={6}>
						{/* Product Form Side */}
						<Grid item xs={12} lg={4}>
							<Paper sx={{ p: 4, borderRadius: 6, position: 'sticky', top: 120 }}>
								<Typography variant='h6' sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
									{editingId ? <EditIcon sx={{ color: '#D4AF37' }} /> : <AddIcon sx={{ color: '#D4AF37' }} />}
									{editingId ? (lang === 'ar' ? 'تعديل منتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
								</Typography>

								<Stack spacing={3}>
									{/* Image Upload Area */}
									<Box
										onClick={() => mainImageRef.current?.click()}
										sx={{
											border: '2px dashed',
											borderColor: 'divider',
											borderRadius: 4,
											p: 2,
											textAlign: 'center',
											cursor: 'pointer',
											bgcolor: 'grey.50',
											transition: '0.3s',
											'&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(212, 175, 55, 0.05)' },
										}}
									>
										{newProduct.image ? (
											<Box component='img' src={newProduct.image} sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 3 }} />
										) : (
											<Box sx={{ py: 4 }}>
												<ImageIcon sx={{ fontSize: 48, color: '#ccc' }} />
												<Typography variant='caption' display='block' sx={{ mt: 1, fontWeight: 'bold', color: 'text.secondary' }}>
													{lang === 'ar' ? 'اضغط لرفع الصورة' : 'Click to upload image'}
												</Typography>
											</Box>
										)}
										<input type='file' hidden ref={mainImageRef} onChange={handleFileUpload} accept='image/*' />
									</Box>

									<Grid container spacing={2}>
										<Grid item xs={6}>
											<FormControl fullWidth size='small'>
												<InputLabel>{lang === 'ar' ? 'الفئة' : 'Category'}</InputLabel>
												<Select
													value={newProduct.category_name}
													onChange={(e) => {
														const cat = categories.find(c => c.ar === e.target.value);
														setNewProduct({ ...newProduct, category_name: cat?.ar, category_en: cat?.en });
													}}
													label={lang === 'ar' ? 'الفئة' : 'Category'}
												>
													{categories.map((c) => (
														<MenuItem key={c.en} value={c.ar}>{lang === 'ar' ? c.ar : c.en}</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={6}>
											<TextField
												fullWidth
												size='small'
												type='number'
												label={lang === 'ar' ? 'المخزون' : 'Stock'}
												value={newProduct.stock}
												onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
											/>
										</Grid>
									</Grid>

									<TextField
										fullWidth
										size='small'
										label={lang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}
										value={newProduct.name}
										onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
									/>
									<TextField
										fullWidth
										size='small'
										label={lang === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}
										value={newProduct.nameEn}
										onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
									/>
									<TextField
										fullWidth
										size='small'
										type='number'
										label={lang === 'ar' ? 'السعر' : 'Price'}
										value={newProduct.price}
										onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
										InputProps={{ startAdornment: <InputAdornment position='start'>{currency}</InputAdornment> }}
									/>
									<TextField
										fullWidth
										multiline
										rows={3}
										label={lang === 'ar' ? 'الوصف' : 'Description'}
										value={newProduct.description}
										onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
									/>

									<Stack direction='row' spacing={2}>
										{editingId && (
											<Button fullWidth variant='outlined' onClick={resetProductForm}>
												{lang === 'ar' ? 'إلغاء' : 'Cancel'}
											</Button>
										)}
										<Button fullWidth variant='contained' color='secondary' onClick={handleAddOrUpdateProduct} sx={{ fontWeight: 800 }}>
											{editingId ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add')}
										</Button>
									</Stack>
								</Stack>
							</Paper>
						</Grid>

						{/* Product List Side */}
						<Grid item xs={12} lg={8}>
							<Typography variant='h6' sx={{ mb: 4 }}>
								{lang === 'ar' ? 'قائمة المنتجات' : 'Product List'} ({products.length})
							</Typography>
							<Stack spacing={2}>
								{products.map((p) => (
									<Paper key={p.id} sx={{ p: 2, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s', '&:hover': { borderColor: 'primary.main', border: 1 } }}>
										<Stack direction='row' spacing={3} alignItems='center'>
											<Box sx={{ position: 'relative' }}>
												<Avatar variant='rounded' src={p.image} sx={{ width: 80, height: 80, borderRadius: 3 }} />
												{p.stock <= 5 && <Chip label={lang === 'ar' ? 'منخفض' : 'Low'} size='small' color='error' sx={{ position: 'absolute', top: -10, right: -10, height: 20, fontSize: '0.6rem', fontWeight: 'bold' }} />}
											</Box>
											<Box>
												<Typography variant='subtitle1' fontWeight='bold'>{lang === 'ar' ? p.name : p.nameEn}</Typography>
												<Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 1 }}>{lang === 'ar' ? p.category_name : p.category_en}</Typography>
												<Stack direction='row' spacing={2}>
													<Chip label={`${p.price} ${currency}`} size='small' color='primary' variant='outlined' sx={{ fontWeight: 800 }} />
													<Chip icon={<WarehouseIcon sx={{ fontSize: 12 }} />} label={`${p.stock} pcs`} size='small' variant='outlined' />
												</Stack>
											</Box>
										</Stack>
										<Stack direction='row' spacing={1}>
											<IconButton
												color='info'
												onClick={() => {
													setEditingId(p.id);
													setNewProduct(p);
													window.scrollTo({ top: 0, behavior: 'smooth' });
												}}
											>
												<EditIcon sx={{ fontSize: 18 }} />
											</IconButton>
											<IconButton
												color='error'
												onClick={() => {
													if (confirm(lang === 'ar' ? 'حذف المنتج؟' : 'Delete product?')) {
														setProducts((prev) => prev.filter((x) => x.id !== p.id));
													}
												}}
											>
												<DeleteIcon sx={{ fontSize: 18 }} />
											</IconButton>
										</Stack>
									</Paper>
								))}
							</Stack>
						</Grid>
					</Grid>
				)}

				{/* TAB CONTENT: CATEGORIES */}
				{activeTab === 'categories' && (
					<Paper sx={{ p: 6, borderRadius: 6 }}>
						<Typography variant='h6' sx={{ mb: 4 }}>{lang === 'ar' ? 'إدارة الفئات' : 'Manage Categories'}</Typography>
						<Grid container spacing={2} sx={{ mb: 6 }}>
							<Grid item xs={12} sm={4}>
								<TextField fullWidth label='الاسم بالعربي' value={newCat.ar} onChange={(e) => setNewCat({ ...newCat, ar: e.target.value })} />
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField fullWidth label='Name in English' value={newCat.en} onChange={(e) => setNewCat({ ...newCat, en: e.target.value })} />
							</Grid>
							<Grid item xs={12} sm={4}>
								<Button fullWidth variant='contained' color='primary' size='large' onClick={handleAddCategory} sx={{ height: '100%', fontWeight: 800, color: 'black' }}>
									{lang === 'ar' ? 'إضافة فئة' : 'Add Category'}
								</Button>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							{categories.map((c) => (
								<Grid item key={c.en} xs={6} md={3}>
									<Paper variant='outlined' sx={{ p: 2, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50' }}>
										<Typography fontWeight='bold'>{lang === 'ar' ? c.ar : c.en}</Typography>
										{c.ar !== 'الكل' && (
											<IconButton size='small' color='error' onClick={() => removeCategory(c.id)}>
												<CloseIcon sx={{ fontSize: 16 }} />
											</IconButton>
										)}
									</Paper>
								</Grid>
							))}
						</Grid>
					</Paper>
				)}

				{/* TAB CONTENT: CUSTOMERS */}
				{activeTab === 'customers' && (
					<Paper sx={{ height: 600, width: '100%', borderRadius: 6, overflow: 'hidden' }}>
						<DataGrid
							rows={customers}
							columns={customerColumns}
							pageSizeOptions={[5, 10, 25]}
							initialState={{
								pagination: { paginationModel: { pageSize: 10 } },
							}}
							sx={{
								border: 'none',
								'& .MuiDataGrid-columnHeaders': {
									bgcolor: 'grey.50',
									fontWeight: 800,
								},
								'& .MuiDataGrid-row': {
									opacity: (params) => (params.row.isBlocked ? 0.5 : 1),
								},
							}}
							disableRowSelectionOnClick
						/>
					</Paper>
				)}

				{/* TAB CONTENT: SHIPPING */}
				{activeTab === 'shipping' && (
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Paper sx={{ p: 4, borderRadius: 6 }}>
								<Typography variant='h6' sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
									<LocalShippingIcon sx={{ color: '#D4AF37' }} /> {lang === 'ar' ? 'شركات الشحن' : 'Shipping Companies'}
								</Typography>
								<Stack spacing={2}>
									{shippingCompanies.map(company => (
										<Paper key={company.id} variant='outlined' sx={{ p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<Box>
												<Typography variant='subtitle2' fontWeight='bold'>{company.name}</Typography>
												<Typography variant='caption'>{company.contact}</Typography>
											</Box>
											<Switch
												checked={company.isActive}
												onChange={() => setShippingCompanies(prev => prev.map(c => c.id === company.id ? { ...c, isActive: !c.isActive } : c))}
											/>
										</Paper>
									))}
									<Button fullWidth variant='outlined' startIcon={<AddIcon sx={{ fontSize: 18 }} />} sx={{ borderStyle: 'dashed', py: 1.5, borderRadius: 3 }}>
										{lang === 'ar' ? 'إضافة شركة' : 'Add Company'}
									</Button>
								</Stack>
							</Paper>
						</Grid>
						<Grid item xs={12} md={6}>
							<Paper sx={{ p: 4, borderRadius: 6 }}>
								<Typography variant='h6' sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
									<LocationOnIcon sx={{ color: '#D4AF37' }} /> {lang === 'ar' ? 'المناطق والأسعار' : 'Zones & Rates'}
								</Typography>
								<Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
									<Stack spacing={2}>
										{shippingZones.map(zone => (
											<Paper key={zone.id} variant='outlined' sx={{ p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Box>
													<Typography variant='subtitle2' fontWeight='bold'>{zone.city}</Typography>
													<Typography variant='caption'>{zone.delivery_time || zone.deliveryTime}</Typography>
												</Box>
												<Stack direction='row' spacing={2} alignItems='center'>
													<TextField
														size='small'
														type='number'
														value={zone.rate}
														onChange={(e) => setShippingZones(prev => prev.map(z => z.id === zone.id ? { ...z, rate: Number(e.target.value) } : z))}
														sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
													/>
													<Switch
														size='small'
														checked={zone.isActive}
														onChange={() => setShippingZones(prev => prev.map(z => z.id === zone.id ? { ...z, isActive: !z.isActive } : z))}
													/>
												</Stack>
											</Paper>
										))}
									</Stack>
								</Box>
							</Paper>
						</Grid>
					</Grid>
				)}

				{/* TAB CONTENT: COUPONS */}
				{activeTab === 'coupons' && (
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<Paper sx={{ p: 4, borderRadius: 6 }}>
								<Typography variant='h6' sx={{ mb: 4 }}>{lang === 'ar' ? 'إنشاء كوبون' : 'Create Coupon'}</Typography>
								<Stack spacing={3}>
									<TextField
										fullWidth
										label={lang === 'ar' ? 'الكود' : 'Code'}
										value={newCoupon.code}
										onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
										sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, fontFamily: 'monospace' } }}
									/>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<FormControl fullWidth size='small'>
												<Select
													value={newCoupon.discountType}
													onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
												>
													<MenuItem value='percentage'>{lang === 'ar' ? 'نسبة %' : 'Percentage %'}</MenuItem>
													<MenuItem value='fixed'>{lang === 'ar' ? 'مبلغ ثابت' : 'Fixed'}</MenuItem>
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={6}>
											<TextField
												fullWidth
												size='small'
												type='number'
												label='Value'
												value={newCoupon.discountValue}
												onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
											/>
										</Grid>
									</Grid>
									<TextField
										fullWidth
										type='date'
										label='Expiry'
										InputLabelProps={{ shrink: true }}
										value={newCoupon.expiryDate}
										onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
									/>
									<Button variant='contained' color='secondary' fullWidth onClick={() => {
										setCoupons(prev => [...prev, { ...newCoupon, id: Date.now().toString(), usageCount: 0 }]);
										setNewCoupon({ code: '', discountType: 'percentage', discountValue: 0, minOrderValue: 0, expiryDate: '', usageLimit: 100, isActive: true });
									}} sx={{ py: 1.5, fontWeight: 800 }}>
										{lang === 'ar' ? 'حفظ الكوبون' : 'Save Coupon'}
									</Button>
								</Stack>
							</Paper>
						</Grid>
						<Grid item xs={12} lg={8}>
							<Stack spacing={2}>
								{coupons.map(coupon => (
									<Paper key={coupon.id} sx={{ p: 3, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<Stack direction='row' spacing={3} alignItems='center'>
									<Avatar sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', color: 'primary.main' }}><LocalActivityIcon sx={{ fontSize: 24 }} /></Avatar>
											<Box>
												<Typography variant='h6' sx={{ fontFamily: 'monospace', fontWeight: 900 }}>{coupon.code}</Typography>
												<Typography variant='caption' color='text.secondary'>
													{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} ${currency}`} OFF
												</Typography>
											</Box>
										</Stack>
										<Stack direction='row' spacing={4} alignItems='center'>
											<Box textAlign='center'>
												<Typography variant='caption' display='block' fontWeight='bold' color='text.secondary'>EXPIRES</Typography>
												<Typography variant='body2' fontWeight='bold' color='error'>{coupon.expiry_date || coupon.expiryDate}</Typography>
											</Box>
											<IconButton color='error' onClick={() => setCoupons(prev => prev.filter(c => c.id !== coupon.id))}>
												<DeleteIcon sx={{ fontSize: 18 }} />
											</IconButton>
										</Stack>
									</Paper>
								))}
							</Stack>
						</Grid>
					</Grid>
				)}

				{/* TAB CONTENT: SETTINGS */}
				{activeTab === 'settings' && (
					<Stack spacing={4}>
						<Paper sx={{ p: 6, borderRadius: 6 }}>
							<Typography variant='h6' sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
								<SettingsIcon sx={{ color: '#D4AF37' }} /> {lang === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}
							</Typography>
							<Grid container spacing={4}>
								<Grid item xs={12} md={6}>
									<TextField fullWidth label='Store Name' value={storeSettings.name} onChange={e => setStoreSettings({ ...storeSettings, name: e.target.value })} sx={{ mb: 3 }} />
									<TextField fullWidth label='Logo (Text or URL)' value={storeSettings.logo} onChange={e => setStoreSettings({ ...storeSettings, logo: e.target.value })} sx={{ mb: 3 }} />
									<TextField fullWidth label='Email' value={storeSettings.email} onChange={e => setStoreSettings({ ...storeSettings, email: e.target.value })} />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField fullWidth label='WhatsApp' value={storeSettings.whatsapp} onChange={e => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })} sx={{ mb: 3 }} />
									<TextField fullWidth label='Currency' value={storeSettings.currency} onChange={e => setStoreSettings({ ...storeSettings, currency: e.target.value })} sx={{ mb: 3 }} />
									<TextField fullWidth label='Policy' multiline rows={3} value={storeSettings.policy} onChange={e => setStoreSettings({ ...storeSettings, policy: e.target.value })} />
								</Grid>
							</Grid>
						</Paper>

						<Paper sx={{ p: 4, borderRadius: 6, bgcolor: 'rgba(16, 185, 129, 0.05)', border: 1, borderColor: 'success.light' }}>
							<Stack direction='row' justifyContent='space-between' alignItems='center'>
								<Box>
									<Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
										<MemoryIcon sx={{ color: '#10b981' }} /> {lang === 'ar' ? 'تطوير المتجر بالذكاء الاصطناعي' : 'AI Development Mode'}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{lang === 'ar' ? 'السماح للذكاء الاصطناعي بتحسين المتجر تلقائياً' : 'Allow AI to automatically optimize your store'}
									</Typography>
								</Box>
								<Switch
									checked={storeSettings.aiDevelopmentEnabled}
									onChange={() => setStoreSettings({ ...storeSettings, aiDevelopmentEnabled: !storeSettings.aiDevelopmentEnabled })}
									color='success'
								/>
							</Stack>
						</Paper>

						<Paper sx={{ p: 4, borderRadius: 6 }}>
							<Stack direction='row' justifyContent='space-between' alignItems='center'>
								<Box>
									<Typography variant='h6'>{lang === 'ar' ? 'نظام التقييمات' : 'Review System'}</Typography>
									<Typography variant='body2' color='text.secondary'>
										{lang === 'ar' ? 'تفعيل أو تعطيل تقييمات العملاء' : 'Enable or disable customer reviews'}
									</Typography>
								</Box>
								<Switch
									checked={isReviewSystemActive}
									onChange={() => setIsReviewSystemActive(!isReviewSystemActive)}
								/>
							</Stack>
						</Paper>
					</Stack>
				)}
			</Container>

			{/* Order Details Dialog */}
			<Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth='md' fullWidth PaperProps={{ sx: { borderRadius: 6, overflow: 'hidden' } }}>
				{selectedOrder && (
					<>
						<DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Box>
								<Typography variant='h6' color='primary.main' fontWeight='bold'>{lang === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}</Typography>
								<Typography variant='caption' sx={{ fontFamily: 'monospace' }}>#{selectedOrder.id}</Typography>
							</Box>
							<IconButton onClick={() => setSelectedOrder(null)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
						</DialogTitle>
						<DialogContent sx={{ p: 4 }}>
							<Grid container spacing={4} sx={{ mb: 4, pb: 4, borderBottom: 1, borderColor: 'divider' }}>
								<Grid item xs={6}>
									<Typography variant='overline' color='text.secondary' fontWeight='bold' display='block' sx={{ mb: 1 }}>{lang === 'ar' ? 'العميل' : 'Customer'}</Typography>
									<Typography variant='h6' fontWeight='bold'>{selectedOrder.customer_name || selectedOrder.customer?.name}</Typography>
									<Typography variant='body2' color='text.secondary'>{selectedOrder.customer_phone || selectedOrder.customer?.phone}</Typography>
									<Typography variant='body2' color='text.secondary'>{selectedOrder.city}, {selectedOrder.region}</Typography>
								</Grid>
								<Grid item xs={6} textAlign='right'>
									<Typography variant='overline' color='text.secondary' fontWeight='bold' display='block' sx={{ mb: 1 }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</Typography>
									<Typography variant='h4' fontWeight='bold' color='primary'>{selectedOrder.total} {currency}</Typography>
									<Chip label={selectedOrder.status} size='small' color='secondary' sx={{ mt: 1, fontWeight: 'bold' }} />
								</Grid>
							</Grid>

							<Typography variant='overline' fontWeight='bold' sx={{ mb: 2, display: 'block' }}>{lang === 'ar' ? 'المنتجات' : 'Products'}</Typography>
							<Stack spacing={2}>
								{(selectedOrder.items || []).map((item, idx) => (
									<Paper key={idx} variant='outlined' sx={{ p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<Stack direction='row' spacing={2} alignItems='center'>
											<Avatar variant='rounded' src={item.image} />
											<Box>
												<Typography variant='body2' fontWeight='bold'>{lang === 'ar' ? item.name : item.nameEn}</Typography>
												<Typography variant='caption' color='text.secondary'>{item.price} {currency} × {item.quantity}</Typography>
											</Box>
										</Stack>
										<Typography fontWeight='bold'>{item.price * item.quantity} {currency}</Typography>
									</Paper>
								))}
							</Stack>
						</DialogContent>
						<DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
							<Button variant='outlined' startIcon={<DescriptionIcon sx={{ fontSize: 18 }} />} onClick={() => window.print()}>{lang === 'ar' ? 'طباعة' : 'Print'}</Button>
							<Button variant='contained' color='secondary' onClick={() => setSelectedOrder(null)}>{lang === 'ar' ? 'إغلاق' : 'Close'}</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</Box>
	);
};

export default AdminDashboard;
