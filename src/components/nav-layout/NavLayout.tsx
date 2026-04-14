import { Box } from '@mui/material';
import { useState } from 'react';
import NavSidebar from './NavSidebar';
import ViewFooter from './ViewFooter';
import ViewHeader from './ViewHeader';
import type { NavLayoutProps } from './nav.types';

export default function NavLayout({
  children,
  navItems,
  activePath,
  headerProps,
  footerProps,
  logoUrl,
}: NavLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left sidebar */}
      <NavSidebar
        navItems={navItems}
        activePath={activePath}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        logoUrl={logoUrl}
      />

      {/* Right: header + content + footer */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {headerProps && (
          <ViewHeader
            {...headerProps}
            onMenuToggle={() => setMobileOpen((v) => !v)}
          />
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Box>

        {footerProps !== undefined && <ViewFooter {...footerProps} />}
      </Box>
    </Box>
  );
}
