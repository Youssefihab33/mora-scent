import React, { useState, useEffect, useRef } from 'react';
import { Fab, Box, Paper, Typography, IconButton, TextField, InputAdornment, Avatar, CircularProgress, Stack, Zoom, Fade } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { api } from '../api';

/**
 * ChatWidget component migrated to MUI.
 * Features: Floating action button, animated chat window, and integration with backend AI chat.
 */
const ChatWidget = ({ products, lang, storeSettings }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			role: 'model',
			text:
				lang === 'ar'
					? `أهلاً بك في ${storeSettings.name}! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم في اختيار عطر أحلامك؟`
					: `Welcome to ${storeSettings.name}! I am your smart assistant. How can I help you choose your dream scent today?`,
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(scrollToBottom, [messages]);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		const userMsg = input.trim();
		setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
		setInput('');
		setIsLoading(true);

		try {
			// Refactored to use the central API layer instead of direct SDK call
			const response = await api.chat([...messages, { role: 'user', text: userMsg }], lang);
			const responseText = response.text || (lang === 'ar' ? 'عذراً، حدث خطأ في معالجة طلبك.' : 'Sorry, an error occurred while processing your request.');
			setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
		} catch (error) {
			console.error('Chat error:', error);
			setMessages((prev) => [
				...prev,
				{
					role: 'model',
					text: lang === 'ar' ? 'عذراً، أواجه صعوبة في الاتصال حالياً. يرجى المحاولة مرة أخرى.' : 'Sorry, I am having trouble connecting right now. Please try again.',
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Fab
				color='primary'
				aria-label='chat'
				onClick={() => setIsOpen(!isOpen)}
				sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, boxShadow: 6, '&:hover': { transform: 'scale(1.1)' }, transition: 'transform 0.3s ease' }}
			>
				{isOpen ? <CloseIcon /> : <ChatIcon />}
			</Fab>

			<Zoom in={isOpen}>
				<Paper
					elevation={12}
					sx={{
						position: 'fixed',
						bottom: 96,
						right: 24,
						zIndex: 1000,
						width: { xs: 'calc(100% - 48px)', sm: 380 },
						height: 500,
						borderRadius: 6,
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
						border: 1,
						borderColor: 'divider',
					}}
				>
					{/* Chat Header */}
					<Box sx={{ p: 2.5, bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Stack direction='row' spacing={2} alignItems='center'>
							<Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', border: 2, borderColor: 'primary.main' }}>
								{storeSettings.logo?.startsWith('http') ? (
									<Box component='img' src={storeSettings.logo} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
								) : (
									<Typography sx={{ color: 'black', fontWeight: 800 }}>{storeSettings.logo}</Typography>
								)}
							</Avatar>
							<Box>
								<Typography variant='subtitle1' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
									{lang === 'ar' ? `مساعد ${storeSettings.name}` : `${storeSettings.name} Assistant`}
								</Typography>
								<Stack direction='row' spacing={1} alignItems='center'>
									<Box sx={{ width: 6, height: 6, bgcolor: 'success.main', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
									<Typography variant='caption' sx={{ color: 'primary.main', fontWeight: 600 }}>
										{lang === 'ar' ? 'متصل الآن' : 'Online'}
									</Typography>
								</Stack>
							</Box>
						</Stack>
						<IconButton onClick={() => setIsOpen(false)} size='small' sx={{ color: 'white', opacity: 0.7, '&:hover': { opacity: 1 } }}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Box>

					{/* Chat Messages */}
					<Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', gap: 2 }}>
						{messages.map((msg, idx) => (
							<Box key={idx} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
								<Paper
									elevation={1}
									sx={{
										p: 2,
										maxWidth: '85%',
										borderRadius: 4,
										bgcolor: msg.role === 'user' ? 'secondary.main' : 'white',
										color: msg.role === 'user' ? 'white' : 'text.primary',
										borderTopRightRadius: msg.role === 'user' ? 0 : 4,
										borderTopLeftRadius: msg.role === 'model' ? 0 : 4,
										position: 'relative',
									}}
								>
									<Typography variant='body2' sx={{ lineHeight: 1.6 }}>
										{msg.text}
									</Typography>
								</Paper>
							</Box>
						))}
						{isLoading && (
							<Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
								<Paper elevation={0} sx={{ p: 2, bgcolor: 'white', borderRadius: 4, borderTopLeftRadius: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
									<CircularProgress size={12} color='primary' />
									<Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
										{lang === 'ar' ? 'جاري التفكير...' : 'Thinking...'}
									</Typography>
								</Paper>
							</Box>
						)}
						<div ref={messagesEndRef} />
					</Box>

					{/* Chat Input */}
					<Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
						<TextField
							fullWidth
							size='small'
							placeholder={lang === 'ar' ? 'اكتب استفسارك هنا...' : 'Type your query here...'}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSend()}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={handleSend} disabled={isLoading || !input.trim()} color='primary' sx={{ '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
											<SendIcon sx={{ fontSize: 18, transform: lang === 'en' ? 'rotate(180deg)' : 'none' }} />
										</IconButton>
									</InputAdornment>
								),
								sx: { borderRadius: 10, bgcolor: 'grey.50', px: 2 },
							}}
							variant='standard'
							disableUnderline
						/>
					</Box>
				</Paper>
			</Zoom>
		</>
	);
};

export default ChatWidget;
