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
      const currentTime = new Date().getTime();

      if (currentTime < banObject.expiry) {
        document.documentElement.innerHTML = `
                <head>
                  <title>Acesso Negado</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0;">
                  <div style="font-family: Arial, sans-serif; text-align: center; padding-top: 20vh; color: #333; height: 100vh; background: #f9f9f9;">
                    <h1 style="font-size: 48px; margin: 0;">403</h1>
                    <p style="font-size: 20px;">Acesso Negado</p>
                    <p style="color: #777;">O seu acesso a este recurso foi temporariamente bloqueado.</p>
                  </div>
                </body>
              `;
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
        isp: data.connection.isp,
        src: "ipwho.is",
      }),
    },
  ];

  let locationData = null;

  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    try {
      const cacheObject = JSON.parse(cachedData);
      if (new Date().getTime() < cacheObject.expiry) {
        locationData = cacheObject.data;
        console.log("[Tracker] Usando dados de IP do cache local.");
      }
    } catch (e) {
      localStorage.removeItem(CACHE_KEY);
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
        expiry: new Date().getTime() + CACHE_TTL_MS,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
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
        expiry: new Date().getTime() + BAN_TTL_MS,
      };
      localStorage.setItem(BANNED_KEY, JSON.stringify(banObject));
      console.warn(
        "[Tracker] Banimento 403 recebido. Bloqueio temporário ativado."
      );

      document.documentElement.innerHTML = `
        <head>
          <title>Acesso Negado</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0;">
          <div style="font-family: Arial, sans-serif; text-align: center; padding-top: 20vh; color: #333; height: 100vh; background: #f9f9f9;">
            <h1 style="font-size: 48px; margin: 0;">403</h1>
            <p style="font-size: 20px;">Acesso Negado</p>
            <p style="color: #777;">O seu acesso a este recurso foi bloqueado.</p>
          </div>
        </body>
      `;
      return;
    }
  } catch (error) {
  }

  const labels = {
    ip: "Endereço IP",
    city: "Cidade",
    region: "Estado/Região",
    country: "País",
    isp: "Provedor (ISP)",
    src: "Fonte dos Dados",
    uri: "Página Atual",
    host: "Host (URL e Porta)",
    hostname: "Nome do Host (Domínio)",
    agent: "Navegador (User Agent)",
    lang: "Idioma do Navegador",
    res: "Resolução da Tela",
    ts: "Timestamp (UTC)",
    tz: "Fuso Horário Local",
  };

  const modalId = "session-info-modal";
  const overlayId = "session-info-overlay";

  function hideModal() {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById(overlayId);
    if (modal) document.body.removeChild(modal);
    if (overlay) document.body.removeChild(overlay);
  }

  function showModal() {
    const overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); z-index: 9998;
            -webkit-tap-highlight-color: transparent;
        `;
    overlay.onclick = hideModal;
    document.body.appendChild(overlay);

    const modal = document.createElement("div");
    modal.id = modalId;
    modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #fff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999; max-width: 90%; width: 500px; max-height: 80vh;
            display: flex; flex-direction: column; font-family: Arial, sans-serif;
            box-sizing: border-box;
        `;

    const header = document.createElement("div");
    header.style.cssText = `
            padding: 15px 20px; border-bottom: 1px solid #eee;
            font-size: 18px; font-weight: bold; color: #333;
            box-sizing: border-box;
        `;
    header.innerText = "Informações da Sessão";
    modal.appendChild(header);

    const content = document.createElement("div");
    content.style.cssText =
      "padding: 20px; overflow-y: auto; box-sizing: border-box;";

    let contentHTML = "";
    for (const [key, label] of Object.entries(labels)) {
      const value = finalReport[key] || "N/A";
      contentHTML += `
                <div style="margin: 0 0 10px 0; font-size: 14px; word-break: break-all; line-height: 1.4;">
                    <strong style="color: #111; display: block;">${label}:</strong>
                    <span style="color: #555;">${value}</span>
                </div>
            `;
    }
    content.innerHTML = contentHTML;
    modal.appendChild(content);

    const footer = document.createElement("div");
    footer.style.cssText = `
            padding: 15px 20px; border-top: 1px solid #eee;
            text-align: right; background: #f9f9f9; border-radius: 0 0 8px 8px;
            box-sizing: border-box;
        `;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Fechar";
    closeButton.style.cssText = `
            padding: 8px 15px; background: #007bff; color: white;
            border: none; border-radius: 5px; cursor: pointer; font-size: 14px;
            -webkit-tap-highlight-color: transparent;
        `;
    closeButton.onmouseover = () => (closeButton.style.background = "#0056b3");
    closeButton.onmouseout = () => (closeButton.style.background = "#007bff");
    closeButton.onclick = hideModal;

    footer.appendChild(closeButton);
    modal.appendChild(footer);

    document.body.appendChild(modal);
  }

  function createFAB() {
    const fab = document.createElement("button");
    fab.id = "session-info-fab";
    fab.innerHTML = '<i class="fas fa-lock"></i>';

    fab.style.cssText = `
            position: fixed; bottom: 15px; left: 15px;
            width: 45px; height: 45px; border-radius: 50%;
            background: #ffc107; /* Amarelo */
            color: #000; /* Cor do ícone/texto forçada para PRETO */
            border: none;
            font-size: 20px; 
            line-height: 45px; 
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer; z-index: 9997;
            transition: transform 0.2s ease-out;
            -webkit-tap-highlight-color: transparent;
        `;

    fab.onmouseover = () => {
      fab.style.transform = "scale(1.1)";
      fab.style.background = "#e0a800";
    };
    fab.onmouseout = () => {
      fab.style.transform = "scale(1.0)";
      fab.style.background = "#ffc107";
    };

    fab.onclick = showModal;

    document.body.appendChild(fab);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFAB);
  } else {
    createFAB();
  }
})();