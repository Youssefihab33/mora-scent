import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, Stack, Button, Chip } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import PhoneIcon from '@mui/icons-material/Phone';

/**
 * Footer component migrated to MUI.
 * Features: Multi-column layout, social icons, and contact information.
 */
const Footer = ({ onAdminClick, lang, storeSettings }) => {
	const currentYear = new Date().getFullYear();

	return (
		<Box component='footer' sx={{ bgcolor: 'white', pt: 10, pb: 5, borderTop: 1, borderColor: 'grey.100' }}>
			<Container maxWidth='lg'>
				<Grid container spacing={6} sx={{ mb: 8 }}>
					{/* Brand Section */}
					<Grid item xs={12} md={3}>
						<Typography variant='h4' sx={{ color: 'primary.main', fontWeight: 700, mb: 3 }}>
							{storeSettings.name}
						</Typography>
						<Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.8, mb: 4 }}>
							{storeSettings.policy}
						</Typography>
						<Stack direction='row' spacing={2}>
							<IconButton
								href='#'
								sx={{ border: 1, borderColor: 'divider', color: 'text.secondary', '&:hover': { bgcolor: 'primary.main', color: 'black', borderColor: 'primary.main' } }}
							>
								<InstagramIcon sx={{ fontSize: 18 }} />
							</IconButton>
							<IconButton
								href='#'
								sx={{ border: 1, borderColor: 'divider', color: 'text.secondary', '&:hover': { bgcolor: 'primary.main', color: 'black', borderColor: 'primary.main' } }}
							>
								<FacebookIcon sx={{ fontSize: 18 }} />
							</IconButton>
						</Stack>
					</Grid>

					{/* Quick Links */}
					<Grid item xs={12} sm={4} md={3}>
						<Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 3, borderBottom: 2, borderColor: 'primary.main', pb: 1, display: 'inline-block' }}>
							{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
						</Typography>
						<Stack spacing={2}>
							<Link href='#' underline='none' color='text.secondary' sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
								{lang === 'ar' ? 'الرئيسية' : 'Home'}
							</Link>
							<Link href='#collection' underline='none' color='text.secondary' sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
								{lang === 'ar' ? 'المجموعات' : 'Collections'}
							</Link>
							<Button
								onClick={onAdminClick}
								sx={{ p: 0, justifyContent: 'flex-start', color: 'text.secondary', fontSize: '0.875rem', textTransform: 'none', minWidth: 0, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
							>
								{lang === 'ar' ? 'إدارة المتجر' : 'Store Management'}
							</Button>
						</Stack>
					</Grid>

					{/* Contact Info */}
					<Grid item xs={12} sm={4} md={3}>
						<Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 3, borderBottom: 2, borderColor: 'primary.main', pb: 1, display: 'inline-block' }}>
							{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
						</Typography>
						<Stack spacing={3}>
							<Stack direction='row' spacing={2} alignItems='flex-start'>
								<PhoneIcon sx={{ fontSize: 18, color: '#D4AF37', mt: 0.5 }} />
								<Box>
									<Typography variant='caption' color='text.secondary' sx={{ display: 'block', fontWeight: 600 }}>
										{lang === 'ar' ? 'خدمة العملاء' : 'Customer Service'}
									</Typography>
									<Typography variant='body2' sx={{ fontWeight: 700 }}>{storeSettings.whatsapp}</Typography>
								</Box>
							</Stack>
							<Stack direction='row' spacing={2} alignItems='flex-start'>
								<MailIcon sx={{ fontSize: 18, color: '#D4AF37', mt: 0.5 }} />
								<Box>
									<Typography variant='body2' sx={{ fontWeight: 700 }}>{storeSettings.email}</Typography>
								</Box>
							</Stack>
						</Stack>
					</Grid>

					{/* Location */}
					<Grid item xs={12} sm={4} md={3}>
						<Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 3, borderBottom: 2, borderColor: 'primary.main', pb: 1, display: 'inline-block' }}>
							{lang === 'ar' ? 'موقعنا' : 'Our Location'}
						</Typography>
						<Typography variant='caption' color='text.secondary' sx={{ display: 'block', lineHeight: 2 }}>
							{lang === 'ar' ? 'جمهورية مصر العربية، القاهرة' : 'Egypt, Cairo'}
							<br />
							{lang === 'ar' ? 'التجمع الخامس - القاهرة الجديدة' : '5th Settlement - New Cairo'}
						</Typography>
					</Grid>
				</Grid>

				<Divider sx={{ mb: 4 }} />

				<Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' alignItems='center' spacing={3}>
					<Typography variant='caption' color='text.secondary'>
						&copy; {currentYear} {storeSettings.name}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
					</Typography>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Chip
							icon={<SmartphoneIcon sx={{ fontSize: '12px !important', color: '#D4AF37 !important' }} />}
							label='InstaPay'
							size='small'
							sx={{ bgcolor: 'grey.50', fontWeight: 700, px: 1 }}
						/>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
};

export default Footer;
