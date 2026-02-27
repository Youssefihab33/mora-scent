import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

/**
 * Hero component migrated to MUI.
 * Features: Background image with overlay and theme-aware typography.
 */
const Hero = ({ lang }) => {
	return (
		<Box
			sx={{
				position: 'relative',
				height: '85vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
			}}
		>
			{/* Background Image with Overlay */}
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					zIndex: 0,
					'&::before': {
						content: '""',
						position: 'absolute',
						inset: 0,
						bgcolor: 'rgba(0,0,0,0.5)',
						backdropFilter: 'blur(2px)',
						zIndex: 1,
					},
				}}
			>
				<Box
					component='img'
					src='https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2000&auto=format&fit=crop'
					alt='Luxury Perfume Hero'
					sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			</Box>

			{/* Hero Content */}
			<Container maxWidth='md' sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
				<Typography
					variant='overline'
					sx={{
						display: 'block',
						color: 'primary.main',
						fontSize: '1.125rem',
						fontWeight: 500,
						mb: 2,
						letterSpacing: '0.2em',
						textTransform: 'uppercase',
					}}
				>
					{lang === 'ar' ? 'عالم Mora scent للفخامة العطرية' : 'Mora scent World of Aromatic Luxury'}
				</Typography>

				<Typography
					variant='h2'
					sx={{
						fontSize: { xs: '3rem', md: '4.5rem' },
						fontWeight: 700,
						mb: 3,
						lineHeight: 1.2,
					}}
				>
					{lang === 'ar' ? (
						<>
							حيث تبدأ الذكريات <br /> برائحة لا تُنسى
						</>
					) : (
						<>
							Where Memories Begin <br /> with an Unforgettable Scent
						</>
					)}
				</Typography>

				<Typography
					variant='h6'
					sx={{
						maxWidth: '42rem',
						mx: 'auto',
						mb: 5,
						fontWeight: 300,
						color: 'neutral.200',
						opacity: 0.9,
					}}
				>
					{lang === 'ar'
						? 'نقدم لك أرقى تشكيلة من عطور النيش والزيوت العطرية، مختارة بعناية في مصر لتناسب ذوقك الرفيع وتمنحك حضوراً ملكياً.'
						: 'We offer you the finest collection of niche perfumes and essential oils, carefully selected in Egypt to suit your refined taste.'}
				</Typography>

				<Button
					component='a'
					href='#collection'
					variant='contained'
					color='primary'
					size='large'
					sx={{
						px: 5,
						py: 2,
						fontSize: '1.125rem',
						fontWeight: 600,
						transition: 'all 0.3s ease',
						transform: 'translateY(0)',
						'&:hover': { transform: 'translateY(-4px)', bgcolor: 'white', color: 'black' },
					}}
				>
					{lang === 'ar' ? 'اكتشف المجموعة' : 'Discover Collection'}
				</Button>
			</Container>
		</Box>
	);
};

export default Hero;
