import { PROPERTIES_DATA } from './src/data/propertiesData.js';
import { POLTAVA_DISTRICTS } from './src/data/poltavaDistricts.js';

const SITE_URL = 'https://favorit-group.com';
const BRAND_NAME = 'АН «ФАВОРИТ ГРУП»';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate Dynamic Sitemap XML with all pages and 1,198+ properties
 */
export function generateSitemapXml() {
  const today = new Date().toISOString().split('T')[0];
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/catalog', priority: '0.9', changefreq: 'daily' },
    { url: '/map', priority: '0.8', changefreq: 'weekly' },
    { url: '/services', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contacts', priority: '0.7', changefreq: 'monthly' },
    { url: '/calculator', priority: '0.6', changefreq: 'monthly' },
    { url: '/requisites', priority: '0.5', changefreq: 'monthly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Pages
  staticPages.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${p.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Property Pages (1,198 objects)
  PROPERTIES_DATA.forEach(prop => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/property/${prop.id}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${prop.isExclusive ? '0.8' : '0.6'}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generate Robots.txt
 */
export function generateRobotsTxt() {
  return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\nHost: favorit-group.com\n`;
}

/**
 * Generate SEO Meta & Semantic HTML Shell for Search Crawlers and Social Sharing
 */
export function renderSeoPage(templateHtml, reqUrl = '/') {
  const urlObj = new URL(reqUrl, SITE_URL);
  const pathname = urlObj.pathname.toLowerCase();
  const search = urlObj.search;

  let pageTitle = 'Агентство нерухомості «ФАВОРИТ ГРУП» Полтава — Купівля, Продаж, Оренда';
  let pageDesc = 'Купівля, продаж та оренда нерухомості у м. Полтава (ТОВ «НОВЕКС ІНВЕСТ», ЄДРПОУ 43980756). База 1 198 перевірених квартир, будинків та комерції. Юридичний супровід.';
  let ogImage = `${SITE_URL}/images/poltava-hero.jpg`;
  let canonicalUrl = `${SITE_URL}${pathname}`;
  let ogType = 'website';
  let jsonLd = null;
  let bodyContentHtml = '';

  // 1. PROPERTY DETAIL PAGE (/property/:id or /realty/:id or ?property=:id)
  let propId = null;
  if (pathname.startsWith('/property/')) {
    propId = pathname.split('/property/')[1]?.split('/')[0];
  } else if (pathname.startsWith('/realty/')) {
    propId = pathname.split('/realty/')[1]?.split('/')[0];
  } else if (urlObj.searchParams.get('property') || urlObj.searchParams.get('id')) {
    propId = urlObj.searchParams.get('property') || urlObj.searchParams.get('id');
  }

  if (propId) {
    const prop = PROPERTIES_DATA.find(p => String(p.id).toLowerCase() === String(propId).toLowerCase());
    if (prop) {
      const typeLabel = prop.transaction === 'rent' ? 'Оренда' : 'Продаж';
      const catLabel = prop.type === 'apartment' ? 'квартири' : (prop.type === 'house' ? 'будинку' : 'комерційної нерухомості');
      
      pageTitle = `${prop.title} | ${BRAND_NAME} Полтава`;
      pageDesc = `${typeLabel} ${catLabel}: ${prop.rooms ? prop.rooms + '-кімн., ' : ''}${prop.area} м², Полтава, район ${prop.districtName || 'Центр'}, ${prop.address}. Ціна: $${prop.priceUSD} (${prop.priceUAH?.toLocaleString('uk-UA')} грн). Перевірено АН «ФАВОРИТ ГРУП».`;
      canonicalUrl = `${SITE_URL}/property/${prop.id}`;
      ogType = 'article';
      
      if (prop.images && prop.images.length > 0) {
        ogImage = prop.images[0].startsWith('http') ? prop.images[0] : `${SITE_URL}${prop.images[0]}`;
      }

      jsonLd = {
        "@context": "https://schema.org",
        "@type": prop.type === 'apartment' ? "Apartment" : (prop.type === 'house' ? "SingleFamilyResidence" : "RealEstateListing"),
        "name": prop.title,
        "description": pageDesc,
        "image": prop.images && prop.images.length > 0 ? prop.images.slice(0, 5) : [ogImage],
        "url": canonicalUrl,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": prop.address || "Полтава",
          "addressLocality": "Полтава",
          "addressRegion": "Полтавська область",
          "addressCountry": "UA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": prop.lat || 49.5883,
          "longitude": prop.lng || 34.5514
        },
        "numberOfRooms": prop.rooms || 1,
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": prop.area || 0,
          "unitCode": "MTK"
        },
        "offers": {
          "@type": "Offer",
          "price": prop.priceUAH || 0,
          "priceCurrency": "UAH",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": prop.priceUSD || 0,
            "priceCurrency": "USD"
          },
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-01-01",
          "seller": {
            "@type": "RealEstateAgent",
            "name": "АН «ФАВОРИТ ГРУП» Полтава",
            "telephone": "+380987204050",
            "url": SITE_URL
          }
        }
      };

      bodyContentHtml = `
        <article class="seo-property-detail" style="max-width: 900px; margin: 0 auto; padding: 20px; font-family: sans-serif; color: #0f172a;">
          <nav aria-label="Хлібні крихти" style="font-size: 14px; margin-bottom: 15px; color: #64748b;">
            <a href="/" style="color: #1e3a8a; text-decoration: none;">Головна</a> &gt; 
            <a href="/catalog" style="color: #1e3a8a; text-decoration: none;">Каталог</a> &gt; 
            <a href="/catalog?transaction=${prop.transaction}" style="color: #1e3a8a; text-decoration: none;">${typeLabel}</a> &gt; 
            <span>${escapeHtml(prop.title)}</span>
          </nav>
          <h1 style="font-size: 26px; font-weight: 800; margin-bottom: 12px;">${escapeHtml(prop.title)}</h1>
          <p style="font-size: 18px; font-weight: 700; color: #1e3a8a; margin-bottom: 15px;">
            Вартість: $${prop.priceUSD} (${prop.priceUAH?.toLocaleString('uk-UA')} грн)
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; margin-top: 0;">Характеристики об'єкта:</h2>
            <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
              <li>📍 <strong>Адреса:</strong> ${escapeHtml(prop.address)}</li>
              <li>🗺️ <strong>Район:</strong> ${escapeHtml(prop.districtName || 'Полтава')}</li>
              <li>🚪 <strong>Кімнат:</strong> ${prop.rooms || '—'}</li>
              <li>📐 <strong>Загальна площа:</strong> ${prop.area || '—'} м²</li>
              <li>🏢 <strong>Поверх:</strong> ${prop.floor ? prop.floor + ' з ' + prop.totalFloors : '—'}</li>
              <li>🔥 <strong>Опалення:</strong> ${escapeHtml(prop.heating || 'Індивідуальне')}</li>
              <li>🛋️ <strong>Стан ремонту:</strong> ${escapeHtml(prop.condition || 'Житловий стан')}</li>
              <li>🆔 <strong>ID в базі агентства:</strong> ${escapeHtml(prop.id)}</li>
            </ul>
          </div>
          <p style="line-height: 1.6; color: #334155; margin-bottom: 20px;">
            ${escapeHtml(prop.description || prop.title)}. Об'єкт пройшов повну юридичну перевірку документації фахівцями АН «ФАВОРИТ ГРУП». Організація безкоштовного перегляду та супровід угоди.
          </p>
          <div style="margin-top: 25px;">
            <a href="/catalog" style="display: inline-block; padding: 12px 24px; background: #1e3a8a; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700;">Переглянути весь каталог нерухомості Полтави</a>
          </div>
        </article>
      `;
    }
  }

  // 2. CATALOG PAGE (/catalog)
  else if (pathname === '/catalog') {
    pageTitle = `Каталог нерухомості Полтави | Купівля та Оренда 1 198 об'єктів — ${BRAND_NAME}`;
    pageDesc = `Офіційний каталог нерухомості Полтави: 1 198 перевірених квартир, будинків, ділянок та комерції. Фільтри за всіма районами міста: Центр, Левада, Поділ, Алмазний, Сади, Огнівка, Половки. АН ФАВОРИТ ГРУП.`;
    canonicalUrl = `${SITE_URL}/catalog`;

    const topProperties = PROPERTIES_DATA.slice(0, 12);

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Каталог нерухомості Полтави — АН ФАВОРИТ ГРУП",
      "description": pageDesc,
      "numberOfItems": PROPERTIES_DATA.length,
      "itemListElement": topProperties.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "RealEstateListing",
          "name": p.title,
          "url": `${SITE_URL}/property/${p.id}`,
          "image": p.images && p.images[0] ? p.images[0] : `${SITE_URL}/images/poltava-hero.jpg`
        }
      }))
    };

    bodyContentHtml = `
      <section class="seo-catalog-content" style="max-width: 1100px; margin: 0 auto; padding: 30px 20px; font-family: sans-serif; color: #0f172a;">
        <h1 style="font-size: 30px; font-weight: 900; margin-bottom: 12px; color: #0f172a;">Каталог нерухомості у м. Полтава — АН «ФАВОРИТ ГРУП»</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 25px;">
          Актуальна база перевірених об'єктів нерухомості у Полтаві. У каталозі представлено <strong>1 198 активних оголошень</strong> з продажу та оренди квартир, приватних будинків, земельних ділянок і комерційних приміщень.
        </p>

        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 15px;">Райони Полтави:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px;">
          ${POLTAVA_DISTRICTS.filter(d => d.id !== 'all').map(d => `
            <a href="/catalog?district=${d.id}" style="display: inline-block; padding: 8px 16px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; color: #1e3a8a; text-decoration: none; font-size: 14px; font-weight: 600;">
              ${escapeHtml(d.name)}
            </a>
          `).join('')}
        </div>

        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 15px;">Популярні об'єкти в базі:</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
          ${topProperties.map(p => `
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0;">
                <a href="/property/${p.id}" style="color: #0f172a; text-decoration: none;">${escapeHtml(p.title)}</a>
              </h3>
              <p style="font-size: 16px; font-weight: 800; color: #1e3a8a; margin: 0 0 8px 0;">
                $${p.priceUSD} <span style="font-size: 13px; color: #64748b; font-weight: normal;">(${p.priceUAH?.toLocaleString('uk-UA')} грн)</span>
              </p>
              <p style="font-size: 13px; color: #64748b; margin: 0 0 12px 0;">📍 ${escapeHtml(p.address)} • ${p.rooms ? p.rooms + ' кімн.' : ''} • ${p.area} м²</p>
              <a href="/property/${p.id}" style="display: block; text-align: center; padding: 8px 12px; background: #f1f5f9; color: #1e3a8a; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px;">Детальніше про об'єкт</a>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // 3. SERVICES PAGE (/services)
  else if (pathname === '/services') {
    pageTitle = `Послуги агентства нерухомості у Полтаві | ${BRAND_NAME}`;
    pageDesc = `Повний спектр рієлторських та юридичних послуг у Полтаві: купівля, продаж, оренда житлової та комерційної нерухомості, експертна оцінка та перевірка договорів.`;
    canonicalUrl = `${SITE_URL}/services`;
  }

  // 4. ABOUT PAGE (/about)
  else if (pathname === '/about') {
    pageTitle = `Про агентство «ФАВОРИТ ГРУП» Полтава | ТОВ «НОВЕКС ІНВЕСТ»`;
    pageDesc = `Офіційна інформація про АН «ФАВОРИТ ГРУП» (ТОВ «НОВЕКС ІНВЕСТ», ЄДРПОУ 43980756). Професійні рієлтори, бездоганна репутація та безпечні угоди у Полтаві.`;
    canonicalUrl = `${SITE_URL}/about`;
  }

  // 5. CONTACTS PAGE (/contacts)
  else if (pathname === '/contacts') {
    pageTitle = `Контакти АН «ФАВОРИТ ГРУП» у Полтаві | Телефон, Адреса офісу`;
    pageDesc = `Офіс АН «ФАВОРИТ ГРУП» у центрі Полтави: вул. Соборності, 22. Телефон: +380 (98) 720-40-50. Працюємо щодня з 10:00 до 18:00 без вихідних.`;
    canonicalUrl = `${SITE_URL}/contacts`;
  }

  // 6. MAP PAGE (/map)
  else if (pathname === '/map') {
    pageTitle = `Карта нерухомості Полтави | Пошук квартир та будинків на карті — ${BRAND_NAME}`;
    pageDesc = `Інтерактивна карта об'єктів нерухомості Полтави. Зручний пошук квартир для купівлі та оренди за районами та вулицями міста з точними координатами.`;
    canonicalUrl = `${SITE_URL}/map`;
  }

  // 7. DEFAULT / HOME PAGE (/)
  else {
    const featured = PROPERTIES_DATA.slice(0, 8);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "ФАВОРИТ ГРУП",
      "legalName": "ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ НОВЕКС ІНВЕСТ",
      "taxID": "43980756",
      "description": "Провідне агентство нерухомості м. Полтава. База 1 198 перевірених об'єктів.",
      "telephone": "+380987204050",
      "email": "novexinvest.poltava@gmail.com",
      "url": SITE_URL,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "вул. Соборності, 22",
        "addressLocality": "Полтава",
        "postalCode": "36020",
        "addressCountry": "UA"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "18:00"
        }
      ],
      "priceRange": "$$"
    };

    bodyContentHtml = `
      <div class="seo-home-shell" style="max-width: 1100px; margin: 0 auto; padding: 25px 20px; font-family: sans-serif; color: #0f172a;">
        <header style="margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px;">Агентство нерухомості «ФАВОРИТ ГРУП» Полтава</h1>
          <p style="font-size: 17px; color: #475569; line-height: 1.6;">
            Надійний партнер у сфері купівлі, продажу та оренди нерухомості в Полтаві. Офіційна перевірена база з понад <strong>1 198 актуальних об'єктів</strong>.
          </p>
        </header>

        <section style="margin-bottom: 35px;">
          <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 15px;">Основні розділи нерухомості:</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <a href="/catalog?transaction=buy" style="padding: 10px 20px; background: #1e3a8a; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700;">Купити нерухомість у Полтаві</a>
            <a href="/catalog?transaction=rent" style="padding: 10px 20px; background: #0f172a; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700;">Орендувати квартиру / будинок</a>
            <a href="/map" style="padding: 10px 20px; background: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: 700;">Карта об'єктів Полтави</a>
          </div>
        </section>

        <section style="margin-bottom: 35px;">
          <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 15px;">Популярні райони міста:</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${POLTAVA_DISTRICTS.filter(d => d.id !== 'all').map(d => `
              <a href="/catalog?district=${d.id}" style="padding: 6px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; color: #334155; text-decoration: none; font-size: 14px;">${escapeHtml(d.name)}</a>
            `).join('')}
          </div>
        </section>

        <section>
          <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 15px;">Свіжі пропозиції:</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
            ${featured.map(p => `
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; background: #fff;">
                <h3 style="font-size: 15px; margin: 0 0 6px 0;"><a href="/property/${p.id}" style="color: #0f172a; text-decoration: none;">${escapeHtml(p.title)}</a></h3>
                <p style="font-weight: 800; color: #1e3a8a; margin: 0 0 6px 0;">$${p.priceUSD} (${p.priceUAH?.toLocaleString('uk-UA')} грн)</p>
                <p style="font-size: 12px; color: #64748b; margin: 0;">${escapeHtml(p.districtName || 'Полтава')} • ${p.rooms ? p.rooms + ' кімн.' : ''} • ${p.area} м²</p>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  // Perform HTML injections into templateHtml
  let finalHtml = templateHtml;

  // Replace Title
  finalHtml = finalHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);

  // Replace Meta Description
  if (finalHtml.includes('name="description"')) {
    finalHtml = finalHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(pageDesc)}" />`);
  }

  // Replace Canonical Link
  if (finalHtml.includes('rel="canonical"')) {
    finalHtml = finalHtml.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  }

  // Replace OpenGraph Title & Description & Image & Url
  finalHtml = finalHtml.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`);
  finalHtml = finalHtml.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`);
  finalHtml = finalHtml.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
  finalHtml = finalHtml.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  finalHtml = finalHtml.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`);

  // Replace Twitter Title & Description & Image
  finalHtml = finalHtml.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`);
  finalHtml = finalHtml.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(pageDesc)}" />`);
  finalHtml = finalHtml.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`);

  // Inject or Replace JSON-LD Schema.org
  if (jsonLd) {
    const jsonLdScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>`;
    if (finalHtml.includes('application/ld+json')) {
      finalHtml = finalHtml.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLdScript);
    } else {
      finalHtml = finalHtml.replace('</head>', `${jsonLdScript}\n  </head>`);
    }
  }

  // Inject Semantic HTML inside <div id="root"> (React replaces it on client, crawlers read it directly!)
  if (bodyContentHtml) {
    finalHtml = finalHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${bodyContentHtml}</div>`
    );
  }

  return finalHtml;
}
