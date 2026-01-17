// ============================================================================
// Newsletter Signup Component
// Email subscription form with validation and feedback
// ============================================================================

import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Snackbar,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Send,
  CheckCircle,
  NotificationsActive,
} from '@mui/icons-material';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  email: string;
  status: SubmitStatus;
  errorMessage: string;
}

// -----------------------------------------------------------------------------
// Email Validation Helper
// -----------------------------------------------------------------------------

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const NewsletterSignup: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    status: 'idle',
    errorMessage: '',
  });

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      email: e.target.value,
      status: 'idle',
      errorMessage: '',
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const { email } = formState;

    // Validation
    if (!email.trim()) {
      setFormState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'Please enter your email address',
      }));
      return;
    }

    if (!isValidEmail(email)) {
      setFormState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'Please enter a valid email address',
      }));
      return;
    }

    // Simulate API call
    setFormState((prev) => ({ ...prev, status: 'loading' }));

    try {
      // Simulated delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      setFormState({
        email: '',
        status: 'success',
        errorMessage: '',
      });
      setShowSnackbar(true);
    } catch {
      setFormState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'Something went wrong. Please try again.',
      }));
    }
  }, [formState]);

  const isLoading = formState.status === 'loading';
  const hasError = formState.status === 'error';

  return (
    <>
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.05),
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.03),
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Icon */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                backgroundColor: alpha('#ffffff', 0.15),
                backdropFilter: 'blur(10px)',
              }}
            >
              <NotificationsActive sx={{ fontSize: 36, color: 'white' }} />
            </Box>

            {/* Heading */}
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                color: 'white',
              }}
            >
              Never Miss a Deal
            </Typography>

            {/* Subheading */}
            <Typography
              variant="body1"
              sx={{
                color: alpha('#ffffff', 0.85),
                maxWidth: 500,
                mx: 'auto',
                mb: 4,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              Subscribe to our newsletter and be the first to know about exclusive flight deals,
              price drops, and travel inspiration.
            </Typography>

            {/* Signup Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                maxWidth: 520,
                mx: 'auto',
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email address"
                type="email"
                value={formState.email}
                onChange={handleEmailChange}
                disabled={isLoading}
                error={hasError}
                helperText={hasError ? formState.errorMessage : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: hasError ? 'error.main' : 'action.active' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: hasError ? 'error.main' : 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: hasError ? 'error.main' : 'primary.light',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: hasError ? 'error.main' : 'primary.main',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: alpha('#ffffff', 0.9),
                    mt: 1,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                endIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Send />
                  )
                }
                sx={{
                  minWidth: { xs: '100%', sm: 160 },
                  py: 1.75,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.9),
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  },
                  '&:disabled': {
                    backgroundColor: alpha('#ffffff', 0.7),
                    color: 'primary.main',
                  },
                }}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </Box>

            {/* Privacy Note */}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 3,
                color: alpha('#ffffff', 0.6),
              }}
            >
              We respect your privacy. Unsubscribe at any time.
            </Typography>

            {/* Benefits */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
                flexWrap: 'wrap',
                mt: 4,
              }}
            >
              {[
                'Weekly deal alerts',
                'Price drop notifications',
                'Exclusive offers',
              ].map((benefit) => (
                <Box
                  key={benefit}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    color: alpha('#ffffff', 0.85),
                  }}
                >
                  <CheckCircle sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{benefit}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
          sx={{
            minWidth: 300,
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
        >
          Successfully subscribed! Check your inbox for confirmation.
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewsletterSignup;
