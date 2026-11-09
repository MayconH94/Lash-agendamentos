import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 text-petal-700">
      <Image
        src="/logo.png"
        alt="Lash Designer Studio"
        width={640}
        height={551}
        priority
        className="h-14 w-auto"
      />
      <div className="leading-tight">
        <p className="font-display text-2xl italic">Lash</p>
        <p className="text-[10px] font-medium uppercase tracking-widest">
          Lash Designer · Studio
        </p>
      </div>
    </div>
  );
}