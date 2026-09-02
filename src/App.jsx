import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  FacebookLogo,
  InstagramLogo,
  MapPin,
  Package,
  ShoppingBagOpen,
  Storefront,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { businessHours, links } from "./config";
import { resolveQrRedirect, trackEvent, withAttribution } from "./qr";

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const categoryMeta = [
  {
    id: "kratom",
    label: "KRATOM",
    name: "Kratom",
    slug: "kratom",
    note: "Drinks, powder, capsules & shots",
    staticCount: 8,
    compliance: "18+ • In-store purchase only",
    complianceTh: "สำหรับผู้มีอายุ 18 ปีขึ้นไป • จำหน่ายที่ร้านเท่านั้น",
    order: 10,
  },
  { id: "functional-mushrooms", label: "FUNCTIONAL MUSHROOMS", name: "Functional Mushrooms", slug: "functional-mushrooms", note: "Drinks, capsules & gummies", order: 20 },
  { id: "probiotics", label: "PROBIOTICS", name: "Probiotics", slug: "probiotics", note: "Probiotic shots and gut-focused products", order: 30 },
  { id: "energy-nutrition", label: "ENERGY & NUTRITION", name: "Energy & Nutrition", slug: "energy-nutrition", note: "Functional drinks and nutrition products", order: 40 },
  { id: "electrolytes", label: "ELECTROLYTES", name: "Electrolytes", slug: "electrolytes", note: "Single sachets and variety packs", order: 50 },
];

const popularProducts = [
  {
    id: "og-kraft-soda-original",
    brand: "OG Kratom",
    group: "OG Kratom",
    name: "Kraft Soda Original",
    descriptor: "Ready-to-drink kratom soda",
    category: "Kraft Soda",
    image: asset("catalog/cutouts/og-original.png"),
    imageAlt: "OG Kratom Kraft Soda Original bottle",
    homepagePriority: 10,
  },
  {
    id: "og-kraft-soda-fresh",
    brand: "OG Kratom",
    group: "OG Kratom",
    name: "Kraft Soda Fresh",
    descriptor: "Fresh-style kratom soda",
    category: "Kraft Soda",
    image: asset("catalog/cutouts/og-fresh.png"),
    imageAlt: "OG Kratom Kraft Soda Fresh bottle",
    homepagePriority: 20,
  },
  {
    id: "og-kraft-soda-kola",
    brand: "OG Kratom",
    group: "OG Kratom",
    name: "Kraft Soda Kola",
    descriptor: "Kola kratom soda",
    category: "Kraft Soda",
    image: asset("catalog/cutouts/og-kola.png"),
    imageAlt: "OG Kratom Kraft Soda Kola bottle",
    homepagePriority: 30,
  },
  {
    id: "og-kraft-soda-cherry",
    brand: "OG Kratom",
    group: "OG Kratom",
    name: "Kraft Soda Cherry",
    descriptor: "Cherry kratom soda",
    category: "Kraft Soda",
    image: asset("catalog/cutouts/og-cherry.png"),
    imageAlt: "OG Kratom Kraft Soda Cherry bottle",
    homepagePriority: 40,
  },
  {
    id: "og-kraft-soda-orange-cream",
    brand: "OG Kratom",
    group: "OG Kratom",
    name: "Kraft Soda Orange Cream",
    descriptor: "Orange cream kratom soda",
    category: "Kraft Soda",
    image: asset("catalog/cutouts/og-orange-cream.png"),
    imageAlt: "OG Kratom Kraft Soda Orange Cream bottle",
    homepagePriority: 50,
  },
  {
    id: "og-kratom-powder-150g",
    brand: "OG Kratom",
    group: "OG Kratom",
    name: "Kratom Powder 150g",
    descriptor: "150 g kratom leaf powder",
    category: "Powder",
    image: asset("catalog/cutouts/og-powder-150g-transparent.webp"),
    imageAlt: "OG Kratom 150 gram kratom powder product",
    homepagePriority: 60,
  },
  {
    id: "og-kratom-capsules-10",
    brand: "OG Kratom",
    group: "OG Kratom",
    name: "Kratom Capsules 10ct",
    descriptor: "10-count kratom capsules",
    category: "Capsules",
    image: asset("catalog/cutouts/og-capsules-10-transparent.webp"),
    imageAlt: "OG Kratom 10 capsule product pack",
    homepagePriority: 70,
  },
  {
    id: "blackshot",
    brand: "Red Hippo",
    group: "Black Shot",
    name: "BlackShot",
    descriptor: "Kratom leaf extract",
    category: "Kratom extract",
    image: asset("catalog/cutouts/blackshot.webp"),
    imageAlt: "BlackShot kratom leaf extract bottle",
    homepagePriority: 80,
  },
  {
    id: "vegain-probiotic-original",
    brand: "Vegain",
    group: "Vegain",
    name: "Probiotic Shot Original",
    descriptor: "Ginger probiotic shot",
    category: "Probiotic shot",
    image: asset("catalog/cutouts/vegain-shot-1.png"),
    imageAlt: "Vegain original ginger probiotic shot",
    homepagePriority: 90,
  },
  {
    id: "vegain-probiotic-lemon-vanilla",
    brand: "Vegain",
    group: "Vegain",
    name: "Probiotic Shot Lemon Vanilla",
    descriptor: "Lemon vanilla probiotic shot",
    category: "Probiotic shot",
    image: asset("catalog/cutouts/vegain-shot-2.png"),
    imageAlt: "Vegain lemon vanilla probiotic shot",
    homepagePriority: 91,
  },
  {
    id: "vegain-probiotic-passion-raspberry",
    brand: "Vegain",
    group: "Vegain",
    name: "Probiotic Shot Passion Raspberry",
    descriptor: "Passion raspberry probiotic shot",
    category: "Probiotic shot",
    image: asset("catalog/cutouts/vegain-shot-3.png"),
    imageAlt: "Vegain passion fruit raspberry probiotic shot",
    homepagePriority: 92,
  },
  {
    id: "vegain-probiotic-blackcurrant-vanilla",
    brand: "Vegain",
    group: "Vegain",
    name: "Probiotic Shot Blackcurrant Vanilla",
    descriptor: "Blackcurrant vanilla probiotic shot",
    category: "Probiotic shot",
    image: asset("catalog/cutouts/vegain-shot-4.png"),
    imageAlt: "Vegain blackcurrant vanilla probiotic shot",
    homepagePriority: 93,
  },
  {
    id: "vegain-energize-lemon-ginger",
    brand: "Vegain",
    group: "Vegain",
    name: "Energize Lemon Ginger",
    descriptor: "Plant-based functional nutrition",
    category: "Energy Drink",
    image: asset("catalog/cutouts/vegain-energize.png"),
    imageAlt: "Vegain Energize lemon ginger product",
    homepagePriority: 100,
  },
  {
    id: "vegain-energize-orange",
    brand: "Vegain",
    group: "Vegain",
    name: "Energize Orange",
    descriptor: "Plant-based functional nutrition",
    category: "Energy Drink",
    image: asset("catalog/cutouts/vegain-energize-orange.png"),
    imageAlt: "Vegain Energize orange product",
    homepagePriority: 101,
  },
  {
    id: "earthlings-lions-mane-seltzer",
    brand: "Earthlings",
    group: "Earthlings",
    name: "Lion's Mane Seltzer",
    descriptor: "Functional mushroom drink",
    category: "Functional Mushrooms",
    image: asset("catalog/cutouts/earthling-lions-mane-seltzer-transparent.webp"),
    imageAlt: "Earthlings Lion's Mane mushroom seltzer",
    homepagePriority: 110,
  },
  {
    id: "earthlings-lions-mane-capsules",
    brand: "Earthlings",
    group: "Earthlings",
    name: "Lion's Mane Capsules",
    descriptor: "Functional mushroom capsules",
    category: "Functional Mushrooms",
    image: asset("catalog/cutouts/earthling-lm-capsules-transparent.webp"),
    imageAlt: "Earthlings Lion's Mane mushroom capsules",
    homepagePriority: 111,
  },
  {
    id: "earthlings-cordyceps",
    brand: "Earthlings",
    group: "Earthlings",
    name: "Cordyceps Capsules",
    descriptor: "Functional mushroom capsules",
    category: "Functional Mushrooms",
    image: asset("catalog/cutouts/earthling-cordyceps-transparent.webp"),
    imageAlt: "Earthlings Cordyceps mushroom capsules",
    homepagePriority: 112,
  },
  {
    id: "earthlings-reishi",
    brand: "Earthlings",
    group: "Earthlings",
    name: "Reishi Capsules",
    descriptor: "Functional mushroom capsules",
    category: "Functional Mushrooms",
    image: asset("catalog/cutouts/earthling-reishi-transparent.webp"),
    imageAlt: "Earthlings Reishi mushroom capsules",
    available: false,
    homepagePriority: 113,
  },
  {
    id: "earthlings-mushroom-gummies",
    brand: "Earthlings",
    group: "Earthlings",
    name: "Mushroom Gummies",
    descriptor: "Functional mushroom gummies",
    category: "Functional Mushrooms",
    image: asset("catalog/cutouts/earthling-gummies-transparent.webp"),
    imageAlt: "Earthlings functional mushroom gummies",
    homepagePriority: 114,
  },
  {
    id: "wilder-electrolyte-peach-single",
    brand: "Wilder",
    group: "Wilder",
    name: "Peach Single Sachet",
    descriptor: "Single-serve electrolyte sachet",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-peach-transparent.png"),
    imageAlt: "Wilder peach electrolyte single sachet",
    homepagePriority: 120,
  },
  {
    id: "wilder-electrolyte-pineapple-single",
    brand: "Wilder",
    group: "Wilder",
    name: "Pineapple Single Sachet",
    descriptor: "Single-serve electrolyte sachet",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-pineapple-transparent.png"),
    imageAlt: "Wilder pineapple electrolyte single sachet",
    homepagePriority: 121,
  },
  {
    id: "wilder-electrolyte-strawberry-single",
    brand: "Wilder",
    group: "Wilder",
    name: "Strawberry Single Sachet",
    descriptor: "Single-serve electrolyte sachet",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-strawberry-transparent.png"),
    imageAlt: "Wilder strawberry electrolyte single sachet",
    homepagePriority: 122,
  },
  {
    id: "wilder-electrolyte-watermelon-single",
    brand: "Wilder",
    group: "Wilder",
    name: "Watermelon Single Sachet",
    descriptor: "Single-serve electrolyte sachet",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-watermelon-transparent.png"),
    imageAlt: "Wilder watermelon electrolyte single sachet",
    homepagePriority: 123,
  },
  {
    id: "wilder-electrolyte-yuzu-single",
    brand: "Wilder",
    group: "Wilder",
    name: "Yuzu Single Sachet",
    descriptor: "Single-serve electrolyte sachet",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-yuzu-transparent.png"),
    imageAlt: "Wilder yuzu electrolyte single sachet",
    homepagePriority: 124,
  },
  {
    id: "wilder-electrolyte-variety-3pack",
    brand: "Wilder",
    group: "Wilder",
    name: "3-Flavour Variety Pack",
    descriptor: "Three-flavour electrolyte pack",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-variety-transparent.png"),
    imageAlt: "Wilder three-flavour electrolyte variety pack",
    homepagePriority: 125,
  },
  {
    id: "wilder-electrolyte-10pack-box",
    brand: "Wilder",
    group: "Wilder",
    name: "10-Pack Box",
    descriptor: "Multi-pack electrolyte box",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-variety-transparent.png"),
    imageAlt: "Wilder three-flavour electrolyte multi-pack box",
    homepagePriority: 126,
  },
  {
    id: "wilder-electrolyte-12pack-box",
    brand: "Wilder",
    group: "Wilder",
    name: "12-Pack Box",
    descriptor: "Three-flavour electrolyte box",
    category: "Electrolytes",
    image: asset("catalog/wilder/wilder-variety-transparent.png"),
    imageAlt: "Wilder three-flavour electrolyte 12-pack box",
    homepagePriority: 127,
  },
];

const merchandisingProducts = [...popularProducts].sort((a, b) => {
  const promoA = a.promoPriority ?? Number.POSITIVE_INFINITY;
  const promoB = b.promoPriority ?? Number.POSITIVE_INFINITY;

  if (promoA !== promoB) {
    return promoA - promoB;
  }

  return a.homepagePriority - b.homepagePriority;
});

const withFulfillment = (product) => {
  const inStoreOnly = product.group === "OG Kratom" || product.group === "Black Shot";

  return {
    ...product,
    fulfillment: inStoreOnly
      ? { inStore: true, kpgDelivery: false, onlinePurchase: false, label: "IN-STORE ONLY" }
      : { inStore: true, kpgDelivery: true, onlinePurchase: false, label: "DELIVERY AVAILABLE" },
  };
};

const getProductCategoryId = (product) => {
  if (product.group === "OG Kratom" || product.group === "Black Shot") return "kratom";
  if (product.category === "Functional Mushrooms") return "functional-mushrooms";
  if (product.category === "Electrolytes") return "electrolytes";
  if (product.category === "Probiotic shot") return "probiotics";
  if (product.category === "Energy Drink") return "energy-nutrition";
  return null;
};

const productsWithFulfillment = merchandisingProducts.map((product) => ({
  ...withFulfillment(product),
  categoryId: getProductCategoryId(product),
}));

const getProductsForCategory = (categoryId) =>
  productsWithFulfillment
    .filter((product) => product.categoryId === categoryId)
    .sort((a, b) => {
      const promoA = a.promoPriority ?? Number.POSITIVE_INFINITY;
      const promoB = b.promoPriority ?? Number.POSITIVE_INFINITY;
      return promoA - promoB || a.homepagePriority - b.homepagePriority;
    });

const availableCategories = categoryMeta.filter((category) => getProductsForCategory(category.id).length > 0);

const destinations = [
  {
    id: "shop",
    eyebrow: businessHours.visitEyebrow,
    eyebrowNote: businessHours.closedLabel,
    title: "Visit BaiMai",
    description: "Visit us in Hin Kong for kratom, functional mushrooms, electrolytes, supplements and more.",
    action: "Get Directions",
    href: links.maps,
    image: asset("shop-front-view.jpg"),
    imageAlt: "Front view of BaiMai Herbs and Wellness shop in Hin Kong Koh Phangan",
    Icon: Storefront,
    event: "directions_click",
  },
  {
    id: "delivery",
    eyebrow: "ISLAND DELIVERY",
    title: "Delivery across Koh Phangan",
    description: "Eligible BaiMai wellness products delivered through KPG Delivery.",
    secondaryNote: "Kratom products are available in store only.",
    action: "Order Delivery",
    href: links.delivery,
    logo: asset("kpg-delivery-logo.png"),
    logoAlt: "KPG Delivery logo",
    Icon: Package,
    event: "delivery_click",
  },
];

const socialLinks = [
  { label: "Instagram", href: links.instagram, Icon: InstagramLogo, event: "contact_click" },
  { label: "Facebook", href: links.facebook, Icon: FacebookLogo, event: "contact_click" },
];

const pageMeta = {
  home: {
    title: "BaiMai Herbs & Wellness | Kratom Shop & Eligible Wellness Delivery",
    description:
      "BaiMai Herbs & Wellness in Koh Phangan offers kratom in store, plus eligible wellness products for local shop pickup and KPG Delivery.",
    url: "https://baimaiherbs.com/",
  },
  kratom: {
    title: "Kratom Koh Phangan | BaiMai Herbs & Wellness",
    description:
      "Browse kratom products at BaiMai Herbs & Wellness in Koh Phangan, including drinks, shots, capsules and powders available in store.",
    url: "https://baimaiherbs.com/kratom",
  },
  mushrooms: {
    title: "Functional Mushrooms Koh Phangan | BaiMai Herbs & Wellness",
    description:
      "Find functional mushroom products at BaiMai Herbs & Wellness in Koh Phangan, including Lion's Mane, Cordyceps and selected wellness products.",
    url: "https://baimaiherbs.com/mushrooms",
  },
  delivery: {
    title: "BaiMai Delivery Koh Phangan | Order on KPG Delivery",
    description:
      "Order eligible BaiMai Herbs & Wellness wellness products for Koh Phangan delivery through KPG Delivery. Kratom products are available in store only.",
    url: "https://baimaiherbs.com/delivery",
  },
  biohacking: {
    title: "Biohacking Products Koh Phangan | BaiMai Herbs & Wellness",
    description:
      "Explore BaiMai Herbs & Wellness products for energy, focus, gut support and recovery in Koh Phangan, with shop pickup and local delivery options.",
    url: "https://baimaiherbs.com/biohacking",
  },
};

function isExternal(href) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

function TrackLink({ href, event, payload, className, children, ...props }) {
  const finalHref = isExternal(href) || href.startsWith("#") ? href : withAttribution(href);
  const external = isExternal(finalHref);

  return (
    <a
      className={className}
      href={finalHref}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={() => event && trackEvent(event, payload)}
      {...props}
    >
      {children}
    </a>
  );
}

function CategoryCarouselCard({ category, products }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef(null);
  const resumeTimer = useRef(null);
  const product = products[index % products.length];
  const href = `/products/${category.slug}`;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (products.length < 2 || paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % products.length), 4200);
    return () => window.clearInterval(timer);
  }, [paused, products.length, reducedMotion]);

  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  const pauseTemporarily = () => {
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 5200);
  };

  const move = (direction) => {
    pauseTemporarily();
    setIndex((current) => (current + direction + products.length) % products.length);
  };

  const openCategory = () => {
    trackEvent("category_click", { category: category.name });
    window.location.assign(withAttribution(href));
  };

  return (
    <article
      className="category-carousel-card"
      tabIndex="0"
      role="link"
      aria-label={`Browse ${category.name}`}
      onClick={(event) => {
        if (!event.target.closest("button, a")) openCategory();
      }}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && event.target === event.currentTarget) {
          event.preventDefault();
          openCategory();
        }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(distance) > 36) move(distance < 0 ? 1 : -1);
        else setPaused(false);
      }}
    >
      <div className="category-carousel-image">
        <img key={product.id} src={product.image} alt={product.imageAlt} width="420" height="280" />
        {products.length > 1 && (
          <>
            <button className="category-carousel-arrow category-carousel-prev" type="button" aria-label={`Previous ${category.name} product`} onClick={(event) => { event.stopPropagation(); move(-1); }}>
              &#8249;
            </button>
            <button className="category-carousel-arrow category-carousel-next" type="button" aria-label={`Next ${category.name} product`} onClick={(event) => { event.stopPropagation(); move(1); }}>
              &#8250;
            </button>
          </>
        )}
      </div>
      <div className="category-carousel-copy">
        <p className="category-carousel-kicker">{category.label || category.name.toUpperCase()}</p>
        <h3>{category.name}</h3>
        <p>{category.note}</p>
        <div className="category-carousel-footer">
          <span>{category.staticCount ?? products.length} products</span>
          <TrackLink href={href} event="category_click" payload={{ category: category.name }}>Explore {category.name} <ArrowRight size={15} weight="bold" aria-hidden="true" /></TrackLink>
        </div>
        {category.compliance && (
          <p className="category-carousel-compliance">
            {category.compliance}
            <span lang="th">{category.complianceTh}</span>
          </p>
        )}
        {products.length > 1 && (
          <div className="category-carousel-dots" aria-label={`${category.name} product slides`}>
            {products.map((item, itemIndex) => (
              <button key={item.id} type="button" className={itemIndex === index ? "is-active" : ""} aria-label={`Show ${item.name}`} aria-current={itemIndex === index ? "true" : undefined} onClick={(event) => { event.stopPropagation(); pauseTemporarily(); setIndex(itemIndex); }} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function ProductCard({ product }) {
  const inStoreOnly = !product.fulfillment?.kpgDelivery;
  const isUnavailable = product.available === false;

  return (
    <article
      className={`product-card${isUnavailable ? " product-card-unavailable" : ""}`}
      data-product-group={product.group}
      data-product-id={product.id}
      style={{ "--product-scale": String(product.imageScale ?? 1) }}
    >
      <div className="product-image">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          width="300"
          height="300"
        />
      </div>
      <div className="product-copy">
        <p>{product.brand}</p>
        <h3>{product.name}</h3>
        <span>{product.descriptor}</span>
        {product.price ? <strong className="product-price">{product.price}</strong> : null}
      </div>
      <div className="product-bottom">
        <small className={`fulfillment-state${inStoreOnly ? " in-store" : ""}${isUnavailable ? " unavailable" : ""}`}>
          {isUnavailable ? "UNAVAILABLE" : inStoreOnly ? "IN-STORE ONLY" : product.category}
        </small>
        {!isUnavailable && (
          <TrackLink
            href={inStoreOnly ? links.maps : links.delivery}
            event="product_click"
            payload={{ product: product.id }}
            aria-label={`${inStoreOnly ? "Get directions for" : "View delivery for"} ${product.name}`}
          >
            {inStoreOnly ? "Directions" : "Delivery"}
          </TrackLink>
        )}
      </div>
    </article>
  );
}

function DestinationCard({ destination }) {
  const { Icon } = destination;

  return (
    <article className={`destination-card destination-card-${destination.id}`}>
      <div className="card-image">
        {destination.id === "delivery" ? (
          <div className="delivery-product-visual" aria-label="Delivery-eligible BaiMai wellness products">
            <img className="delivery-product-image" src={asset("catalog/cutouts/vegain-shot-1.png")} alt="Vegain probiotic shot" loading="lazy" width="180" height="240" />
            <img className="delivery-product-image delivery-product-image-hero" src={asset("catalog/cutouts/vegain-energize.png")} alt="Vegain Energize product" loading="lazy" width="180" height="240" />
            <img className="delivery-product-image" src={asset("catalog/wilder/wilder-variety-pouch-transparent.png")} alt="Wilder electrolyte variety pack" loading="lazy" width="180" height="240" />
            {destination.logo && (
              <span className="delivery-stage-mark">
                <img src={destination.logo} alt={destination.logoAlt} loading="lazy" width="92" height="32" />
              </span>
            )}
          </div>
        ) : (
          <img src={destination.image} alt={destination.imageAlt} loading="lazy" width="625" height="420" />
        )}
        <span className="card-icon" aria-hidden="true">
          <Icon size={22} weight="regular" />
        </span>
      </div>
      <div className="card-copy">
        <p className="card-eyebrow">{destination.eyebrow}</p>
        {destination.eyebrowNote && <span className="card-eyebrow-note">{destination.eyebrowNote}</span>}
        <h2>{destination.title}</h2>
        <p>{destination.description}</p>
        {destination.secondaryNote && <small className="card-secondary-note">{destination.secondaryNote}</small>}
        <TrackLink
          className="card-button"
          href={destination.href}
          event={destination.event}
          payload={{ destination: destination.id }}
        >
          <span>{destination.action}</span>
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </TrackLink>
      </div>
    </article>
  );
}

function MobileActionBar({ hideDelivery = false }) {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <TrackLink href="#products" event="shop_products_click">
        <ShoppingBagOpen size={18} weight="regular" aria-hidden="true" />
        Shop
      </TrackLink>
      {!hideDelivery && (
        <TrackLink
          className="mobile-delivery-pill"
          href={links.delivery}
          event="delivery_click"
          aria-label="Open KPG Delivery"
        >
          <img src={asset("kpg-delivery-logo.png")} alt="KPG Delivery" width="92" height="32" />
        </TrackLink>
      )}
      <TrackLink href={links.maps} event="directions_click">
        <MapPin size={18} weight="regular" aria-hidden="true" />
        Directions
      </TrackLink>
    </nav>
  );
}

function CategoryPage({ category, products }) {
  const isKratom = category.id === "kratom";

  return (
    <div className="site-shell category-page">
      <main>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <TrackLink href="/">BaiMai Herbs &amp; Wellness</TrackLink>
          <span aria-hidden="true">/</span>
          <span>Products</span>
          <span aria-hidden="true">/</span>
          <strong>{category.name}</strong>
        </nav>
        <section className="category-page-header" aria-labelledby="category-page-title">
          <p className="section-kicker">Product category</p>
          <h1 id="category-page-title">{category.name}</h1>
          <p>{category.note}. Explore the current BaiMai selection.</p>
          <p className="category-hours">Shop hours: {businessHours.compact}</p>
          {isKratom && (
            <>
              <p className="category-location">Available at BaiMai Herbs &amp; Wellness, Hin Kong</p>
              <p className="compliance-note">
                In-store purchase only • 18+
                <span lang="th">ผลิตภัณฑ์กระท่อมจำหน่ายที่ร้านเท่านั้น สำหรับผู้มีอายุ 18 ปีขึ้นไป</span>
              </p>
            </>
          )}
        </section>
        <section className="products-section category-products" aria-labelledby="category-products-title">
          <div className="section-heading">
            <p className="section-kicker">{products.length} products</p>
            <h2 id="category-products-title">{category.name}</h2>
          </div>
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
        <section className="category-page-actions" aria-label="Continue browsing">
          <TrackLink className="secondary-action" href="/">Back to categories</TrackLink>
          {isKratom && <TrackLink className="primary-action" href={links.maps} event="directions_click">Visit shop <ArrowRight size={16} weight="bold" aria-hidden="true" /></TrackLink>}
        </section>
      </main>
      <footer>
        <div>
          <strong>BaiMai Herbs &amp; Wellness</strong>
          <span>Koh Phangan, Thailand</span>
        </div>
        <div className="footer-links">
          <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={links.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={links.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </footer>
      <MobileActionBar hideDelivery={isKratom} />
    </div>
  );
}

export function App() {
  const route = useMemo(() => window.location.pathname, []);
  const categoryContext = useMemo(() => {
    const match = route.match(/^\/products\/([^/]+)/);
    return categoryMeta.find((category) => category.slug === match?.[1]) || null;
  }, [route]);
  const routeContext = useMemo(() => {
    if (categoryContext) return "category";
    if (route.startsWith("/kratom")) return "kratom";
    if (route.startsWith("/mushrooms")) return "mushrooms";
    if (route.startsWith("/delivery")) return "delivery";
    if (route.startsWith("/biohacking")) return "biohacking";
    return "home";
  }, [categoryContext, route]);

  useEffect(() => {
    const meta = categoryContext
      ? {
          title: `${categoryContext.name} Products | BaiMai Herbs & Wellness`,
          description: `Browse ${categoryContext.name.toLowerCase()} products available from BaiMai Herbs & Wellness in Koh Phangan, Thailand.`,
          url: `https://baimaiherbs.com/products/${categoryContext.slug}`,
        }
      : pageMeta[routeContext] || pageMeta.home;
    document.title = meta.title;

    const setMeta = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:url"]', meta.url);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", meta.url);
  }, [categoryContext, routeContext]);

  useEffect(() => {
    const redirect = resolveQrRedirect(window.location.pathname);
    if (redirect) {
      window.location.replace(redirect);
      return;
    }

    const hasUtm = window.location.search.includes("utm_");
    trackEvent(hasUtm ? "qr_landing_view" : "landing_view", { route: routeContext });
  }, [routeContext]);

  if (categoryContext) {
    return <CategoryPage category={categoryContext} products={getProductsForCategory(categoryContext.id)} />;
  }

  return (
    <div className="site-shell">
      <main>
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <img
              className="brand-seal"
              src={asset("baimai-logo.png")}
              alt="BaiMai Herbs and Wellness botanical logo"
              fetchPriority="high"
              width="108"
              height="108"
            />
            <p className="location">Koh Phangan • Hin Kong</p>
            <h1 id="page-title">BaiMai Herbs &amp; Wellness</h1>
            <p className="product-descriptor">
              Kratom • Functional Mushrooms • Electrolytes • Probiotics • Supplements • Microgreens
            </p>
          <p className="intro">Functional wellness products, local shop &amp; island-wide delivery for eligible products.</p>
            <div className="hero-actions" aria-label="Primary BaiMai actions">
              <TrackLink className="primary-action" href="#products" event="shop_products_click">
                Shop Products
              </TrackLink>
              <TrackLink className="secondary-action" href={links.delivery} event="delivery_click">
                Order Delivery
              </TrackLink>
              <TrackLink className="secondary-action" href={links.maps} event="directions_click">
                Get Directions
              </TrackLink>
            </div>
            <p className="utility-line">{businessHours.compact} • Hin Kong</p>
          </div>
          <figure className="hero-photo">
            <img
              src={asset("shop-front-view.jpg")}
              alt="Front view of BaiMai Herbs and Wellness shop in Hin Kong Koh Phangan"
              fetchPriority="high"
              width="960"
              height="1280"
            />
          </figure>
        </section>

        <section className="category-section" id="products" aria-labelledby="categories-title">
          <p className="section-kicker">Browse the range</p>
          <h2 id="categories-title">Explore Our Products</h2>
          <p className="section-intro">Browse by category and discover what is available at BaiMai.</p>
          <div className="category-carousel-grid">
            {availableCategories.map((category) => (
              <CategoryCarouselCard
                key={category.id}
                category={category}
                products={getProductsForCategory(category.id)}
              />
            ))}
          </div>
        </section>

        <section className="destination-section" aria-label="Visit and delivery options">
          <div className="destination-grid">
            {destinations.filter((destination) => !destination.hidden).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>

        <section className="wholesale-lead" aria-labelledby="wholesale-title">
          <div>
            <p className="section-kicker">Wholesale</p>
            <h2 id="wholesale-title">Own or manage a shop?</h2>
            <p>Ask about wholesale pricing for selected BaiMai products.</p>
          </div>
          <TrackLink className="primary-action" href="https://wholesale.baimaiherbs.com/" external event="wholesale_click">
            Wholesale Information
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </TrackLink>
        </section>

        <section className="secondary-area" id="contact" aria-label="BaiMai contact and social links">
          <div className="help-copy">
            <p className="prompt-kicker">Can’t find what you’re looking for?</p>
            <p>Chat with BaiMai and we’ll help you find the right product or delivery option.</p>
          </div>

          <nav className="social-links" aria-label="BaiMai social links">
            <TrackLink className="whatsapp-primary" href={links.whatsapp} event="contact_click" payload={{ channel: "WhatsApp" }} aria-label="Chat with BaiMai on WhatsApp">
              <WhatsappLogo size={19} weight="fill" aria-hidden="true" />
              <span>WhatsApp BaiMai</span>
            </TrackLink>
            {socialLinks.map(({ label, href, Icon, event }) => (
              <TrackLink key={label} href={href} event={event} payload={{ channel: label }} aria-label={label}>
                <Icon size={19} weight="regular" aria-hidden="true" />
                <span>{label}</span>
              </TrackLink>
            ))}
          </nav>

        </section>
      </main>

      <footer>
        <div>
          <strong>BaiMai Herbs &amp; Wellness</strong>
          <span>Koh Phangan, Thailand</span>
        </div>
        <div className="footer-links">
          <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={links.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={links.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </footer>

      <MobileActionBar />
    </div>
  );
}
