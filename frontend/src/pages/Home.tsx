import { Link } from "react-router-dom";
import { useContent } from "../lib/useContent";
import Reveal from "../components/common/Reveal";

export default function Home() {
  const heroVideo = useContent("home.hero.video", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4");
  const heroTagline = useContent("home.hero.tagline", "Haute couture and ready-to-wear for the contemporary African woman.");
  const heroCta = useContent("home.hero.cta", "Explore the Collection");

  const rtwImage = useContent("home.banner.rtw.image", "https://picsum.photos/seed/home-rtw/1200/1200");
  const rtwSubtitle = useContent("home.banner.rtw.subtitle", "Effortless elegance for everyday wear.");
  const bridalsImage = useContent("home.banner.bridals.image", "https://picsum.photos/seed/home-bridals/1200/1200");
  const bridalsSubtitle = useContent("home.banner.bridals.subtitle", "Gowns that tell your story, on the day it matters most.");
  const bespokeImage = useContent("home.banner.bespoke.image", "https://picsum.photos/seed/home-bespoke/1200/1200");
  const bespokeSubtitle = useContent("home.banner.bespoke.subtitle", "Tailored exclusively to your shape, taste, and occasion.");
  const salesImage = useContent("home.banner.sales.image", "https://picsum.photos/seed/home-sales/1200/1200");
  const salesSubtitle = useContent("home.banner.sales.subtitle", "Limited pieces at final prices, while they last.");

  const ctaTitle = useContent("home.cta.title", "Something made just for you");
  const ctaSubtitle = useContent("home.cta.subtitle", "Book a one-on-one consultation with our team to design a piece as unique as you are.");

  const banners = [
    { title: "Ready-to-Wear", subtitle: rtwSubtitle, image: rtwImage, link: "/shop/rtw", cta: "Shop RTW" },
    { title: "Bridals", subtitle: bridalsSubtitle, image: bridalsImage, link: "/shop/bridals", cta: "Shop Bridals" },
    { title: "Bespoke", subtitle: bespokeSubtitle, image: bespokeImage, link: "/shop/bespoke", cta: "Shop Bespoke" },
    { title: "Shop Sales", subtitle: salesSubtitle, image: salesImage, link: "/shop/sales", cta: "Shop Sales" },
  ];

  return (
    <div>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <video src={heroVideo} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-text/80 via-brand-text/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-text/70 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-8 sm:px-16">
          <span className="font-heading text-4xl tracking-[0.15em] text-white sm:text-5xl">FAVY</span>
          <span className="font-heading text-xl tracking-[0.4em] text-brand-accent sm:text-2xl">ATELIER</span>
          <p className="mt-4 max-w-md text-sm text-white/85">{heroTagline}</p>
          <Link to="/shop/rtw" className="mt-8 border border-white px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-brand-text">
            {heroCta}
          </Link>
        </div>
      </div>

      {banners.map((banner, i) => {
        const isRight = i % 2 === 1;
        return (
          <Reveal key={banner.title}>
            <Link to={banner.link} className="group relative block h-screen w-full overflow-hidden">
              <img src={banner.image} alt={banner.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div
                className={
                  isRight
                    ? "absolute inset-0 bg-gradient-to-l from-brand-primary/85 via-brand-primary/35 to-transparent"
                    : "absolute inset-0 bg-gradient-to-r from-brand-primary/85 via-brand-primary/35 to-transparent"
                }
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className={`relative z-10 flex h-full flex-col justify-center px-8 sm:px-16 ${isRight ? "items-end text-right" : "items-start text-left"}`}>
                <h2 className="font-heading text-3xl text-white sm:text-4xl">{banner.title}</h2>
                <p className="mt-3 max-w-sm text-sm text-white/85">{banner.subtitle}</p>
                <span className="mt-6 inline-block border border-white px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition group-hover:bg-white group-hover:text-brand-text">
                  {banner.cta}
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}

      <Reveal>
        <div className="flex flex-col items-center justify-center bg-brand-primary px-6 py-24 text-center">
          <h2 className="font-heading text-2xl text-[#f4f1e8] sm:text-3xl">{ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#f4f1e8]/75">{ctaSubtitle}</p>
          <Link to="/consultations" className="mt-8 inline-block bg-brand-accent px-7 py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-text transition hover:opacity-90">
            Book a Consultation
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
