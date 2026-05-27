import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coffee, 
  CupSoda, 
  CakeSlice, 
  Flame, 
  ChefHat, 
  ChevronUp, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Instagram, 
  Facebook, 
  MapPin, 
  Search, 
  X, 
  Leaf, 
  Clock, 
  Phone, 
  Share2,
  Heart,
  Calendar,
  MessageCircle
} from "lucide-react";
import { 
  MenuCategory, 
  MenuItem, 
  menuData as localMenuData,
  cateringData,
  weddingGalleryData,
  CateringItem,
  WeddingGalleryItem,
  OccasionsAlbumItem,
  occasionsAlbumData
} from "./data";
import { dynamicWeddingGalleryData } from "./weddingGalleryData";
import { SiteSettings } from "./settingsTypes";


const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame size={22} className="text-amber-500 animate-pulse" />,
  ChefHat: <ChefHat size={22} className="text-emerald-500" />,
  CakeSlice: <CakeSlice size={22} className="text-amber-500" />,
  IceCream: <Leaf size={22} className="text-emerald-400" />,
  CupSoda: <CupSoda size={22} className="text-teal-400" />,
  Coffee: <Coffee size={22} className="text-yellow-600" />,
};

// Elegant responsive cover images for categories
const fallbackCategoryImages: Record<string, string> = {
  grills: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
  stone_oven: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
  crepes: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=600",
  waffles: "https://images.unsplash.com/photo-1562376502-0ac40ae8a105?auto=format&fit=crop&q=80&w=600",
  pancakes: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600",
  milkshakes: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
  smoothies: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600",
  mojitos: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
  fresh_drinks: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=600",
  hot_drinks: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
  soft_drinks: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600",
};

export default function UserMenu() {
  const [menuData, setMenuData] = useState<MenuCategory[]>(localMenuData);
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeDivision, setActiveDivision] = useState<"portal" | "menu" | "events" | "catering">("portal");
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxImage, setLightboxImage] = useState<OccasionsAlbumItem | null>(null);
  const [albumActiveCategory, setAlbumActiveCategory] = useState<string>("الكل");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedWeddingGallery, setSelectedWeddingGallery] = useState<WeddingGalleryItem | null>(null);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const [weddingGallery, setWeddingGallery] = useState<WeddingGalleryItem[]>(dynamicWeddingGalleryData);

  // Custom dynamically managed states
  const [cateringItems, setCateringItems] = useState<CateringItem[]>(cateringData);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Helper to resolve site settings keys smoothly with fallback values
  const resolveSetting = (key: keyof SiteSettings, fallback: string): string => {
    if (siteSettings && siteSettings[key]) {
      return String(siteSettings[key]);
    }
    return fallback;
  };

  // Auto-slide for the occasions album gallery
  useEffect(() => {
    if (activeDivision === "events") {
      const timer = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % occasionsAlbumData.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [activeDivision]);

  // Dynamic backgroud image depending on division
  const getBackgroundImage = () => {
    switch (activeDivision) {
      case "events":
        return resolveSetting("weddingBg", "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1600");
      case "catering":
        return resolveSetting("cateringBg", "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=1600");
      case "menu":
        return resolveSetting("menuBg", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600");
      case "portal":
      default:
        return resolveSetting("portalBg", "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1600");
    }
  };

  // Load backend configurations
  useEffect(() => {
    fetch(`/api/menu?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuData(data);
        }
      })
      .catch(e => {
        console.error("Using local fallback for menuData");
        setMenuData(localMenuData);
      });

    fetch(`/api/wedding-gallery?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setWeddingGallery(data);
        }
      })
      .catch(e => {
        console.error("Using fallback for weddingGallery");
        setWeddingGallery(dynamicWeddingGalleryData);
      });

    fetch(`/api/catering?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCateringItems(data);
        }
      })
      .catch(e => {
        console.error("Using fallback for catering items");
        setCateringItems(cateringData);
      });

    fetch(`/api/settings?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data && typeof data === 'object') {
          setSiteSettings(data);
        }
      })
      .catch(e => {
        console.error("Using fallback for siteSettings");
        import('./settingsData').then(mod => setSiteSettings(mod.settingsData)).catch(err => console.error(err));
      });
  }, []);

  // Progressive Loading Screen trigger
  useEffect(() => {
    if (showSplash) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowSplash(false);
            }, 1000);
            return 100;
          }
          // Increment smaller, more graceful steps to increase loading/splash duration
          const increment = Math.floor(Math.random() * 3) + 2;
          return Math.min(prev + increment, 100);
        });
      }, 180);
      return () => clearInterval(interval);
    }
  }, [showSplash]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToMain = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedCategory(null);
  };

  const handleSelectCategory = (category: MenuCategory) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedCategory(category);
    window.history.pushState({ hasCategory: true }, "", "");
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      setSelectedCategory(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Searching logic across all categories
  const filteredCategories = menuData.map(cat => {
    const matchedItems = cat.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return { ...cat, items: matchedItems };
  }).filter(cat => cat.items.length > 0);

  return (
    <>
      {/* 🌳 ELEGANT OLIVE SPLASH PROGRESS SCREEN 🌳 */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070b07] text-center overflow-hidden px-6"
          >
            {/* Background nature underlay */}
            <motion.div
              initial={{ scale: 1.15 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 15, ease: "easeOut" }}
              className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.07]"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1444858291040-58fe7d05014a?auto=format&fit=crop&q=80&w=2000')" }}
            />
            
            {/* Ambient gold/green light halo */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050805] via-[#070c07]/97 to-[#0d150e]/95 z-10" />

            <motion.div
              animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-80 h-80 bg-[#d4af37]/5 rounded-full blur-[100px] z-10 pointer-events-none"
            />
            
            {/* Golden Leaf Particles */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-[#d4af37]/25 rounded-full"
                  style={{
                    width: Math.random() * 5 + 3 + 'px',
                    height: Math.random() * 5 + 3 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                  }}
                  animate={{
                    y: [120, -100],
                    x: [0, Math.random() * 40 - 20],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
              className="relative z-30 flex flex-col items-center"
            >
              {/* Premium Emblem with fill indicator wrapper */}
              <div className="relative mb-8 flex items-center justify-center p-6 rounded-[2.5rem] bg-gradient-to-tr from-white/[0.04] to-[#d4af37]/10 border border-[#d4af37]/20 shadow-2xl backdrop-blur-md">
                <motion.img 
                  animate={{ 
                    y: [0, -6, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  src={resolveSetting("logoUrl", "/logo.png")} 
                  alt="Al Zaytouna Emblem" 
                  className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackIcon = document.getElementById("emblem-fallback");
                    if (fallbackIcon) fallbackIcon.classList.remove("hidden");
                  }}
                />
                <div id="emblem-fallback" className="hidden flex flex-col items-center gap-2">
                  <Leaf size={48} className="text-[#d4af37]" />
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold tracking-wide text-[#faf7ec] font-['Amiri'] mb-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                {resolveSetting("portalTitle", "الزيتونة")}
              </h1>
              
              <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-5" />

              <p className="text-sm sm:text-base text-[#a3bfa5] text-center font-medium font-['Cairo'] leading-relaxed max-w-xs mb-8 mx-auto">
                {resolveSetting("portalSubtitle", "أصالة المذاق الكنعاني، وصالات مناسباتكم السعيدة، وقسم التواصي والولائم الفخم")}
              </p>

              {/* Progressive loading indicator bar directly below */}
              <div className="w-56 sm:w-64">
                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-[#d4af37]/20 p-[1px] shadow-lg">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#d4af37]/80 via-[#e4c264] to-[#faf7ec] transition-all duration-300 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen relative bg-[#050805] text-[#f6fdf7] font-['Cairo'] pb-28 ${showSplash ? "h-screen overflow-hidden" : ""}`} dir="rtl">
        {/* Dynamic Theme Color Injection Style Block */}
        {siteSettings && (
          <style>{`
            :root {
              --color-primary: ${siteSettings.primaryColor || '#111e12'} !important;
              --color-olive-dark: ${siteSettings.primaryColor || '#162618'} !important;
              --color-olive-gold: ${siteSettings.accentColor || '#b39139'} !important;
              --color-gold-light: ${siteSettings.textColor || '#f3eac8'} !important;
              --color-earth-sand: ${siteSettings.textColor || '#f6f3eb'} !important;
            }
            body {
              background-color: ${siteSettings.primaryBgColor || '#050805'} !important;
              color: ${siteSettings.textColor || '#faf7ec'} !important;
            }
            .border-\\[\\#d4af37\\] {
              border-color: ${siteSettings.accentColor || '#d4af37'} !important;
            }
            .border-\\[\\#d4af37\\]\\/20 {
              border-color: ${siteSettings.accentColor || '#d4af37'}33 !important;
            }
            .border-\\[\\#d4af37\\]\\/25 {
              border-color: ${siteSettings.accentColor || '#d4af37'}40 !important;
            }
            .border-\\[\\#d4af37\\]\\/30 {
              border-color: ${siteSettings.accentColor || '#d4af37'}4d !important;
            }
            .border-\\[\\#d4af37\\]\\/40 {
              border-color: ${siteSettings.accentColor || '#d4af37'}66 !important;
            }
            .border-\\[\\#d4af37\\]\\/45 {
              border-color: ${siteSettings.accentColor || '#d4af37'}73 !important;
            }
            .text-\\[\\#d4af37\\] {
              color: ${siteSettings.accentColor || '#d4af37'} !important;
            }
            .bg-\\[\\#d4af37\\] {
              background-color: ${siteSettings.accentColor || '#d4af37'} !important;
            }
            .bg-\\[\\#d4af37\\]\\/10 {
              background-color: ${siteSettings.accentColor || '#d4af37'}1a !important;
            }
            .bg-\\[\\#d4af37\\]\\/15 {
              background-color: ${siteSettings.accentColor || '#d4af37'}26 !important;
            }
            .text-\\[\\#faf7ec\\] {
              color: ${siteSettings.textColor || '#faf7ec'} !important;
            }
            .bg-\\[\\#faf7ec\\] {
              background-color: ${siteSettings.textColor || '#faf7ec'} !important;
            }
          `}</style>
        )}
        
        {/* Decorative Background Assets */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Deep dark gradient back layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b07] via-[#050805]/98 to-[#030503]" />
          
          {/* Beautiful Dynamic Background Image (Garden/Wedding/Feasts) */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-[0.09] mix-blend-luminosity transition-all duration-1000 ease-in-out" 
            style={{ backgroundImage: `url('${getBackgroundImage()}')` }}
          />
          
          {/* Olive-Gold atmospheric radial glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-950/30 rounded-full blur-[110px] -mr-32 -mt-32" />
          <div className="absolute bottom-[30%] left-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[140px] -ml-44" />
        </div>

        {/* FLOATING ACTION DECK (Top Bar) */}
        {!showSplash && (
          <div className="sticky top-0 z-40 transition-colors duration-300 bg-[#162618]/90 backdrop-blur-xl border-b border-[#3f6042]/30 px-4 py-4 flex items-center justify-between shadow-lg">
            
            <div className="flex gap-3 items-center w-auto">
              <a href={resolveSetting("instagramUrl", "https://www.instagram.com/alzaytounagarden?igsh=d201ZWE1dm9lOHoy")} target="_blank" rel="noopener noreferrer" className="text-[#faf7ec] hover:text-[#d4af37] transition-colors">
                <Instagram size={20} />
              </a>
              <a href={resolveSetting("facebookUrl", "https://www.facebook.com/share/17ijDmHrak/")} target="_blank" rel="noopener noreferrer" className="text-[#faf7ec] hover:text-[#d4af37] transition-colors">
                <Facebook size={20} />
              </a>
            </div>

            {/* Middle: Brand Logo */}
            <div 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setActiveDivision("portal");
                setSelectedCategory(null);
              }}
              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity absolute left-1/2 -translate-x-1/2"
              title="الرجوع للرئيسية"
            >
              <img src={resolveSetting("logoUrl", "/logo.png")} alt="الزيتونة" className="h-10 sm:h-12 w-auto object-contain" />
            </div>

            {/* Left Side: Location & WhatsApp */}
            <div className="flex gap-2 sm:gap-3 items-center w-auto justify-end" dir="ltr">
              <a href={resolveSetting("googleMapsUrl", "https://maps.app.goo.gl/4CExVi9K2ynHPcpu8?g_st=ac")} target="_blank" rel="noopener noreferrer" className="text-[#faf7ec] hover:text-[#d4af37] transition-colors flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 px-2.5 py-1 rounded-full cursor-pointer" title="لزيارتنا">
                <MapPin size={14} className="text-[#d4af37]" />
                <span className="text-[10px] font-bold font-['Cairo']">لزيارتنا</span>
              </a>
              <a href={`https://wa.me/${resolveSetting("whatsapp", "972598467629")}`} target="_blank" rel="noopener noreferrer" className="text-[#faf7ec] hover:text-[#d4af37] transition-colors cursor-pointer" title="للتواصل معنا عبر واتساب">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key={`division-view-${activeDivision}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* PORTAL DIVISION */}
              {activeDivision === "portal" && (
                <div className="pt-6 sm:pt-12">
                  <div className="relative overflow-hidden pb-8 px-4 text-center max-w-4xl mx-auto">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-44 bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex justify-center mb-6">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="p-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-full shadow-2xl backdrop-blur-md"
                      >
                        <img 
                          src={resolveSetting("logoUrl", "/logo.png")} 
                          alt="Al Zaytouna Logo" 
                          className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </motion.div>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold font-['Amiri'] mb-4 text-[#faf7ec] tracking-wide leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                      {resolveSetting("portalTitle", "أهلاً وسهلاً بكم في الزيتونة")}
                    </h2>

                    <p className="text-sm sm:text-base text-[#a3bfa5] font-normal leading-relaxed max-w-xl mx-auto mb-10 font-['Cairo']">
                      {resolveSetting("portalSubtitle", "نُرحّب بكم في صرح الضيافة المتكامل؛ ثلاثة أقسام نُجسّد بها عراقة المذاق الكنعاني وتفاصيل مناسباتكم السعيدة والولائم الفخمة بفرش الهوى الخلابة.")}
                    </p>
                  </div>

                  {/* PORTAL TILES */}
                  <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-16">
                    {/* PORTAL 1: Food & Cafe */}
                    <motion.div 
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="relative h-[25rem] rounded-[2.5rem] overflow-hidden group border border-emerald-900/30 hover:border-[#d4af37]/50 shadow-[0_15px_30px_rgba(0,0,0,0.7)] p-[2px] bg-gradient-to-br from-emerald-950/20 via-[#d4af37]/10 to-teal-950/20 flex flex-col justify-end"
                    >
                      <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden flex flex-col justify-end p-6">
                        <div 
                          className="absolute inset-0 bg-cover bg-center brightness-[0.35] group-hover:scale-105 transition-transform duration-700" 
                          style={{ backgroundImage: `url('${resolveSetting("menuBg", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600")}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040804]/95 via-[#040804]/50 to-transparent z-10" />
                        
                        <div className="relative z-20 flex flex-col text-right h-full justify-between">
                          <div className="flex justify-between items-start">
                            <div className="text-[#050805] bg-gradient-to-br from-[#faf7ec] to-[#d4af37] p-3 rounded-2xl shadow-xl">
                              <ChefHat size={24} />
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#d4af37] font-bold tracking-wide bg-black/60 px-3 py-1 rounded-full border border-[#d4af37]/20">
                              مطعم وكافيه
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold font-['Amiri'] text-[#faf7ec] mb-2">{resolveSetting("menuTabTitle", "مطعم وكافيه الزيتونة")}</h3>
                            <p className="text-xs text-[#a3bfa5] leading-relaxed mb-4 font-['Cairo']">
                              {resolveSetting("menuTabDesc", "تذوقوا المأكولات الإيطالية الشهية والمشاوي والريش المحمرة على لهب كوخ الحطب البلدي والحلويات والمشروبات المنعشة.")}
                            </p>
                            <button 
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setActiveDivision("menu");
                              }}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b39139] text-[#050805] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              تصفح المنيو الفاخر
                              <ChevronLeft size={14} className="stroke-[2.5px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* PORTAL 2: Weddings */}
                    <motion.div 
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="relative h-[25rem] rounded-[2.5rem] overflow-hidden group border border-emerald-900/30 hover:border-[#d4af37]/50 shadow-[0_15px_30px_rgba(0,0,0,0.7)] p-[2px] bg-gradient-to-br from-emerald-950/20 via-[#d4af37]/10 to-teal-950/20 flex flex-col justify-end"
                    >
                      <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden flex flex-col justify-end p-6">
                        <div 
                          className="absolute inset-0 bg-cover bg-center brightness-[0.35] group-hover:scale-105 transition-transform duration-700" 
                          style={{ backgroundImage: `url('${resolveSetting("weddingBg", "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600")}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040804]/95 via-[#040804]/50 to-transparent z-10" />
                        
                        <div className="relative z-20 flex flex-col text-right h-full justify-between">
                          <div className="flex justify-between items-start">
                            <div className="text-[#050805] bg-gradient-to-br from-[#faf7ec] to-[#d4af37] p-3 rounded-2xl shadow-xl">
                              <Heart size={24} className="fill-[#050805]" />
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#d4af37] font-bold tracking-wide bg-black/60 px-3 py-1 rounded-full border border-[#d4af37]/20">
                              صالة الأفراح
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold font-['Amiri'] text-[#faf7ec] mb-2">{resolveSetting("eventsTabTitle", "قاعة الأعراس والحفلات")}</h3>
                            <p className="text-xs text-[#a3bfa5] leading-relaxed mb-4 font-['Cairo']">
                              {resolveSetting("eventsTabDesc", "مساحاتنا الخضراء وممراتها المضاءة مصممة بعناية فائقة لتنعموا بليلة العمر الاستثنائية وسهرات العائلات المرموقة والبهيجة.")}
                            </p>
                            <button 
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setActiveDivision("events");
                              }}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b39139] text-[#050805] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              شاهد ألبوم الحفلات
                              <ChevronLeft size={14} className="stroke-[2.5px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* PORTAL 3: Catering */}
                    <motion.div 
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="relative h-[25rem] rounded-[2.5rem] overflow-hidden group border border-emerald-900/30 hover:border-[#d4af37]/50 shadow-[0_15px_30px_rgba(0,0,0,0.7)] p-[2px] bg-gradient-to-br from-emerald-950/20 via-[#d4af37]/10 to-teal-950/20 flex flex-col justify-end"
                    >
                      <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden flex flex-col justify-end p-6">
                        <div 
                          className="absolute inset-0 bg-cover bg-center brightness-[0.35] group-hover:scale-105 transition-transform duration-700" 
                          style={{ backgroundImage: `url('${resolveSetting("cateringBg", "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=600")}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040804]/95 via-[#040804]/50 to-transparent z-10" />
                        
                        <div className="relative z-20 flex flex-col text-right h-full justify-between">
                          <div className="flex justify-between items-start">
                            <div className="text-[#050805] bg-gradient-to-br from-[#faf7ec] to-[#d4af37] p-3 rounded-2xl shadow-xl">
                              <Flame size={24} />
                            </div>
                            <span className="text-[10px] sm:text-xs text-[#d4af37] font-bold tracking-wide bg-black/60 px-3 py-1 rounded-full border border-[#d4af37]/20">
                              التواصي والولائم
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold font-['Amiri'] text-[#faf7ec] mb-2">{resolveSetting("cateringTabTitle", "قسم التواصي والطلب")}</h3>
                            <p className="text-xs text-[#a3bfa5] leading-relaxed mb-4 font-['Cairo']">
                              {resolveSetting("cateringTabDesc", "ولائم كبرى تفوق التوقعات؛ خرفان بلدية كاملة محشية بالأرز الطويل واللوز، رقاب محشية بلديّة، وسدور المنسف المحضّر بالجميد الأصلي.")}
                            </p>
                            <button 
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setActiveDivision("catering");
                              }}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b39139] text-[#050805] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              تصفح قائمة التواصي
                              <ChevronLeft size={14} className="stroke-[2.5px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* RESTAURANT MENU DIVISION */}
              {activeDivision === "menu" && (
                <div>
                  {/* BRAND COZY HERO CONTAINER */}
                  <div className="relative overflow-hidden pt-12 pb-8 px-4 text-center max-w-4xl mx-auto">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-44 bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Logo placed directly above welcome text as requested */}
                    <div className="flex justify-center mb-6">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="p-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-full shadow-2xl backdrop-blur-md"
                      >
                        <img 
                          src={resolveSetting("logoUrl", "/logo.png")} 
                          alt="Al Zaytouna Logo" 
                          className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </motion.div>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold font-['Amiri'] mb-4 text-[#faf7ec] tracking-wide leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                      {resolveSetting("menuTabTitle", "قائمة مطعم وكافيه الزيتونة")}
                    </h2>

                    <p className="text-sm sm:text-base text-[#a3bfa5] font-normal leading-relaxed max-w-lg mx-auto mb-8 font-['Cairo']">
                      {resolveSetting("menuTabDesc", "مساحاتنا الخضراء الطبيعية، مصممة بعناية فائقة لتنعموا بجلسة عائلية مريحة ودافئة في فرش الهوى. تذوقوا أجود اللحوم البلدية المدخنة، والمعجنات الإيطالية الطازجة من الفرن الحجري الفاخر.")}
                    </p>

                    {/* SEARCH DRUM BAR */}
                    <div className="relative max-w-md mx-auto">
                      <span className="absolute inset-y-0 right-4 flex items-center pr-1 text-emerald-400">
                        <Search size={18} />
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن مشاكيل، معجنات، كريب، موهيتو..."
                        className="w-full pl-6 pr-12 py-3 sm:py-3.5 bg-emerald-950/35 text-emerald-100 hover:bg-emerald-950/60 focus:bg-emerald-950/80 rounded-2xl border border-emerald-900/35 focus:border-[#d4af37]/40 outline-none text-sm transition-all shadow-inner"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery("")} 
                          className="absolute inset-y-0 left-4 flex items-center text-emerald-450 hover:text-red-400"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SPECIAL DETAILED EMBED */}
                  {(!searchQuery) && (
                    <div className="max-w-4xl mx-auto px-4 mb-12">
                      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-tr from-[#040804]/95 via-[#081309]/95 to-[#122214]/95 border border-[#d4af37]/30 p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-44 h-44 bg-[#d4af37]/5 rounded-full blur-[80px]" />
                        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-900/10 rounded-full blur-[100px]" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                          
                          {/* Premium Photo with Elegant Gold Frame Border */}
                          <div className="w-full md:w-40 shrink-0 aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden border-2 border-[#d4af37]/30 shadow-2xl select-none p-1 bg-black/40">
                            <img 
                              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400" 
                              alt="Special Ribs Cottage" 
                              className="w-full h-full object-cover rounded-xl transform hover:scale-110 transition-transform duration-1000"
                            />
                          </div>

                          {/* Info and Special Highlights */}
                          <div className="flex-1 text-right">
                            <div className="inline-flex items-center gap-2 text-[#faf7ec] bg-gradient-to-r from-[#d4af37]/30 to-[#b39139]/20 border border-[#d4af37]/35 px-4 py-1.5 rounded-full text-xs font-bold mb-3 shadow-md">
                              <Flame size={14} className="text-[#d4af37] animate-pulse" />
                              ركن كوخ الشواء الخصوصي الفاخر
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-[#faf7ec] font-['Amiri'] mb-3 leading-tight drop-shadow-md">
                              شواء المذاق الأصيل على الفحم والحطب البلدي طازجاً
                            </h3>
                            <p className="text-xs sm:text-sm text-[#a3bfa5] leading-relaxed mb-5 font-['Cairo']">
                              ننفرد بفضل الله بتقديم أشهى نكهات الشواء بطابع كنعاني أصيل. نستخدم لحوم النعيمي والريش البلدية الطازجة التي تأتينا يومياً لتُطهى على لهب الحطب الهادئ ونحقق أرقى مستويات الرضا عافيةً وهناً.
                            </p>
                            <button 
                              onClick={() => {
                                const grillCat = menuData.find(c => c.id === "grills");
                                if (grillCat) handleSelectCategory(grillCat);
                              }}
                              className="text-xs font-bold text-[#faf7ec] bg-emerald-950 border border-[#d4af37]/45 px-5 py-2.5 rounded-xl hover:bg-[#d4af37] hover:text-[#050805] transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              تصفح قسم المشاوي والريش الفاخرة
                              <ChevronLeft size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DYNAMIC CATEGORY GRID SECTION */}
                  <main className="max-w-4xl mx-auto p-4 sm:p-6 relative z-30 pb-20">
                    {searchQuery ? (
                      // SEARCH RESULTS
                      <div className="space-y-8">
                        <h3 className="text-xl font-bold text-[#d4af37] flex items-center gap-2 px-1">
                          <Sparkles size={18} />
                          نتائج البحث عن ({searchQuery})
                        </h3>
                        
                        {filteredCategories.length > 0 ? (
                          <div className="grid gap-4">
                            {filteredCategories.map(cat => (
                              <div key={cat.id} className="bg-emerald-950/10 rounded-2xl border border-emerald-900/10 p-4">
                                <h4 className="text-sm font-black text-[#819b83] mb-3 pb-1.5 border-b border-emerald-900/10">
                                  صنف: {cat.title}
                                </h4>
                                <div className="grid gap-3">
                                  {cat.items.map(item => (
                                    <div 
                                      key={item.id}
                                      className="p-4 rounded-xl bg-[#090e09]/75 border border-emerald-950 flex items-center justify-between gap-4"
                                    >
                                      <div>
                                        <h5 className="font-bold text-white text-base">{item.name}</h5>
                                        {item.description && <p className="text-xs text-[#819b83] line-clamp-1 mt-1">{item.description}</p>}
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-[#d4af37] font-extrabold text-sm sm:text-base px-2.5 py-1 bg-emerald-950/80 border border-emerald-900/40 rounded-xl">
                                          {item.price} ₪
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-[#819b83]">
                            لم نجد ما يطابق بحثك، جرب البحث عن كلمات عامة مثل "مشاوي" أو "بيتزا".
                          </div>
                        )}
                      </div>
                    ) : (
                      // STANDARD TILES
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        {menuData.map((category, index) => (
                          <motion.button
                            key={category.id}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.6, type: "spring", stiffness: 70 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            onClick={() => handleSelectCategory(category)}
                            className="relative h-56 sm:h-64 rounded-[2rem] overflow-hidden group w-full text-right shadow-[0_15px_30px_rgba(0,0,0,0.7)] border border-emerald-900/30 hover:border-[#d4af37]/50 transition-all duration-500 pointer-events-auto p-[3px] bg-gradient-to-br from-emerald-950/20 via-[#d4af37]/10 to-teal-950/20"
                          >
                            <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden">
                              <motion.div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${category.image || fallbackCategoryImages[category.id] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400"}')` }}
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                              />
                              
                              {/* Elegant luxury overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#040804]/95 via-[#040804]/50 to-black/20 z-10 transition-opacity duration-300" />
                              
                              {/* Top-left design accent - small gold chevron pointing left */}
                              <div className="absolute top-5 left-5 z-20">
                                <div className="w-10 h-10 rounded-full bg-[#050805]/90 border border-[#d4af37]/30 text-[#faf7ec] flex items-center justify-center shadow-lg transform group-hover:-translate-x-1 transition-transform duration-300">
                                  <ChevronLeft size={18} className="text-[#d4af37] stroke-[2.5px]" />
                                </div>
                              </div>

                              {/* Outer thin gold frame lines inside card for depth */}
                              <div className="absolute inset-3 border border-[#d4af37]/10 rounded-[1.2rem] pointer-events-none z-15 group-hover:border-[#d4af37]/30 transition-all duration-500" />

                              {/* Category Metadata */}
                              <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-7 z-20">
                                <div className="flex items-center gap-4">
                                  <div className="mb-1 bg-gradient-to-br from-[#faf7ec] via-[#f5e2a2] to-[#d4af37] p-3 rounded-xl text-center shadow-2xl transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105 shrink-0">
                                    {category.icon && iconMap[category.icon] ? (
                                      <div className="text-[#050805] flex items-center justify-center [&_svg]:text-[#050805] [&_svg]:!w-6 [&_svg]:!h-6">
                                        {iconMap[category.icon]}
                                      </div>
                                    ) : (
                                      <Leaf size={24} className="text-[#050805]" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-xl sm:text-2xl font-bold font-['Amiri'] text-white group-hover:text-[#faf7ec] tracking-wide leading-none drop-shadow-md">
                                      {category.title}
                                    </h3>
                                    <p className="text-xs text-[#a3bfa5] mt-1.5 font-medium font-['Cairo'] flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/80 inline-block animate-pulse" />
                                      <span>{category.items ? `${category.items.length} خيارات بلديّة فاخرة` : ""}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </main>
                </div>
              )}

              {/* WEDDINGS & EVENTS GALLERY DIVISION */}
              {activeDivision === "events" && (
                <div className="max-w-4xl mx-auto px-4 pb-16 pt-6 sm:pt-12">
                  
                  {/* Logo placed directly above welcome text as requested */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="p-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-full shadow-2xl backdrop-blur-md"
                    >
                      <img 
                        src={resolveSetting("logoUrl", "/logo.png")} 
                        alt="Al Zaytouna Logo" 
                        className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </motion.div>
                  </div>

                  <div className="relative overflow-hidden pb-10 text-center">
                    <div className="inline-flex justify-center mb-4 text-[#d4af37]">
                      <Heart size={36} className="fill-[#d4af37]/20 animate-pulse" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold font-['Amiri'] mb-3 text-[#faf7ec]">{resolveSetting("eventsTabTitle", "قاعات ومناسبات الزيتونة")}</h2>
                    <p className="text-sm sm:text-base text-zinc-200 max-w-lg mx-auto font-['Cairo'] leading-relaxed">
                      {resolveSetting("eventsTabDesc", "نسعد بتخليد أسعد أيام العمر في صالتنا وزوايانا الخارجية البديعة المجهزة بكامل متطبات الفخامة وممرات الورد وكرم الاستقبال.")}
                    </p>
                  </div>

                  {/* Gallery List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
                    {weddingGallery.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          setSelectedWeddingGallery(item);
                          setGalleryActiveIndex(0);
                        }}
                        className="group relative rounded-[2rem] overflow-hidden bg-[#070b07] border border-[#d4af37]/20 shadow-2xl p-[3px] bg-gradient-to-br from-[#050805] to-[#122214]/40 cursor-pointer"
                      >
                        <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden flex flex-col">
                          <div className="relative h-60 w-full overflow-hidden">
                            {/* Simple crossfade display or just the cover image */}
                            <img 
                              src={(item.images && item.images.length > 0) ? item.images[0] : "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600"} 
                              alt={item.title} 
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050805] via-transparent to-transparent" />
                            
                            <span className="absolute top-4 right-4 bg-[#d4af37] text-[#050805] text-[10px] font-black px-3 py-1 rounded-full shadow-md z-20">
                              {item.tag}
                            </span>
                            
                            <div className="absolute bottom-4 left-4 right-4 z-20 text-right font-['Cairo'] flex items-center justify-between">
                              {item.images.length > 0 && (
                                <span className="inline-flex items-center gap-1.5 bg-black/60 border border-[#d4af37]/40 px-3 py-1 rounded-full text-[#faf7ec] text-[10px] backdrop-blur-sm">
                                  <Sparkles size={12} className="text-[#d4af37]" />
                                  عرض جميع الصور
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-6 text-right flex-1 flex flex-col justify-between">
                            <div>
                               <h3 className="text-xl font-bold font-['Amiri'] text-[#faf7ec] mb-3">{item.title}</h3>
                               <p className="text-xs sm:text-sm text-zinc-200 font-['Cairo'] leading-relaxed mb-6 font-normal">
                                 {item.description}
                               </p>
                            </div>
                            <a 
                              href={`https://wa.me/${resolveSetting("whatsapp", "972598467629")}?text=${encodeURIComponent(`مرحباً الزيتونة، استفسار بخصوص تنظيم حجز قاعة الأعراس والمناسبات لـ: ${item.title}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full py-2.5 rounded-xl border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#050805] text-[#faf7ec] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                            >
                              <Calendar size={14} />
                              <span>استفسر أو احجز مناسبتك الآن</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>



                  {/* Call-to-action details for wedding */}
                  <div className="mt-16 text-center bg-gradient-to-tr from-[#050805] via-[#09150a] to-[#112413] border border-[#d4af37]/25 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl" />
                    <h3 className="text-2xl font-bold font-['Amiri'] text-white mb-3">حفلتك القادمة في أيدي الضيافة الأمينة</h3>
                    <p className="text-xs sm:text-sm text-zinc-200 max-w-xl mx-auto leading-relaxed mb-6 font-['Cairo'] font-normal">
                      سواء كان زفاف أحلامك، خطوبة مميزة، أو بوفيه لمّة لمناسبة اجتماعية قيّمة، نحن فخورون بتفاصيل الجودة والتنظيم الفندقي. تواصل معنا لتنسيق الأعداد والخدمات المشمولة عافيةً وسروراً.
                    </p>
                    <a 
                      href={`https://wa.me/${resolveSetting("whatsapp", "972598467629")}?text=${encodeURIComponent("مرحّب الزيتونة، أود التواصل لحجز قاعة المناسبات")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b39139] hover:opacity-90 text-[#050805] font-extrabold text-sm rounded-xl transition-all shadow-xl cursor-pointer"
                    >
                      <Phone size={16} />
                      <span>تواصل مباشر وتنسيق حجوزات الصالات</span>
                    </a>
                  </div>
                </div>
              )}

              {/* DETAILED CATERING DIVISION */}
              {activeDivision === "catering" && (
                <div className="max-w-4xl mx-auto px-4 pb-16 pt-6 sm:pt-12">
                  
                  {/* Logo placed directly above welcome text as requested */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="p-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-full shadow-2xl backdrop-blur-md"
                    >
                      <img 
                        src="/logo.png" 
                        alt="Al Zaytouna Logo" 
                        className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </motion.div>
                  </div>

                  <div className="relative overflow-hidden pb-10 text-center">
                    <div className="inline-flex justify-center mb-4 text-[#d4af37]">
                      <Flame size={36} className="text-[#d4af37] animate-pulse" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold font-['Amiri'] mb-3 text-[#faf7ec]">{resolveSetting("cateringTabTitle", "قسم التواصي وولائم المناسبات")}</h2>
                    <p className="text-sm sm:text-base text-zinc-200 max-w-lg mx-auto font-['Cairo'] leading-relaxed">
                      {resolveSetting("cateringTabDesc", "نقدم أفخم الولائم البلدية التقليدية المحشوة والمجهزة لتصل في الموعد ساخنة غضّة لتبيض وجوهكم في مناسباتكم الكبرى والعائلية المتميزة.")}
                    </p>
                  </div>

                  {/* Catering List Items */}
                  <div className="space-y-12 mt-6">
                    {cateringItems.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-gradient-to-tr from-[#050805] via-[#09150a] to-black border border-[#d4af37]/20 p-5 sm:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group flex flex-col lg:flex-row gap-6 md:gap-8 items-center"
                      >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-[80px]" />
                        
                        {/* Photo with frame */}
                        <div className="w-full lg:w-60 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#d4af37]/25 shadow-2xl p-1 bg-black/60 relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                          />
                          {item.approxWeight && (
                            <div className="absolute bottom-4 right-4 bg-emerald-950/95 border border-[#d4af37]/30 px-3 py-1 rounded-xl text-[10px] sm:text-xs font-bold text-[#faf7ec] shadow-inner font-['Cairo']">
                              الوزن التقريبي: {item.approxWeight}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 text-right w-full">
                          <h3 className="text-xl sm:text-2xl font-bold font-['Amiri'] text-[#faf7ec] mb-3">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-[#a3bfa5] leading-relaxed mb-4 font-['Cairo']">
                            {item.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                            {item.features && item.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2 text-xs text-[#8da48e] font-medium font-['Cairo']">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-950/60 pt-5">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs text-[#8da48e] font-bold">السعر التقديري للمناسبة:</span>
                              <span className="text-2xl font-extrabold font-['Cairo'] text-[#faf7ec] px-4 py-1.5 bg-[#d4af37]/15 rounded-2xl border border-[#d4af37]/40 shadow-inner">
                                {item.price} ₪
                              </span>
                            </div>

                            <a 
                              href={`https://wa.me/${resolveSetting("whatsapp", "972598467629")}?text=${encodeURIComponent(`مرحباً كافيه ومطعم الزيتونة، أود طلب حجز تواصي مناسبة لوليمة: ${item.name} - السعر ${item.price} شيكل.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#faf7ec] border border-[#d4af37]/45 hover:bg-[#d4af37] text-[#050805] text-xs font-extrabold px-6 py-3 rounded-xl flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center cursor-pointer"
                            >
                              <span>طلب الوجبة بالكامل/تفاصيل الحجز</span>
                              <ChevronLeft size={14} className="stroke-[2.5px]" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PREMIUM CUSTOM OLIVE GARDEN FOOTER */}
              <footer className="mt-16 bg-[#030603] rounded-t-[3rem] border-t border-emerald-950 p-8 sm:p-12 pb-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444858291040-58fe7d05014a?auto=format&fit=crop&q=80&w=600')] opacity-[0.03] bg-center bg-cover mix-blend-overlay" />
                
                <div className="relative z-10 max-w-4xl mx-auto">
                  <div className="flex justify-center mb-4">
                    <img src={resolveSetting("logoUrl", "/logo.png")} alt="الزيتونة" className="w-16 h-16 object-contain" />
                  </div>

                  <h3 className="text-[#faf7ec] text-lg font-bold mb-2">
                    {resolveSetting("portalTitle", "الزيتونة")}
                  </h3>
                  <p className="text-xs text-[#8da48e] max-w-sm mx-auto mb-8 leading-relaxed">
                    {resolveSetting("footerDesc", "متعة هواء الحدائق المنعشة مع المذاق البلدي الساحر. غايتنا خدمتكم بأعلى معايير الراحة والضيافة.")}
                  </p>

                  <div className="flex justify-center items-center gap-4 sm:gap-6 mb-8" dir="ltr">
                    <a href={resolveSetting("googleMapsUrl", "https://maps.app.goo.gl/4CExVi9K2ynHPcpu8?g_st=ac")} target="_blank" rel="noopener noreferrer" className="bg-[#d4af37]/10 border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#050805] transition-all flex items-center justify-center px-4 py-2 rounded-full text-[#faf7ec] gap-2 mr-2">
                      <span className="text-xs font-bold font-['Cairo']">لزيارتنا</span>
                      <MapPin size={17} />
                    </a>
                    <a href={`https://wa.me/${resolveSetting("whatsapp", "972598467629")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-950/45 hover:bg-[#d4af37] hover:text-[#070b07] transition-all flex items-center justify-center text-[#faf7ec] border border-[#d4af37]/10" title="تواصل معنا">
                      <MessageCircle size={17} />
                    </a>
                    <a href={resolveSetting("facebookUrl", "https://www.facebook.com/share/17ijDmHrak/")} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-950/45 hover:bg-[#d4af37] hover:text-[#070b07] transition-all flex items-center justify-center text-[#faf7ec] border border-emerald-900/10">
                      <Facebook size={17} />
                    </a>
                    <a href={resolveSetting("instagramUrl", "https://www.instagram.com/alzaytounagarden?igsh=d201ZWE1dm9lOHoy")} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-950/45 hover:bg-[#d4af37] hover:text-[#070b07] transition-all flex items-center justify-center text-[#faf7ec] border border-emerald-900/10">
                      <Instagram size={17} />
                    </a>
                  </div>
                  
                  {/* Garden Location & Timing Contacts */}
                  <div className="flex flex-col items-center justify-center gap-3 mb-10 text-xs text-[#819b83]">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#d4af37]" />
                      <span>{resolveSetting("addressText", "فلسطين - الخليل - فرش الهوى -بير عكا")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-[#d4af37]" />
                      <span>{resolveSetting("workingHoursText", "مفتوح يومياً من الساعة 10:00 صباحاً حتى 12:00 ليلاً")}</span>
                    </div>
                  </div>

                  <div className="border-t border-[#d4af37]/10 pt-8 flex flex-col items-center">
                    <p className="text-[10px] text-emerald-100/35">
                      © 2026 جميع الحقوق محفوظة -  الزيتونة 
                    </p>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : (
            // CATEGORY ITEMS VIEW
            <motion.div
              key="category-details-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >


              {/* COVER HEADER JUMBOTRON */}
              <div className="relative overflow-hidden py-16 px-4 text-center mt-6 max-w-4xl mx-auto rounded-[2.5rem] border border-[#d4af37]/20 shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center brightness-[0.25] blur-[1px]"
                  style={{ backgroundImage: `url('${selectedCategory.image || fallbackCategoryImages[selectedCategory.id]}')` }}
                />
                
                {/* Thin gold decorative inner frame */}
                <div className="absolute inset-3 border border-[#d4af37]/20 rounded-[1.85rem] pointer-events-none z-15" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#050805] via-[#050805]/50 to-black/35 z-10" />
                
                <div className="relative z-25 flex flex-col items-center p-4">
                  <div className="bg-gradient-to-br from-[#faf7ec] via-[#f5e2a2] to-[#d4af37] p-3 rounded-full mb-4 shadow-xl border border-white/5 transform hover:rotate-12 transition-transform duration-500">
                    {selectedCategory.icon && iconMap[selectedCategory.icon] ? (
                      <div className="text-[#050805] flex items-center justify-center [&_svg]:text-[#050805] [&_svg]:!w-6 [&_svg]:!h-6">
                        {iconMap[selectedCategory.icon]}
                      </div>
                    ) : (
                      <Leaf size={24} className="text-[#050805]" />
                    )}
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-white font-['Amiri'] tracking-wide drop-shadow-md">
                    {selectedCategory.title}
                  </h1>
                  <span className="text-xs sm:text-sm text-[#faf7ec] font-bold tracking-wide bg-[#050805]/95 px-5 py-2 rounded-full border border-[#d4af37]/35 shadow-inner">
                    أصالة المذاق الكنعاني في أرقى حُلّة
                  </span>
                </div>
              </div>

              {/* DISHES LIST CONTAINER */}
              <main className="max-w-3xl mx-auto px-4 pb-24 relative z-25 mt-10">
                <div className="grid gap-6">
                  {selectedCategory.items && selectedCategory.items.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="p-5 sm:p-6 rounded-[2rem] bg-gradient-to-r from-[#070b07]/90 via-[#0a110a]/90 to-black/80 border border-[#d4af37]/15 hover:border-[#d4af37]/45 hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)] shadow-md flex flex-row gap-5 items-center transition-all duration-300 relative group"
                      >
                        {/* Tiny decorative leaf marker inside card */}
                        <div className="absolute top-4 left-4 opacity-[0.03] group-hover:opacity-[0.08] text-[#d4af37] transition-all pointer-events-none">
                          <Leaf size={40} />
                        </div>

                        {/* Dish photo with glowing gold boundary overlay */}
                        {item.image && (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-[#d4af37]/20 relative select-none p-1 bg-[#050805]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-2">
                            <h3 className="text-base sm:text-lg font-bold font-['Cairo'] text-white flex items-center gap-1.5 flex-wrap">
                              {item.name}
                              {item.isPopular && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] bg-gradient-to-r from-[#d4af37]/20 to-[#b39139]/20 text-[#faf7ec] font-bold border border-[#d4af37]/35 shadow-sm">
                                  <Sparkles size={8} fill="currentColor" className="text-[#d4af37]" />
                                  مميز الكوخ
                                </span>
                              )}
                            </h3>

                            {/* Dynamic Size prices presented beautifully */}
                            <div className="flex items-center gap-2 shrink-0">
                              {item.description && item.description.includes("كبير:") ? (
                                <div className="flex flex-wrap gap-1.5">
                                  <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-900 text-xs text-[#a3bfa5] font-bold shadow-inner">
                                    صغير: {item.price} ₪
                                  </span>
                                  {(() => {
                                    const match = item.description?.match(/كبير:\s*(\d+)/);
                                    if (match) {
                                      const bigPrice = Number(match[1]);
                                      return (
                                        <span className="px-3 py-1.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-xs text-[#faf7ec] font-bold">
                                          كبير: {bigPrice} ₪
                                        </span>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              ) : (
                                <div className="text-[#faf7ec] font-extrabold text-sm sm:text-base bg-[#d4af37]/15 px-4 py-1.5 rounded-xl border border-[#d4af37]/35 shadow-md leading-none">
                                  {item.price} ₪
                                </div>
                              )}
                            </div>
                          </div>

                          {item.description && (
                            <p className="text-xs sm:text-sm text-[#8da48e] font-normal leading-relaxed line-clamp-2 pl-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Scroll back to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#d4af37] text-[#050805] shadow-lg hover:bg-[#e4be4a] transition-colors cursor-pointer"
            >
              <ChevronUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating Back Buttons */}
        <AnimatePresence>
          {/* 1. If we are inside an active menu category, show "الرجوع للمنيو" */}
          {activeDivision === "menu" && selectedCategory && (
            <motion.button
              key="back-to-menu-btn"
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -50 }}
              onClick={handleBackToMain}
              className="fixed bottom-6 left-6 z-40 px-5 py-3 rounded-full bg-[#d4af37] text-[#050805] shadow-2xl flex items-center gap-1.5 font-bold hover:bg-[#e4be4a] transition-all border border-[#d4af37]/30 cursor-pointer"
            >
              <ChevronRight size={18} className="stroke-[3px]" />
              <span>الرجوع للمنيو</span>
            </motion.button>
          )}

          {/* 2. If we are on any inner division main level (Menu home, Events page, Catering page), show the sticky "الرجوع للرئيسية" */}
          {activeDivision !== "portal" && !selectedCategory && (
            <motion.button
              key="back-to-portal-btn"
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -50 }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setActiveDivision("portal");
              }}
              className="fixed bottom-6 left-6 z-40 px-5 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b39139] text-[#050805] shadow-2xl flex items-center gap-1.5 font-bold hover:scale-105 transition-all border border-[#d4af37]/30 cursor-pointer"
            >
              <ChevronRight size={18} className="stroke-[3px]" />
              <span>الرجوع للرئيسية</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 🖼️ ELEGANT LIGHTBOX MODAL FOR PHOTO ALBUM 🖼️ */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6"
              onClick={() => setLightboxImage(null)}
            >
              <button 
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setLightboxImage(null)}
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 185 }}
                className="relative max-w-4xl w-full flex flex-col bg-[#070b07] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Media element */}
                <div className="aspect-[4/3] sm:aspect-[16/10] w-full bg-black overflow-hidden relative">
                  <img 
                    src={lightboxImage.src} 
                    alt={lightboxImage.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Meta information */}
                <div className="p-6 bg-gradient-to-t from-[#050805] via-[#070b07] to-[#0d160f] border-t border-white/5 text-right flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-block text-[#d4af37] font-bold text-xs bg-[#d4af37]/10 border border-[#d4af37]/25 px-3 py-1 rounded-full mb-2 font-['Cairo']">
                      {lightboxImage.category}
                    </span>
                    <h3 className="text-xl font-bold font-['Amiri'] text-white">
                      {lightboxImage.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <div className="bg-black/40 border border-white/10 p-3 rounded-xl text-right">
                      <p className="text-[10px] text-[#a3bfa5] font-['Cairo'] mb-1">اسم ومسار الصورة المطلوب رفعها واستبدالها فيه:</p>
                      <p className="text-[11px] font-mono text-[#d4af37] bg-black p-1.5 rounded select-all text-left">
                        {lightboxImage.localPath}
                      </p>
                    </div>
                    
                    <a 
                      href={`https://wa.me/972598467629?text=${encodeURIComponent(`أهلاً الزيتونة، استفسار بخصوص تفاصيل ترتيب الحجز أو تنسيق زاوية: ${lightboxImage.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b39139] hover:opacity-90 text-[#050805] text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone size={12} />
                      <span>استفسر بخصوص هذا الترتيب</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🖼️ WEDDING GALLERY MODAL 🖼️ */}
        <AnimatePresence>
          {selectedWeddingGallery && (
            <motion.div
              key="wedding-gallery-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6"
              onClick={() => setSelectedWeddingGallery(null)}
            >
              <button 
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer z-[130]"
                onClick={() => setSelectedWeddingGallery(null)}
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 185 }}
                className="relative max-w-5xl w-full h-full max-h-[90vh] flex flex-col bg-[#070b07] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Section */}
                <div className="flex-1 w-full bg-black relative flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    {selectedWeddingGallery.images && selectedWeddingGallery.images.length > 0 ? (
                      <motion.img
                        key={galleryActiveIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        src={selectedWeddingGallery.images[galleryActiveIndex]}
                        alt={selectedWeddingGallery.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-zinc-500 text-xs font-['Cairo'] text-center">
                        لم يتم رفع أي صور في هذا المجلد بعد. يمكنك رفع الصور من لوحة التحكم.
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {selectedWeddingGallery.images && selectedWeddingGallery.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryActiveIndex((prev) => (prev > 0 ? prev - 1 : selectedWeddingGallery.images.length - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/80 border border-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryActiveIndex((prev) => (prev < selectedWeddingGallery.images.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/80 border border-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {selectedWeddingGallery.images && selectedWeddingGallery.images.length > 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-[#faf7ec] text-xs font-mono font-bold tracking-widest border border-white/20 backdrop-blur-md">
                      {galleryActiveIndex + 1} / {selectedWeddingGallery.images.length}
                    </div>
                  )}
                </div>

                {/* Meta details footer */}
                <div className="p-5 sm:p-6 bg-gradient-to-t from-[#050805] via-[#070b07] to-[#0d160f] border-t border-white/5 text-right flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                  <div className="flex-1">
                    <span className="inline-block text-[#d4af37] font-bold text-xs bg-[#d4af37]/10 border border-[#d4af37]/25 px-3 py-1 rounded-full mb-2 font-['Cairo']">
                      {selectedWeddingGallery.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-['Amiri'] text-white">
                      {selectedWeddingGallery.title}
                    </h3>
                  </div>

                  <a 
                    href={`https://wa.me/972598467629?text=${encodeURIComponent(`مرحباً الزيتونة، استفسار بخصوص قاعة الأعراس: ${selectedWeddingGallery.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b39139] hover:opacity-90 text-[#050805] text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Calendar size={16} />
                    <span>للحجز والإستفسار</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
