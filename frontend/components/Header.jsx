import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Button, Box, Typography, Container, Divider, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LanguageIcon from '@mui/icons-material/Language';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * Header component migrated to MUI.
 * Features: Sticky positioning, theme-aware styling, and RTL support.
 */
const Header = ({ lang, setLang, cartCount, isSearchOpen, setIsSearchOpen, onOpenCart, onOpenLogin, user, onLogout, storeSettings }) => {
	return (
		<AppBar position='sticky' color='default' elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
			<Container maxWidth='lg'>
				<Toolbar disableGutters sx={{ height: 80, justifyContent: 'space-between' }}>
					{/* Left Section: Language and Login */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Button
							onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
							startIcon={<LanguageIcon sx={{ fontSize: 20 }} />}
							sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, fontWeight: 'bold', fontSize: '0.75rem' }}
						>
							{lang === 'ar' ? 'English' : 'عربي'}
						</Button>

						<Divider orientation='vertical' flexItem sx={{ mx: 1, my: 2 }} />

						{user ? (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Button
									onClick={onOpenLogin}
									variant='outlined'
									color='secondary'
									startIcon={<Avatar src={user.picture} alt={user.name} sx={{ width: 24, height: 24 }} />}
									sx={{ borderRadius: 999, py: 0.75, px: 2, textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}
								>
									<Typography variant='caption' fontWeight='bold'>
										{user.name}
									</Typography>
								</Button>
								{/* Mobile Avatar Button */}
								<IconButton onClick={onOpenLogin} sx={{ display: { xs: 'flex', md: 'none' } }}>
									<Avatar src={user.picture} alt={user.name} sx={{ width: 24, height: 24 }} />
								</IconButton>

								<IconButton onClick={onLogout} color='error' size='small'>
									<LogoutIcon sx={{ fontSize: 18 }} />
								</IconButton>
							</Box>
						) : (
							<Button
								onClick={onOpenLogin}
								variant='contained'
								startIcon={<LoginIcon sx={{ fontSize: 16 }} />}
								sx={{
									bgcolor: 'rgba(212, 175, 55, 0.1)',
									color: 'primary.main',
									'&:hover': { bgcolor: 'primary.main', color: 'white' },
									borderRadius: 999,
									fontWeight: 'bold',
									fontSize: '0.75rem',
									px: 2,
								}}
							>
								{lang === 'ar' ? 'تسجيل دخول' : 'Login'}
							</Button>
						)}
					</Box>

					{/* Center Section: Logo */}
					<Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
						{storeSettings.logo?.startsWith('http') ? (
							<Box component='img' src={storeSettings.logo} alt={storeSettings.name} sx={{ height: 40, width: 'auto' }} />
						) : (
							<Avatar sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 'bold', fontSize: '1.25rem', width: 40, height: 40 }}>{storeSettings.logo}</Avatar>
						)}
						<Typography variant='h4' sx={{ color: 'primary.main', tracking: '-0.05em', display: { xs: 'none', sm: 'block' } }}>
							{storeSettings.name}
						</Typography>
					</Box>

					{/* Right Section: Search and Cart */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<IconButton onClick={() => setIsSearchOpen(!isSearchOpen)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
							<SearchIcon sx={{ fontSize: 22 }} />
						</IconButton>
						<IconButton onClick={onOpenCart} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
							<Badge badgeContent={cartCount} color='error'>
								<ShoppingBagIcon sx={{ fontSize: 22 }} />
							</Badge>
						</IconButton>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Header;
