export const qrRegistry = {
  "flyer-general": {
    id: "flyer-general",
    campaign: "General BaiMai",
    placement: "Flyer",
    medium: "offline",
    creative: "General flyer",
    version: "v1",
    destination: "/",
    active: true,
    created: "2026-08-20",
  },
  "sticker-general": {
    id: "sticker-general",
    campaign: "General BaiMai",
    placement: "Sticker",
    medium: "offline",
    creative: "General sticker",
    version: "v1",
    destination: "/",
    active: true,
    created: "2026-08-20",
  },
  "sticker-kratom": {
    id: "sticker-kratom",
    campaign: "Kratom",
    placement: "Kratom sticker",
    medium: "offline",
    creative: "Kratom sticker",
    version: "v1",
    destination: "/products/kratom",
    active: true,
    created: "2026-09-02",
  },
  "accommodation-hotel": {
    id: "accommodation-hotel",
    campaign: "Accommodation Referral",
    placement: "Hotel or accommodation",
    medium: "referral",
    creative: "Accommodation card",
    version: "v1",
    destination: "/",
    active: true,
    created: "2026-09-02",
  },
  "taxi-referral": {
    id: "taxi-referral",
    campaign: "Taxi Referral",
    placement: "Taxi driver",
    medium: "referral",
    creative: "Taxi referral card",
    version: "v1",
    destination: "/",
    active: true,
    created: "2026-09-02",
  },
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

export function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return UTM_KEYS.reduce(
    (data, key) => {
      data[key] = params.get(key) || "";
      return data;
    },
    { landing_path: window.location.pathname || "/" },
  );
}

export function withAttribution(href) {
  if (!href.startsWith("/")) return href;

  const current = new URLSearchParams(window.location.search);
  const url = new URL(href, window.location.origin);

  UTM_KEYS.forEach((key) => {
    if (current.has(key) && !url.searchParams.has(key)) {
      url.searchParams.set(key, current.get(key));
    }
  });

  return `${url.pathname}${url.search}${url.hash}`;
}

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function buildQrDestination(record) {
  const url = new URL(record.destination, window.location.origin);
  const current = new URLSearchParams(window.location.search);
  const defaults = {
    utm_source: record.medium === "referral" ? slugify(record.placement.split(" ")[0]) : "qr",
    utm_medium: record.medium,
    utm_campaign: slugify(record.campaign),
    utm_content: record.id,
  };

  UTM_KEYS.forEach((key) => {
    if (current.has(key)) url.searchParams.set(key, current.get(key));
    else if (!url.searchParams.has(key)) url.searchParams.set(key, defaults[key]);
  });

  return `${url.pathname}${url.search}${url.hash}`;
}

export function resolveQrRedirect(pathname) {
  if (!pathname.startsWith("/go/")) return null;

  const qrId = pathname.replace("/go/", "").replace(/\/$/, "");
  const record = qrRegistry[qrId];

  if (!record || !record.active) return "/";
  return buildQrDestination(record);
}

export function trackEvent(name, payload = {}) {
  const detail = {
    event: name,
    timestamp: new Date().toISOString(),
    ...getAttribution(),
    ...payload,
  };

  window.__BAIMAI_EVENTS__ = window.__BAIMAI_EVENTS__ || [];
  window.__BAIMAI_EVENTS__.push(detail);
  window.dispatchEvent(new CustomEvent("baimai:analytics", { detail }));
}
