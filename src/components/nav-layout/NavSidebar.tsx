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

const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 64;

interface SidebarContentProps {
  navItems: NavItem[];
  activePath?: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  logoUrl?: string;
}

function SidebarContent({ navItems, activePath, collapsed, onToggleCollapse, logoUrl }: SidebarContentProps) {
  const initialOpen =
    navItems.find((item) => item.children?.some((c) => c.href === activePath))?.href ?? null;

  const [openHref, setOpenHref] = useState<string | null>(initialOpen);

  const toggle = (href: string) =>
    setOpenHref((prev) => (prev === href ? null : href));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Logo — acts as collapse/expand toggle */}
      <Box
        onClick={onToggleCollapse}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 2.5,
          minHeight: 64,
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 },
          transition: 'opacity 0.15s',
        }}
      >
        <Box
          component="img"
          src={logoUrl || msupplyLogo}
          alt="mSupply"
          sx={{ height: 40, width: 'auto', flexShrink: 0 }}
        />
      </Box>

      {/* Nav items */}
      <List disablePadding sx={{ flex: 1, pt: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item) => {
          const hasChildren = !!item.children?.length;
          const isParentActive = activePath === item.href;
          const isChildActive = item.children?.some((c) => c.href === activePath) ?? false;
          const isOpen = openHref === item.href;

          const parentButton = (
            <ListItemButton
              onClick={hasChildren ? () => toggle(item.href) : (item.onClick ?? undefined)}
              component={hasChildren ? 'div' : item.onClick ? 'div' : 'a'}
              {...(!hasChildren && !item.onClick ? { href: item.href } : {})}
              selected={isParentActive || (!isOpen && isChildActive)}
              sx={{
                mx: 1,
                borderRadius: '8px',
                py: 0.75,
                px: 1.5,
                mb: 0.25,
                minHeight: 40,
                cursor: 'pointer',
                color: isParentActive || isChildActive ? 'primary.main' : 'text.primary',
                '& .MuiListItemIcon-root': {
                  color: isParentActive || isChildActive ? 'primary.main' : 'text.secondary',
                },
                '&:hover': {
                  bgcolor: 'rgba(233,92,48,0.05)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(233,92,48,0.05)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '&:hover': { bgcolor: 'rgba(233,92,48,0.05)' },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 'unset' : 36,
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
                      fontSize: 14,
                      fontWeight: isParentActive || isChildActive ? 600 : 400,
                      color: 'inherit',
                      noWrap: true,
                      letterSpacing: '0.15px',
                    }}
                  />
                  {hasChildren && (
                    <Box sx={{ color: 'inherit', display: 'flex', ml: 0.5 }}>
                      {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </Box>
                  )}
                </>
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.href} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              {collapsed ? (
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
                          component={child.onClick ? 'div' : 'a'}
                          {...(!child.onClick ? { href: child.href } : {})}
                          onClick={child.onClick}
                          selected={isActive}
                          sx={{
                            pl: '52px',
                            pr: 2,
                            py: '4px',
                            minHeight: 32,
                            color: isActive ? 'primary.main' : 'text.primary',
                            '&:hover': {
                              bgcolor: 'rgba(233,92,48,0.05)',
                              color: 'primary.main',
                            },
                            '&.Mui-selected': {
                              bgcolor: 'rgba(233,92,48,0.05)',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'rgba(233,92,48,0.05)' },
                            },
                          }}
                        >
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: isActive ? 600 : 400,
                              color: 'inherit',
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

interface NavSidebarProps {
  navItems: NavItem[];
  activePath?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  logoUrl?: string;
}

export default function NavSidebar({
  navItems,
  activePath,
  mobileOpen = false,
  onMobileClose,
  logoUrl,
}: NavSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Manual collapse state; tablet starts collapsed, desktop starts expanded
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed((v) => !v);

  const drawerWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

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
        <SidebarContent
          navItems={navItems}
          activePath={activePath}
          collapsed={false}
          onToggleCollapse={onMobileClose ?? (() => {})}
          logoUrl={logoUrl}
        />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          bgcolor: 'transparent',
          position: 'relative',
          height: '100%',
          overflowX: 'hidden',
          transition: 'width 0.2s ease',
        },
      }}
    >
      <SidebarContent
        navItems={navItems}
        activePath={activePath}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        logoUrl={logoUrl}
      />
    </Drawer>
  );
}
