(async function () {
  "use strict";

  const CACHE_KEY = "session_location_cache";
  const BANNED_KEY = "is_ip_banned";

  const CACHE_TTL_MS = 5 * 60 * 1000;
  const BAN_TTL_MS = 30 * 60 * 1000;

  const bannedData = localStorage.getItem(BANNED_KEY);
  if (bannedData) {
    try {
      const banObject = JSON.parse(bannedData);
      const currentTime = Date.now();

      if (currentTime < banObject.expiry) {
        const blocker = document.createElement('div');
        blocker.setAttribute('role', 'dialog');
        blocker.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#f9f9f9;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;color:#333;';
        blocker.innerHTML = '<div style="text-align:center"><h1 style="font-size:48px;margin:0">403</h1><p style="font-size:20px;margin:8px 0 0">Acesso Negado</p><p style="color:#777">O seu acesso a este recurso foi temporariamente bloqueado.</p></div>';
        document.body.appendChild(blocker);
        return;
      } else {
        localStorage.removeItem(BANNED_KEY);
        console.log(
          "[Tracker] Banimento expirado (30 min). Tentando nova conexão."
        );
      }
    } catch (e) {
      localStorage.removeItem(BANNED_KEY);
    }
  }

  const apiEndpoints = [
    {
      url: "https://ipinfo.io/json",
      normalize: (data) => ({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        isp: data.org,
        src: "ipinfo.io",
      }),
    },
    {
      url: "https://ipwho.is/",
      normalize: (data) => ({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        isp: (data.connection && data.connection.isp) ? data.connection.isp : "N/A",
        src: "ipwho.is",
      }),
    },
  ];

  let locationData = null;

  const cachedData = sessionStorage.getItem(CACHE_KEY);
  if (cachedData) {
    try {
      const cacheObject = JSON.parse(cachedData);
      if (Date.now() < cacheObject.expiry) {
        locationData = cacheObject.data;
        console.log("[Tracker] Usando dados de IP do cache local.");
      } else {
        sessionStorage.removeItem(CACHE_KEY);
        console.log("[Tracker] Cache de IP expirado — removido.");
      }
    } catch (e) {
      sessionStorage.removeItem(CACHE_KEY);
    }
  }

  if (!locationData) {
    console.log("[Tracker] Consultando APIs de IP...");

    const fetchIP = async (api) => {
      const response = await fetch(api.url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      const normalized = api.normalize(data);
      if (!normalized.ip) throw new Error("IP inválido recebido");
      return normalized;
    };

    try {
      const promises = apiEndpoints.map(fetchIP);
      locationData = await Promise.any(promises);

      const cacheObject = {
        data: locationData,
        expiry: Date.now() + CACHE_TTL_MS,
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      locationData = {
        ip: "N/A",
        city: "N/A",
        region: "N/A",
        country: "N/A",
        isp: "N/A",
        src: "Falha em todas as fontes",
      };
      console.error("[Tracker] Falha em todas as consultas de IP.", error);
    }
  }

  const browserData = {
    uri: window.location.pathname,
    host: window.location.host || "N/A",
    hostname: window.location.hostname || "N/A",
    agent: navigator.userAgent || "N/A",
    lang: navigator.language || "N/A",
    res: `${window.screen.width}x${window.screen.height}`,
    ts: new Date().toISOString(),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const finalReport = { ...locationData, ...browserData };

  try {
    const response = await fetch("https://tracker.propresto.app/log-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalReport),
    });

    if (response.status === 403) {
      const banObject = {
        status: true,
        expiry: Date.now() + BAN_TTL_MS,
      };
      localStorage.setItem(BANNED_KEY, JSON.stringify(banObject));
      console.warn(
        "[Tracker] Banimento 403 recebido. Bloqueio temporário ativado."
      );

      const blocker = document.createElement('div');
        blocker.setAttribute('role', 'dialog');
        blocker.setAttribute('aria-modal', 'true');
        blocker.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#f9f9f9;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;color:#333;';
        blocker.innerHTML = '<div style="text-align:center"><h1 style="font-size:48px;margin:0">403</h1><p style="font-size:20px;margin:8px 0 0">Acesso Negado</p><p style="color:#777">O seu acesso a este recurso foi temporariamente bloqueado.</p></div>';
        document.body.appendChild(blocker);
        document.documentElement.style.overflow = 'hidden';
        return;
    }
  } catch (error) {
    console.warn("[Tracker] Erro ao enviar log:", error);
  }
})();