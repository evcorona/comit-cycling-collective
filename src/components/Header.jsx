export function Header() {
  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <a href="#" aria-label="Comit, inicio">
          <img
            src="/logo_rosa.png"
            alt="Comit Cycling Collective"
            className="h-16 w-16 object-contain"
          />
        </a>
        <span className="text-sm font-semibold italic tracking-wide">
          Nobody Rides Alone<span className="text-pink">.</span>
        </span>
      </div>
    </header>
  );
}
