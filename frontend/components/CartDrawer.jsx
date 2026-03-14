import React from 'react';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, Divider, Stack, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * CartDrawer component migrated to MUI.
 * Features: Responsive drawer width, item quantity controls, and total calculation display.
 */
const CartDrawer = ({ isOpen, onClose, cart, lang, updateQuantity, removeFromCart, total, onCheckout }) => {
	const theme = useTheme();
	const currency = lang === 'ar' ? 'ج.م' : 'EGP';

	return (
		<Drawer
			anchor={lang === 'ar' ? 'left' : 'right'}
			open={isOpen}
			onClose={onClose}
			PaperProps={{
				sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' },
			}}
		>
			{/* Drawer Header */}
			<Box sx={{ p: 2.5, bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant='h6' sx={{ fontWeight: 700 }}>
					{lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
				</Typography>
				<IconButton onClick={onClose} sx={{ color: 'white' }}>
					<CloseIcon />
				</IconButton>
			</Box>

			{/* Cart Items List */}
			<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
				{cart.length === 0 ? (
					<Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
						<ShoppingBagIcon sx={{ fontSize: 64, margin: '0 auto 16px', opacity: 0.2, display: 'block' }} />
						<Typography variant='h6' gutterBottom>
							{lang === 'ar' ? 'السلة فارغة حالياً' : 'Your cart is empty'}
						</Typography>
						<Button onClick={onClose} sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 600 }}>
							{lang === 'ar' ? 'ابدأ التسوق الآن' : 'Start shopping now'}
						</Button>
					</Box>
				) : (
					<List disablePadding>
						{cart.map((item) => (
							<ListItem
								key={item.id}
								sx={{
									mb: 2,
									p: 2,
									borderRadius: 3,
									bgcolor: 'background.default',
									border: 1,
									borderColor: 'divider',
									alignItems: 'flex-start',
									'&:hover': { borderColor: 'primary.main' },
								}}
								secondaryAction={
									<IconButton edge='end' onClick={() => removeFromCart(item.id)} size='small' sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
										<DeleteIcon sx={{ fontSize: 18 }} />
									</IconButton>
								}
							>
								<ListItemAvatar sx={{ mr: 2 }}>
									<Avatar variant='rounded' src={item.image} alt={item.name} sx={{ width: 80, height: 80, borderRadius: 2 }} />
								</ListItemAvatar>
								<ListItemText
									primaryTypographyProps={{ component: 'div' }}
									primary={
										<Typography variant='subtitle1' component='div' sx={{ fontWeight: 700, mb: 0.5 }}>
											{lang === 'ar' ? item.name : item.nameEn}
										</Typography>
									}
									secondaryTypographyProps={{ component: 'div' }}
									secondary={
										<Box component='div'>
											<Typography variant='body2' component='div' color='primary' sx={{ fontWeight: 800, mb: 1.5 }}>
												{item.price} {currency}
											</Typography>
											<Stack direction='row' alignItems='center' spacing={1.5}>
												<IconButton
													size='small'
													onClick={() => updateQuantity(item.id, -1)}
													sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, bgcolor: 'white', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
												>
													<RemoveIcon sx={{ fontSize: 14 }} />
												</IconButton>
												<Typography variant='body2' component='span' data-testid="item-quantity" sx={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
													{item.quantity}
												</Typography>
												<IconButton
													size='small'
													onClick={() => updateQuantity(item.id, 1)}
													sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, bgcolor: 'white', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
												>
													<AddIcon sx={{ fontSize: 14 }} />
												</IconButton>
											</Stack>
										</Box>
									}
								/>
							</ListItem>
						))}
					</List>
				)}
			</Box>

			{/* Cart Footer / Summary */}
			{cart.length > 0 && (
				<Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
					<Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
						<Typography variant='h5' sx={{ fontWeight: 800 }}>
							{lang === 'ar' ? 'المجموع' : 'Total'}
						</Typography>
						<Typography variant='h5' sx={{ fontWeight: 800, color: 'primary.main' }}>
							{total} {currency}
						</Typography>
					</Stack>
					<Button
						fullWidth
						variant='contained'
						size='large'
						onClick={onCheckout}
						sx={{
							py: 2,
							fontSize: '1.125rem',
							fontWeight: 800,
							boxShadow: theme.shadows[4],
							'&:hover': { bgcolor: 'primary.dark' },
						}}
					>
						{lang === 'ar' ? 'إتمام الطلب' : 'Checkout'}
					</Button>
					<Typography variant='caption' align='center' display='block' sx={{ mt: 2, color: 'text.secondary' }}>
						{lang === 'ar' ? 'الأسعار شاملة ضريبة القيمة المضافة' : 'Prices include VAT'}
					</Typography>
				</Box>
			)}
		</Drawer>
	);
};

export default CartDrawer;
