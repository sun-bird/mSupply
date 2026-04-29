import { Backdrop, Box, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FinaliseSplashProps {
  /** When true, the splash mounts and plays the confetti rain. */
  open: boolean;
  /** Called once the splash has finished — typically the parent uses this
   *  to navigate elsewhere (e.g. back to the tenders list). */
  onComplete: () => void;
  /** Time the splash is shown before `onComplete` fires. Default 3500ms. */
  durationMs?: number;
}

/**
 * Full-screen confetti splash shown when the user finalises a tender.
 *
 * Each piece is an absolutely-positioned <Box> that falls from above the
 * viewport down past the bottom edge. Per-piece variation (start column,
 * horizontal drift, rotation, fall duration, colour, size, shape) is
 * randomised on each open so the rain looks fresh every time.
 *
 * A single shared `@keyframes confetti-fall` rule reads each piece's drift
 * and rotation from CSS custom properties, so we only define one animation
 * regardless of piece count.
 *
 * The "Tender finalised" headline floats centred over the confetti.
 */
export default function FinaliseSplash({ open, onComplete, durationMs = 3500 }: FinaliseSplashProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const primary = theme.palette.primary.main;

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onComplete, durationMs);
    return () => window.clearTimeout(id);
  }, [open, durationMs, onComplete]);

  // Generate ~120 confetti pieces with random properties. useMemo is keyed
  // on `open` so each new splash gets a fresh distribution.
  const pieces = useMemo(() => {
    if (!open) return [];
    const palette = [primary, '#FFC857', '#3E7BFA', '#05A660', '#E53535', '#FFFFFF'];
    return Array.from({ length: 120 }, (_, i) => {
      const isStrip = Math.random() > 0.45;
      const w = isStrip ? 6 + Math.random() * 4 : 8 + Math.random() * 6;
      const h = isStrip ? 12 + Math.random() * 6 : w;
      return {
        key: i,
        left: Math.random() * 100, // vw
        delayMs: Math.random() * 600,
        durationMs: 1800 + Math.random() * 1400,
        width: w,
        height: h,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotateDeg: Math.random() * 1080 - 540, // total rotation -540…540°
        driftPx: (Math.random() - 0.5) * 260, // horizontal drift -130…130px
        round: !isStrip,
      };
    });
  }, [open, primary]);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: theme.zIndex.modal,
        bgcolor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(2px)',
        overflow: 'hidden',
        '@keyframes confetti-fall': {
          '0%': {
            transform: 'translate3d(0, 0, 0) rotate(0deg)',
            opacity: 1,
          },
          '100%': {
            transform: 'translate3d(var(--drift), 110vh, 0) rotate(var(--rotate))',
            opacity: 0.9,
          },
        },
        '@keyframes finalise-text': {
          '0%': { opacity: 0, transform: 'translateY(8px) scale(0.96)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      }}
    >
      {open && (
        <>
          {pieces.map((p) => (
            <Box
              key={p.key}
              style={{
                // Per-piece values via CSS custom properties so the shared
                // keyframe can read them. style= bypasses emotion class
                // generation, which is what we want for raw CSS vars.
                ['--drift' as string]: `${p.driftPx}px`,
                ['--rotate' as string]: `${p.rotateDeg}deg`,
              }}
              sx={{
                position: 'absolute',
                top: '-10vh',
                left: `${p.left}vw`,
                width: p.width,
                height: p.height,
                bgcolor: p.color,
                borderRadius: p.round ? '50%' : '2px',
                willChange: 'transform',
                animation: `confetti-fall ${p.durationMs}ms ${p.delayMs}ms ease-in forwards`,
              }}
            />
          ))}

          {/* Headline — floats above the confetti */}
          <Typography
            sx={{
              position: 'relative',
              zIndex: 1,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 28,
              color: '#FFFFFF',
              letterSpacing: '0.5px',
              textShadow: '0 2px 16px rgba(0,0,0,0.55)',
              animation: 'finalise-text 600ms 200ms ease-out backwards',
            }}
          >
            {t('tenderState.tenderFinalised')}
          </Typography>
        </>
      )}
    </Backdrop>
  );
}
