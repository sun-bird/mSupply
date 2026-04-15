import { ArrowRight01Icon, HelpCircleIcon, PrinterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import msupplyLogo from '../assets/msupply-logo.svg';
import msupplyLogoWhite from '../assets/msupply-logo-white.svg';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';

interface LoginSampleViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  primaryColor: string;
  logoUrl: string | null;
}

export default function LoginSampleView({
  navItems,
  onNavigate,
  primaryColor,
  logoUrl,
}: LoginSampleViewProps) {
  const { t } = useTranslation();
  const displayLogo = logoUrl || msupplyLogo;

  return (
    <NavLayout
      navItems={navItems}
      activePath="/settings/login-sample"
      logoUrl={displayLogo}
      headerProps={{
        title: t('loginSample.title'),
        onBack: () => onNavigate('/settings/themes'),
        comboActions: [
          {
            icon: <HugeiconsIcon icon={PrinterIcon} size={20} />,
            label: t('common.print'),
            onClick: () => {},
          },
          {
            icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />,
            label: t('common.help'),
            onClick: () => {},
          },
        ],
      }}
      footerProps={{
        storeName: 'Central Tamaki Warehouse',
        userName: 'Mark Prins',
        syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
        isOnline: true,
      }}
    >
      {/* Login preview container */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          minHeight: 500,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 0px 2px rgba(0,0,0,0.04), 0px 4px 8px rgba(0,0,0,0.12)',
        }}
      >
        {/* Left panel — gradient background */}
        <Box
          sx={{
            flex: 1,
            bgcolor: 'white',
            background: `linear-gradient(137deg, ${alpha(primaryColor || '#E95C30', 0.75)} 7%, ${primaryColor || '#E95C30'} 93%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            textAlign: 'left',
            p: '60px',
            position: 'relative',
            minWidth: 0,
          }}
        >
          {/* Small logo + "Open mSupply" */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '20px' }}>
            <Box
              component="img"
              src={msupplyLogoWhite}
              alt="Logo"
              sx={{ width: 30, height: 30, objectFit: 'contain' }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                lineHeight: '28px',
                color: '#FAFAFA',
                letterSpacing: '-0.02px',
              }}
            >
              {t('loginSample.openMsupply')}
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 32,
              lineHeight: 'normal',
              color: '#FAFAFA',
              letterSpacing: '-0.02px',
              mb: 6,
            }}
          >
            {t('loginSample.headline')}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '22px',
              color: '#FAFAFA',
              letterSpacing: '-0.02px',
              maxWidth: 478,
            }}
          >
            {t('loginSample.welcome')}
          </Typography>
        </Box>

        {/* Right panel — login form */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#F2F2F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: { xs: 4, md: 6 },
            py: 6,
            minWidth: 0,
            position: 'relative',
          }}
        >
          {/* Large logo */}
          <Box
            component="img"
            src={displayLogo}
            alt="Brand logo"
            sx={{
              width: 140,
              height: 140,
              objectFit: 'contain',
              mt: 4,
              mb: 4,
            }}
          />

          {/* Form */}
          <Box sx={{ width: '100%', maxWidth: 200, display: 'flex', flexDirection: 'column', gap: 2.5, mt: '40px' }}>
            {/* Username */}
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 12,
                  lineHeight: '16px',
                  color: '#8F90A6',
                  letterSpacing: '0.2px',
                  textAlign: 'left',
                  mb: 0.5,
                  pl: 1,
                }}
              >
                {t('loginSample.username')}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'white',
                    boxShadow: 'inset 0px 0.5px 4px rgba(96,97,112,0.32)',
                    '& fieldset': { borderColor: '#E4E4EB' },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    color: '#8F90A6',
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 12,
                  lineHeight: '16px',
                  color: '#8F90A6',
                  letterSpacing: '0.2px',
                  textAlign: 'left',
                  mb: 0.5,
                  pl: 1,
                }}
              >
                {t('loginSample.password')}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'white',
                    boxShadow: 'inset 0px 0.5px 4px rgba(96,97,112,0.32)',
                    '& fieldset': { borderColor: '#E4E4EB' },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    color: '#8F90A6',
                  },
                }}
              />
            </Box>

            {/* Next button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                endIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={20} />}
                sx={{
                  height: 36,
                  borderRadius: '24px',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#1C1C28',
                  bgcolor: 'white',
                  boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
                  px: '20px',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  '& .MuiButton-endIcon': { color: primaryColor },
                }}
              >
                {t('loginSample.next')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </NavLayout>
  );
}
