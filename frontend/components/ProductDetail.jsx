import React, { useState } from 'react';
import { Dialog, Box, IconButton, Typography, Grid, Button, Rating, Avatar, TextField, Divider, Stack, Paper, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

/**
 * ProductDetail component migrated to MUI.
 * Features: Full-screen dialog on mobile, side-by-side layout on desktop, image gallery, and review system.
 */
const ProductDetail = ({ product, onClose, onAddToCart, lang, reviews, onAddReview, user, isReviewSystemActive }) => {
	const [activeImage, setActiveImage] = useState(product.image);
	const [newRating, setNewRating] = useState(5);
	const [newComment, setNewComment] = useState('');

	const gallery = [product.image, ...(product.images || [])].filter(Boolean);
	const currency = lang === 'ar' ? 'ج.م' : 'EGP';

	const handleReviewSubmit = (e) => {
		e.preventDefault();
		if (!user || !newComment.trim()) return;

		onAddReview({
			product: product.id,
			rating: newRating,
			comment: newComment,
		});
		setNewComment('');
		setNewRating(5);
	};

	const avgRating = reviews?.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

	return (
		<Dialog
			open={true}
			onClose={onClose}
			maxWidth='lg'
			fullWidth
			PaperProps={{
				sx: { borderRadius: { xs: 0, md: 8 }, overflow: 'hidden', m: { xs: 0, md: 2 }, maxHeight: { xs: '100%', md: '95vh' } },
			}}
			fullScreen={window.innerWidth < 900}
		>
			<IconButton onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, bgcolor: 'rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' } }}>
				<CloseIcon sx={{ fontSize: 24 }} />
			</IconButton>

			<Grid container sx={{ height: '100%' }}>
				{/* Left Side: Gallery */}
				<Grid item xs={12} md={6} sx={{ bgcolor: 'grey.50', p: { xs: 2, md: 6 }, display: 'flex', flexDirection: 'column' }}>
					<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', borderRadius: 6, p: 2, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
						<Box component='img' src={activeImage} alt={product.name} sx={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain' }} />
					</Box>

					<Stack direction='row' spacing={2} sx={{ mt: 4, overflowX: 'auto', py: 1, px: 1 }}>
						{gallery.map((img, idx) => (
							<Paper
								key={idx}
								onClick={() => setActiveImage(img)}
								elevation={activeImage === img ? 4 : 0}
								sx={{
									flexShrink: 0,
									width: 80,
									height: 80,
									borderRadius: 3,
									overflow: 'hidden',
									cursor: 'pointer',
									border: 2,
									borderColor: activeImage === img ? 'primary.main' : 'transparent',
									transform: activeImage === img ? 'scale(1.1)' : 'scale(1)',
									transition: 'all 0.3s ease',
								}}
							>
								<Box component='img' src={img} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
							</Paper>
						))}
					</Stack>
				</Grid>

				{/* Right Side: Details */}
				<Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 8 }, overflowY: 'auto' }}>
					<Box sx={{ mb: 4 }}>
						<Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
							<Chip label={lang === 'ar' ? product.category_name : product.category_en} color='primary' variant='outlined' size='small' sx={{ fontWeight: 800, borderRadius: 2 }} />
							{isReviewSystemActive && avgRating !== null && (
								<Stack direction='row' spacing={0.5} alignItems='center'>
									<Rating value={avgRating} readOnly size='small' precision={0.5} />
									<Typography variant='caption' color='text.secondary' fontWeight='bold'>
										({reviews.length})
									</Typography>
								</Stack>
							)}
						</Stack>

						<Typography variant='h3' sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
							{lang === 'ar' ? product.name : product.nameEn}
						</Typography>

						<Typography variant='h4' color='text.primary' sx={{ fontWeight: 800, display: 'flex', alignItems: 'baseline', gap: 1 }}>
							{product.price} <Typography component='span' variant='h6' color='primary' sx={{ fontWeight: 700 }}>{currency}</Typography>
						</Typography>
					</Box>

					<Box sx={{ mb: 6 }}>
						<Typography variant='overline' sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 2 }}>
							{lang === 'ar' ? 'عن العطر' : 'About the Scent'}
						</Typography>
						<Typography variant='body1' sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
							{lang === 'ar' ? product.description : product.descriptionEn}
						</Typography>
					</Box>

					<Grid container spacing={3} sx={{ mb: 6, borderTop: 1, borderColor: 'divider', pt: 4 }}>
						<Grid item xs={6}>
							<Stack direction='row' spacing={2} alignItems='center'>
								<Avatar sx={{ bgcolor: 'grey.50', color: 'primary.main', borderRadius: 2 }}>
									<AccessTimeIcon sx={{ fontSize: 20 }} />
								</Avatar>
								<Box>
									<Typography variant='caption' color='text.secondary' sx={{ fontWeight: 800, textTransform: 'uppercase' }}>{lang === 'ar' ? 'موعد التوصيل' : 'Delivery'}</Typography>
									<Typography variant='body2' sx={{ fontWeight: 700 }}>{lang === 'ar' ? 'خلال 48 ساعة' : 'Within 48h'}</Typography>
								</Box>
							</Stack>
						</Grid>
						<Grid item xs={6}>
							<Stack direction='row' spacing={2} alignItems='center'>
								<Avatar sx={{ bgcolor: 'grey.50', color: 'primary.main', borderRadius: 2 }}>
									<VerifiedUserIcon sx={{ fontSize: 20 }} />
								</Avatar>
								<Box>
									<Typography variant='caption' color='text.secondary' sx={{ fontWeight: 800, textTransform: 'uppercase' }}>{lang === 'ar' ? 'منتج أصلي' : 'Original'}</Typography>
									<Typography variant='body2' sx={{ fontWeight: 700 }}>{lang === 'ar' ? 'ضمان الجودة' : 'Quality Guaranteed'}</Typography>
								</Box>
							</Stack>
						</Grid>
					</Grid>

					<Button
						fullWidth
						variant='contained'
						color='secondary'
						size='large'
						startIcon={<ShoppingBagIcon sx={{ fontSize: 20 }} />}
						onClick={() => onAddToCart(product)}
						sx={{ py: 2.5, borderRadius: 4, fontWeight: 800, fontSize: '1.1rem', boxShadow: 6, '&:hover': { bgcolor: 'primary.main', color: 'black' } }}
					>
						{lang === 'ar' ? 'أضف لحقيبة التسوق' : 'Add to Shopping Bag'}
					</Button>

					{/* Review System */}
					{isReviewSystemActive && (
						<Box sx={{ mt: 10, pt: 6, borderTop: 1, borderColor: 'divider' }}>
							<Typography variant='h5' sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
								<ForumIcon sx={{ fontSize: 24, color: '#D4AF37' }} />
								{lang === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}
							</Typography>

							{user ? (
								<Paper variant='outlined' sx={{ p: 3, borderRadius: 6, mb: 4, bgcolor: 'grey.50' }}>
									<Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
										<Avatar src={user.picture} sx={{ border: 2, borderColor: 'primary.main' }} />
										<Box>
											<Typography variant='subtitle2' fontWeight='bold'>{user.name}</Typography>
											<Rating value={newRating} onChange={(_, val) => setNewRating(val)} size='small' />
										</Box>
									</Stack>
									<TextField
										fullWidth
										multiline
										rows={3}
										placeholder={lang === 'ar' ? 'اكتب رأيك هنا...' : 'Write your review here...'}
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
										variant='outlined'
										sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
										InputProps={{
											endAdornment: (
												<IconButton onClick={handleReviewSubmit} color='secondary' sx={{ position: 'absolute', bottom: 8, right: 8 }}>
													<SendIcon sx={{ fontSize: 18 }} />
												</IconButton>
											),
										}}
									/>
								</Paper>
							) : (
								<Paper variant='outlined' sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', borderRadius: 6, mb: 4 }}>
									<Typography variant='body2' color='text.secondary'>
										{lang === 'ar' ? 'يرجى تسجيل الدخول لتتمكن من إضافة تقييم' : 'Please login to leave a review'}
									</Typography>
								</Paper>
							)}

							<Stack spacing={3}>
								{reviews?.length === 0 ? (
									<Typography variant='body2' align='center' color='text.secondary' sx={{ py: 4 }}>
										{lang === 'ar' ? 'لا توجد تقييمات بعد. كن أول من يقيم!' : 'No reviews yet. Be the first to review!'}
									</Typography>
								) : (
									reviews.map((review) => (
										<Paper key={review.id} elevation={0} sx={{ p: 2.5, bgcolor: 'white', border: 1, borderColor: 'grey.100', borderRadius: 4 }}>
											<Stack direction='row' spacing={2} alignItems='flex-start'>
												<Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary' }}>
													<PersonIcon sx={{ fontSize: 20 }} />
												</Avatar>
												<Box sx={{ flexGrow: 1 }}>
													<Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 0.5 }}>
														<Typography variant='subtitle2' fontWeight='bold'>{review.user_name || review.userName}</Typography>
														<Typography variant='caption' color='text.secondary'>{review.created_at || review.date}</Typography>
													</Stack>
													<Rating value={review.rating} readOnly size='small' sx={{ mb: 1 }} />
													<Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6 }}>{review.comment}</Typography>
												</Box>
											</Stack>
										</Paper>
									))
								)}
							</Stack>
						</Box>
					)}
				</Grid>
			</Grid>
		</Dialog>
	);
};

export default ProductDetail;
