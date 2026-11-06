import { Link } from "react-router-dom";
import { useContent } from "../lib/useContent";
import Reveal from "../components/common/Reveal";
import { ContentImage, ContentVideo } from "../components/content/ContentMedia";
import { usePageMeta } from "../lib/usePageMeta";

export default function Home() {
  usePageMeta({
    title: "Favy Atelier | Bridal, bespoke and ready-to-wear in Nigeria",
    description: "Favy Atelier makes bridal gowns, bespoke pieces and ready-to-wear in Nigeria. Shop online or book a consultation.",
  });

  const heroTagline = useContent("home.hero.tagline", "Haute couture and ready-to-wear for the contemporary African woman.");
  const heroCta = useContent("home.hero.cta", "Shop Ready-to-Wear");

  const rtwSubtitle = useContent("home.banner.rtw.subtitle", "Everyday pieces, ready to order in your size.");
  const bridalsSubtitle = useContent("home.banner.bridals.subtitle", "Gowns that tell your story, on the day it matters most.");
  const bespokeSubtitle = useContent("home.banner.bespoke.subtitle", "Made to your measurements, for the occasion you have in mind.");
  const salesSubtitle = useContent("home.banner.sales.subtitle", "Final pieces at reduced prices. Once they sell, they're gone.");

  const ctaTitle = useContent("home.cta.title", "Something made just for you");
  const ctaSubtitle = useContent("home.cta.subtitle", "Book a one-on-one consultation and we'll design a piece around your measurements and your occasion.");

  const banners = [
    { title: "Ready-to-Wear", subtitle: rtwSubtitle, key: "home.banner.rtw.image", file: "home-ready-to-wear.webp", link: "/shop/rtw", cta: "Shop Ready-to-Wear" },
    { title: "Bridals", subtitle: bridalsSubtitle, key: "home.banner.bridals.image", file: "home-bridals.webp", link: "/shop/bridals", cta: "Shop Bridals" },
    { title: "Bespoke", subtitle: bespokeSubtitle, key: "home.banner.bespoke.image", file: "home-bespoke.webp", link: "/shop/bespoke", cta: "Shop Bespoke" },
    { title: "Sales", subtitle: salesSubtitle, key: "home.banner.sales.image", file: "home-sales.webp", link: "/shop/sales", cta: "Shop the Sale" },
  ];

  return (
    <div>
      <Reveal className="relative h-svh w-full overflow-hidden bg-black">
        <ContentVideo contentKey="home.hero.video" file="home-hero" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-text/80 via-brand-text/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-text/70 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 sm:px-16">
          <h1 className="flex flex-col">
            <span className="reveal-item font-heading text-4xl tracking-[0.15em] text-white sm:text-5xl">FAVY</span>
            <span className="reveal-item font-heading text-xl tracking-[0.4em] text-brand-accent sm:text-2xl">ATELIER</span>
          </h1>
          <p className="reveal-item mt-4 max-w-md text-sm text-white/85">{heroTagline}</p>
          <Link to="/shop/rtw" className="reveal-item mt-8 border border-white px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-brand-text">
            {heroCta}
          </Link>
        </div>
      </Reveal>

      {banners.map((banner, i) => {
        const isRight = i % 2 === 1;
        return (
          <Reveal key={banner.title}>
            <Link to={banner.link} className="group relative block h-svh w-full overflow-hidden">
              <ContentImage
                contentKey={banner.key}
                file={banner.file}
                alt={banner.title}
                className="reveal-fade absolute inset-0"
                imgClassName="transition duration-700 group-hover:scale-105"
              />
              <div
                className={
                  isRight
                    ? "absolute inset-0 bg-gradient-to-l from-brand-primary/85 via-brand-primary/35 to-transparent"
                    : "absolute inset-0 bg-gradient-to-r from-brand-primary/85 via-brand-primary/35 to-transparent"
                }
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className={`relative z-10 flex h-full flex-col justify-center px-6 sm:px-16 ${isRight ? "items-end text-right" : "items-start text-left"}`}>
                <h2 className="reveal-item font-heading text-3xl text-white sm:text-4xl">{banner.title}</h2>
                <p className="reveal-item mt-3 max-w-sm text-sm text-white/85">{banner.subtitle}</p>
                <span className="reveal-item mt-6 inline-block border border-white px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition group-hover:bg-white group-hover:text-brand-text">
                  {banner.cta}
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}

      <Reveal className="bg-brand-primary px-6 py-20 sm:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="reveal-item font-heading text-2xl text-[#f4f1e8] sm:text-3xl">{ctaTitle}</h2>
          <p className="reveal-item mt-3 max-w-md text-sm leading-relaxed text-[#f4f1e8]/75">{ctaSubtitle}</p>
          <Link to="/consultations" className="reveal-item mt-8 inline-block bg-brand-accent px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-text transition hover:opacity-90">
            Book a Consultation
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
