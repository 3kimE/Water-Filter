import Link from "next/link";
import {
  Droplet,
  ShieldCheck,
  Truck,
  Users,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "À propos" };

const STATS = [
  { value: "+5 000", label: "Clients satisfaits" },
  { value: "+10", label: "Villes desservies" },
  { value: "4.8/5", label: "Note moyenne" },
  { value: "7 ans", label: "D'expérience" },
];

const VALUES = [
  { icon: Droplet, title: "Eau pure garantie", text: "Des systèmes qui éliminent jusqu'à 99% des impuretés." },
  { icon: ShieldCheck, title: "Qualité certifiée", text: "Composants de qualité et garantie jusqu'à 3 ans." },
  { icon: Truck, title: "Partout au Maroc", text: "Livraison et installation dans tout le royaume." },
  { icon: HeartHandshake, title: "Service de confiance", text: "Paiement à la livraison et support 24/7." },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero-water">
        <div className="container-page py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft">
            <Droplet className="h-4 w-4 text-aqua-500" /> Notre histoire
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Une mission : offrir à chaque foyer marocain une{" "}
            <span className="text-gradient">eau pure</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
            Filtre Maroc accompagne les familles et les professionnels avec des
            solutions de filtration fiables, abordables et adaptées à la qualité
            de l&apos;eau au Maroc.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-8">
        <div className="grid grid-cols-2 gap-4 rounded-card border border-brand-100 bg-white p-6 shadow-soft sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-brand-600">{s.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-gradient-to-br from-brand-400 to-brand-800 shadow-glow">
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplet className="h-40 w-40 animate-float text-white/90" strokeWidth={1.2} fill="rgba(255,255,255,0.18)" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-ink">Qui sommes-nous ?</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Né de la conviction qu&apos;une eau saine ne devrait pas être un luxe,
            Filtre Maroc importe et installe des systèmes d&apos;osmose inverse de
            haute qualité partout au Maroc. Du petit appartement au grand
            restaurant, nous avons la solution adaptée à votre consommation.
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Notre équipe vous accompagne du choix du produit jusqu&apos;à
            l&apos;installation, et notre centre de confirmation s&apos;assure que
            chaque commande se déroule en toute sérénité.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/shop" size="lg">
              Voir nos produits <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/contact" variant="outline" size="lg">Nous contacter</Button>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-50/60 py-16">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-ink">Nos engagements</h2>
            <p className="mt-2 text-ink-soft">Ce qui fait la différence Filtre Maroc</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-card bg-white p-6 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-gradient-to-r from-brand-700 to-brand-500 px-8 py-12 text-center text-white">
          <Users className="h-12 w-12 text-aqua-300" />
          <h2 className="max-w-xl font-display text-3xl font-bold">
            Rejoignez plus de 5 000 familles qui boivent une eau pure
          </h2>
          <Button href="/shop" variant="dark" size="lg">
            Découvrir la boutique <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}
