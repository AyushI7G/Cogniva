/**
 * Clean Faceless Professional Avatars for Cogniva Enterprise Roles
 * High-resolution, self-contained SVG vectors with modern gradients and sleek faceless silhouettes.
 */

// Helper to encode SVG into Data URI
const svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

export const FACELESS_AVATARS: Record<string, string> = {
  super_admin: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="bg_super" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A2545"/>
          <stop offset="100%" stop-color="#1E1020"/>
        </linearGradient>
        <linearGradient id="skin_super" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E2D4E0"/>
          <stop offset="100%" stop-color="#C5B2C3"/>
        </linearGradient>
        <linearGradient id="hair_super" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2D152A"/>
          <stop offset="100%" stop-color="#150814"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg_super)"/>
      <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <!-- Body / Executive Blazer -->
      <path d="M22 112 C24 88 40 76 60 76 C80 76 96 88 98 112 Z" fill="#1C1420"/>
      <path d="M42 86 L60 108 L78 86 L68 76 L60 84 L52 76 Z" fill="#FFFFFF" opacity="0.9"/>
      <path d="M46 88 L60 112 L74 88" fill="#5E3557"/>
      <!-- Neck -->
      <path d="M50 56 H70 V74 C70 79 65 84 60 84 C55 84 50 79 50 74 Z" fill="url(#skin_super)"/>
      <!-- Head / Face Silhouette -->
      <ellipse cx="60" cy="50" rx="18" ry="22" fill="url(#skin_super)"/>
      <!-- Sleek Hair Silhouette -->
      <path d="M40 46 C40 28 50 20 60 20 C70 20 80 28 80 46 C80 48 78 54 77 56 C74 42 70 34 60 34 C50 34 46 42 43 56 C42 54 40 48 40 46 Z" fill="url(#hair_super)"/>
      <!-- Executive Minimalist Earring Accent -->
      <circle cx="41" cy="53" r="2" fill="#E8D38D"/>
      <circle cx="79" cy="53" r="2" fill="#E8D38D"/>
    </svg>
  `),

  security_officer: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="bg_sec" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="skin_sec" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <linearGradient id="hair_sec" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg_sec)"/>
      <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <!-- Security Coat -->
      <path d="M22 112 C24 88 40 76 60 76 C80 76 96 88 98 112 Z" fill="#0A0F1D"/>
      <path d="M44 84 L60 106 L76 84 L60 78 Z" fill="#38BDF8" opacity="0.8"/>
      <!-- Neck -->
      <path d="M50 56 H70 V74 C70 79 65 84 60 84 C55 84 50 79 50 74 Z" fill="url(#skin_sec)"/>
      <!-- Head -->
      <ellipse cx="60" cy="50" rx="18" ry="22" fill="url(#skin_sec)"/>
      <!-- Crop Hair -->
      <path d="M42 42 C42 26 50 22 60 22 C70 22 78 26 78 42 C78 30 72 26 60 26 C48 26 42 30 42 42 Z" fill="url(#hair_sec)"/>
      <!-- Security Badge Pin -->
      <polygon points="60,94 65,99 63,106 60,103 57,106 55,99" fill="#38BDF8"/>
    </svg>
  `),

  eng_lead: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="bg_eng" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0E3A53"/>
          <stop offset="100%" stop-color="#082130"/>
        </linearGradient>
        <linearGradient id="skin_eng" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F1E3D3"/>
          <stop offset="100%" stop-color="#DFC8B2"/>
        </linearGradient>
        <linearGradient id="hair_eng" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg_eng)"/>
      <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <!-- Tech Hoodie / Jacket -->
      <path d="M22 112 C24 88 40 76 60 76 C80 76 96 88 98 112 Z" fill="#132337"/>
      <path d="M50 78 L60 92 L70 78 Z" fill="#0284C7"/>
      <!-- Neck -->
      <path d="M50 56 H70 V74 C70 79 65 84 60 84 C55 84 50 79 50 74 Z" fill="url(#skin_eng)"/>
      <!-- Head -->
      <ellipse cx="60" cy="50" rx="18" ry="22" fill="url(#skin_eng)"/>
      <!-- Modern Hair Cut -->
      <path d="M40 40 C40 22 50 18 64 18 C74 18 80 24 80 38 C75 30 68 25 60 25 C49 25 43 32 40 40 Z" fill="url(#hair_eng)"/>
      <!-- Sleek Minimalist Architect Glasses -->
      <rect x="46" y="44" width="11" height="8" rx="2" stroke="#0284C7" stroke-width="1.8" fill="none"/>
      <rect x="63" y="44" width="11" height="8" rx="2" stroke="#0284C7" stroke-width="1.8" fill="none"/>
      <line x1="57" y1="48" x2="63" y2="48" stroke="#0284C7" stroke-width="1.8"/>
    </svg>
  `),

  hr_director: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="bg_hr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#581C87"/>
          <stop offset="100%" stop-color="#2E1065"/>
        </linearGradient>
        <linearGradient id="skin_hr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCE7F3"/>
          <stop offset="100%" stop-color="#FBCFE8"/>
        </linearGradient>
        <linearGradient id="hair_hr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A044E"/>
          <stop offset="100%" stop-color="#2E0854"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg_hr)"/>
      <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <!-- Collar Blouse -->
      <path d="M22 112 C24 88 40 76 60 76 C80 76 96 88 98 112 Z" fill="#240738"/>
      <path d="M46 80 L60 98 L74 80 Z" fill="#C084FC" opacity="0.9"/>
      <!-- Neck -->
      <path d="M50 56 H70 V74 C70 79 65 84 60 84 C55 84 50 79 50 74 Z" fill="url(#skin_hr)"/>
      <!-- Head -->
      <ellipse cx="60" cy="50" rx="18" ry="22" fill="url(#skin_hr)"/>
      <!-- Elegant Wavy Hair -->
      <path d="M38 52 C36 32 46 20 60 20 C74 20 84 32 82 52 C84 64 80 74 76 78 C76 62 74 38 60 38 C46 38 44 62 44 78 C40 74 36 64 38 52 Z" fill="url(#hair_hr)"/>
    </svg>
  `),

  sales_rep: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="bg_sales" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#78350F"/>
          <stop offset="100%" stop-color="#451A03"/>
        </linearGradient>
        <linearGradient id="skin_sales" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF3C7"/>
          <stop offset="100%" stop-color="#FDE68A"/>
        </linearGradient>
        <linearGradient id="hair_sales" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#451A03"/>
          <stop offset="100%" stop-color="#290E02"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg_sales)"/>
      <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <!-- Suit & Tie -->
      <path d="M22 112 C24 88 40 76 60 76 C80 76 96 88 98 112 Z" fill="#1C1917"/>
      <path d="M44 82 L60 102 L76 82 L60 76 Z" fill="#FFFFFF"/>
      <path d="M57 82 L63 82 L62 108 L60 112 L58 108 Z" fill="#D97706"/>
      <!-- Neck -->
      <path d="M50 56 H70 V74 C70 79 65 84 60 84 C55 84 50 79 50 74 Z" fill="url(#skin_sales)"/>
      <!-- Head -->
      <ellipse cx="60" cy="50" rx="18" ry="22" fill="url(#skin_sales)"/>
      <!-- Side Part Hair -->
      <path d="M42 38 C42 22 50 20 62 20 C74 20 78 26 78 38 C72 28 66 26 60 26 C48 26 44 32 42 38 Z" fill="url(#hair_sales)"/>
    </svg>
  `),

  guest: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="bg_guest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
        <linearGradient id="skin_guest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <linearGradient id="hair_guest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg_guest)"/>
      <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <!-- Minimalist Sweater -->
      <path d="M22 112 C24 88 40 76 60 76 C80 76 96 88 98 112 Z" fill="#1E293B"/>
      <!-- Lanyard / Visitor badge -->
      <path d="M52 76 L58 98 L62 98 L68 76" stroke="#94A3B8" stroke-width="1.5" fill="none"/>
      <rect x="55" y="98" width="10" height="13" rx="1.5" fill="#E2E8F0"/>
      <!-- Neck -->
      <path d="M50 56 H70 V74 C70 79 65 84 60 84 C55 84 50 79 50 74 Z" fill="url(#skin_guest)"/>
      <!-- Head -->
      <ellipse cx="60" cy="50" rx="18" ry="22" fill="url(#skin_guest)"/>
      <!-- Simple Hair Cut -->
      <path d="M42 40 C42 24 50 22 60 22 C70 22 78 24 78 40 C74 30 68 27 60 27 C50 27 45 30 42 40 Z" fill="url(#hair_guest)"/>
    </svg>
  `)
};

export const getFacelessAvatar = (roleId: string): string => {
  return FACELESS_AVATARS[roleId] || FACELESS_AVATARS.guest;
};
