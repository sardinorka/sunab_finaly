import { db } from "@/db";
import { products, testimonials, posts, settings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { IMAGES } from "@/lib/images";

let ensurePromise: Promise<void> | null = null;

/** Idempotent schema + empty-seed bootstrap for serverless cold starts (Neon/Netlify). */
export function ensureSchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await createTables();
      // Safe: only inserts when tables are empty
      await seedIfEmpty();
    })().catch((err) => {
      ensurePromise = null;
      throw err;
    });
  }
  return ensurePromise;
}

/** Create all SUNAB tables if they don't exist (safe for Neon/Netlify). */
export async function createTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products (
      id serial PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      tagline text NOT NULL,
      description text NOT NULL,
      price numeric(12, 2) NOT NULL,
      compare_price numeric(12, 2),
      image text NOT NULL,
      gallery jsonb DEFAULT '[]'::jsonb NOT NULL,
      category text NOT NULL,
      material text,
      dimensions text,
      capacity text,
      features jsonb DEFAULT '[]'::jsonb NOT NULL,
      is_featured boolean DEFAULT false NOT NULL,
      is_new boolean DEFAULT false NOT NULL,
      stock integer DEFAULT 0 NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id serial PRIMARY KEY,
      author_name text NOT NULL,
      author_role text NOT NULL,
      content text NOT NULL,
      rating integer DEFAULT 5 NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id serial PRIMARY KEY,
      path text NOT NULL,
      referrer text,
      user_agent text,
      country text,
      session_id text NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path);
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at);
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views (session_id);
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS settings (
      key text PRIMARY KEY,
      value text,
      updated_at timestamp DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS orders (
      id serial PRIMARY KEY,
      order_number text NOT NULL UNIQUE,
      customer_name text NOT NULL,
      phone text NOT NULL,
      email text,
      city text NOT NULL,
      address text NOT NULL,
      postal_code text NOT NULL,
      payment_method text NOT NULL,
      note text,
      items jsonb NOT NULL,
      total numeric(14, 2) NOT NULL,
      status text DEFAULT 'pending' NOT NULL,
      source text DEFAULT 'platform' NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS posts (
      id serial PRIMARY KEY,
      title text NOT NULL,
      slug text NOT NULL UNIQUE,
      excerpt text NOT NULL,
      content text NOT NULL,
      cover_image text NOT NULL,
      category text NOT NULL,
      tags jsonb DEFAULT '[]'::jsonb NOT NULL,
      author_name text DEFAULT 'تیم سوناب' NOT NULL,
      author_avatar text,
      read_time integer DEFAULT 5 NOT NULL,
      is_published boolean DEFAULT true NOT NULL,
      seo_title text,
      seo_description text,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
  `);
}

const seedProducts = [
  {
    name: "وان الماس سوناب",
    slug: "almas-bathtub",
    tagline: "شکوه مطلق در هر لمس",
    description:
      "وان الماس سوناب با الهام از معماری کلاسیک ایرانی و ساختاری مدرن، ترکیبی بی‌نظیر از سنگ مرمر کارارا و چوب گردوی دست‌ساز است. هر قطعه از این وان توسط استادکاران به صورت اختصاصی ساخته می‌شود و امضای منحصر به فرد خالق خود را بر تن دارد.",
    price: "285000000",
    comparePrice: "340000000",
    image: IMAGES.almas,
    gallery: [IMAGES.almas, IMAGES.almas2],
    category: "وان",
    material: "سنگ مرمر کارارا",
    dimensions: "۱۸۰ × ۸۰ × ۶۵ سانتی‌متر",
    capacity: "۲۸۰ لیتر",
    features: [
      "سنگ مرمر طبیعی کارارا",
      "پایه‌های چوب گردوی دست‌ساز",
      "سیستم گرمایش هوشمند",
      "گارانتی مادام‌العمر سوناب",
    ],
    isFeatured: true,
    isNew: true,
    stock: 8,
  },
  {
    name: "جکوزی سافایر سوناب",
    slug: "sapphire-jacuzzi",
    tagline: "اقیانوس آرامش در خانه شما",
    description:
      "جکوزی سافایر با ۲۴ جت هیدروتراپی و سیستم نورپردازی کروماتراپی، تجربه‌ای بی‌نظیر از آرامش و سلامتی را به خانه شما می‌آورد. بدنه‌ای از آکرلیک تقویت‌شده با فایبرگلاس، برای سال‌ها استفاده بدون افت کیفیت.",
    price: "420000000",
    comparePrice: null,
    image: IMAGES.sapphire,
    gallery: [IMAGES.sapphire],
    category: "جکوزی",
    material: "آکرلیک تقویت‌شده",
    dimensions: "۲۰۰ × ۲۰۰ × ۹۰ سانتی‌متر",
    capacity: "۴ نفره",
    features: [
      "۲۴ جت هیدروتراپی",
      "نورپردازی کروماتراپی",
      "سیستم تصفیه اوزون",
      "کنترل لمسی هوشمند",
    ],
    isFeatured: true,
    isNew: false,
    stock: 5,
  },
  {
    name: "وان سلطنتی پارس سوناب",
    slug: "pars-royal",
    tagline: "میراث پادشاهان، برای شما",
    description:
      "وان سلطنتی پارس با الهام از حمام‌های تاریخی ایران، با روکش طلا و جزئیات دست‌ساز، شاهکاری است که هر حمامی را به قصر تبدیل می‌کند.",
    price: "580000000",
    comparePrice: null,
    image: IMAGES.pars,
    gallery: [IMAGES.pars],
    category: "وان",
    material: "مس با روکش طلای ۲۴ عیار",
    dimensions: "۱۹۰ × ۸۵ × ۷۰ سانتی‌متر",
    capacity: "۳۰۰ لیتر",
    features: [
      "روکش طلای ۲۴ عیار",
      "نقش‌برجسته‌های دست‌ساز",
      "شیرآلات طلای ایتالیا",
      "گواهی اصالت هنری سوناب",
    ],
    isFeatured: true,
    isNew: true,
    stock: 3,
  },
  {
    name: "جکوزی اینفینیتی سوناب",
    slug: "infinity-jacuzzi",
    tagline: "بی‌نهایت در آغوش آب",
    description:
      "جکوزی اینفینیتی با طراحی مینیمال و لبه‌های بی‌نهایت، حس شناور بودن در اقیانوس را به شما هدیه می‌دهد. مناسب ویلاهای مدرن و فضاهای باز.",
    price: "365000000",
    comparePrice: null,
    image: IMAGES.infinity,
    gallery: [IMAGES.infinity],
    category: "جکوزی",
    material: "کامپوزیت پیشرفته",
    dimensions: "۲۲۰ × ۲۲۰ × ۸۵ سانتی‌متر",
    capacity: "۶ نفره",
    features: [
      "طراحی لبه بی‌نهایت",
      "مقاوم در برابر UV",
      "سیستم گرمایش خورشیدی",
      "کنترل از راه دور",
    ],
    isFeatured: false,
    isNew: false,
    stock: 7,
  },
  {
    name: "زیردوشی اسلات طبیعی سوناب",
    slug: "slate-shower-tray",
    tagline: "ظرافت سنگ طبیعی در زیر پای شما",
    description:
      "زیردوشی سنگ اسلات طبیعی سوناب با روکش ضد لغزش و طراحی فوق‌العاده باریک (Ultra-slim)، جلوه‌ای بی‌نظیر از طبیعت را به بخش دوش حمام شما می‌بخشد.",
    price: "85000000",
    comparePrice: "98000000",
    image: IMAGES.nordic,
    gallery: [IMAGES.nordic],
    category: "زیردوشی",
    material: "سنگ گرانیت و اسلات طبیعی",
    dimensions: "۱۴۰ × ۹۰ × ۳ سانتی‌متر",
    capacity: "۱ نفره",
    features: [
      "سطح کاملاً ضد لغزش (Anti-slip)",
      "طراحی اولترا اسلیم ۳ سانتی‌متری",
      "تخلیه سریع آب با شیب مهندسی‌شده",
      "مقاوم در برابر مواد شوینده اسیدی",
    ],
    isFeatured: true,
    isNew: true,
    stock: 15,
  },
  {
    name: "زیردوشی کوارتز پریمیوم سوناب",
    slug: "quartz-premium-tray",
    tagline: "ترکیب استحکام کوارتز و مینیمالیسم مدرن",
    description:
      "زیردوشی کوارتز پریمیوم سوناب با ساختار یکپارچه و آنتی‌باکتریال، انتخابی بی‌عیب و نقص برای حمام‌های شیشه‌ای و کابین‌های دوش مدرن است.",
    price: "110000000",
    comparePrice: null,
    image: IMAGES.rose,
    gallery: [IMAGES.rose],
    category: "زیردوشی",
    material: "رزین کوارتز آنتی‌باکتریال",
    dimensions: "۱۶۰ × ۱۰۰ × ۳.۵ سانتی‌متر",
    capacity: "۱ نفره",
    features: [
      "ساختار آنتی‌باکتریال دائم",
      "سطح گرم و دلپذیر در لمس با پا",
      "مقاومت فوق‌العاده در برابر ضربه",
      "نصب هم‌سطح با سرامیک کف",
    ],
    isFeatured: false,
    isNew: true,
    stock: 10,
  },
];

const seedTestimonials = [
  {
    authorName: "دکتر آرش محمدی",
    authorRole: "معمار ارشد، دفتر معماری آرتا",
    content:
      "وان الماس سوناب که برای پروژه ویلای لواسان استفاده کردیم، نقطه عطف کل طراحی بود. کیفیت ساخت و توجه به جزئیات در سطح جهانی است.",
    rating: 5,
  },
  {
    authorName: "سارا رضوی",
    authorRole: "مدیر هتل بوتیک ماهان",
    content:
      "تجربه مهمانان ما پس از نصب جکوزی سافایر سوناب دگرگون شد. خدمات پس از فروش و تعهد تیم سوناب نیز بی‌نظیر است.",
    rating: 5,
  },
  {
    authorName: "مهندس کامران نوری",
    authorRole: "توسعه‌دهنده املاک لوکس",
    content:
      "در ۲۰ پروژه اخیرمان از وان، جکوزی و زیردوشی‌های برند سوناب استفاده کرده‌ایم. همواره فراتر از انتظار ظاهر شده‌اند.",
    rating: 5,
  },
];

const seedPosts = [
  {
    title: "راهنمای جامع انتخاب وان و زیردوشی برای حمام مستر",
    slug: "guide-luxury-bathtub-selection",
    excerpt:
      "در این راهنما، هر آنچه باید برای انتخاب بهترین وان و زیردوشی لاکچری متناسب با فضای حمام، سبک طراحی و بودجه خود بدانید را بررسی می‌کنیم.",
    content: `<h2>وان مستقل یا توکار؟ اولین تصمیم بزرگ</h2>
<p>انتخاب بین <strong>وان مستقل (Freestanding)</strong> و <strong>وان توکار (Built-in)</strong> شاید مهم‌ترین تصمیم در مسیر طراحی حمام لوکس شما باشد.</p>
<h2>اهمیت انتخاب زیردوشی استاندارد</h2>
<p>زیردوشی‌های کوارتز و اسلات سوناب با ضخامت تنها ۳ سانتی‌متر و خاصیت ضدلغزش، ایمنی و زیبایی را همزمان به ارمغان می‌آورند.</p>`,
    coverImage: IMAGES.almas,
    category: "راهنمای خرید",
    tags: ["وان", "زیردوشی", "حمام مستر", "راهنمای خرید"],
    authorName: "دکتر آرش محمدی",
    readTime: 7,
    isPublished: true,
    seoTitle: "راهنمای جامع خرید وان و زیردوشی سوناب",
    seoDescription:
      "راهنمای کامل انتخاب وان و زیردوشی لاکچری: متریال، ابعاد و نکات طراحی حمام مستر.",
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2025-06-15"),
  },
  {
    title: "جکوزی هیدروتراپی؛ سرمایه‌گذاری روی سلامتی و آرامش",
    slug: "hydrotherapy-jacuzzi-health-benefits",
    excerpt:
      "تحقیقات علمی نشان می‌دهد جکوزی هیدروتراپی چه تأثیرات شگفت‌انگیزی بر کاهش استرس، بهبود گردش خون و تسکین دردهای عضلانی دارد.",
    content: `<h2>هیدروتراپی چیست؟</h2>
<p>هیدروتراپی روشی علمی است که از خواص فیزیکی آب برای درمان و پیشگیری استفاده می‌کند. جکوزی‌های سوناب این تجربه را به خانه می‌آورند.</p>
<ol>
<li>کاهش استرس و اضطراب</li>
<li>بهبود گردش خون</li>
<li>تسکین دردهای عضلانی</li>
<li>بهبود کیفیت خواب</li>
</ol>`,
    coverImage: IMAGES.sapphire,
    category: "سلامتی و تندرستی",
    tags: ["جکوزی", "هیدروتراپی", "سلامتی"],
    authorName: "دکتر سارا رضوی",
    readTime: 6,
    isPublished: true,
    seoTitle: "جکوزی هیدروتراپی سوناب | فواید علمی",
    seoDescription: "کشف فواید علمی جکوزی هیدروتراپی برای سلامت جسم و روان.",
    createdAt: new Date("2025-06-20"),
    updatedAt: new Date("2025-06-20"),
  },
  {
    title: "طراحی حمام لاکچری به سبک مدرن",
    slug: "luxury-bathroom-interior-design-ideas",
    excerpt:
      "با این ایده‌های خلاقانه، حمام خود را به فضایی الهام‌بخش و آرامش‌بخش تبدیل کنید.",
    content: `<h2>پالت رنگی</h2>
<p>ترکیب سنگ مرمر سفید با جزئیات طلایی یا گرانیت مشکی مات با شیرآلات برنجی فضایی لوکس خلق می‌کند.</p>
<h2>وان و زیردوشی</h2>
<p>در طراحی مدرن، وان مستقل مجسمه‌ای هنری در مرکز توجه است.</p>`,
    coverImage: IMAGES.nordic,
    category: "طراحی و دکوراسیون",
    tags: ["طراحی داخلی", "حمام مدرن", "دکوراسیون"],
    authorName: "مهندس کامران نوری",
    readTime: 8,
    isPublished: true,
    seoTitle: "طراحی حمام لاکچری مدرن | ایده‌های سوناب",
    seoDescription: "ایده‌های طراحی حمام لوکس مدرن با محصولات سوناب.",
    createdAt: new Date("2025-06-25"),
    updatedAt: new Date("2025-06-25"),
  },
  {
    title: "تفاوت وان جکوزی و جکوزی مستقل",
    slug: "bathtub-vs-jacuzzi-comparison",
    excerpt:
      "مقایسه کامل وان جکوزی و جکوزی مستقل از نظر قیمت، فضای مورد نیاز و تجربه کاربری.",
    content: `<h2>وان جکوزی چیست؟</h2>
<p>وان جکوزی یک وان حمام استاندارد با جت‌های آب و هوا است.</p>
<h2>جکوزی مستقل چیست؟</h2>
<p>واحد کامل با سیستم گرمایش و فیلتراسیون که معمولاً در فضای باز نصب می‌شود.</p>`,
    coverImage: IMAGES.infinity,
    category: "راهنمای خرید",
    tags: ["وان جکوزی", "جکوزی", "مقایسه"],
    authorName: "تیم سوناب",
    readTime: 5,
    isPublished: true,
    seoTitle: "وان جکوزی بهتر است یا جکوزی مستقل؟",
    seoDescription: "مقایسه کامل وان جکوزی و جکوزی مستقل محصولات سوناب.",
    createdAt: new Date("2025-07-01"),
    updatedAt: new Date("2025-07-01"),
  },
  {
    title: "نگهداری از وان و زیردوشی سنگ طبیعی",
    slug: "marble-bathtub-maintenance-tips",
    excerpt:
      "با این نکات ساده و کاربردی، محصولات سنگی خود را برای چندین دهه درخشان نگه دارید.",
    content: `<h2>اصول نگهداری</h2>
<ol>
<li>از مواد اسیدی استفاده نکنید</li>
<li>بلافاصله خشک کنید</li>
<li>شوینده مخصوص سنگ استفاده کنید</li>
<li>سیلر سالانه بزنید</li>
</ol>`,
    coverImage: IMAGES.almas,
    category: "نگهداری و مراقبت",
    tags: ["مرمر", "وان سنگی", "نگهداری"],
    authorName: "تیم سوناب",
    readTime: 4,
    isPublished: true,
    seoTitle: "نگهداری وان و زیردوشی سنگ مرمر",
    seoDescription: "آموزش کامل نگهداری وان مرمر و زیردوشی اسلات.",
    createdAt: new Date("2025-07-05"),
    updatedAt: new Date("2025-07-05"),
  },
  {
    title: "وان سلطنتی پارس سوناب؛ داستان یک شاهکار ایرانی",
    slug: "pars-royal-bathtub-story",
    excerpt:
      "با الهام از حمام‌های تاریخی ایران، داستان خلق وان سلطنتی پارس را بخوانید.",
    content: `<h2>الهامی از شکوه ایران باستان</h2>
<p>وان سلطنتی پارس با روکش طلای ۲۴ عیار و نقش‌برجسته‌های دست‌ساز، شاهکاری ایرانی است.</p>
<p>هر قطعه گواهی اصالت هنری با امضای استادکاران دارد.</p>`,
    coverImage: IMAGES.pars,
    category: "داستان برند",
    tags: ["وان طلا", "سوناب", "ایرانی", "دست‌ساز"],
    authorName: "استاد محمود فرشچی",
    readTime: 6,
    isPublished: true,
    seoTitle: "وان سلطنتی پارس سوناب | داستان یک شاهکار",
    seoDescription: "داستان خلق وان سلطنتی پارس سوناب با روکش طلای ۲۴ عیار.",
    createdAt: new Date("2025-07-10"),
    updatedAt: new Date("2025-07-10"),
  },
];

const defaultSettings: Record<string, string> = {
  seo_meta_title: "سوناب | وان، جکوزی و زیردوشی لاکچری",
  seo_meta_description:
    "برند برتر طراحی و تولید وان، جکوزی و زیردوشی لاکچری در ایران. تجربه‌ای بی‌نظیر از آرامش، سلامتی و شکوه در حمام شما.",
  seo_meta_keywords: "وان, جکوزی, زیردوشی, سوناب, حمام لوکس",
  seo_og_image: IMAGES.almas,
};

/** Seed products/testimonials/posts only when tables are empty. */
export async function seedIfEmpty() {
  const productCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  const count = productCount[0]?.count ?? 0;

  if (count === 0) {
    await db.insert(products).values(seedProducts);
  }

  const testimonialCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(testimonials);
  if ((testimonialCount[0]?.count ?? 0) === 0) {
    await db.insert(testimonials).values(seedTestimonials);
  }

  const postCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(posts);
  if ((postCount[0]?.count ?? 0) === 0) {
    await db.insert(posts).values(seedPosts);
  }

  // Default SEO settings (do not overwrite custom values)
  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(settings).values({ key, value });
    }
  }

  return {
    productsInserted: count === 0 ? seedProducts.length : 0,
    productsExisting: count,
  };
}

export async function getDbStatus() {
  const tables = [
    "products",
    "testimonials",
    "page_views",
    "settings",
    "orders",
    "posts",
  ] as const;

  const status: Record<string, boolean> = {};
  for (const table of tables) {
    try {
      await db.execute(sql.raw(`SELECT 1 FROM ${table} LIMIT 1`));
      status[table] = true;
    } catch {
      status[table] = false;
    }
  }

  let productCount = 0;
  if (status.products) {
    try {
      const rows = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products);
      productCount = rows[0]?.count ?? 0;
    } catch {
      productCount = 0;
    }
  }

  return {
    connected: true,
    tables: status,
    allTablesReady: Object.values(status).every(Boolean),
    productCount,
  };
}

export async function setupDatabase() {
  await createTables();
  const seedResult = await seedIfEmpty();
  const status = await getDbStatus();
  return { ...status, ...seedResult };
}
