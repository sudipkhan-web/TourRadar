import { ChevronDown, Code2, Compass, CreditCard, ShieldCheck } from 'lucide-react';
import { PARTNER_THEMES } from '../data/travelData';
import { PartnerId, PartnerTheme } from '../types/travel';

interface TopNavBarProps {
  partnerId: PartnerId;
  onPartnerChange: (id: PartnerId) => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  theme: PartnerTheme;
}

export function TopNavBar({
  partnerId,
  onPartnerChange,
  showInspector,
  onToggleInspector,
  theme,
}: TopNavBarProps) {
  const appTitle =
    partnerId === 'vayo'
      ? 'Vayo AI Trip Manager — Powered by TourRadar MCP'
      : `${theme.assistantName} — Powered by TourRadar MCP`;

  const PartnerIcon =
    partnerId === 'capital-one'
      ? CreditCard
      : partnerId === 'mastercard-agentpay'
        ? ShieldCheck
        : Compass;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Title */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition-colors ${theme.primaryBg}`}
            aria-hidden="true"
          >
            <PartnerIcon className="h-4.5 w-4.5" />
          </div>
          <h1 className="truncate font-display text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            {appTitle}
          </h1>
        </div>

        {/* Zone 2 & 3: Partner Switcher + MCP Inspector Toggle */}
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          {/* Partner Branding Switcher */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="partner-theme-select"
              className="hidden text-xs font-medium text-slate-500 xl:inline whitespace-nowrap"
            >
              Partner Channel
            </label>
            <div className="relative">
              <select
                id="partner-theme-select"
                value={partnerId}
                onChange={(e) => onPartnerChange(e.target.value as PartnerId)}
                aria-label="Partner branding theme"
                className={`h-9 appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-medium text-slate-800 transition-colors hover:border-slate-300 hover:bg-white focus:outline-none focus-visible:ring-2 ${theme.ringFocus} sm:text-sm`}
              >
                {(Object.keys(PARTNER_THEMES) as PartnerId[]).map((key) => (
                  <option key={key} value={key}>
                    {PARTNER_THEMES[key].label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* MCP / API Inspector Toggle Switch */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4 sm:pl-6">
            <Code2 className="hidden h-4 w-4 text-slate-500 sm:block" aria-hidden="true" />
            <span
              id="mcp-inspector-label"
              className="hidden text-xs font-medium text-slate-700 md:inline whitespace-nowrap sm:text-sm"
            >
              Show MCP / API Inspector
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showInspector}
              aria-labelledby="mcp-inspector-label"
              aria-label="Show MCP / API Inspector"
              onClick={onToggleInspector}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${theme.ringFocus} ${
                showInspector
                  ? `${theme.primaryBg} border-transparent`
                  : 'border-slate-300 bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  showInspector ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
