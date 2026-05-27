import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { createServer as createViteServer } from "vite";

import { menuData } from "./src/data.js";

const app = express();
const PORT = 3000;
const SECRET_KEY = "gelato_lab_secret_key_12345"; // For demo purposes
const DATA_FILE = path.join(process.cwd(), "menuData.json");
const SETTINGS_FILE = path.join(process.cwd(), "settings.json");
const GALLERY_FILE = path.join(process.cwd(), "weddingGallery.json");
const CATERING_FILE = path.join(process.cwd(), "catering.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const initialSettings = {
  musicUrl: "https://www.image2url.com/r2/default/audio/1779605277020-c303c35e-9a3a-48b9-9632-7122a3d4f357.mp3"
};

const initialGallery = [
  {
    "id": "wed_1",
    "title": "ليلة العمر في الهواء الطلق",
    "description": "جزء من قاعتنا الخارجية المزدانة بممرات الخضار والأشجار البهية من حولها، تحت أنوار سلسلة الفيريل المضيئة الساحرة، لتجربة تجمع بين رومانسية الحدائق ودفء الطبيعة الخلابة.",
    "images": [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1000"
    ],
    "folderPath": "/public/images/weddings/outdoor/",
    "tag": "أفراح وسهرات مميزة"
  },
  {
    "id": "wed_2",
    "title": "حفلات الخطوبة والجاهات الكبرى",
    "description": "كوشة وتصميم ممتص للأضواء المبهجة يعكس فخامة العائلات وكرم الاستقبال، مع ترتيب مقاعد عائلي مريح يضمن رؤية ممتعة وخصوصية متناهية لكافة ضيوفكم الكرام.",
    "images": [
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1000"
    ],
    "folderPath": "/public/images/weddings/engagement/",
    "tag": "جاهات وخطوبات"
  },
  {
    "id": "wed_3",
    "title": "أعياد ميلاد ولقاءات دافئة في الطبيعة",
    "description": "زوايا مجهزة بديكورات مخصصة ببالونات ملونة وثيمات تبهج قلوب الصغار والكبار، في وضوح النهار النقي وتحت نسمات جبال الخليل المنعشة الحانية.",
    "images": [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1000"
    ],
    "folderPath": "/public/images/weddings/birthdays/",
    "tag": "أعياد ومناسبات عائلية"
  },
  {
    "id": "wed_4",
    "title": "تجهيز طاولات الخدمة والبوفيه المفتوح",
    "description": "تنظيم مذهل بأجهزة السخان النحاسية الفاخرة والطاولات الذهبية اللامعة لتقديم أشهى أصناف الطعام والمقبلات والحلويات الشرقية مباشرة تحت إشراف طاقم طهاة كافيه الزيتونة المرموقين.",
    "images": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000"
    ],
    "folderPath": "/public/images/weddings/buffet/",
    "tag": "بوفيهات ملكية"
  }
];

if (!fs.existsSync(GALLERY_FILE)) {
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(initialGallery, null, 2));
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure weddings directory and album subfolders exist, and run migration of flat files + download external image URLs to local storage
async function downloadExternalImage(url: string, destDirPath: string): Promise<string | null> {
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return null;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch external image ${url}: status ${res.status}`);
      return null;
    }
    const contentType = res.headers.get('content-type') || '';
    let ext = '.jpg';
    if (contentType.includes('image/png')) ext = '.png';
    else if (contentType.includes('image/gif')) ext = '.gif';
    else if (contentType.includes('image/webp')) ext = '.webp';
    else if (contentType.includes('image/svg')) ext = '.svg';
    else if (contentType.includes('image/avif')) ext = '.avif';
    
    // Create clean and unique filename
    const hash = Math.random().toString(36).substring(2, 10);
    const filename = `downloaded-${Date.now()}-${hash}${ext}`;
    const destFilePath = path.join(destDirPath, filename);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destFilePath, buffer);
    console.log(`Success downloading ${url} -> ${destFilePath}`);
    return filename;
  } catch (err) {
    console.error(`Error in downloadExternalImage for URL ${url}:`, err);
    return null;
  }
}

(async () => {
  try {
    const weddingsDir = path.join(UPLOADS_DIR, "weddings");
    if (!fs.existsSync(weddingsDir)) {
      fs.mkdirSync(weddingsDir, { recursive: true });
    }

    const galleryDataRaw = fs.readFileSync(GALLERY_FILE, 'utf-8');
    const galleryObj = JSON.parse(galleryDataRaw) as any[];
    let migrationModified = false;

    for (const album of galleryObj) {
      const albumDir = path.join(weddingsDir, album.id);
      if (!fs.existsSync(albumDir)) {
        fs.mkdirSync(albumDir, { recursive: true });
      }
      
      // Ensure .keep file exists so Git tracks this folder
      const keepFilePath = path.join(albumDir, ".keep");
      if (!fs.existsSync(keepFilePath)) {
        try {
          fs.writeFileSync(keepFilePath, "");
        } catch (err) {
          console.error(`Failed to write .keep to ${album.id}:`, err);
        }
      }

      const updatedImagesList = [];
      for (const imgUrl of (album.images || [])) {
        if (imgUrl.startsWith('/uploads/') && !imgUrl.startsWith('/uploads/weddings/')) {
          const filename = path.basename(imgUrl);
          const oldPath = path.join(UPLOADS_DIR, filename);
          const newPath = path.join(albumDir, filename);
          if (fs.existsSync(oldPath)) {
            try {
              fs.renameSync(oldPath, newPath);
              console.log(`Migrated ${filename} to category subfolder ${album.id}`);
              migrationModified = true;
              updatedImagesList.push(`/uploads/weddings/${album.id}/${filename}`);
              continue;
            } catch (renameErr) {
              console.error(`Failed to migrate ${filename}:`, renameErr);
            }
          }
        } else if (imgUrl.trim().startsWith('http://') || imgUrl.trim().startsWith('https://')) {
          const localFilename = await downloadExternalImage(imgUrl.trim(), albumDir);
          if (localFilename) {
            migrationModified = true;
            updatedImagesList.push(`/uploads/weddings/${album.id}/${localFilename}`);
            continue;
          }
        }
        updatedImagesList.push(imgUrl);
      }
      album.images = updatedImagesList;
    }

    if (migrationModified) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(galleryObj, null, 2));
      try {
        const galleryContent = `import { WeddingGalleryItem } from "./data";\n\nexport const dynamicWeddingGalleryData: WeddingGalleryItem[] = ${JSON.stringify(galleryObj, null, 2)};\n`;
        fs.writeFileSync(path.join(process.cwd(), 'src', 'weddingGalleryData.ts'), galleryContent);
      } catch (e) {}
    }
  } catch (migErr) {
    console.error("Wedding gallery initialization/migration failed:", migErr);
  }
})();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const albumId = req.query.albumId as string;
    if (albumId) {
      const albumDir = path.join(process.cwd(), "public", "uploads", "weddings", albumId);
      if (!fs.existsSync(albumDir)) {
        fs.mkdirSync(albumDir, { recursive: true });
      }
      cb(null, albumDir);
    } else {
      cb(null, UPLOADS_DIR);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(menuData, null, 2));
}

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(initialSettings, null, 2));
}

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'Kanaan@731963') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/menu', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read menu data' });
  }
});

app.put('/api/menu', authenticateToken, (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));

    // Also update src/data.ts for static exports (preserve other properties)
    const dataTsContent = `export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  isPopular?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  icon?: string;
  image?: string;
  items: MenuItem[];
}

export interface CateringItem {
  id: string;
  name: string;
  description: string;
  price: string;
  approxWeight?: string;
  image: string;
  features: string[];
}

export interface WeddingGalleryItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  folderPath: string;
  tag: string;
}

export interface OccasionsAlbumItem {
  id: string;
  src: string;
  localPath: string;
  title: string;
  category: string;
}

export const cateringData: CateringItem[] = [];

export const weddingGalleryData: WeddingGalleryItem[] = [];

export const occasionsAlbumData: OccasionsAlbumItem[] = [
  {
    id: "album_1",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/wedding_outdoor.jpg",
    title: "جلسة خارجية ساحرة مع إضاءة خافتة",
    category: "صالات خارجية"
  },
  {
    id: "album_2",
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/engagement_table.jpg",
    title: "تنسيق طاولات الخطوبة والجاهات الكبرى",
    category: "ديكور وطاولات"
  },
  {
    id: "album_3",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/birthday_setup.jpg",
    title: "تنسيق زوايا أعياد ميلاد مميزة بالهواء الطلق",
    category: "أعياد ومناسبات"
  },
  {
    id: "album_4",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/buffet_lux.jpg",
    title: "بوفيه سخانات الضيافة الملكية",
    category: "بوفيه واستقبال"
  },
  {
    id: "album_5",
    src: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/kosha_gold.jpg",
    title: "الكوشة والممشى الملكي المضاء بالورد والإنارة الغنية",
    category: "الكوشة والممر"
  },
  {
    id: "album_6",
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/catering_feast.jpg",
    title: "ولائم وقرب الضيافة الممرونة الفخمة",
    category: "ضيافة وولائم"
  }
];

export const menuData: MenuCategory[] = ${JSON.stringify(req.body, null, 2)};
`;
    fs.writeFileSync(path.join(process.cwd(), 'src', 'data.ts'), dataTsContent);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update menu data' });
  }
});

app.get('/api/catering', (req, res) => {
  try {
    const data = fs.readFileSync(CATERING_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read catering data' });
  }
});

app.put('/api/catering', authenticateToken, (req, res) => {
  try {
    fs.writeFileSync(CATERING_FILE, JSON.stringify(req.body, null, 2));

    // Update src/cateringData.ts
    const cateringContent = `import { CateringItem } from "./data";\n\nexport const dynamicCateringData: CateringItem[] = ${JSON.stringify(req.body, null, 2)};\n`;
    fs.writeFileSync(path.join(process.cwd(), 'src', 'cateringData.ts'), cateringContent);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update catering data' });
  }
});

app.get('/api/settings', (req, res) => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read settings data' });
  }
});

app.put('/api/settings', authenticateToken, (req, res) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body, null, 2));

    // Also update src/settingsData.ts for static exports (if directory exists/writable)
    try {
      const srcDir = path.join(process.cwd(), 'src');
      if (fs.existsSync(srcDir)) {
        const settingsContent = `import { SiteSettings } from "./settingsTypes";\n\nexport const settingsData: SiteSettings = ${JSON.stringify(req.body, null, 2)};\n`;
        fs.writeFileSync(path.join(srcDir, 'settingsData.ts'), settingsContent);
      }
    } catch (importErr) {
      console.warn("Could not sync src/settingsData.ts (safe to ignore in production):", importErr);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ error: 'Failed to update settings data' });
  }
});

// Helper function to dynamically list and merge files in wedding subfolders
const getMergedWeddingGallery = () => {
  const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
  const albums = JSON.parse(data) as any[];
  
  return albums.map(album => {
    const albumDir = path.join(process.cwd(), "public", "uploads", "weddings", album.id);
    if (!fs.existsSync(albumDir)) {
      try {
        fs.mkdirSync(albumDir, { recursive: true });
      } catch (e) {}
    }

    // Ensure .keep file exists so that git tracks this subfolder
    const keepFilePath = path.join(albumDir, ".keep");
    if (!fs.existsSync(keepFilePath)) {
      try {
        fs.writeFileSync(keepFilePath, "");
      } catch (e) {}
    }
    
    try {
      const files = fs.readdirSync(albumDir);
      const localImages = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(file))
        .map(file => `/uploads/weddings/${album.id}/${file}`);
      
      // Filter out any older links starting with this album's specific static subfolder to avoid duplicates
      const nonLocalImages = (album.images || []).filter((statImg: string) => {
        return !statImg.startsWith(`/uploads/weddings/${album.id}/`);
      });
      
      return {
        ...album,
        images: [...nonLocalImages, ...localImages],
        folderPath: `/public/uploads/weddings/${album.id}/`
      };
    } catch (err) {
      console.error(`Error listing folder of album ${album.id}:`, err);
      return album;
    }
  });
};

app.get('/api/wedding-gallery', (req, res) => {
  try {
    const merged = getMergedWeddingGallery();
    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read wedding gallery data' });
  }
});

app.put('/api/wedding-gallery', authenticateToken, async (req, res) => {
  try {
    const albums = req.body;
    if (Array.isArray(albums)) {
      for (const album of albums) {
        const albumDir = path.join(process.cwd(), "public", "uploads", "weddings", album.id);
        if (!fs.existsSync(albumDir)) {
          fs.mkdirSync(albumDir, { recursive: true });
        }

        if (Array.isArray(album.images)) {
          const updatedImages = [];
          for (const imgUrl of album.images) {
            if (imgUrl && typeof imgUrl === 'string' && (imgUrl.trim().startsWith('http://') || imgUrl.trim().startsWith('https://'))) {
              const filename = await downloadExternalImage(imgUrl.trim(), albumDir);
              if (filename) {
                updatedImages.push(`/uploads/weddings/${album.id}/${filename}`);
                continue;
              }
            }
            updatedImages.push(imgUrl);
          }
          album.images = updatedImages;
        }
      }
    }

    // Write the raw saved gallery list
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(albums, null, 2));

    // Get the fully merged representation containing physical files on the disk
    const merged = getMergedWeddingGallery();

    // Persist this fully merged representation to both GALLERY_FILE and src/weddingGalleryData.ts
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(merged, null, 2));

    const galleryContent = `import { WeddingGalleryItem } from "./data";\n\nexport const dynamicWeddingGalleryData: WeddingGalleryItem[] = ${JSON.stringify(merged, null, 2)};\n`;
    fs.writeFileSync(path.join(process.cwd(), 'src', 'weddingGalleryData.ts'), galleryContent);

    res.json({ success: true, gallery: merged });
  } catch (err) {
    console.error("Error updating wedding gallery:", err);
    res.status(500).json({ error: 'Failed to update wedding gallery data' });
  }
});

app.post('/api/upload', authenticateToken, (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("Multer error in /api/upload:", err);
      return res.status(400).json({ error: err.message });
    }
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file = files[0];
    const albumId = req.query.albumId as string;
    let url = '';
    if (albumId) {
      url = `/uploads/weddings/${albumId}/${file.filename}`;
    } else {
      url = `/uploads/${file.filename}`;
    }
    res.json({ url });
  });
});

app.post('/api/upload-multiple', authenticateToken, (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("Multer error in /api/upload-multiple:", err);
      return res.status(400).json({ error: err.message });
    }
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const albumId = req.query.albumId as string;
    const urls = files.map(file => {
      if (albumId) {
        return `/uploads/weddings/${albumId}/${file.filename}`;
      } else {
        return `/uploads/${file.filename}`;
      }
    });
    res.json({ urls });
  });
});

app.delete('/api/delete-image', authenticateToken, (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    if (url.startsWith('/uploads/')) {
      let filepath = '';
      if (url.startsWith('/uploads/weddings/')) {
        const pathParts = url.replace('/uploads/weddings/', '').split('/');
        if (pathParts.length === 2) {
          const albumId = pathParts[0];
          const filename = pathParts[1];
          filepath = path.join(process.cwd(), "public", "uploads", "weddings", albumId, filename);
        }
      } else {
        const filename = path.basename(url);
        filepath = path.join(UPLOADS_DIR, filename);
      }

      if (filepath && fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return res.json({ success: true, message: 'Image deleted from disk successfully' });
      }
    }
    return res.json({ success: true, message: 'Image ref removed successfully' });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

import * as cheerio from 'cheerio';

app.get('/api/search-images', authenticateToken, async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    const fetchRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
    const html = await fetchRes.text();
    const $ = cheerio.load(html);
    const images: string[] = [];
    
    $('a.iusc').each((i, el) => {
      const m = $(el).attr('m');
      if (m) {
        try {
          const data = JSON.parse(m);
          if (data.murl) images.push(data.murl);
        } catch(e) {}
      }
    });
    
    res.json({ images: images.slice(0, 20) });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.use((err: any, req: any, res: any, next: any) => {
  if (err && err.name === 'MulterError') {
    console.error("Express handled Multer error:", err);
    return res.status(400).json({ error: err.message, code: err.code });
  }
  if (err) {
    console.error("Express handled global error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
  next();
});

async function startServer() {
  app.use('/uploads', express.static(UPLOADS_DIR));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
