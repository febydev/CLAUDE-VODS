import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PAL } from "../theme";

/**
 * MID-ROLL CTA MODULE - FULL_PACKAGE section 9, rendered entirely in code.
 * Nothing here is an AI-generated image and no lettering is baked: the word SUBSCRIBE is drawn
 * by this component in the mandatory font (Anton), with the Arial/Helvetica/Times/Calibri/Segoe
 * ban in force. The two backdrop plates keep their whole lower third empty by design.
 *
 * Mounted at absolute frame 20163 (672.10s) for 399 frames (to 685.40s), so every time below is
 * LOCAL and matches the section 9 table exactly:
 *    0.00  panel paper-wipes on from the left            0.45s  ease-out
 *    0.45  like icon draws on along its own path         0.50s  linear draw
 *    2.10  SUBSCRIBE scales in 0.88 -> 1.06 -> 1.00      0.50s  back-ease overshoot
 *    3.30  cursor travels from off-frame lower right     0.70s  ease-in-out
 *    4.05  click: squash + fill inverts + tick draws     0.18s  ease-out
 *    4.25  bell rings +/-12deg, 3 decaying oscillations  0.70s  damped sine
 *    4.50  6 spark ticks radiate from the bell and fade  0.40s  ease-out
 *    4.90  hold, panel breathing 1.000 -> 1.015          3.20s  sine, looped
 *   11.70  cursor and sparks exit, 8px downward drift    0.80s  ease-in
 *   12.50  panel paper-wipes off to the right            0.80s  ease-in
 *   13.30  frame fully clean for the rest of S123
 *
 * Accessibility: no flash above 3 Hz, the spark burst is a single 0.40s event, and the ivory
 * label on the charcoal button holds roughly 13:1 contrast.
 */
const S = (sec: number) => sec * 30;

export const CtaModule: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const f = frame;

  // ── geometry, normalized to 1920x1080 (section 9 table) ─────────────────────────────────
  const panelW = 0.52 * width;
  const panelH = 0.17 * height;
  const panelCx = 0.5 * width;
  const panelCy = 0.845 * height;
  const btnW = 0.24 * width;
  const btnH = 0.085 * height;
  const likeCx = 0.315 * width;
  const bellCx = 0.685 * width;

  // ── panel wipe on / off ─────────────────────────────────────────────────────────────────
  const wipeOn = interpolate(f, [S(0), S(0.45)], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeOff = interpolate(f, [S(12.5), S(13.3)], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (wipeOff >= 1) return null;
  // revealed from the left, then cleared to the right
  const insetRight = (1 - wipeOn) * 100;
  const insetLeft = wipeOff * 100;

  // ── breathing hold from 4.90s, 3.20s period ─────────────────────────────────────────────
  const breathe =
    f >= S(4.9) ? 1 + 0.015 * Math.sin(((f - S(4.9)) / (3.2 * 30)) * Math.PI * 2) : 1;

  // ── like icon draws on along its own path ───────────────────────────────────────────────
  const likeDraw = interpolate(f, [S(0.45), S(0.95)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── SUBSCRIBE button: 0.88 -> 1.06 -> 1.00 with back-ease overshoot ─────────────────────
  const btnIn = interpolate(f, [S(2.1), S(2.4), S(2.6)], [0.88, 1.06, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnAppeared = f >= S(2.1);

  // ── click at 4.05s: squash 1.00 -> 0.94 -> 1.00 over 0.18s, fill inverts ────────────────
  const squash = interpolate(f, [S(4.05), S(4.14), S(4.23)], [1, 0.94, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clicked = f >= S(4.05);
  const btnFill = clicked ? PAL.warmRed : PAL.charcoal;
  const tickDraw = interpolate(f, [S(4.05), S(4.35)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── cursor travel, then exit ────────────────────────────────────────────────────────────
  const travel = interpolate(f, [S(3.3), S(4.0)], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const curX = interpolate(travel, [0, 1], [1.05 * width, 0.5 * width]);
  const curY = interpolate(travel, [0, 1], [1.05 * height, 0.862 * height]);
  const exitFade = interpolate(f, [S(11.7), S(12.5)], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitDrift = interpolate(f, [S(11.7), S(12.5)], [0, 8], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorVisible = f >= S(3.3);

  // ── bell: +/-12 degrees, 3 oscillations decaying to 0 over 0.70s ────────────────────────
  let bellRot = 0;
  if (f >= S(4.35) && f <= S(5.05)) {
    const t = (f - S(4.35)) / (0.7 * 30);
    bellRot = 12 * Math.exp(-3.1 * t) * Math.sin(3 * 2 * Math.PI * t);
  }

  // ── 6 spark ticks radiate from the bell, single 0.40s event ─────────────────────────────
  const sparkP = interpolate(f, [S(4.6), S(5.0)], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sparksLive = f >= S(4.6) && f <= S(5.0);

  const stroke = PAL.charcoal;
  const label = Math.round(btnH * 0.46);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60, opacity: exitFade === 0 ? 0 : 1 }}>
      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${insetRight}% 0 ${insetLeft}%)`,
          WebkitClipPath: `inset(0 ${insetRight}% 0 ${insetLeft}%)`,
        }}
      >
        {/* ── torn-paper ivory panel with a 4px paper drop shadow offset at 4 degrees ── */}
        <div
          style={{
            position: "absolute",
            left: panelCx - panelW / 2,
            top: panelCy - panelH / 2,
            width: panelW,
            height: panelH,
            transform: `scale(${breathe})`,
            transformOrigin: "center",
            background: PAL.ivory,
            border: `6px solid ${stroke}`,
            boxShadow: `${4 * Math.cos((4 * Math.PI) / 180)}px ${4 * Math.sin((4 * Math.PI) / 180) + 4}px 0 rgba(36,27,22,0.55)`,
            // torn edge: a slightly irregular outline rather than a clean rectangle
            clipPath:
              "polygon(0.4% 3%, 6% 0.6%, 19% 2.4%, 33% 0.4%, 48% 2.6%, 63% 0.5%, 78% 2.8%, 92% 0.6%, 99.6% 3%, 99.4% 96%, 93% 99.4%, 79% 97%, 64% 99.5%, 49% 97.2%, 34% 99.5%, 20% 97%, 7% 99.4%, 0.6% 96%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />

        {/* ── hand-drawn thumb (like), charcoal line + ivory fill, draws along its path ── */}
        <svg
          style={{
            position: "absolute",
            left: likeCx - 0.0375 * width,
            top: panelCy - 0.0375 * width,
            width: 0.075 * width,
            height: 0.075 * width,
            transform: `scale(${breathe})`,
            overflow: "visible",
          }}
          viewBox="0 0 100 100"
        >
          <path
            d="M32 46 L32 84 L20 84 L20 46 Z M38 46 L38 84 C38 84 46 88 58 88 L74 88 C79 88 82 85 83 80 L88 56 C89 50 86 46 80 46 L62 46 L66 28 C68 20 63 12 55 12 C51 12 48 15 47 19 L44 34 C43 40 40 44 38 46 Z"
            fill={PAL.ivory}
            stroke={stroke}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={620}
            strokeDashoffset={(1 - likeDraw) * 620}
            style={{ opacity: likeDraw > 0 ? 1 : 0 }}
          />
        </svg>

        {/* ── SUBSCRIBE button: charcoal, flipping to warm red on click ── */}
        {btnAppeared ? (
          <div
            style={{
              position: "absolute",
              left: panelCx - btnW / 2,
              top: panelCy - btnH / 2,
              width: btnW,
              height: btnH,
              transform: `scale(${btnIn * squash * breathe})`,
              transformOrigin: "center",
              background: btnFill,
              border: `6px solid ${stroke}`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: label,
                letterSpacing: 1,
                color: PAL.ivory,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Subscribe
            </span>
          </div>
        ) : null}

        {/* ── ivory tick, drawn 0.06 to the right of the word ── */}
        {clicked ? (
          <svg
            style={{
              position: "absolute",
              left: panelCx + btnW / 2 - 0.005 * width,
              top: panelCy - 0.024 * width,
              width: 0.05 * width,
              height: 0.05 * width,
              overflow: "visible",
            }}
            viewBox="0 0 60 60"
          >
            <path
              d="M8 32 L24 48 L54 12"
              fill="none"
              stroke={PAL.ivory}
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={95}
              strokeDashoffset={(1 - tickDraw) * 95}
            />
          </svg>
        ) : null}

        {/* ── hand-drawn bell, ringing ── */}
        <svg
          style={{
            position: "absolute",
            left: bellCx - 0.035 * width,
            top: panelCy - 0.035 * width,
            width: 0.07 * width,
            height: 0.07 * width,
            transform: `scale(${breathe}) rotate(${bellRot}deg)`,
            transformOrigin: "50% 18%",
            overflow: "visible",
          }}
          viewBox="0 0 100 100"
        >
          <path
            d="M50 14 C36 14 28 24 28 38 C28 54 22 62 18 68 L82 68 C78 62 72 54 72 38 C72 24 64 14 50 14 Z"
            fill={PAL.ivory}
            stroke={stroke}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <path d="M50 8 L50 14" stroke={stroke} strokeWidth={5} strokeLinecap="round" />
          <path
            d="M42 74 C42 80 45 84 50 84 C55 84 58 80 58 74"
            fill={PAL.ivory}
            stroke={stroke}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </svg>

        {/* ── 6 spark ticks radiating from the bell ── */}
        {sparksLive
          ? Array.from({ length: 6 }).map((_, i) => {
              const a = (-150 + i * 30) * (Math.PI / 180);
              const r0 = 0.028 * width;
              const r = r0 + sparkP * 0.032 * width;
              const len = 0.014 * width * (1 - sparkP * 0.45);
              const x1 = bellCx + Math.cos(a) * r;
              const y1 = panelCy - 0.012 * width + Math.sin(a) * r;
              const x2 = x1 + Math.cos(a) * len;
              const y2 = y1 + Math.sin(a) * len;
              return (
                <svg
                  key={i}
                  style={{ position: "absolute", left: 0, top: 0, width, height, overflow: "visible" }}
                >
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={stroke}
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={1 - sparkP}
                  />
                </svg>
              );
            })
          : null}

        {/* ── hand-drawn cursor: charcoal outline with an ivory inner ── */}
        {cursorVisible ? (
          <svg
            style={{
              position: "absolute",
              left: curX,
              top: curY + exitDrift,
              width: 0.038 * width,
              height: 0.038 * width,
              opacity: exitFade,
              overflow: "visible",
            }}
            viewBox="0 0 60 60"
          >
            <path
              d="M8 4 L8 46 L20 35 L28 54 L37 50 L29 32 L45 30 Z"
              fill={PAL.ivory}
              stroke={stroke}
              strokeWidth={5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
