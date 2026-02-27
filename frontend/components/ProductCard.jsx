import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, IconButton, Rating, CardActionArea, Stack, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

/**
 * ProductCard component migrated to MUI.
 * Features: Image gallery navigation, quick action overlays, and consistent theme styling.
 */
const ProductCard = ({ product, onAddToCart, onViewDetails, lang, reviews, isReviewSystemActive }) => {
	const [currentImgIdx, setCurrentImgIdx] = useState(0);
	const allImages = [product.image, ...(product.images || [])].filter(Boolean);

	const avgRating = reviews?.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

	const handleNextImg = (e) => {
		e.stopPropagation();
		setCurrentImgIdx((prev) => (prev + 1) % allImages.length);
	};

	const handlePrevImg = (e) => {
		e.stopPropagation();
		setCurrentImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
	};

	const currency = lang === 'ar' ? 'ج.م' : 'EGP';

	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				borderRadius: 3,
				overflow: 'hidden',
				transition: 'all 0.3s ease',
				'&:hover': {
					transform: 'translateY(-8px)',
					boxShadow: (theme) => theme.shadows[10],
				},
				position: 'relative',
			}}
		>
			<Box sx={{ position: 'relative', pt: '133%', overflow: 'hidden', bgcolor: 'grey.100' }}>
				<CardActionArea onClick={() => onViewDetails(product)} sx={{ position: 'absolute', inset: 0 }}>
					<CardMedia
						component='img'
						image={allImages[currentImgIdx]}
						alt={lang === 'ar' ? product.name : product.nameEn}
						sx={{
							height: '100%',
							width: '100%',
							objectFit: 'cover',
							transition: 'transform 0.7s ease',
							'&:hover': { transform: 'scale(1.05)' },
						}}
					/>
				</CardActionArea>

				{/* Quick View Overlay */}
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						bgcolor: 'rgba(0,0,0,0.2)',
						opacity: 0,
						pointerEvents: 'none',
						transition: 'opacity 0.3s ease',
						'.MuiCard-root:hover &': { opacity: 1 },
					}}
				>
					<Avatar sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'black', width: 48, height: 48, boxShadow: 2 }}>
						<SearchIcon sx={{ fontSize: 20 }} />
					</Avatar>
				</Box>

				{/* Image Navigation Controls */}
				{allImages.length > 1 && (
					<Stack
						direction='row'
						justifyContent='space-between'
						sx={{
							position: 'absolute',
							top: '50%',
							left: 0,
							right: 0,
							transform: 'translateY(-50%)',
							px: 1,
							opacity: 0,
							transition: 'opacity 0.3s ease',
							'.MuiCard-root:hover &': { opacity: 1 },
							zIndex: 2,
						}}
					>
						<IconButton
							size='small'
							onClick={handlePrevImg}
							sx={{ bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'white' } }}
						>
							<ChevronLeftIcon sx={{ fontSize: 16 }} />
						</IconButton>
						<IconButton
							size='small'
							onClick={handleNextImg}
							sx={{ bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'white' } }}
						>
							<ChevronRightIcon sx={{ fontSize: 16 }} />
						</IconButton>
					</Stack>
				)}

				{/* Wishlist Button */}
				<IconButton
					size='small'
					sx={{
						position: 'absolute',
						top: 16,
						right: 16,
						bgcolor: 'rgba(255,255,255,0.8)',
						backdropFilter: 'blur(4px)',
						color: 'grey.400',
						'&:hover': { color: 'error.main', bgcolor: 'white' },
						zIndex: 2,
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<FavoriteBorderIcon sx={{ fontSize: 20 }} />
				</IconButton>

				{/* Add to Cart Overlay Button */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						p: 2,
						transform: 'translateY(100%)',
						transition: 'transform 0.3s ease',
						'.MuiCard-root:hover &': { transform: 'translateY(0)' },
						zIndex: 2,
					}}
				>
					<Button
						fullWidth
						variant='contained'
						color='secondary'
						startIcon={<ShoppingBagIcon sx={{ fontSize: 18 }} />}
						onClick={(e) => {
							e.stopPropagation();
							onAddToCart(product);
						}}
						sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, '&:hover': { bgcolor: 'primary.main', color: 'black' } }}
					>
						{lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
					</Button>
				</Box>
			</Box>

			<CardContent sx={{ textAlign: 'center', p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
				<Typography variant='overline' sx={{ color: 'primary.main', fontWeight: 600, mb: 0.5 }}>
					{lang === 'ar' ? product.category_name : product.category_en}
				</Typography>
				<Typography variant='h5' component='h4' sx={{ mb: 1, fontWeight: 700 }}>
					{lang === 'ar' ? product.name : product.nameEn}
				</Typography>

				{isReviewSystemActive && avgRating !== null && (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1.5 }}>
						<Rating value={avgRating} readOnly size='small' precision={0.5} />
						<Typography variant='caption' color='text.secondary' sx={{ fontWeight: 'bold', mt: 0.5 }}>
							({reviews.length})
						</Typography>
					</Box>
				)}

				<Typography
					variant='body2'
					color='text.secondary'
					sx={{
						mb: 2,
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						minHeight: '3em',
					}}
				>
					{lang === 'ar' ? product.description : product.descriptionEn}
				</Typography>

				<Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'grey.100' }}>
					<Typography variant='h6' sx={{ fontWeight: 800 }}>
						{product.price} {currency}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default ProductCard;
