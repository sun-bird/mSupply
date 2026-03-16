import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { NavItem } from './nav.types';

const SIDEBAR_WIDTH = 200;
const SIDEBAR_COLLAPSED_WIDTH = 64;

// mSupply brand logo mark as inline SVG
function MSupplyLogo() {
  return (
    <Box
      component="img"
      src="https://msupply.foundation/wp-content/uploads/2021/07/msupply-logo.png"
      alt="mSupply"
      onError={(e) => {
        // Fallback to text if image fails
        const target = e.currentTarget as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          const fallback = document.createElement('div');
          fallback.style.cssText =
            'width:40px;height:40px;background:#E95C30;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:18px;';
          fallback.textContent = 'M';
          parent.appendChild(fallback);
        }
      }}
      sx={{ width: 40, height: 40, objectFit: 'contain' }}
    />
  );
}

interface NavSidebarProps {
  navItems: NavItem[];
  activePath?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({
  navItems,
  activePath,
  collapsed,
}: {
  navItems: NavItem[];
  activePath?: string;
  collapsed: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 2.5,
          minHeight: 64,
        }}
      >
        <MSupplyLogo />
      </Box>

      {/* Nav items */}
      <List disablePadding sx={{ flex: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive = activePath === item.href;

          const listItemButton = (
            <ListItemButton
              component="a"
              href={item.href}
              selected={isActive}
              sx={{
                mx: 1,
                borderRadius: '8px',
                py: 0.75,
                px: 1.5,
                mb: 0.25,
                minHeight: 40,
                '&.Mui-selected': {
                  bgcolor: 'rgba(233,92,48,0.08)',
                  '&:hover': { bgcolor: 'rgba(233,92,48,0.12)' },
                },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 'unset' : 36,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '& svg': { fontSize: 22 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                    noWrap: true,
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.href} disablePadding>
              {collapsed ? (
                <Tooltip title={item.label} placement="right">
                  {listItemButton}
                </Tooltip>
              ) : (
                listItemButton
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default function NavSidebar({
  navItems,
  activePath,
  mobileOpen = false,
  onMobileClose,
}: NavSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent
          navItems={navItems}
          activePath={activePath}
          collapsed={false}
        />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isTablet ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isTablet ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          position: 'relative',
          height: '100%',
        },
      }}
    >
      <SidebarContent
        navItems={navItems}
        activePath={activePath}
        collapsed={isTablet}
      />
    </Drawer>
  );
}
