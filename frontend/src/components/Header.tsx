import Image from "next/image";
import Logo from "./logo";

// Para usar a foto: salve em frontend/public/profissional.jpg
// e troque null por "/profissional.jpg"
const PHOTO: string | null = null;
const NAME = "Sua Lash Designer";

export default function Header() {
  return (
    <header className="rounded-b-[2.5rem] bg-linear-to-b from-petal-300 via-petal-200 to-petal-100 px-6 pb-16 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Logo />
          <h1 className="mt-5 text-2xl font-bold">Agende seu Horário</h1>
          <p className="mt-1 max-w-48 text-sm text-ink/70">
            Escolha o dia, o serviço e o horário que combinam com você.
          </p>
        </div>

        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-3xl border-4 border-white/70 bg-petal-400 shadow-lg">
          {PHOTO ? (
            <Image src={PHOTO} alt={NAME} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-4xl italic text-white">
              L
            </div>
          )}
        </div>
      </div>
    </header>
  );
}