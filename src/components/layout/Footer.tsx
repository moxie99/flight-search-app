// ============================================================================
// Footer Component
// Comprehensive footer with navigation, social links, and legal info
// ============================================================================

import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Flight,
  Twitter,
  Facebook,
  Instagram,
  LinkedIn,
  ExpandMore,
  Language,
  Email,
  Phone,
} from '@mui/icons-material';
import { FOOTER_LINKS } from '../../config/constants';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface FooterLinkGroupProps {
  title: string;
  links: ReadonlyArray<{
    readonly label: string;
    readonly href: string;
    readonly icon?: string;
  }>;
  isMobile: boolean;
}

// -----------------------------------------------------------------------------
// Social Icon Mapper
// -----------------------------------------------------------------------------

const getSocialIcon = (iconName: string): React.ReactNode => {
  const iconProps = { sx: { fontSize: 20 } };

  switch (iconName) {
    case 'Twitter':
      return <Twitter {...iconProps} />;
    case 'Facebook':
      return <Facebook {...iconProps} />;
    case 'Instagram':
      return <Instagram {...iconProps} />;
    case 'LinkedIn':
      return <LinkedIn {...iconProps} />;
    default:
      return <Language {...iconProps} />;
  }
};

// -----------------------------------------------------------------------------
// Footer Link Group Component
// -----------------------------------------------------------------------------

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({
  title,
  links,
  isMobile,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Desktop version
  if (!isMobile) {
    return (
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2.5,
            color: 'text.primary',
            fontSize: '0.95rem',
          }}
        >
          {title}
        </Typography>
        <Box component="nav" aria-label={title}>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              underline="none"
              sx={{
                display: 'block',
                py: 0.75,
                color: 'text.secondary',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateX(4px)',
                },
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Box>
    );
  }

  // Mobile accordion version
  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      disableGutters
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        '&:before': { display: 'none' },
        '& .MuiAccordionSummary-root': {
          px: 0,
          minHeight: 48,
        },
        '& .MuiAccordionDetails-root': {
          px: 0,
          pb: 2,
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography fontWeight={600} fontSize="0.95rem">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="nav" aria-label={title}>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              underline="none"
              sx={{
                display: 'block',
                py: 0.75,
                color: 'text.secondary',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.grey[50], 0.8),
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 0, md: 4 }}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              {/* Logo */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
                    boxShadow: '0 4px 12px rgba(26, 54, 93, 0.2)',
                  }}
                >
                  <Flight
                    sx={{
                      fontSize: 22,
                      color: 'white',
                      transform: 'rotate(45deg)',
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    letterSpacing: '-0.02em',
                  }}
                >
                  SpotterSearch
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  maxWidth: 280,
                  lineHeight: 1.7,
                }}
              >
                Find the best flight deals from hundreds of airlines. 
                Compare prices, filter results, and book with confidence.
              </Typography>

              {/* Contact Info */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    support@spottersearch.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    1-800-SPO-SRCH
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Links Columns */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={{ xs: 0, md: 3 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FooterLinkGroup
                  title={FOOTER_LINKS.company.title}
                  links={FOOTER_LINKS.company.links}
                  isMobile={isMobile}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FooterLinkGroup
                  title={FOOTER_LINKS.support.title}
                  links={FOOTER_LINKS.support.links}
                  isMobile={isMobile}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FooterLinkGroup
                  title={FOOTER_LINKS.legal.title}
                  links={FOOTER_LINKS.legal.links}
                  isMobile={isMobile}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 2.5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Copyright */}
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              &copy; {currentYear} SpotterSearch. All rights reserved.
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {FOOTER_LINKS.social.links.map((social) => (
                <IconButton
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {getSocialIcon(social.icon)}
                </IconButton>
              ))}
            </Box>

            {/* Legal Links */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Link
                href="#privacy"
                underline="hover"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Privacy
              </Link>
              <Link
                href="#terms"
                underline="hover"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Terms
              </Link>
              <Link
                href="#cookies"
                underline="hover"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Cookies
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
