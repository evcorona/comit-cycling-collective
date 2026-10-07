import texts from '@/locales/es.json'
import { ShieldCheck } from 'lucide-react'
export function PrivacyNotice() {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-black">
        <ShieldCheck size={18} />
        {texts.privacyNotice.title}
      </div>
      <p className="text-xs leading-6 text-black/75">
        {texts.privacyNotice.description}
      </p>
      <p className="mt-3 border-t border-black/10 pt-3 text-xs leading-5 text-black/75">
        <strong>{texts.privacyNotice.warningTitle}</strong>{' '}
        {texts.privacyNotice.warning}
      </p>
    </div>
  )
}
