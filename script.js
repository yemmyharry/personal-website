(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  function updateThemeLabel() {
    const label = root.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.title = label;
  }
  updateThemeLabel();
  themeToggle.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("yh-theme", root.dataset.theme); } catch (_) {}
    updateThemeLabel();
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  function closeNav() {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  document.querySelectorAll('.nav a[href^="#"]').forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav")) closeNav();
  });
  window.matchMedia("(min-width: 851px)").addEventListener("change", closeNav);

  const systemData = {
    payments: {
      entry: "Checkout", core: "Go payment service", leftLabel: "STATE", left: "Database",
      rightLabel: "SETTLEMENT", right: "Payment rails",
      description: "A successful charge is only the beginning. Validation, state changes, and repeat events all need deliberate handling."
    },
    realtime: {
      entry: "Client connection", core: "Go WebSocket service", leftLabel: "STATE", left: "Inventory locks",
      rightLabel: "DELIVERY", right: "Live updates",
      description: "Keep people in sync while state changes. Ticket availability, connection lifetimes, and updates belong to the same story."
    },
    media: {
      entry: "Media upload", core: "Processing pipeline", leftLabel: "TRANSFORM", left: "FFmpeg",
      rightLabel: "DELIVERY", right: "Asset storage",
      description: "An upload is a workflow. Validate the asset, transform it into useful formats, and prepare it for delivery."
    }
  };
  const tabs = Array.from(document.querySelectorAll("[data-system]"));
  function selectSystem(tab, focus) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    const data = systemData[tab.dataset.system];
    const fields = { nodeEntry: "entry", nodeCore: "core", nodeLeftLabel: "leftLabel", nodeLeft: "left", nodeRightLabel: "rightLabel", nodeRight: "right", systemDescription: "description" };
    Object.entries(fields).forEach(([id, key]) => { document.getElementById(id).textContent = data[key]; });
    document.getElementById("system-panel").setAttribute("aria-labelledby", tab.id);
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectSystem(tab, false));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectSystem(tabs[next], true);
      }
    });
  });

  const cases = {
    clooza: {
      eyebrow: "CLOOZA / PROFESSIONAL WORK",
      title: "Connecting the moving parts of commerce.",
      intro: "Full-stack and backend engineering across commerce, ticketing, media, and payment workflows.",
      sections: [
        { title: "The problem", paragraphs: ["A commerce platform brings together systems with different rules: payment providers, subscriptions, inventory, media, and customer communication. They need to work together without losing the details that make each one reliable."] },
        { title: "My role", paragraphs: ["I work across Go backend services and React product interfaces, connecting business requirements to implementation and maintaining the workflows behind the user experience."] },
        { title: "Selected engineering work", list: ["Payment integrations: multi-provider checkout and webhook handling across payment rails.", "Subscriptions: billing periods, plan and pricing validation, admin discount codes, and renewal rules.", "Entitlements: messaging credits that scale with the number of subscription months.", "Shipping: currency validation for Shipbubble top-ups, restricting the workflow to Naira.", "Real-time and media: WebSocket services and FFmpeg-based asset processing."] },
        { title: "The decisions that matter", paragraphs: ["Validate the plan and price on the backend. Apply billing-period and promotional discounts consistently. Treat a repeat payment event deliberately. Keep provider-specific constraints at the integration boundary.", "These are the details that turn a feature request into a workflow the rest of the product can depend on."] }
      ],
      status: "Recent subscription and shipping changes were completed as feature work. Production rollout is separate from implementation.",
      links: [{ label: "Visit Clooza", href: "https://clooza.com" }]
    },
    ipile: {
      eyebrow: "IPILẸ WALLET / FOUNDER & LEAD ENGINEER",
      title: "Making Bitcoin fit into everyday life.",
      intro: "A founder project bringing Bitcoin and Lightning payments to familiar web and conversational experiences.",
      sections: [
        { title: "The problem", paragraphs: ["A payment tool has to make sense to the person using it. Ipilẹ explores how Bitcoin payments can fit into familiar interactions while the backend handles the underlying payment workflows."] },
        { title: "My role", paragraphs: ["Founder and lead engineer, working from product direction through Go backend services, PostgreSQL ledger workflows, React interfaces, and Lightning integrations."] },
        { title: "Engineering focus", list: ["Connect web and chat experiences around coherent payment flows.", "Handle Lightning invoices, Lightning Addresses, and LNURL interactions.", "Model ledger state and payment lifecycle changes deliberately.", "Build commerce-oriented workflows and localised interfaces."] },
        { title: "What makes it challenging", paragraphs: ["Different interfaces still need to represent the same payment state. A conversational request, a pending invoice, and a completed transfer have to communicate clearly to users while remaining consistent in the backend.", "The work combines product design, systems thinking, and payment integration rather than stopping at one layer of the application."] }
      ],
      status: "Custody models and resilient transport are areas of ongoing exploration. They are not claims of a completed non-custodial release or an independent security audit.",
      links: [{ label: "Visit Ipilẹ", href: "https://ipile.xyz" }]
    },
    monitor: {
      eyebrow: "BITCOIN NETWORK MONITOR / OPEN-SOURCE BACKEND WORK",
      title: "Turning node responses into useful insight.",
      intro: "Go backend contributions to a Bitcoin monitoring tool, with public work dating to 2024.",
      sections: [
        { title: "The problem", paragraphs: ["Low-level node data is only useful when an API returns the right information and interprets it correctly. A monitoring service needs more than a thin wrapper around RPC calls."] },
        { title: "My contributions", list: ["Node RPC integration and block and transaction endpoints.", "Address lookups and network statistics.", "Corrections to network hashrate calculations.", "Fixes to the retrieval of recent transactions."] },
        { title: "What the work taught me", paragraphs: ["Accuracy at the API boundary depends on understanding the Bitcoin structures underneath it. Working on transaction retrieval and hashrate calculations meant tracing the source data and checking what each response actually represented."] }
      ],
      links: [{ label: "Explore the repository", href: "https://github.com/yemmyharry/btc-network-monitor" }, { label: "Transaction retrieval PR", href: "https://github.com/yemmyharry/btc-network-monitor/pull/11" }]
    },
    kurier: {
      eyebrow: "KURIER / IN DEVELOPMENT",
      title: "When connectivity cannot be taken for granted.",
      intro: "An independent open-source transport SDK exploring resilient delivery of Bitcoin transactions and payment messages.",
      sections: [
        { title: "The direction", paragraphs: ["Compress and route payment-related payloads across constrained connections. The design explores how smaller, transportable messages could serve as a fallback when normal internet connectivity is unavailable."] },
        { title: "Areas under exploration", list: ["Payload encoding, compression, and message chunking.", "Transport adapters for low-bandwidth channels such as SMS and mesh networks.", "Delivery, reassembly, and integrity checks.", "A separate SDK that applications such as Ipilẹ could integrate."] },
        { title: "Why separate it from the wallet?", paragraphs: ["Transport resilience is a reusable problem. Keeping it independent makes the boundary clearer: applications own their payment experience, while a transport layer focuses on moving payloads across available channels."] }
      ],
      status: "Development direction, not a released guarantee. Channel support, offline behaviour, and integrations need to be implemented and validated before being presented as available."
    }
  };
  const dialog = document.getElementById("caseDialog");
  let dialogTrigger = null;
  function createElement(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function createIcon(name) {
    const namespace = "http://www.w3.org/2000/svg";
    const icon = document.createElementNS(namespace, "svg");
    icon.setAttribute("class", "icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("width", "16");
    icon.setAttribute("height", "16");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    const reference = document.createElementNS(namespace, "use");
    reference.setAttribute("href", "#icon-" + name);
    icon.append(reference);
    return icon;
  }
  function openCase(key, trigger) {
    const study = cases[key];
    if (!study) return;
    dialogTrigger = trigger;
    document.getElementById("caseEyebrow").textContent = study.eyebrow;
    document.getElementById("caseTitle").textContent = study.title;
    document.getElementById("caseIntro").textContent = study.intro;
    const content = document.getElementById("caseContent");
    content.replaceChildren();
    study.sections.forEach((section) => {
      const block = createElement("section", undefined, "case-section");
      block.append(createElement("h3", section.title));
      (section.paragraphs || []).forEach((text) => block.append(createElement("p", text)));
      if (section.list) {
        const list = createElement("ul");
        section.list.forEach((text) => list.append(createElement("li", text)));
        block.append(list);
      }
      content.append(block);
    });
    if (study.status) content.append(createElement("p", study.status, "case-status"));
    const links = document.getElementById("caseLinks");
    links.replaceChildren();
    (study.links || []).forEach((link) => {
      const anchor = createElement("a", link.label, "text-link");
      anchor.append(createIcon("arrow-up-right"));
      anchor.href = link.href;
      anchor.target = "_blank";
      anchor.rel = "noopener";
      links.append(anchor);
    });
    root.classList.add("has-dialog");
    document.body.classList.add("dialog-open");
    dialog.showModal();
    dialog.scrollTop = 0;
    document.getElementById("closeCase").focus({ preventScroll: true });
  }
  document.querySelectorAll("[data-case]").forEach((button) => button.addEventListener("click", () => openCase(button.dataset.case, button)));
  document.getElementById("closeCase").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    root.classList.remove("has-dialog");
    document.body.classList.remove("dialog-open");
    if (dialogTrigger) dialogTrigger.focus({ preventScroll: true });
  });
  document.getElementById("caseContact").addEventListener("click", () => {
    dialog.close();
    document.getElementById("contact").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    document.getElementById("contactName").focus({ preventScroll: true });
  });

  const log = document.getElementById("eventLog");
  let eventCount = 0;
  let paymentCount = 0;
  let duplicateCount = 0;
  let paymentSequence = 0;
  let lastEvent = null;
  let currentPayment = null;
  let pendingDelivery = null;
  let startTime = Date.now();
  const processed = new Set();
  const replay = document.getElementById("replayEvent");
  const retry = document.getElementById("retryPayment");
  const scenarioButtons = ["sendEvent", "delayEvent", "outOfOrderEvent", "failEvent"].map((id) => document.getElementById(id));
  function logEvent(level, text, warning = false) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const time = String(Math.floor(elapsed / 60)).padStart(2, "0") + ":" + String(elapsed % 60).padStart(2, "0");
    const line = createElement("div", undefined, "log-line");
    line.append(createElement("span", time, "log-time"), createElement("span", level, "log-info" + (warning ? " duplicate" : "")), createElement("span", text));
    log.append(line);
    while (log.children.length > 35) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function showOutcome(state, text) {
    document.getElementById("consoleState").textContent = state;
    document.getElementById("paymentState").textContent = currentPayment ? currentPayment.status.toUpperCase() : "NONE";
    document.getElementById("scenarioOutcome").textContent = text;
  }
  function updateControls() {
    scenarioButtons.forEach((button) => { button.disabled = pendingDelivery !== null; });
    replay.disabled = !lastEvent || pendingDelivery !== null;
    retry.disabled = !currentPayment || currentPayment.status !== "failed" || pendingDelivery !== null;
    document.getElementById("eventCount").textContent = eventCount;
    document.getElementById("paymentCount").textContent = paymentCount;
    document.getElementById("duplicateCount").textContent = duplicateCount;
  }
  function beginPayment() {
    currentPayment = { id: "pay_demo_" + String(++paymentSequence).padStart(3, "0"), status: "pending", version: 0, recorded: false };
    lastEvent = null;
    logEvent("CREATE", currentPayment.id + " · payment pending");
    updateControls();
  }
  function sampleEvent(status, version) {
    return { id: "evt_" + currentPayment.id + "_" + version, paymentId: currentPayment.id, status, version };
  }
  function processEvent(event) {
    lastEvent = event;
    eventCount++;
    logEvent("RECEIVE", event.id + " · payment." + event.status);
    if (processed.has(event.id)) {
      duplicateCount++;
      logEvent("SKIP", "Event ID already processed. No payment state or balance change.", true);
      showOutcome("DUPLICATE SKIPPED", "The repeated event was ignored. The payment and recorded total stay unchanged.");
    } else {
      processed.add(event.id);
      // This sketch uses provider-supplied versions to recognise older events.
      if (event.version <= currentPayment.version || currentPayment.status === "succeeded") {
        logEvent("STALE", "Older event ignored. A confirmed payment cannot move back to pending or failed.", true);
        showOutcome("STALE EVENT IGNORED", "Success arrived first. The older pending event cannot undo it or record another payment.");
      } else {
        currentPayment.version = event.version;
        currentPayment.status = event.status;
        if (event.status === "succeeded") {
          if (!currentPayment.recorded) {
            currentPayment.recorded = true;
            paymentCount++;
          }
          logEvent("COMMIT", event.paymentId + " · confirmed; one payment recorded.");
          showOutcome("PAYMENT RECORDED", "Confirmation received. This payment is recorded once, even if its event is replayed.");
        } else if (event.status === "failed") {
          logEvent("FAIL", "Attempt declined. No payment recorded; a new attempt can be made.", true);
          showOutcome("PAYMENT FAILED", "The attempt failed and no payment was recorded. Try a new attempt with “Retry failed payment”.");
        }
      }
    }
    updateControls();
  }
  document.getElementById("sendEvent").addEventListener("click", () => {
    beginPayment();
    processEvent(sampleEvent("succeeded", 1));
  });
  document.getElementById("delayEvent").addEventListener("click", () => {
    beginPayment();
    logEvent("WAIT", "Confirmation is delayed for 3 seconds. Keep pending; do not assume success or failure.", true);
    showOutcome("AWAITING WEBHOOK", "Waiting for confirmation. A slow webhook leaves this payment pending and the recorded total unchanged.");
    const event = sampleEvent("succeeded", 1);
    pendingDelivery = setTimeout(() => {
      pendingDelivery = null;
      processEvent(event);
      showOutcome("PAYMENT RECORDED", "The delayed webhook arrived. The pending payment is now confirmed and recorded once.");
    }, 3000);
    updateControls();
  });
  document.getElementById("outOfOrderEvent").addEventListener("click", () => {
    beginPayment();
    logEvent("ORDER", "Delivering success (version 2) before pending (version 1).");
    processEvent(sampleEvent("succeeded", 2));
    processEvent(sampleEvent("pending", 1));
  });
  document.getElementById("failEvent").addEventListener("click", () => {
    beginPayment();
    processEvent(sampleEvent("failed", 1));
  });
  retry.addEventListener("click", () => {
    if (!currentPayment || currentPayment.status !== "failed") return;
    logEvent("RETRY", "Starting a new attempt for " + currentPayment.id + ". This sample attempt succeeds.");
    processEvent(sampleEvent("succeeded", currentPayment.version + 1));
    showOutcome("RETRY SUCCEEDED", "The new attempt succeeded. The earlier failed attempt recorded nothing; this payment is credited once.");
  });
  replay.addEventListener("click", () => { if (lastEvent) processEvent(lastEvent); });
  document.getElementById("resetDemo").addEventListener("click", () => {
    clearTimeout(pendingDelivery);
    pendingDelivery = null;
    eventCount = paymentCount = duplicateCount = paymentSequence = 0;
    lastEvent = currentPayment = null;
    processed.clear();
    startTime = Date.now();
    log.replaceChildren();
    logEvent("READY", "Waiting for a sample event…");
    showOutcome("IDLE", "Choose a scenario to see how the payment is handled.");
    updateControls();
  });

  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");
  const isLocalPreview = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(location.hostname) || location.protocol === "file:";
  if (isLocalPreview) contactForm.querySelector(".form-note").textContent = "Local preview: you can test this form. Messages will not be sent.";
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    contactStatus.hidden = false;
    contactStatus.className = "form-status";
    if (isLocalPreview) {
      contactStatus.textContent = "Preview complete. Your message has not been sent.";
      return;
    }
    const button = contactForm.querySelector("button[type=submit]");
    const originalContent = Array.from(button.childNodes);
    button.disabled = true;
    button.textContent = "Sending…";
    contactStatus.textContent = "";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(contactForm.action, { method: "POST", body: new FormData(contactForm), headers: { Accept: "application/json" }, signal: controller.signal });
      if (!response.ok) throw new Error("Unable to send");
      contactForm.reset();
      contactStatus.textContent = "Thanks for reaching out. Your message has been sent.";
    } catch (_) {
      contactStatus.classList.add("is-error");
      contactStatus.textContent = "Your message could not be sent. Please try again or contact me on LinkedIn.";
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.replaceChildren(...originalContent);
    }
  });
})();
