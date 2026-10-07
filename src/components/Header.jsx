import texts from '@/locales/es.json'
export function Header() {
  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <a
          href="#"
          aria-label={texts.header.homeLabel}
        >
          <img
            src="/logo_rosa.png"
            alt={texts.header.logoAlt}
            className="h-16 w-16 object-contain"
          />
        </a>
        <span className="text-sm font-semibold italic tracking-wide">
          {texts.header.motto}
          <span className="text-pink">{texts.common.period}</span>
        </span>
      </div>
    </header>
  )
}
