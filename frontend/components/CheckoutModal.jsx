import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, TextField, Button, Stepper, Step, StepLabel, RadioGroup, FormControlLabel, Radio, Paper, Stack, Divider, MenuItem, InputAdornment, Alert, Zoom, Avatar, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MapIcon from '@mui/icons-material/Map';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { EGYPT_CITIES } from '../constants';

/**
 * CheckoutModal component migrated to MUI.
 * Features: Multi-step checkout process, shipping cost calculation, coupon application, and success state.
 */
const CheckoutModal = ({ lang, user, onClose, total, cart, onOrderSubmit, storeSettings, coupons, shippingZones }) => {
	const [activeStep, setActiveStep] = useState(0);
	const [isSuccess, setIsSuccess] = useState(false);
	const [lastOrder, setLastOrder] = useState(null);
	const [info, setInfo] = useState({
		name: user?.name || '',
		phone: '',
		country: 'مصر',
		city: EGYPT_CITIES[0],
		region: '',
		streetDetails: '',
		notes: '',
		paymentMethod: 'cod',
		transactionId: '',
	});
	const [couponCode, setCouponCode] = useState('');
	const [appliedCoupon, setAppliedCoupon] = useState(null);
	const [couponError, setCouponError] = useState('');

	const currency = storeSettings.currency;
	const currentZone = shippingZones.find((z) => z.city === info.city && z.isActive);
	const shippingCost = currentZone ? currentZone.rate : 0;

	const handleApplyCoupon = () => {
		setCouponError('');
		const coupon = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
		if (!coupon) {
			setCouponError(lang === 'ar' ? 'كود غير صالح' : 'Invalid code');
			return;
		}
		if (total < coupon.minOrderValue) {
			setCouponError(lang === 'ar' ? `أقل قيمة للطلب ${coupon.minOrderValue}` : `Min order value ${coupon.minOrderValue}`);
			return;
		}
		if (coupon.usageCount >= coupon.usageLimit) {
			setCouponError(lang === 'ar' ? 'انتهت صلاحية الكود' : 'Coupon expired');
			return;
		}
		setAppliedCoupon(coupon);
	};

	const discount = appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? (total * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue) : 0;
	const finalTotal = total - discount + shippingCost;

	const handleSubmit = () => {
		if (info.paymentMethod === 'instapay' && !info.transactionId) {
			alert(lang === 'ar' ? 'يرجى إدخال رقم العملية' : 'Enter transaction ID');
			return;
		}
		const newOrder = {
			id: `MRA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
			items: cart,
			total: finalTotal,
			customer_name: info.name,
			customer_phone: `+20${info.phone}`,
			customer_email: user?.email,
			city: info.city,
			region: info.region,
			street_details: info.streetDetails,
			notes: info.notes,
			payment_method: info.paymentMethod,
			transaction_id: info.transactionId,
			coupon_code: appliedCoupon?.code,
			shipping_cost: shippingCost,
			status: 'جديد',
		};
		setLastOrder(newOrder);
		onOrderSubmit(newOrder);
		setIsSuccess(true);
	};

	const steps = [lang === 'ar' ? 'البيانات الشخصية' : 'Personal Info', lang === 'ar' ? 'العنوان' : 'Address', lang === 'ar' ? 'الدفع' : 'Payment'];

	if (isSuccess && lastOrder) {
		return (
			<Dialog open={true} maxWidth='sm' fullWidth PaperProps={{ sx: { borderRadius: 8, p: 4, textAlign: 'center' } }}>
				<Zoom in={true}>
					<Box>
						<Avatar sx={{ bgcolor: 'success.light', color: 'success.main', width: 80, height: 80, mx: 'auto', mb: 3 }}>
							<CheckCircleIcon sx={{ fontSize: 48 }} />
						</Avatar>
						<Typography variant='h4' sx={{ fontWeight: 700, mb: 2 }}>
							{lang === 'ar' ? `شكراً لطلبك من ${storeSettings.name}!` : `Thank you for ordering from ${storeSettings.name}!`}
						</Typography>
						<Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
							{lang === 'ar' ? 'تم تسجيل طلبك بنجاح. سيتم التواصل معك قريباً لتأكيد الشحن.' : 'Your order has been successfully registered. We will contact you soon.'}
						</Typography>

						<Paper variant='outlined' sx={{ p: 3, borderRadius: 4, bgcolor: 'grey.50', mb: 4, textAlign: 'right' }}>
							<Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
								<Typography variant='subtitle1' color='primary' fontWeight='bold'>
									{lang === 'ar' ? 'رقم الفاتورة:' : 'Invoice ID:'}
								</Typography>
								<Typography variant='h6' sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
									{lastOrder.id}
								</Typography>
							</Stack>
							<Stack spacing={1}>
								<Stack direction='row' justifyContent='space-between'>
									<Typography variant='caption' color='text.secondary'>{lang === 'ar' ? 'العميل:' : 'Customer:'}</Typography>
									<Typography variant='caption' fontWeight='bold'>{lastOrder.customer_name}</Typography>
								</Stack>
								<Stack direction='row' justifyContent='space-between'>
									<Typography variant='caption' color='text.secondary'>{lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</Typography>
									<Typography variant='caption' fontWeight='bold'>{lastOrder.payment_method === 'cod' ? (lang === 'ar' ? 'عند الاستلام' : 'Cash on Delivery') : 'InstaPay'}</Typography>
								</Stack>
								<Divider sx={{ my: 1 }} />
								<Stack direction='row' justifyContent='space-between'>
									<Typography variant='h6' fontWeight='bold'>{lang === 'ar' ? 'الإجمالي:' : 'Total:'}</Typography>
									<Typography variant='h6' fontWeight='bold' color='primary'>{lastOrder.total} {currency}</Typography>
								</Stack>
							</Stack>
						</Paper>

						<Stack spacing={2}>
							<Button variant='outlined' fullWidth startIcon={<PhoneIcon sx={{ fontSize: 18 }} />} sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}>
								{storeSettings.whatsapp}
							</Button>
							<Button variant='contained' color='secondary' fullWidth onClick={onClose} sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}>
								{lang === 'ar' ? 'العودة للتسوق' : 'Back to Shopping'}
							</Button>
						</Stack>
					</Box>
				</Zoom>
			</Dialog>
		);
	}

	return (
		<Dialog open={true} onClose={onClose} maxWidth='sm' fullWidth PaperProps={{ sx: { borderRadius: 6, overflow: 'hidden' } }}>
			<DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', py: 3, px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant='h5' sx={{ fontWeight: 700, color: 'primary.main' }}>
					{lang === 'ar' ? `إتمام طلب ${storeSettings.name}` : `Checkout at ${storeSettings.name}`}
				</Typography>
				<IconButton onClick={onClose} sx={{ color: 'white' }}>
					<CloseIcon sx={{ fontSize: 24 }} />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ p: 4 }}>
				<Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				<Box sx={{ mt: 2 }}>
					{activeStep === 0 && (
						<Stack spacing={3}>
							<Typography variant='h6' fontWeight='bold'>{lang === 'ar' ? 'بيانات العميل' : 'Customer Info'}</Typography>
							<TextField
								fullWidth
								label={lang === 'ar' ? 'الاسم الثلاثي' : 'Full Name'}
								value={info.name}
								onChange={(e) => setInfo({ ...info, name: e.target.value })}
								variant='outlined'
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
							/>
							<TextField
								fullWidth
								label={lang === 'ar' ? 'رقم التلفون' : 'Phone Number'}
								value={info.phone}
								onChange={(e) => setInfo({ ...info, phone: e.target.value })}
								variant='outlined'
								InputProps={{
									startAdornment: <InputAdornment position='start'>+20</InputAdornment>,
								}}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
							/>
							<Button
								fullWidth
								variant='contained'
								color='secondary'
								size='large'
								onClick={() => {
									if (!info.name || !info.phone) {
										alert(lang === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Enter name and phone');
										return;
									}
									setActiveStep(1);
								}}
								sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
							>
								{lang === 'ar' ? 'التالي' : 'Next'}
							</Button>
						</Stack>
					)}

					{activeStep === 1 && (
						<Stack spacing={3}>
							<Typography variant='h6' fontWeight='bold'>{lang === 'ar' ? 'عنوان التوصيل' : 'Shipping Address'}</Typography>
							<TextField
								select
								fullWidth
								label={lang === 'ar' ? 'المحافظة' : 'City'}
								value={info.city}
								onChange={(e) => setInfo({ ...info, city: e.target.value })}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
							>
								{EGYPT_CITIES.map((city) => (
									<MenuItem key={city} value={city}>{city}</MenuItem>
								))}
							</TextField>
							<TextField
								fullWidth
								label={lang === 'ar' ? 'المنطقة' : 'Region'}
								value={info.region}
								onChange={(e) => setInfo({ ...info, region: e.target.value })}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
							/>
							<TextField
								fullWidth
								multiline
								rows={2}
								label={lang === 'ar' ? 'تفاصيل العنوان' : 'Street Details'}
								value={info.streetDetails}
								onChange={(e) => setInfo({ ...info, streetDetails: e.target.value })}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
							/>
							<TextField
								fullWidth
								multiline
								rows={2}
								label={lang === 'ar' ? 'ملاحظات إضافية' : 'Notes'}
								value={info.notes}
								onChange={(e) => setInfo({ ...info, notes: e.target.value })}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
							/>
							<Stack direction='row' spacing={2}>
								<Button fullWidth variant='outlined' onClick={() => setActiveStep(0)} sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}>
									{lang === 'ar' ? 'السابق' : 'Back'}
								</Button>
								<Button
									fullWidth
									variant='contained'
									color='secondary'
									onClick={() => {
										if (!info.region) {
											alert(lang === 'ar' ? 'يرجى إدخال المنطقة' : 'Enter region');
											return;
										}
										setActiveStep(2);
									}}
									sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
								>
									{lang === 'ar' ? 'التالي' : 'Next'}
								</Button>
							</Stack>
						</Stack>
					)}

					{activeStep === 2 && (
						<Stack spacing={3}>
							<Typography variant='h6' fontWeight='bold'>{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</Typography>
							<RadioGroup value={info.paymentMethod} onChange={(e) => setInfo({ ...info, paymentMethod: e.target.value })}>
								<Paper variant='outlined' sx={{ p: 2, mb: 2, borderRadius: 4, transition: '0.3s', borderColor: info.paymentMethod === 'cod' ? 'primary.main' : 'divider', bgcolor: info.paymentMethod === 'cod' ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}>
									<FormControlLabel
										value='cod'
										control={<Radio color='primary' />}
										label={
											<Stack direction='row' spacing={2} alignItems='center'>
												<PaymentsIcon sx={{ fontSize: 20, color: '#D4AF37' }} />
												<Typography fontWeight='bold'>{lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</Typography>
											</Stack>
										}
										sx={{ m: 0, width: '100%' }}
									/>
								</Paper>
								<Paper variant='outlined' sx={{ p: 2, borderRadius: 4, transition: '0.3s', borderColor: info.paymentMethod === 'instapay' ? 'primary.main' : 'divider', bgcolor: info.paymentMethod === 'instapay' ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}>
									<FormControlLabel
										value='instapay'
										control={<Radio color='primary' />}
										label={
											<Stack direction='row' spacing={2} alignItems='center'>
												<SmartphoneIcon sx={{ fontSize: 20, color: '#D4AF37' }} />
												<Typography fontWeight='bold'>إنستا باي (InstaPay)</Typography>
											</Stack>
										}
										sx={{ m: 0, width: '100%' }}
									/>
									{info.paymentMethod === 'instapay' && (
										<Fade in={true}>
											<Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 3, border: 1, borderColor: 'primary.main', borderStyle: 'dashed' }}>
												<Typography variant='caption' fontWeight='bold' display='block' sx={{ mb: 1 }}>{lang === 'ar' ? 'العنوان:' : 'Address:'} {storeSettings.whatsapp}</Typography>
												<TextField
													fullWidth
													size='small'
													placeholder={lang === 'ar' ? 'رقم العملية' : 'Transaction ID'}
													value={info.transactionId}
													onChange={(e) => setInfo({ ...info, transactionId: e.target.value })}
													sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'monospace' } }}
												/>
											</Box>
										</Fade>
									)}
								</Paper>
							</RadioGroup>

							{/* Coupon Section */}
							<Paper variant='outlined' sx={{ p: 3, borderRadius: 4, bgcolor: 'grey.50' }}>
								<Typography variant='subtitle2' fontWeight='bold' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
									<LocalActivityIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
									{lang === 'ar' ? 'كوبون الخصم' : 'Discount Coupon'}
								</Typography>
								<Stack direction='row' spacing={1}>
									<TextField
										fullWidth
										size='small'
										placeholder={lang === 'ar' ? 'أدخل الكود' : 'Enter code'}
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
										sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
									/>
									<Button variant='contained' color='secondary' onClick={handleApplyCoupon} sx={{ borderRadius: 2, fontWeight: 700 }}>
										{lang === 'ar' ? 'تطبيق' : 'Apply'}
									</Button>
								</Stack>
								{couponError && <Typography variant='caption' color='error' sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>{couponError}</Typography>}
								{appliedCoupon && (
									<Alert severity='success' size='small' sx={{ mt: 2, borderRadius: 2 }} onClose={() => setAppliedCoupon(null)}>
										{lang === 'ar' ? 'تم تطبيق الخصم:' : 'Discount applied:'} <strong>{appliedCoupon.code}</strong>
									</Alert>
								)}
							</Paper>

							{/* Order Summary */}
							<Paper variant='outlined' sx={{ p: 3, borderRadius: 4, bgcolor: 'grey.50' }}>
								<Stack spacing={1.5}>
									<Stack direction='row' justifyContent='space-between'>
										<Typography variant='body2' color='text.secondary'>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</Typography>
										<Typography variant='body2' fontWeight='bold'>{total} {currency}</Typography>
									</Stack>
									{discount > 0 && (
										<Stack direction='row' justifyContent='space-between' sx={{ color: 'success.main' }}>
											<Typography variant='body2'>{lang === 'ar' ? 'الخصم:' : 'Discount:'}</Typography>
											<Typography variant='body2' fontWeight='bold'>-{discount} {currency}</Typography>
										</Stack>
									)}
									<Stack direction='row' justifyContent='space-between'>
										<Typography variant='body2' color='text.secondary'>{lang === 'ar' ? `تكلفة الشحن (${info.city}):` : `Shipping (${info.city}):`}</Typography>
										<Typography variant='body2' fontWeight='bold'>{shippingCost} {currency}</Typography>
									</Stack>
									<Divider />
									<Stack direction='row' justifyContent='space-between' alignItems='center'>
										<Typography variant='h6' fontWeight='bold'>{lang === 'ar' ? 'الإجمالي النهائي:' : 'Final Total:'}</Typography>
										<Typography variant='h5' fontWeight='800' color='primary'>{finalTotal} {currency}</Typography>
									</Stack>
								</Stack>
							</Paper>

							<Stack direction='row' spacing={2}>
								<Button fullWidth variant='outlined' onClick={() => setActiveStep(1)} sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}>
									{lang === 'ar' ? 'السابق' : 'Back'}
								</Button>
								<Button
									fullWidth
									variant='contained'
									color='primary'
									onClick={handleSubmit}
									sx={{ py: 2, borderRadius: 3, fontWeight: 800, color: 'black', '&:hover': { bgcolor: 'secondary.main', color: 'white' } }}
								>
									{lang === 'ar' ? 'تأكيد الطلب' : 'Confirm Order'}
								</Button>
							</Stack>
						</Stack>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default CheckoutModal;
