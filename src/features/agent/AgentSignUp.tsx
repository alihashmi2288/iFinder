import React, { useState } from 'react';
import {
  CheckCircle2,
  FileUp,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { COPY } from '../../data/copy';
import { validateReraBrn, verifyReraNumberAsync } from '../../services/agentService';
import { useAppStore } from '../../store/AppContext';

export const AgentSignUp: React.FC = () => {
  const { updateAgentSession, pushToast } = useAppStore();

  const [name, setName] = useState('');
  const [agency, setAgency] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reraBrn, setReraBrn] = useState('');
  const [tradeLicenceFile, setTradeLicenceFile] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [verifyingBrn, setVerifyingBrn] = useState(false);
  const [brnVerified, setBrnVerified] = useState(false);
  const [brnError, setBrnError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleVerifyBrn = async () => {
    setBrnError(null);
    setBrnVerified(false);
    const syncCheck = validateReraBrn(reraBrn);
    if (!syncCheck.valid) {
      setBrnError(syncCheck.error ?? 'Invalid RERA BRN.');
      return;
    }
    setVerifyingBrn(true);
    try {
      const res = await verifyReraNumberAsync(reraBrn);
      if (res.verified) {
        setBrnVerified(true);
      } else {
        setBrnError(res.error ?? 'Verification failed.');
      }
    } finally {
      setVerifyingBrn(false);
    }
  };

  const handleUseDemoAgent = () => {
    updateAgentSession({
      signedIn: true,
      agentId: 'agent-1',
      name: 'Aisha Rahman',
      agency: 'Gulf Haven Real Estate',
      email: 'aisha@gulfhaven.ae',
      phone: '+971 50 482 9104',
      reraBrn: '48291',
      tradeLicenceFile: 'Gulf_Haven_DED_Licence_2026.pdf',
    });
    pushToast(
      'Signed in as Aisha Rahman',
      'RERA BRN 48291 verified · Gulf Haven Real Estate',
      'success'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Enter your full name.';
    if (!agency.trim()) errs.agency = 'Enter your brokerage name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid brokerage email.';
    }
    if (phone.trim().length < 7) errs.phone = 'Enter a valid UAE phone number.';

    const brnCheck = validateReraBrn(reraBrn);
    if (!brnCheck.valid) {
      errs.reraBrn = brnCheck.error ?? 'Invalid RERA BRN.';
      setBrnError(errs.reraBrn);
    }
    if (!tradeLicenceFile) {
      errs.tradeLicence = 'Upload your DED trade licence PDF or image.';
    }
    if (!acceptedTerms) {
      errs.terms = 'Accept the RERA verification & lead-exclusivity terms.';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!brnVerified) {
      setVerifyingBrn(true);
      await verifyReraNumberAsync(reraBrn);
      setVerifyingBrn(false);
      setBrnVerified(true);
    }

    updateAgentSession({
      signedIn: true,
      agentId: 'agent-1',
      name: name.trim(),
      agency: agency.trim(),
      email: email.trim(),
      phone: phone.trim(),
      reraBrn: reraBrn.trim(),
      tradeLicenceFile,
    });
    pushToast(
      'Agent account verified',
      `RERA BRN ${reraBrn.trim()} checked · Welcome to iFinder.`,
      'success'
    );
  };

  return (
    <div className="min-h-[calc(100vh-44px)] bg-navy-900 text-paper py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Founding Plan & Value Summary */}
        <div className="lg:col-span-5 space-y-6">
          <Logo variant="full" theme="dark" size="md" showTagline />

          <div className="space-y-3">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-paper text-balance">
              {COPY.agentPortal.portalTitle}
            </h1>
            <p className="text-sm sm:text-base text-muted-navy leading-relaxed">
              Receive high-intent viewing requests exclusively from matched
              Dubai buyers. Zero lead resale to rival agencies.
            </p>
          </div>

          <div className="rounded-3xl bg-navy-800 border border-navy-700 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gold-500">Your plan</p>
                <p className="font-display text-2xl font-extrabold text-paper mt-0.5">
                  {COPY.agentPortal.planHeadline}
                </p>
                <p className="text-sm text-muted-navy">
                  {COPY.agentPortal.planSubline}
                </p>
              </div>
              <ShieldCheck className="w-7 h-7 text-gold-500 shrink-0" strokeWidth={1.75} />
            </div>

            <div className="rounded-2xl bg-gold-500/15 border border-gold-500/50 p-4 space-y-1">
              <p className="text-sm font-bold text-gold-500">
                {COPY.agentPortal.foundingHeadline}
              </p>
              <p className="text-xs text-paper/85 tabular-nums">
                {COPY.agentPortal.foundingSpotsLeft} of 100 founding spots left
                (sample)
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseDemoAgent}
              className="w-full min-h-[46px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
              <span>Use demo agent (Aisha Rahman)</span>
            </button>
          </div>
        </div>

        {/* Right: Agent Sign-Up Form */}
        <div className="lg:col-span-7 rounded-3xl bg-paper text-ink p-6 sm:p-8 shadow-2xl border border-navy-700/20">
          <div className="mb-5">
            <h2 className="font-display text-xl font-bold text-navy-900">
              RERA Agent Sign-up
            </h2>
            <p className="text-xs text-muted-light mt-0.5">
              RERA broker number and trade licence are checked before listings
              go live.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="agent-name"
                  className="block text-xs font-semibold text-navy-900 mb-1"
                >
                  Full name
                </label>
                <input
                  id="agent-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aisha Rahman"
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                />
                {errors.name && (
                  <p className="text-xs text-danger mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="agent-agency"
                  className="block text-xs font-semibold text-navy-900 mb-1"
                >
                  Agency / brokerage
                </label>
                <input
                  id="agent-agency"
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  placeholder="Gulf Haven Real Estate"
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                />
                {errors.agency && (
                  <p className="text-xs text-danger mt-1">{errors.agency}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="agent-email"
                  className="block text-xs font-semibold text-navy-900 mb-1"
                >
                  Work email
                </label>
                <input
                  id="agent-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aisha@gulfhaven.ae"
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="agent-phone"
                  className="block text-xs font-semibold text-navy-900 mb-1"
                >
                  UAE mobile
                </label>
                <input
                  id="agent-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 482 9104"
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                />
                {errors.phone && (
                  <p className="text-xs text-danger mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* RERA BRN with live check */}
            <div>
              <label
                htmlFor="agent-brn"
                className="block text-xs font-semibold text-navy-900 mb-1"
              >
                RERA Broker Number (BRN)
              </label>
              <div className="flex gap-2">
                <input
                  id="agent-brn"
                  type="text"
                  inputMode="numeric"
                  value={reraBrn}
                  onChange={(e) => {
                    setReraBrn(e.target.value);
                    setBrnVerified(false);
                    setBrnError(null);
                  }}
                  placeholder="5-digit BRN (e.g. 48291)"
                  className="flex-1 rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 tabular-nums focus:outline-2 focus:outline-gold-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyBrn}
                  disabled={verifyingBrn}
                  className="rounded-xl bg-navy-900 hover:bg-navy-800 text-paper font-semibold text-xs px-4 py-2.5 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                >
                  {verifyingBrn && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Verify BRN</span>
                </button>
              </div>
              {brnVerified && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-verified-bg border border-verified-border px-2.5 py-1 text-xs font-semibold text-verified-text">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>RERA number verified at sign-up</span>
                </p>
              )}
              {(brnError || errors.reraBrn) && (
                <p className="text-xs text-danger mt-1">
                  {brnError || errors.reraBrn}
                </p>
              )}
            </div>

            {/* Trade Licence Upload UI */}
            <div>
              <label
                htmlFor="agent-licence"
                className="block text-xs font-semibold text-navy-900 mb-1"
              >
                DED Brokerage Trade Licence
              </label>
              <label
                htmlFor="agent-licence"
                className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-navy-900/30 bg-white px-4 py-3 cursor-pointer hover:border-gold-500"
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <FileUp className="w-4 h-4 text-gold-600" strokeWidth={1.75} />
                  <span className="font-medium text-navy-900">
                    {tradeLicenceFile || 'Upload PDF or image (sample file input)'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gold-600">
                  Browse
                </span>
              </label>
              <input
                id="agent-licence"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setTradeLicenceFile(
                    file ? file.name : 'Brokerage_Trade_Licence_2026.pdf'
                  );
                }}
                className="sr-only"
              />
              {errors.tradeLicence && (
                <p className="text-xs text-danger mt-1">{errors.tradeLicence}</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 text-xs text-muted-light cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-navy-900"
              />
              <span>
                I confirm my RERA BRN is active and agree to iFinder’s DLD
                permit verification and 3-month free trial terms.
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-danger">{errors.terms}</p>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm transition-colors"
            >
              Verify & create agent account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
