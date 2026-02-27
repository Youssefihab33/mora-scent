import React, { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CssBaseline from '@mui/material/CssBaseline';

/**
 * MUI Theme and RTL configuration.
 * Handles the Gold and Black/Neutral palette and RTL layout for Arabic.
 */

// Create caches for RTL and LTR
const cacheRtl = createCache({
	key: 'muirtl',
	stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
	key: 'muiltr',
});

const ThemeCustomization = ({ children, lang }) => {
	const isRtl = lang === 'ar';

	const theme = useMemo(() => {
		return createTheme({
			direction: isRtl ? 'rtl' : 'ltr',
			palette: {
				primary: {
					main: '#D4AF37', // Gold
					contrastText: '#000000',
				},
				secondary: {
					main: '#1a1a1a', // Black/Dark Neutral
				},
				background: {
					default: '#f9f9f9', // Neutral 50
					paper: '#ffffff',
				},
				text: {
					primary: '#171717', // Neutral 900
					secondary: '#525252', // Neutral 600
				},
			},
			typography: {
				fontFamily: isRtl ? '"Tajawal", "Noto Sans Arabic", sans-serif' : '"Inter", "Roboto", sans-serif',
				h1: {
					fontFamily: 'serif',
					fontWeight: 700,
				},
				h2: {
					fontFamily: 'serif',
					fontWeight: 700,
				},
				h3: {
					fontFamily: 'serif',
					fontWeight: 700,
				},
				h4: {
					fontFamily: 'serif',
					fontWeight: 700,
				},
				h5: {
					fontFamily: 'serif',
					fontWeight: 700,
				},
				h6: {
					fontFamily: 'serif',
					fontWeight: 700,
				},
				button: {
					textTransform: 'none',
					fontWeight: 600,
				},
			},
			components: {
				MuiButton: {
					styleOverrides: {
						root: {
							borderRadius: 9999, // Round buttons
						},
					},
				},
				MuiPaper: {
					styleOverrides: {
						root: {
							boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
						},
					},
				},
			},
		});
	}, [isRtl]);

	return (
		<CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</CacheProvider>
	);
};

export default ThemeCustomization;
