import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowDownUp,
  CreditCard,
  Building2,
  Landmark,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const primaryCtaClass =
  "inline-flex w-full items-center justify-center gap-2 py-4 rounded-xl bg-cosmos-accent text-cosmos-on-accent font-semibold text-base hover:bg-cosmos-accent-hover transition-colors text-center";

type CosmosPayMockupProps = {
  ctaLinksToProfileRamp?: boolean;
};

export function CosmosPayMockup({ ctaLinksToProfileRamp = false }: CosmosPayMockupProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("500");
  const [payCurrency] = useState("ARS");

  const feePercent = 0.01;
  const feeFixed = 0.1;
  const rate = 1150; // ARS per USDC (mock)
  const numAmount = parseFloat(amount) || 0;
  const receiveUsdc = mode === "buy"
    ? (numAmount - feeFixed) / (1 + feePercent) / rate
    : 0;
  const receiveArs = mode === "sell"
    ? numAmount * rate * (1 - feePercent) - feeFixed
    : 0;
  const receiveDisplay = mode === "buy"
    ? (receiveUsdc > 0 ? receiveUsdc.toFixed(2) : "0.00")
    : (receiveArs > 0 ? receiveArs.toLocaleString("es-AR", { maximumFractionDigits: 0 }) : "0");

  const tm = (key: string) => t(`cosmosPay.mockup.${key}`);

  return (
    <div className="w-full max-w-[440px] mx-auto lg:ml-auto lg:mr-0">
      <div className="flex gap-1 p-1 rounded-xl bg-cosmos-surface-elevated border border-cosmos-border mb-6">
        <button
          type="button"
          onClick={() => setMode("buy")}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            mode === "buy"
              ? "bg-cosmos-accent text-cosmos-on-accent"
              : "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface"
          }`}
        >
          <ArrowDownToLine size={18} />
          {tm("buy")}
        </button>
        <button
          type="button"
          onClick={() => setMode("sell")}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            mode === "sell"
              ? "bg-cosmos-accent text-cosmos-on-accent"
              : "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface"
          }`}
        >
          <ArrowUpFromLine size={18} className="shrink-0" />
          {tm("sell")}
        </button>
      </div>

      <div className="rounded-2xl border border-cosmos-border bg-cosmos-surface overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-cosmos-border">
          <p className="text-xs text-cosmos-muted mb-2">
            {mode === "buy" ? tm("youPay") : tm("youSell")}
          </p>
          <div className="flex gap-2 sm:gap-3 items-center min-w-0">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              className="min-w-0 flex-1 bg-transparent text-xl sm:text-2xl font-semibold text-cosmos-text outline-none placeholder:text-cosmos-muted"
              placeholder="0.00"
            />
            <div className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-cosmos-surface-elevated border border-cosmos-border justify-center">
              <span className="text-xs sm:text-sm font-medium text-cosmos-text">
                {mode === "buy" ? payCurrency : "USDC"}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {(mode === "buy" ? ["100", "500", "1000", "5000"] : ["10", "50", "100", "500"]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(v)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cosmos-surface-elevated text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-border transition-colors"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-cosmos-surface border-2 border-cosmos-bg flex items-center justify-center">
            <ArrowDownUp size={18} className="text-cosmos-muted" />
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-cosmos-surface-elevated/30">
          <p className="text-xs text-cosmos-muted mb-2">{tm("youReceive")}</p>
          <div className="flex gap-2 sm:gap-3 items-center min-w-0">
            <span className="min-w-0 flex-1 text-lg sm:text-2xl font-semibold text-cosmos-accent truncate">
              {receiveDisplay} {mode === "buy" ? "USDC" : payCurrency}
            </span>
            <div className="shrink-0 px-3 sm:px-4 py-2 rounded-xl bg-cosmos-accent/10 border border-cosmos-accent/20">
              <span className="text-xs sm:text-sm font-medium text-cosmos-accent">
                {mode === "buy" ? "USDC" : payCurrency}
              </span>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-cosmos-muted mt-2 leading-relaxed break-words">
            {t("cosmosPay.mockup.rateNote", { rate: rate.toLocaleString(), currency: payCurrency })}
          </p>
        </div>

        <div className="p-4 sm:p-5 border-t border-cosmos-border">
          <p className="text-xs text-cosmos-muted mb-3">{tm("paymentMethod")}</p>
          <div className="flex flex-col gap-2 min-[360px]:flex-row">
            <button
              type="button"
              className="flex-1 min-w-0 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-cosmos-accent bg-cosmos-accent/10 text-cosmos-accent font-medium text-sm"
            >
              <CreditCard size={18} className="shrink-0" />
              {tm("card")}
            </button>
            <button
              type="button"
              className="flex-1 min-w-0 flex items-center justify-center gap-2 py-3 rounded-xl border border-cosmos-border text-cosmos-muted hover:text-cosmos-text hover:border-cosmos-accent/50 font-medium text-sm transition-colors"
            >
              <Building2 size={18} className="shrink-0" />
              {tm("bankTransfer")}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 pt-0">
          {ctaLinksToProfileRamp ? (
            <Link to="/profile/ramp" className={primaryCtaClass}>
              <Landmark size={20} className="shrink-0 opacity-95" aria-hidden />
              {tm("ctaGoToMyRamp")}
            </Link>
          ) : (
            <button type="button" className={primaryCtaClass}>
              {mode === "buy" ? tm("ctaBuyUsdc") : tm("ctaSellUsdc")}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-cosmos-muted px-1 min-w-0">
        <span className="min-w-0">{tm("protectionIncluded")}</span>
        <span className="shrink-0">{tm("feeShort")}</span>
      </div>
    </div>
  );
}
