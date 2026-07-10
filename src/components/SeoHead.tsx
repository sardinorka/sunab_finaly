"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

interface Settings {
  seo_meta_title?: string | null;
  seo_meta_description?: string | null;
  seo_meta_keywords?: string | null;
  seo_og_image?: string | null;
  seo_google_analytics_id?: string | null;
  seo_google_tag_manager_id?: string | null;
  seo_bing_webmaster?: string | null;
  seo_yandex_verification?: string | null;
  seo_robots_txt?: string | null;
  custom_head_scripts?: string | null;
}

export default function SeoHead() {
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setS(data))
      .catch(() => setS({}));
  }, []);

  if (!s) return null;

  const metaTitle = s.seo_meta_title;
  const metaDescription = s.seo_meta_description;
  const metaKeywords = s.seo_meta_keywords;
  const ogImage = s.seo_og_image;
  const ga = s.seo_google_analytics_id;
  const gtm = s.seo_google_tag_manager_id;
  const bing = s.seo_bing_webmaster;

  return (
    <>
      {metaTitle && typeof document !== "undefined" && (
        <title>{metaTitle}</title>
      )}

      {metaDescription && (
        <meta name="description" content={metaDescription} key="seo-desc" />
      )}
      {metaKeywords && (
        <meta name="keywords" content={metaKeywords} key="seo-kw" />
      )}
      {ogImage && <meta property="og:image" content={ogImage} key="og-img" />}

      {/* Google Analytics 4 */}
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga}');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtm && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtm}');
          `}
        </Script>
      )}

      {/* Bing Webmaster verification */}
      {bing && <meta name="msvalidate.01" content={bing} key="bing" />}

      {/* Yandex verification */}
      {s.seo_yandex_verification && (
        <meta
          name="yandex-verification"
          content={s.seo_yandex_verification}
          key="yandex"
        />
      )}

      {/* Custom head scripts */}
      {s.custom_head_scripts && (
        <Script id="custom-head" strategy="afterInteractive">
          {s.custom_head_scripts}
        </Script>
      )}
    </>
  );
}
