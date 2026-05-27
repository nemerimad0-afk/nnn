import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, LogOut, ChevronDown, ChevronUp, Search, Sparkles, X, Loader2, Calendar, Settings, Flame, Link2 } from "lucide-react";
import { MenuCategory, MenuItem, menuData as localMenuData, WeddingGalleryItem, CateringItem } from "./data";
import { dynamicWeddingGalleryData } from "./weddingGalleryData";
import { dynamicCateringData } from "./cateringData";
import { SiteSettings } from "./settingsTypes";

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("adminToken"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [menu, setMenu] = useState<MenuCategory[]>(localMenuData);
  const [saving, setSaving] = useState(false);

  // Expanded tabs: menu, gallery, catering, settings
  const [activeTab, setActiveTab] = useState<"menu" | "gallery" | "catering" | "settings">("menu");
  
  // Gallery and Dynamic Data States
  const [gallery, setGallery] = useState<WeddingGalleryItem[]>(dynamicWeddingGalleryData);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);

  // Catering (Banquets) state
  const [catering, setCatering] = useState<CateringItem[]>(dynamicCateringData);
  const [loadingCatering, setLoadingCatering] = useState(false);
  const [savingCatering, setSavingCatering] = useState(false);

  // Site Configurations / Settings State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // For UI expansion state
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    catId: string;
    itemId?: string;
    isGalleryAlbum?: boolean;
    albumId?: string;
    isCatering?: boolean;
    cateringId?: string;
    isSettings?: boolean;
    settingsKey?: string;
    query: string;
    images: string[];
    loading: boolean;
  }>({
    isOpen: false,
    catId: '',
    query: '',
    images: [],
    loading: false
  });

  const openImageModal = (catId: string, itemId: string | undefined, defaultQuery: string = '') => {
    setImageModal({ isOpen: true, catId, itemId, query: defaultQuery, images: [], loading: false });
  };

  const openImageModalForGallery = (albumId: string) => {
    const album = gallery.find(g => g.id === albumId);
    const defaultQuery = (album?.title || 'wedding') + ' celebration';
    setImageModal({
      isOpen: true,
      catId: '',
      isGalleryAlbum: true,
      albumId,
      query: defaultQuery,
      images: [],
      loading: false
    });
  };

  const openImageModalForCatering = (id: string, name: string) => {
    setImageModal({
      isOpen: true,
      catId: '',
      isCatering: true,
      cateringId: id,
      query: name + ' feast platter',
      images: [],
      loading: false
    });
  };

  const openImageModalForSettings = (settingsKey: string, placeholder: string) => {
    setImageModal({
      isOpen: true,
      catId: '',
      isSettings: true,
      settingsKey,
      query: placeholder,
      images: [],
      loading: false
    });
  };

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState(p => ({ ...p, isOpen: false }));
      }
    });
  };

  const closeImageModal = () => setImageModal(prev => ({ 
    ...prev, 
    isOpen: false, 
    isGalleryAlbum: false, 
    albumId: undefined, 
    isCatering: false, 
    cateringId: undefined, 
    isSettings: false, 
    settingsKey: undefined 
  }));

  const selectImage = (url: string) => {
    if (imageModal.isGalleryAlbum && imageModal.albumId) {
      addImageToAlbum(imageModal.albumId, url);
    } else if (imageModal.isCatering && imageModal.cateringId) {
      updateCateringItem(imageModal.cateringId, { image: url });
    } else if (imageModal.isSettings && imageModal.settingsKey) {
      setSettings(prev => prev ? { ...prev, [imageModal.settingsKey!]: url } : null);
    } else if (imageModal.itemId) {
      updateItem(imageModal.catId, imageModal.itemId, { image: url });
    } else {
      updateCategory(imageModal.catId, { image: url });
    }
    closeImageModal();
  };

  // Gallery Helper Functions
  const addGalleryAlbum = () => {
    const albumId = "wed-" + Date.now();
    const newAlbum: WeddingGalleryItem = {
      id: albumId,
      title: "مجلد مناسبات جديد بالزيتونة",
      description: "اكتب تفصيلاً معبراً عن هذا الحدث البديع وصوره...",
      images: [],
      folderPath: `/public/uploads/weddings/${albumId}/`,
      tag: "جلسات مميزة"
    };
    setGallery([...gallery, newAlbum]);
  };

  const deleteGalleryAlbum = (id: string) => {
    triggerConfirm(
      "حذف المجلد بالكامل",
      "هل أنت متأكد من حذف هذا المجلد بالكامل بجميع صوره؟ لا يمكن استعادة الصور أو المجلد بعد الحذف.",
      () => {
        setGallery(gallery.filter(g => g.id !== id));
      }
    );
  };

  const updateGalleryAlbum = (id: string, updates: Partial<WeddingGalleryItem>) => {
    setGallery(gallery.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const addImageToAlbum = (albumId: string, imageUrl: string) => {
    if (!imageUrl) return;
    setGallery(gallery.map(g => {
      if (g.id === albumId) {
        return {
          ...g,
          images: [...(g.images || []), imageUrl]
        };
      }
      return g;
    }));
  };

  const removeImageFromAlbum = (albumId: string, imgIndex: number) => {
    triggerConfirm(
      "إزالة الصورة",
      "هل أنت متأكد من إزالة هذه الصورة من المجلد؟",
      () => {
        setGallery(gallery.map(g => {
          if (g.id === albumId) {
            return {
              ...g,
              images: (g.images || []).filter((_, idx) => idx !== imgIndex)
            };
          }
          return g;
        }));
      }
    );
  };

  const handleImageSearch = async () => {
    if (!imageModal.query) return;
    setImageModal(prev => ({ ...prev, loading: true, images: [] }));
    try {
      const res = await fetch(`/api/search-images?q=${encodeURIComponent(imageModal.query)}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setImageModal(prev => ({ ...prev, loading: false, images: data.images || [] }));
    } catch (err) {
      setImageModal(prev => ({ ...prev, loading: false }));
      alert("حدث خطأ أثناء البحث عن الصور");
    }
  };

  useEffect(() => {
    fetch(`/api/menu?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => setMenu(data))
      .catch(e => {
        console.error("Local fallback for menu");
        const localMenu = localStorage.getItem("menuData");
        if (localMenu) {
          setMenu(JSON.parse(localMenu));
        } else {
          import('./data').then(mod => setMenu(mod.menuData)).catch(err => console.error(err));
        }
      });

    fetch(`/api/wedding-gallery?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setGallery(data);
        }
      })
      .catch(e => {
        console.error("Local fallback for wedding gallery in admin");
        setGallery(dynamicWeddingGalleryData);
      });

    fetch(`/api/catering?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCatering(data);
        }
      })
      .catch(e => {
        console.error("Local fallback for catering in admin");
        setCatering(dynamicCateringData);
      });

    fetch(`/api/settings?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(e => {
        console.error("Local fallback for settings in admin");
        import('./settingsData').then(mod => setSettings(mod.settingsData)).catch(err => console.error(err));
      });
  }, []);

  const handleSaveGallery = async () => {
    setSavingGallery(true);
    try {
      const response = await fetch("/api/wedding-gallery", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(gallery)
      });
      if (!response.ok) throw new Error("Failed to save gallery");
      alert("تم حفظ تقسيمات ومجلدات المناسبات بنجاح!");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حفظ مجلدات المناسبات.");
    } finally {
      setSavingGallery(false);
    }
  };

  const handleSaveCatering = async () => {
    setSavingCatering(true);
    try {
      const response = await fetch("/api/catering", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(catering)
      });
      if (!response.ok) throw new Error("Failed to save catering");
      alert("تم حفظ قسم التواصي وولائم المناسبات الكبرى بنجاح!");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حفظ التواصي والولائم.");
    } finally {
      setSavingCatering(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error("Failed to save settings");
      alert("تم حفظ جميع تعديلات وألوان نصوص الخرائط وعناوين المنصات بالكامل بنجاح!");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حفظ التعديلات.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDiskDeleteImage = async (url: string) => {
    try {
      await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });
    } catch (err) {
      console.error("Disks delete failed", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/menu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(menu)
      });
      
      if (!response.ok) throw new Error("Backend save failed");
      
      localStorage.setItem("menuData", JSON.stringify(menu));
      alert("تم حفظ منيو الزيتونة بنجاح على الخادم والداتا المحلية!");
    } catch (e) {
      // Fallback to local storage
      localStorage.setItem("menuData", JSON.stringify(menu));
      alert("تم الحفظ محلياً في المتصفح فقط (الرجاء التأكد من عمل الخادم).");
    }
    setSaving(false);
  };

  // Catering (Banquets) Item Helpers
  const addCateringItem = () => {
    const newItem: CateringItem = {
      id: "cat_lamb_" + Date.now(),
      name: "طبق أو سفرة تواصي جديدة",
      description: "اكتب وصف عراقة الضيافة والمكونات الفاخرة المرفقة هنا...",
      price: "240",
      approxWeight: "3 رقاب كبيرة",
      image: "",
      features: ["لحم طازج ومطهو ببطء", "توصية مسبقة قبل 6 ساعات"]
    };
    setCatering([...catering, newItem]);
  };

  const deleteCateringItem = (id: string) => {
    triggerConfirm(
      "إزالة خيار التواصي والمناسبة",
      "هل أنت متأكد من إزالة هذا الخيار من صفحة الولائم التواصي؟",
      () => {
        setCatering(catering.filter(c => c.id !== id));
      }
    );
  };

  const updateCateringItem = (id: string, updates: Partial<CateringItem>) => {
    setCatering(catering.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addCateringFeature = (id: string) => {
    setCatering(catering.map(c => {
      if (c.id === id) {
        return {
          ...c,
          features: [...(c.features || []), "ميزة/توصية جديدة بالوليمة"]
        };
      }
      return c;
    }));
  };

  const updateCateringFeature = (id: string, fIdx: number, val: string) => {
    setCatering(catering.map(c => {
      if (c.id === id) {
        const nextFeatures = [...c.features];
        nextFeatures[fIdx] = val;
        return { ...c, features: nextFeatures };
      }
      return c;
    }));
  };

  const removeCateringFeature = (id: string, fIdx: number) => {
    setCatering(catering.map(c => {
      if (c.id === id) {
        return {
          ...c,
          features: c.features.filter((_, idx) => idx !== fIdx)
        };
      }
      return c;
    }));
  };

  const addCategory = () => {
    const newCat: MenuCategory = {
      id: "cat-" + Date.now(),
      title: "قسم جديد بالزيتونة",
      image: "",
      items: []
    };
    setMenu([...menu, newCat]);
    setExpandedCats({ ...expandedCats, [newCat.id]: true });
  };

  const deleteCategory = (catId: string) => {
    triggerConfirm(
      "حذف الصنف بالكامل",
      "هل أنت متأكد من حذف هذا الصنف بالكامل بالزيتونة؟ سيتم حذف جميع الأطباق والمشروبات المدرجة تحته أيضاً.",
      () => {
        setMenu(menu.filter(c => c.id !== catId));
      }
    );
  };

  const updateCategory = (catId: string, updates: Partial<MenuCategory>) => {
    setMenu(menu.map(c => c.id === catId ? { ...c, ...updates } : c));
  };

  const addItemToCategory = (catId: string) => {
    const newItem: MenuItem = {
      id: "item-" + Date.now(),
      name: "طبق أو مشروب جديد",
      price: 0,
      description: "",
      image: ""
    };
    setMenu(menu.map(c => {
      if (c.id === catId) {
        return { ...c, items: [...c.items, newItem] };
      }
      return c;
    }));
  };

  const deleteItem = (catId: string, itemId: string) => {
    triggerConfirm(
      "حذف المنتج",
      "هل أنت متأكد من حذف هذا المنتج من قائمة الطعام في الزيتونة؟",
      () => {
        setMenu(menu.map(c => {
          if (c.id === catId) {
            return { ...c, items: c.items.filter(i => i.id !== itemId) };
          }
          return c;
        }));
      }
    );
  };

  const updateItem = (catId: string, itemId: string, updates: Partial<MenuItem>) => {
    setMenu(menu.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
        };
      }
      return c;
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        onUrl(data.url);
      } else {
        alert("فشل في رفع الملف");
      }
    } catch (err) {
      alert("الرفع قد لا يعمل على البيئات التجريبية الثابتة. يفضل استخدام روابط الويب.");
    }
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUrls: (urls: string[]) => void, albumId?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const uploadUrl = albumId ? `/api/upload-multiple?albumId=${encodeURIComponent(albumId)}` : "/api/upload-multiple";
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.urls && Array.isArray(data.urls)) {
        onUrls(data.urls);
      } else {
        alert("فشل في رفع بعض أو كل الصور");
      }
    } catch (err) {
      alert("الرفع قد لا يعمل على البيئات التجريبية الثابتة. يفضل استخدام روابط الويب.");
    }
  };

  const addImagesToAlbum = (albumId: string, imageUrls: string[]) => {
    if (!imageUrls || imageUrls.length === 0) return;
    setGallery(gallery.map(g => {
      if (g.id === albumId) {
        return {
          ...g,
          images: [...(g.images || []), ...imageUrls]
        };
      }
      return g;
    }));
  };

  const toggleCat = (id: string) => {
    setExpandedCats({ ...expandedCats, [id]: !expandedCats[id] });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("adminToken", data.token);
      } else {
        alert("البيانات المدخلة خاطئة");
      }
    } catch (e) {
      alert("حدث خطأ في الاتصال بالخادم");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f6f3eb] text-[#142215] font-['Cairo'] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-right border border-[#e2dde0] relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-[#b39139]" />
          <h2 className="text-2xl font-black mb-1 text-center text-[#142215]">بوابة تحكم المنيو</h2>
          <p className="text-xs text-center text-gray-400 mb-6">مطعم وكافيه الزيتونة</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-2 text-sm text-gray-600">اسم المستخدم</label>
              <input
                type="text"
                autoComplete="off"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#b39139] outline-none text-right"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm text-gray-600">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#b39139] outline-none text-right"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#142215] text-white py-3 rounded-xl font-bold hover:bg-[#253e27] transition-all cursor-pointer shadow-md"
            >
              {loading ? "جاري الدخول الأمني..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#142215] font-['Cairo'] pb-24 text-right" dir="rtl">
      
      {/* Sticky top management bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-[#ebdcb9]/40 px-4 py-4 flex justify-between items-center top-bar">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          خروج
        </button>
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-black text-[#142215]">لوحة الإشراف والمراجعة</h1>
          <p className="text-[10px] text-gray-400">تابع لمطعم وكافيه الزيتونة</p>
        </div>
        
        <button
          onClick={
            activeTab === "menu" ? handleSave :
            activeTab === "gallery" ? handleSaveGallery :
            activeTab === "catering" ? handleSaveCatering :
            handleSaveSettings
          }
          disabled={saving || savingGallery || savingCatering || savingSettings}
          className="flex items-center gap-2 bg-[#b39139] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#c29d38] transition-all cursor-pointer shadow-md text-xs sm:text-sm"
        >
          <Save size={18} />
          {
            activeTab === "menu" ? (saving ? "جاري الحفظ..." : "حفظ المنيو") :
            activeTab === "gallery" ? (savingGallery ? "جاري الحفظ..." : "حفظ المناسبات") :
            activeTab === "catering" ? (savingCatering ? "جاري الحفظ..." : "حفظ التواصي") :
            (savingSettings ? "جاري الحفظ..." : "حفظ الإعدادات")
          }
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="bg-white border-b border-[#ebdcb9]/20 py-3.5 px-4 flex flex-wrap justify-center items-center gap-3">
        <button 
          onClick={() => setActiveTab("menu")}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "menu" ? "bg-[#142215] text-[#faf7ec] shadow-lg scale-102" : "bg-gray-50 hover:bg-gray-100 text-gray-400"}`}
        >
          <Edit2 size={16} />
          تعديل المنيو والمطعم
        </button>
        <button 
          onClick={() => setActiveTab("gallery")}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "gallery" ? "bg-[#142215] text-[#faf7ec] shadow-lg scale-102 font-bold" : "bg-gray-50 hover:bg-gray-100 text-gray-400"}`}
        >
          <Calendar size={16} />
          ألبوم وصور المناسبات
        </button>
        <button 
          onClick={() => setActiveTab("catering")}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "catering" ? "bg-[#142215] text-[#faf7ec] shadow-lg scale-102 font-bold" : "bg-gray-50 hover:bg-gray-100 text-gray-400"}`}
        >
          <Flame size={16} />
          قسم التواصي والولائم
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "settings" ? "bg-[#142215] text-[#faf7ec] shadow-lg scale-102 font-bold" : "bg-gray-50 hover:bg-gray-100 text-gray-400"}`}
        >
          <Settings size={16} />
          إجراءات وتصميم الموقع
        </button>
      </div>

      {activeTab === "menu" && (
        <div className="max-w-4xl mx-auto p-4 mt-6">
          <div className="mb-6 flex justify-end">
          <button
            onClick={addCategory}
            className="flex items-center gap-1.5 bg-[#142215] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#203621] transition-all cursor-pointer shadow"
          >
            <Plus size={18} />
            إضافة صنف زيتونة رئيسي
          </button>
        </div>

        <div className="space-y-6">
          {menu.map((cat, catIdx) => (
            <div key={cat.id} className="bg-white border border-gray-200/50 shadow-md rounded-2xl overflow-hidden p-1">
              <div
                className="bg-emerald-50/20 hover:bg-emerald-50/40 p-4 flex flex-col sm:flex-row justify-between items-center sm:items-start cursor-pointer rounded-xl gap-4 transition-colors"
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "BUTTON" && !(e.target as HTMLElement).closest("button")) {
                    toggleCat(cat.id);
                  }
                }}
              >
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 relative border border-gray-100">
                  {cat.image ? (
                    <img src={cat.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => updateCategory(cat.id, { title: e.target.value })}
                    placeholder="اسم الصنف (مثال: مشاوي الكوخ)"
                    className="text-lg font-black p-2 border rounded-xl focus:ring-2 focus:ring-[#b39139]/50 outline-none text-right"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-16 text-right">صورة الغلاف:</span>
                    <input
                      type="text"
                      value={cat.image}
                      onChange={(e) => updateCategory(cat.id, { image: e.target.value })}
                      placeholder="رابط الصورة (URL)"
                      className="p-2 border rounded-xl flex-1 text-left text-xs"
                      dir="ltr"
                    />
                    <label className="bg-gray-100 p-2 rounded-xl cursor-pointer hover:bg-gray-250 transition-colors shrink-0" title="رفع صورة">
                      <ImageIcon size={18} className="text-gray-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => updateCategory(cat.id, { image: url }))}
                      />
                    </label>
                    <button onClick={() => openImageModal(cat.id, undefined, cat.title + ' food platter')} className="bg-emerald-50 text-emerald-700 p-2 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors shrink-0" title="البحث الذكي">
                      <Search size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400 font-bold whitespace-nowrap">
                    ({cat.items.length} منتجات)
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                    title="حذف الصنف"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="text-gray-400 p-2" onClick={() => toggleCat(cat.id)}>
                    {expandedCats[cat.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {expandedCats[cat.id] && (
                <div className="p-4 bg-gray-50/30 border-t border-gray-100/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.items.map((item, itemIdx) => (
                      <div key={item.id} className="border border-gray-150 rounded-2xl p-4 shadow-sm bg-white relative group">
                        <button
                          onClick={() => deleteItem(cat.id, item.id)}
                          className="absolute top-2 left-2 text-red-400 hover:text-red-600 bg-white border rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="حذف المنتج"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative border group-hover:border-emerald-700/30 transition-colors">
                            <img 
                              src={item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200"} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200";
                              }}
                            />
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                              <span className="text-white text-[10px] font-bold text-center">رفع</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => updateItem(cat.id, item.id, { image: url }))}
                              />
                            </label>
                          </div>

                          <div className="flex-1 flex flex-col gap-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(cat.id, item.id, { name: e.target.value })}
                              placeholder="اسم المنتج (مثال: كباب بلدي)"
                              className="font-bold p-1 border-b focus:border-[#b39139] outline-none text-xs text-right"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={item.price || ""}
                                onChange={(e) => updateItem(cat.id, item.id, { price: Number(e.target.value) })}
                                placeholder="السعر"
                                className="font-bold text-[#b39139] p-1.5 w-16 border rounded-xl text-xs text-center outline-none"
                              />
                              <span className="text-xs font-bold text-gray-400">شيكل (₪)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                           <textarea
                              value={item.description || ""}
                              onChange={(e) => updateItem(cat.id, item.id, { description: e.target.value })}
                              placeholder="وصف الطبق أو المشروب والتحضيرات..."
                              className="w-full border rounded-xl p-2 text-xs text-gray-600 outline-none h-14 resize-none focus:ring-1 focus:ring-emerald-700/30 text-right"
                           />
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2">
                           <input
                             type="text"
                             value={item.image || ""}
                             onChange={(e) => updateItem(cat.id, item.id, { image: e.target.value })}
                             placeholder="رابط الصورة الخارجي (URL)"
                             className="text-[10px] text-left p-1.5 border rounded-lg w-full"
                             dir="ltr"
                           />
                           <button onClick={(e) => { e.stopPropagation(); openImageModal(cat.id, item.id, item.name + ' food meal'); }} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shrink-0" title="بحث">
                             <Search size={14} />
                           </button>
                           <label className="flex items-center gap-1 cursor-pointer mr-2 shrink-0">
                             <input 
                               type="checkbox" 
                               checked={item.isPopular || false} 
                               onChange={(e) => updateItem(cat.id, item.id, { isPopular: e.target.checked })}
                               className="accent-[#b39139]"
                             />
                             <span className="text-[10px] font-bold text-[#b39139] whitespace-nowrap">مميز</span>
                           </label>
                        </div>

                      </div>
                    ))}
                    
                    {/* Add Item Button */}
                    <button
                      onClick={() => addItemToCategory(cat.id)}
                      className="border-2 border-dashed border-[#b39139]/30 rounded-2xl p-4 flex flex-col items-center justify-center text-[#b39139] hover:bg-[#b39139]/5 hover:border-[#b39139] transition-colors min-h-[140px] cursor-pointer"
                    >
                      <Plus size={24} className="mb-1" />
                      <span className="font-bold text-xs">إضافة منتج جديد</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      )}

      {activeTab === "gallery" && (
        <div className="max-w-4xl mx-auto p-4 mt-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-3xl border border-gray-150 shadow-sm gap-4">
            <div className="text-right flex-1">
              <h2 className="text-lg font-black text-[#142215]">منشئ ومعدل ميديا جيلري ومناسبات الزيتونة</h2>
              <p className="text-xs text-gray-500">قم بإنشاء مجلدات فرعية لتمثيل الألبومات وتنسيق الحفلات لتمكين الزبائن من تقليبها ورؤيتها</p>
            </div>
            <button
              onClick={addGalleryAlbum}
              className="flex items-center gap-1.5 bg-[#142215] text-[#faf7ec] px-5 py-3 rounded-2xl font-bold hover:bg-[#203621] transition-all cursor-pointer shadow-md text-xs sm:text-sm whitespace-nowrap"
            >
              <Plus size={18} />
              إنشاء مجلد مناسبة (ألبوم) جديد
            </button>
          </div>

          <div className="space-y-8">
            {gallery.map((album) => (
              <div key={album.id} className="bg-white border border-gray-200 shadow-lg rounded-3xl overflow-hidden text-right">
                {/* Header Block of Album */}
                <div className="bg-emerald-50/10 p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1 w-full gap-3 flex flex-col">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 whitespace-nowrap min-w-[70px]">اسم المجلد:</span>
                      <input
                        type="text"
                        value={album.title}
                        onChange={(e) => updateGalleryAlbum(album.id, { title: e.target.value })}
                        className="text-sm font-black p-2 border rounded-xl focus:ring-2 focus:ring-[#b39139]/50 outline-none flex-1 text-right"
                        placeholder="مثال: حفل زفاف عائلة كنعان"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 whitespace-nowrap min-w-[70px]">التصنيف:</span>
                        <input
                          type="text"
                          value={album.tag}
                          onChange={(e) => updateGalleryAlbum(album.id, { tag: e.target.value })}
                          className="p-1.5 border rounded-xl text-xs outline-none focus:border-[#b39139] flex-1 text-right"
                          placeholder="مثال: جاهات وخطوبات"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 whitespace-nowrap min-w-[70px]">المسار الداخلي:</span>
                        <input
                          type="text"
                          value={album.folderPath}
                          disabled
                          className="p-1.5 border rounded-xl text-xs bg-gray-50 text-gray-500 font-mono text-left flex-1"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 whitespace-nowrap min-w-[70px]">وصف الألبوم:</span>
                      <textarea
                        value={album.description}
                        onChange={(e) => updateGalleryAlbum(album.id, { description: e.target.value })}
                        className="w-full border rounded-xl p-2 text-xs text-gray-650 outline-none h-14 resize-none focus:ring-1 focus:ring-emerald-700/30 text-right"
                        placeholder="اكتب لمحة سريعة عن الحفلة أو التجهيز..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => deleteGalleryAlbum(album.id)}
                      className="bg-red-50 text-red-500 px-3 py-2 rounded-xl hover:bg-red-100 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                      title="حذف المجلد بالكامل"
                    >
                      <Trash2 size={14} />
                      حذف المجلد
                    </button>
                  </div>
                </div>

                {/* Gallery Files/Images Grid */}
                <div className="p-6 bg-gray-50/20">
                  <div className="mb-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <div className="text-right">
                      <h4 className="text-xs font-black text-[#142215] mb-1">رفع أو إضافة صور لهذا المجلد ({album.images ? album.images.length : 0} صور حالياً)</h4>
                      <p className="text-[10px] text-gray-400">يمكنك رفع صورة من جهازك مباشرة إلى هذا المجلد، أو تصفح صور جديدة</p>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <label className="flex items-center gap-1.5 bg-[#142215] text-[#faf7ec] text-xs px-4 py-2.5 rounded-xl cursor-pointer hover:bg-[#203621] font-bold shadow-sm">
                        <ImageIcon size={14} />
                        رفع صور من جهازك (متعدد)
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleMultipleFilesUpload(e, (urls) => addImagesToAlbum(album.id, urls), album.id)}
                        />
                      </label>

                      <button 
                        onClick={() => openImageModalForGallery(album.id)}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
                      >
                        <Search size={14} />
                        البحث الذكي عن صور
                      </button>
                    </div>
                  </div>

                  {/* Grid of images in this album */}
                  {album.images && album.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {album.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="group relative rounded-2xl overflow-hidden aspect-square border bg-white shadow-sm hover:shadow-md transition-shadow">
                          <img src={imgUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button
                              onClick={() => removeImageFromAlbum(album.id, imgIdx)}
                              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg cursor-pointer animate-scale"
                              title="حذف الصورة"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-white flex flex-col items-center gap-1.5 justify-center text-gray-400">
                      <ImageIcon size={28} className="opacity-30" />
                      <p className="text-xs font-bold">لا توجد صور في هذا المجلد بعد</p>
                      <p className="text-[10px]">استخدم زر الرفع بالأعلى لإضافة صور المناسبة وسيقوم الزبائن بتقليبها مباشرة</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {gallery.length === 0 && (
              <div className="text-center py-20 bg-white border rounded-3xl text-gray-400 flex flex-col items-center justify-center gap-3">
                <ImageIcon size={48} className="opacity-20 animate-pulse text-[#b39139]" />
                <h3 className="font-bold text-base text-gray-650">لم تقم بإنشاء أي مجلدات مناسبات بعد</h3>
                <p className="text-xs text-gray-400 max-w-sm">أنشئ مجلد بلمستك الخاصة مثل (أفراح آل كنعان) وارفع صورها وسيقوم زبائن كافيه الزيتونة بمطالعتها طرباً وعافية.</p>
                <button
                  onClick={addGalleryAlbum}
                  className="bg-[#142215] text-white text-xs px-5 py-2.5 rounded-xl font-bold hover:bg-[#203621] transition-all cursor-pointer shadow-md mt-2"
                >
                  إنشاء أول مجلد الآن
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATERING (BANQUETS & FEASTS) TAB */}
      {activeTab === "catering" && (
        <div className="max-w-4xl mx-auto p-4 mt-6 text-right">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-3xl border border-gray-150 shadow-sm gap-4">
            <div className="text-right flex-1">
              <h2 className="text-lg font-black text-[#142215]">قسم الولائم والتواصي الكبرى بالزيتونة</h2>
              <p className="text-xs text-gray-500">قم بإنشاء وتعديل العزائم والولائم الفخمة كالأخروف والرقاب والمنسف البلدي لتظهر في قائمة التواصي للزبون</p>
            </div>
            <button
              onClick={addCateringItem}
              className="flex items-center gap-1.5 bg-[#142215] text-[#faf7ec] px-5 py-3 rounded-2xl font-bold hover:bg-[#203621] transition-all cursor-pointer shadow-md text-sm whitespace-nowrap"
            >
              <Plus size={18} />
              إضافة وليمة/طبق تواصي جديد
            </button>
          </div>

          <div className="space-y-8">
            {catering.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 shadow-lg rounded-3xl overflow-hidden p-6 relative group">
                <button
                  onClick={() => deleteCateringItem(item.id)}
                  className="absolute top-4 left-4 text-red-500 hover:text-red-700 bg-red-50 border rounded-2xl px-3 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="حذف الوليمة"
                >
                  <Trash2 size={14} />
                  إزالة هذه الوليمة
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {/* Photo Frame & Image Setups */}
                  <div className="md:col-span-1 flex flex-col gap-3">
                    <span className="text-xs font-bold text-gray-400">صورة الوليمة:</span>
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border relative group-hover:border-[#b39139] transition-colors">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1.5">
                          <ImageIcon size={32} />
                          <span className="text-[10px] font-bold">لا توجد صورة</span>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white gap-1 select-none">
                        <ImageIcon size={20} />
                        <span className="text-xs font-bold">رفع صورة من جهازك</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (url) => updateCateringItem(item.id, { image: url }))}
                        />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => updateCateringItem(item.id, { image: e.target.value })}
                        placeholder="رابط الصورة الخارجي (URL)"
                        className="text-[10px] p-2 border rounded-xl flex-1 text-left font-mono"
                        dir="ltr"
                      />
                      <button
                        onClick={() => openImageModalForCatering(item.id, item.name)}
                        className="bg-emerald-50 text-emerald-700 p-2 rounded-xl border border-emerald-100 hover:bg-emerald-100 cursor-pointer"
                        title="البحث الذكي بالذكاء الاصطناعي"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Pricing and Details */}
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 ml-1 text-xs text-gray-600">اسم الوليمة</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateCateringItem(item.id, { name: e.target.value })}
                          className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-[#b39139]/50 outline-none font-bold"
                          placeholder="مثال: سدر منسف بلدي ملوك"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold mb-1 ml-1 text-xs text-gray-600">السعر التقريبي (₪)</label>
                          <input
                            type="text"
                            value={item.price}
                            onChange={(e) => updateCateringItem(item.id, { price: e.target.value })}
                            className="w-full p-2.5 border rounded-xl text-center focus:ring-2 focus:ring-[#b39139]/50 outline-none text-[#b39139] font-black"
                            placeholder="السعر بال شيكل"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 ml-1 text-xs text-gray-600">الوزن / الحجم</label>
                          <input
                            type="text"
                            value={item.approxWeight || ""}
                            onChange={(e) => updateCateringItem(item.id, { approxWeight: e.target.value })}
                            className="w-full p-2.5 border rounded-xl text-center focus:ring-2 focus:ring-[#b39139]/50 outline-none text-xs"
                            placeholder="مثال: 12 - 14 كغم"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1 ml-1 text-xs text-gray-600">وصف وتحضيرات الوليمة والضيافة المرفقة</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateCateringItem(item.id, { description: e.target.value })}
                        className="w-full border rounded-xl p-2.5 text-xs text-gray-650 outline-none h-20 resize-none focus:ring-2 focus:ring-[#b39139]/50 text-right leading-relaxed"
                        placeholder="اشرح لزبون عراقة التقديم والطهي ببطء على لهب الحطب البلدي وعمر خروف النعيمي..."
                      />
                    </div>

                    {/* Features checklist manager */}
                    <div>
                      <div className="flex justify-between items-center mb-1 ml-1">
                        <span className="block font-bold text-xs text-gray-600">الميزات والتوصيات (مثل جميد كركي أو توصية مسبقة):</span>
                        <button
                          onClick={() => addCateringFeature(item.id)}
                          className="text-xs font-bold text-[#b39139] hover:text-[#c29d38] flex items-center gap-0.5"
                        >
                          <Plus size={14} />
                          إضافة מيزة/توصية
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.features?.map((feat, fIdx) => (
                          <div key={fIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => updateCateringFeature(item.id, fIdx, e.target.value)}
                              className="p-1.5 border rounded-lg text-xs flex-1 text-right"
                              placeholder="مثال: توصية مسبقة قبل 24 ساعة"
                            />
                            <button
                              onClick={() => removeCateringFeature(item.id, fIdx)}
                              className="text-red-400 hover:text-red-650 p-1.5 rounded-lg hover:bg-red-50"
                              title="حذف الميزة"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {catering.length === 0 && (
              <div className="text-center py-20 bg-white border rounded-3xl text-gray-450 flex flex-col items-center justify-center gap-3">
                <Flame size={48} className="opacity-20 animate-pulse text-[#d4af37]" />
                <h3 className="font-bold text-base text-gray-650">لا توجد ولائم وتواصي بعد</h3>
                <p className="text-xs text-gray-400 max-w-sm">أنشئ أول عرض لوليمة المناسبات الكبرى وارفع صورها للزبائن</p>
                <button
                  onClick={addCateringItem}
                  className="bg-[#142215] text-[#faf7ec] text-xs px-5 py-2.5 rounded-xl font-bold hover:bg-[#203621] transition-all cursor-pointer shadow-md mt-2"
                >
                  إضافة أول وليمة الآن
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE SITE SETTINGS EDIT PANEL */}
      {activeTab === "settings" && settings && (
        <div className="max-w-4xl mx-auto p-4 mt-6 text-right font-['Cairo']">
          <div className="mb-6 bg-white p-5 rounded-3xl border border-gray-150 shadow-sm">
            <h2 className="text-lg font-black text-[#142215]">لوحة التحكم المجهرية بكامل تفاصيل الزيتونة</h2>
            <p className="text-xs text-gray-500">تمكنك هذه الواجهة من تعديل كل كلمة وسعر وعنوان وهاتف وصورة خلفية وتصاميم ألوان بالواجهة لخدمة أهداف المنشأة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. BRANDING COLORS & STYLES (الهوية البصرية والألوان) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-md">
              <h3 className="text-sm font-black text-[#142215] border-b pb-3 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                تعديل الألوان وتصميم الهوية
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">اللون الأساسي للصالات الداكنة: (الرئيسي)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-10 h-10 p-0 border rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 p-2 border rounded-xl text-left text-xs font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">اللون المذهب اللامع للتأثيرات: (الذهب)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="w-10 h-10 p-0 border rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="flex-1 p-2 border rounded-xl text-left text-xs font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">لون خلفية ركيزة الواجهة: (الباك جراوند الطاغي)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primaryBgColor}
                      onChange={(e) => setSettings({ ...settings, primaryBgColor: e.target.value })}
                      className="w-10 h-10 p-0 border rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={settings.primaryBgColor}
                      onChange={(e) => setSettings({ ...settings, primaryBgColor: e.target.value })}
                      className="flex-1 p-2 border rounded-xl text-left text-xs font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">لون نصوص لوحات الضيافة والذهب:</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                      className="w-10 h-10 p-0 border rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={settings.textColor}
                      onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                      className="flex-1 p-2 border rounded-xl text-left text-xs font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">رابط نغمة الموسيقى الخلفية للزيتونة (قناة البث):</label>
                  <input
                    type="text"
                    value={settings.musicUrl}
                    onChange={(e) => setSettings({ ...settings, musicUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl outline-none text-left text-xs font-mono mb-2"
                    dir="ltr"
                  />
                  {settings.musicUrl && (
                    <audio src={settings.musicUrl} controls className="w-full mt-2" />
                  )}
                </div>
              </div>
            </div>

            {/* 2. CONTACT CHANNELS & WORKING HOURS (قنوات الاتصال والتواصي) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-md">
              <h3 className="text-sm font-black text-[#142215] border-b pb-3 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                قنوات الاتصال والـ GPS وساعات العمل
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">رقم الهاتف الأساسي للزيتونة:</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full p-2.5 border rounded-xl focus:ring-1 focus:ring-[#b39139]"
                    placeholder="مثال: 0598467629"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">رقم التواصي بالواتساب (برمز الدولة بدون +):</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full p-2.5 border rounded-xl focus:ring-1 focus:ring-[#b39139] text-left font-bold"
                    dir="ltr"
                    placeholder="مثال: 972598467629"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">رابط صفحة الفيسبوك بالكامل:</label>
                  <input
                    type="text"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-left text-xs font-mono"
                    dir="ltr"
                    placeholder="Facebook link url..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">رابط صفحة الانستجرام بالكامل:</label>
                  <input
                    type="text"
                    value={settings.instagramUrl}
                    onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-left text-xs font-mono"
                    dir="ltr"
                    placeholder="Instagram link url..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">رابط موقع الخريطة والـ GPS:</label>
                  <input
                    type="text"
                    value={settings.googleMapsUrl}
                    onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-left text-xs font-mono"
                    dir="ltr"
                    placeholder="Google Maps link URL..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">نص لافتة العنوان كتابة:</label>
                  <input
                    type="text"
                    value={settings.addressText}
                    onChange={(e) => setSettings({ ...settings, addressText: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs"
                    placeholder="مثال: فلسطين - الخليل - فرش الهوى"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">لافتة ساعات العمل بالموقع:</label>
                  <input
                    type="text"
                    value={settings.workingHoursText}
                    onChange={(e) => setSettings({ ...settings, workingHoursText: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs"
                    placeholder="مثال: مفتوح يومياً من الساعة 10:00 صباحاً"
                  />
                </div>
              </div>
            </div>

            {/* 3. HEADERS, SUBTITLES & LOGO (عناوين البوابات وتفاصيل الترحيب) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-md md:col-span-2">
              <h3 className="text-sm font-black text-[#142215] border-b pb-3 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                تعديل عناوين الأزرار والبوابات ووصف الأقسام
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">عنوان بوابة أهلاً بالزيتونة الأساسي:</label>
                  <input
                    type="text"
                    value={settings.portalTitle}
                    onChange={(e) => setSettings({ ...settings, portalTitle: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">وصف ترحيب بوابة أهلاً بالزيتونة:</label>
                  <textarea
                    value={settings.portalSubtitle}
                    onChange={(e) => setSettings({ ...settings, portalSubtitle: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs h-16 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">عنوان توبيك المطعم والكافيه:</label>
                  <input
                    type="text"
                    value={settings.menuTabTitle}
                    onChange={(e) => setSettings({ ...settings, menuTabTitle: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">وصف وتفاصيل مأكولات مطعم الزيتونة الحجري:</label>
                  <textarea
                    value={settings.menuTabDesc}
                    onChange={(e) => setSettings({ ...settings, menuTabDesc: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs h-16 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">عنوان توبيك الصالات والأفراح والمناسبات:</label>
                  <input
                    type="text"
                    value={settings.eventsTabTitle}
                    onChange={(e) => setSettings({ ...settings, eventsTabTitle: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">سرد ووصف صالات أفراح وميديا الزيتونة المضاءة:</label>
                  <textarea
                    value={settings.eventsTabDesc}
                    onChange={(e) => setSettings({ ...settings, eventsTabDesc: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs h-16 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">عنوان توبيك قسم التواصي والولائم:</label>
                  <input
                    type="text"
                    value={settings.cateringTabTitle}
                    onChange={(e) => setSettings({ ...settings, cateringTabTitle: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">وصف ميزات وتفاصيل بوفيه ولائم كافيه الزيتونة:</label>
                  <textarea
                    value={settings.cateringTabDesc}
                    onChange={(e) => setSettings({ ...settings, cateringTabDesc: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs h-16 resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1 ml-1">الوصف التسويقي في تذييل الحديقة (الفوتر):</label>
                  <textarea
                    value={settings.footerDesc}
                    onChange={(e) => setSettings({ ...settings, footerDesc: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs h-16 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. DESIGN BACKGROUND COVERS & LOGO URLS (الخلفيات وصور الغلاف) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-md md:col-span-2">
              <h3 className="text-sm font-black text-[#142215] border-b pb-3 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                تحديث صور الغلاف والخلفيات واللوغو
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {/* Logo */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-gray-600">لوغو الزيتونة المرفوع:</span>
                  <div className="h-24 rounded-2xl bg-gray-50 border relative flex items-center justify-center p-2">
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} className="h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold">بدون لوغو</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer text-white text-[10px] font-bold rounded-2xl">
                      رفع جديد
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, logoUrl: url }))}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    className="text-[9px] font-mono p-1 border rounded-lg text-left"
                    dir="ltr"
                  />
                </div>

                {/* Portal BG */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-gray-600">خلفية بوابة أهلاً بك:</span>
                  <div className="h-24 rounded-2xl bg-gray-50 border relative flex items-center justify-center overflow-hidden">
                    {settings.portalBg ? (
                      <img src={settings.portalBg} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold">بدون خلفية</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                      رفع جديد
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, portalBg: url }))}
                      />
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={settings.portalBg}
                      onChange={(e) => setSettings({ ...settings, portalBg: e.target.value })}
                      className="text-[9px] font-mono p-1 border rounded-lg text-left flex-1"
                      dir="ltr"
                    />
                    <button onClick={() => openImageModalForSettings('portalBg', 'luxurious beautiful olive garden background')} className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-[#ebd068]/30 shrink-0 select-none">
                      <Search size={14} />
                    </button>
                  </div>
                </div>

                {/* Menu BG */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-gray-600">خلفية المنيو والمطعم:</span>
                  <div className="h-24 rounded-2xl bg-gray-50 border relative flex items-center justify-center overflow-hidden">
                    {settings.menuBg ? (
                      <img src={settings.menuBg} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold">بدون خلفية</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                      رفع جديد
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, menuBg: url }))}
                      />
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={settings.menuBg}
                      onChange={(e) => setSettings({ ...settings, menuBg: e.target.value })}
                      className="text-[9px] font-mono p-1 border rounded-lg text-left flex-1"
                      dir="ltr"
                    />
                    <button onClick={() => openImageModalForSettings('menuBg', 'delicious high-end wood oven restaurant bbq background')} className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-[#ebd068]/30 shrink-0 select-none">
                      <Search size={14} />
                    </button>
                  </div>
                </div>

                {/* Wedding BG */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-gray-600">خلفية صالات المناسبات:</span>
                  <div className="h-24 rounded-2xl bg-gray-50 border relative flex items-center justify-center overflow-hidden">
                    {settings.weddingBg ? (
                      <img src={settings.weddingBg} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold">بدون خلفية</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                      رفع جديد
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, weddingBg: url }))}
                      />
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={settings.weddingBg}
                      onChange={(e) => setSettings({ ...settings, weddingBg: e.target.value })}
                      className="text-[9px] font-mono p-1 border rounded-lg text-left flex-1"
                      dir="ltr"
                    />
                    <button onClick={() => openImageModalForSettings('weddingBg', 'glamorous outdoor wedding venue fairy lights flowers background')} className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-[#ebd068]/30 shrink-0 select-none">
                      <Search size={14} />
                    </button>
                  </div>
                </div>

                {/* Catering BG */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-gray-600">خلفية التواصي والولائم:</span>
                  <div className="h-24 rounded-2xl bg-gray-50 border relative flex items-center justify-center overflow-hidden">
                    {settings.cateringBg ? (
                      <img src={settings.cateringBg} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold">بدون خلفية</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                      رفع جديد
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, cateringBg: url }))}
                      />
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={settings.cateringBg}
                      onChange={(e) => setSettings({ ...settings, cateringBg: e.target.value })}
                      className="text-[9px] font-mono p-1 border rounded-lg text-left flex-1"
                      dir="ltr"
                    />
                    <button onClick={() => openImageModalForSettings('cateringBg', 'luxurious arabian food banquet roast lamb on rice cooked slowly background')} className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-[#ebd068]/30 shrink-0 select-none">
                      <Search size={14} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {imageModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-black flex items-center gap-2 text-[#142215]">
                <Search className="text-gray-500" size={18} />
                {imageModal.isGalleryAlbum ? "البحث السريع عن صور المناسبات والتنسيقات" : "البحث السريع عن صورة طعام"}
              </h2>
              <button onClick={closeImageModal} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 bg-white rounded-full border">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageModal.query}
                  onChange={e => setImageModal(prev => ({...prev, query: e.target.value}))}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                       handleImageSearch();
                    }
                  }}
                  className="flex-1 border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#b39139]/50 text-left"
                  placeholder={imageModal.isGalleryAlbum ? "تبحث بالإنجليزية لخيارات ممتازة (مثال: wedding layout, engagement flowers, birthday party decoration)" : "تبحث بالإنجليزية لخيارات ممتازة (مثال: grilled chicken, pizza, mojito)"}
                  dir="ltr"
                />
                <button
                  onClick={handleImageSearch}
                  disabled={imageModal.loading || !imageModal.query}
                  className="bg-[#b39139] text-white px-5 rounded-xl font-bold hover:bg-[#c29d38] disabled:opacity-50 transition-colors min-w-[80px] flex items-center justify-center cursor-pointer text-sm"
                >
                  {imageModal.loading ? <Loader2 className="animate-spin" size={18} /> : 'بحث'}
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 bg-gray-50 max-h-[50vh] no-scrollbar">
               {imageModal.loading ? (
                 <div className="flex flex-col items-center justify-center h-44 gap-3 text-gray-500">
                   <Loader2 size={24} className="animate-spin text-[#b39139]" />
                   <p className="text-xs">جاري جلب الصور...</p>
                 </div>
               ) : imageModal.images.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {imageModal.images.map((url, i) => (
                     <button
                       key={i}
                       onClick={() => selectImage(url)}
                       className="group relative rounded-2xl overflow-hidden aspect-square border-2 border-transparent hover:border-[#b39139] hover:shadow-lg transition-all cursor-pointer"
                     >
                       <img src={url} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-white font-bold bg-[#b39139] px-3 py-1 rounded-full text-xs">تثبيت</span>
                       </div>
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="text-center text-gray-400 py-10 flex flex-col items-center gap-2">
                   <Search size={36} className="opacity-20" />
                   <p className="text-xs">اكتب كلمة البحث واضغط على الزر لرؤية اللوحات هنا</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 text-right animate-in fade-in zoom-in-95 duration-200 border border-gray-150">
            <h3 className="text-xl font-bold font-['Cairo'] text-[#142215] mb-3 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              {confirmState.title}
            </h3>
            <p className="text-sm font-['Cairo'] text-gray-650 leading-relaxed mb-6">
              {confirmState.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmState(p => ({ ...p, isOpen: false }))}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-bold transition-all text-xs cursor-pointer font-['Cairo']"
              >
                إلغاء
              </button>
              <button
                onClick={confirmState.onConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all text-xs cursor-pointer shadow-md font-['Cairo'] animate-pulse"
              >
                تأكيد ومسح
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
