import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Collapse,
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
import { useState } from 'react';
import msupplyLogo from '../../assets/msupply-logo.svg';
import type { NavItem } from './nav.types';

const SIDEBAR_WIDTH = 200;
const SIDEBAR_COLLAPSED_WIDTH = 64;

function MSupplyLogo() {
  return (
    <Box
      component="img"
      src={msupplyLogo}
      alt="mSupply"
      sx={{ height: 40, width: 'auto', flexShrink: 0 }}
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
  // Track which parent items are open
  const initialOpen = navItems.reduce<Record<string, boolean>>((acc, item) => {
    if (item.children?.some((c) => c.href === activePath)) {
      acc[item.href] = true;
    }
    return acc;
  }, {});

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(initialOpen);

  const toggle = (href: string) =>
    setOpenMap((prev) => ({ ...prev, [href]: !prev[href] }));

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
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 2.5, minHeight: 64 }}>
        <MSupplyLogo />
      </Box>

      {/* Nav items */}
      <List disablePadding sx={{ flex: 1, pt: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item) => {
          const hasChildren = !!item.children?.length;
          const isParentActive = activePath === item.href;
          const isChildActive = item.children?.some((c) => c.href === activePath) ?? false;
          const isOpen = openMap[item.href] ?? false;

          const parentButton = (
            <ListItemButton
              onClick={hasChildren ? () => toggle(item.href) : undefined}
              component={hasChildren ? 'div' : 'a'}
              {...(!hasChildren ? { href: item.href } : {})}
              selected={isParentActive || (!isOpen && isChildActive)}
              sx={{
                mx: 1,
                borderRadius: '8px',
                py: 0.75,
                px: 1.5,
                mb: 0.25,
                minHeight: 40,
                cursor: 'pointer',
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
                  color: isParentActive || isChildActive ? 'primary.main' : 'text.secondary',
                  '& svg': { fontSize: 22 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontWeight: isParentActive || isChildActive ? 600 : 400,
                      color: isParentActive || isChildActive ? 'primary.main' : 'text.primary',
                      noWrap: true,
                      letterSpacing: '0.15px',
                    }}
                  />
                  {hasChildren && (
                    <Box sx={{ color: 'text.secondary', display: 'flex', ml: 0.5 }}>
                      {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </Box>
                  )}
                </>
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.href} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              {collapsed && hasChildren ? (
                <Tooltip title={item.label} placement="right">
                  {parentButton}
                </Tooltip>
              ) : collapsed ? (
                <Tooltip title={item.label} placement="right">
                  {parentButton}
                </Tooltip>
              ) : (
                parentButton
              )}

              {/* Sub-items */}
              {hasChildren && !collapsed && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ py: 1 }}>
                    {item.children!.map((child) => {
                      const isActive = activePath === child.href;
                      return (
                        <ListItemButton
                          key={child.href}
                          component="a"
                          href={child.href}
                          selected={isActive}
                          sx={{
                            pl: '52px', // 36px icon slot + 16px base px
                            pr: 2,
                            py: '4px',
                            minHeight: 32,
                            '&.Mui-selected': {
                              bgcolor: 'rgba(233,92,48,0.04)',
                              '&:hover': { bgcolor: 'rgba(233,92,48,0.08)' },
                            },
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? 'primary.main' : 'text.primary',
                              noWrap: true,
                              letterSpacing: '0.17px',
                              lineHeight: '24px',
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
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
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent navItems={navItems} activePath={activePath} collapsed={false} />
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
      <SidebarContent navItems={navItems} activePath={activePath} collapsed={isTablet} />
    </Drawer>
  );
}
