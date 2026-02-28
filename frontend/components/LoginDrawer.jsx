import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Avatar, Button, TextField, InputAdornment, Stack, Divider, Paper, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * LoginDrawer component migrated to MUI.
 * Handles both authentication (Login/Register) and user profile view (Order history).
 */
const LoginDrawer = ({ isOpen, onClose, lang, user, onLogin, onLogout, orders }) => {
	const [isRegister, setIsRegister] = useState(false);
	const [formData, setFormData] = useState({ name: '', email: '', password: '' });

	const handleAuthSubmit = (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password || (isRegister && !formData.name)) {
			alert(lang === 'ar' ? 'يرجى ملء جميع البيانات' : 'Please fill all fields');
			return;
		}
		// In the migrated version, we pass the mode to the handler
		onLogin({
			...formData,
			mode: isRegister ? 'signup' : 'login',
			picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
		});
		setFormData({ name: '', email: '', password: '' });
	};

	const userOrders = orders.filter((o) => o.customer_email === user?.email || o.customer_name === user?.name);

	return (
		<Drawer
			anchor={lang === 'ar' ? 'right' : 'left'}
			open={isOpen}
			onClose={onClose}
			PaperProps={{
				sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' },
			}}
		>
			{/* Header */}
			<Box sx={{ p: 2.5, bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant='h6' sx={{ fontWeight: 700 }}>
					{user ? (lang === 'ar' ? 'حسابي' : 'My Account') : isRegister ? (lang === 'ar' ? 'إنشاء حساب' : 'Create Account') : lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
				</Typography>
				<IconButton onClick={onClose} sx={{ color: 'white' }}>
					<CloseIcon />
				</IconButton>
			</Box>

			<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
				{user ? (
					<Stack spacing={4}>
						{/* Profile Info */}
						<Box sx={{ textAlign: 'center' }}>
							<Box sx={{ position: 'relative', display: 'inline-block' }}>
								<Avatar
									src={user.picture}
									alt={user.name}
									sx={{ width: 96, height: 96, border: 4, borderColor: 'primary.main', mb: 2, boxShadow: 3 }}
								/>
								<Box sx={{ position: 'absolute', bottom: 16, right: 0, width: 24, height: 24, bgcolor: 'success.main', border: 4, borderColor: 'background.paper', borderRadius: '50%' }} />
							</Box>
							<Typography variant='h5' sx={{ fontWeight: 700 }}>
								{user.name}
							</Typography>
							<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
								{user.email}
							</Typography>
							<Button color='error' onClick={onLogout} sx={{ fontWeight: 700, textTransform: 'none' }}>
								{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
							</Button>
						</Box>

						{/* Order Notifications */}
						<Box>
							<Typography variant='subtitle1' sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
								<NotificationsIcon sx={{ fontSize: 18, color: '#D4AF37' }} />
								{lang === 'ar' ? 'إشعارات الطلبات' : 'Order Notifications'}
							</Typography>

							{userOrders.length === 0 ? (
								<Paper variant='outlined' sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default', borderStyle: 'dashed' }}>
									<InventoryIcon sx={{ fontSize: 32, margin: '0 auto 8px', opacity: 0.3, display: 'block' }} />
									<Typography variant='caption' color='text.secondary'>
										{lang === 'ar' ? 'لا توجد طلبات نشطة حالياً' : 'No active orders currently'}
									</Typography>
								</Paper>
							) : (
								<Stack spacing={2}>
									{userOrders.map((order) => (
										<Paper key={order.id} sx={{ p: 2, position: 'relative', overflow: 'hidden', borderLeft: 4, borderColor: 'primary.main' }}>
											<Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
												<Typography variant='caption' color='text.secondary' fontWeight='bold'>
													#{order.id}
												</Typography>
												<Typography variant='caption' sx={{ bgcolor: 'primary.main', px: 1, py: 0.25, borderRadius: 10, fontWeight: 'bold' }}>
													{order.status}
												</Typography>
											</Stack>
											<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
												{lang === 'ar' ? `طلبك الآن في مرحلة: ${order.status}` : `Your order is now: ${order.status}`}
											</Typography>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<CheckCircleIcon sx={{ fontSize: 12, color: '#10b981' }} />
												<Typography variant='caption' color='text.secondary'>
													{lang === 'ar' ? 'سيتم تحديثك عند تغيير الحالة' : 'You will be updated on status change'}
												</Typography>
											</Box>
										</Paper>
									))}
								</Stack>
							)}
						</Box>
					</Stack>
				) : (
					/* Auth Forms */
					<Box component='form' onSubmit={handleAuthSubmit} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
						<Box sx={{ textAlign: 'center', mb: 5 }}>
							<Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(212, 175, 55, 0.1)', color: 'primary.main', mx: 'auto', mb: 2 }}>
								<LoginIcon sx={{ fontSize: 40 }} />
							</Avatar>
							<Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
								{isRegister ? (lang === 'ar' ? 'انضم إلينا' : 'Join Us') : lang === 'ar' ? 'مرحباً بك' : 'Welcome'}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{lang === 'ar' ? 'استمتع بتجربة تسوق فاخرة مع Mora scent' : 'Enjoy a luxury shopping experience with Mora scent'}
							</Typography>
						</Box>

						<Stack spacing={2.5}>
							{isRegister && (
								<TextField
									fullWidth
									placeholder={lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<PersonIcon sx={{ fontSize: 18, color: '#999' }} />
											</InputAdornment>
										),
									}}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'background.default' } }}
								/>
							)}
							<TextField
								fullWidth
								type='email'
								placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<MailIcon sx={{ fontSize: 18, color: '#999' }} />
										</InputAdornment>
									),
								}}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'background.default' } }}
							/>
							<TextField
								fullWidth
								type='password'
								placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<LockIcon sx={{ fontSize: 18, color: '#999' }} />
										</InputAdornment>
									),
								}}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'background.default' } }}
							/>

							<Button
								fullWidth
								type='submit'
								variant='contained'
								color='secondary'
								size='large'
								sx={{ py: 2, borderRadius: 4, fontSize: '1.1rem', fontWeight: 700, mt: 2, boxShadow: 4, '&:hover': { bgcolor: 'primary.main', color: 'black' } }}
							>
								{isRegister ? (lang === 'ar' ? 'إنشاء حساب' : 'Create Account') : lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
							</Button>
						</Stack>

						<Box sx={{ mt: 'auto', pt: 4, textAlign: 'center' }}>
							<Typography variant='body2' color='text.secondary'>
								{isRegister ? (lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?') : lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
								<Button onClick={() => setIsRegister(!isRegister)} sx={{ color: 'primary.main', fontWeight: 800, mx: 1, textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}>
									{isRegister ? (lang === 'ar' ? 'تسجيل الدخول' : 'Login') : lang === 'ar' ? 'انضم إلينا' : 'Join Us'}
								</Button>
							</Typography>
						</Box>
					</Box>
				)}
			</Box>
		</Drawer>
	);
};

export default LoginDrawer;
