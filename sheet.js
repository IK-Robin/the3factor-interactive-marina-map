/* ================================
   CONFIG
================================ */
const API_KEY = "AIzaSyBNx7Q5oU9TV3T3PC3fy_UkNl_3U-QBHgk";
const SPREADSHEET_ID = "1lXgDUareGWc-avwRQU_jIuI3oxOnIgHCiV3sT7zPXMA";
const SHEET_NAME = "Sheet1";

const tooltipMove = document.getElementById("ikr_toltipMove");
function isMobileDevice() {
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    "ontouchstart" in window
  );
}
let tooltipLeft = 0;
let tooltipTop = 0;

/* ================================
   🌍 GLOBAL DATA MAP
================================ */
let wellDataMap = {};

/* ================================
   NORMALIZE WELL → SVG ID
================================ */
function normalizeWellForSvg(well) {
  return well
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_");
}

/* ================================
   FETCH + BUILD DATA MAP (API)
================================ */
async function loadWellData() {
  try {
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/` +
      `${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`;

    const response = await fetch(url);
    const json = await response.json();

    if (json.error) {
      console.error("❌ Sheets API error:", json.error);
      return;
    }

    const values = json.values;
    if (!values || values.length < 2) {
      console.warn("⚠️ No sheet data found");
      return;
    }

    // headers (row 1)
    const headers = values[0].map(h => h.trim().toLowerCase());

    const wellIndex = headers.findIndex(h => h.startsWith("well"));
    const nameIndex = headers.findIndex(h => h.startsWith("name"));
    const boatIndex = headers.findIndex(h => h.startsWith("boat type"));
    const available = headers.findIndex(h => h.startsWith("available"));

    const reserved_but_unpaid = headers.findIndex(h => h.startsWith("reserved but unpaid"));
    const reserved_and_paid = headers.findIndex(h => h.startsWith("reserved and paid"));
    const price = headers.findIndex(h => h.startsWith("new summer well price:"));
    const MaxDock = headers.findIndex(h => h.startsWith("max dock"));
    const Water = headers.findIndex(h => h.startsWith("water"));
    const Electricity = headers.findIndex(h => h.startsWith("electrical"));


    console.log(reserved_but_unpaid)






    if (wellIndex === -1) {
      console.error("❌ Well column not found");
      return;
    }

    let currentWell = null;

    // rows
    values.slice(1).forEach(row => {
      const rawWell = row[wellIndex];

      // carry-forward grouped wells
      if (rawWell && rawWell.trim()) {
        currentWell = rawWell.trim();
      }

      if (!currentWell) return;

      const svgKey = normalizeWellForSvg(currentWell);

      // only first row per well
      if (!wellDataMap[svgKey]) {
        wellDataMap[svgKey] = {
          well: currentWell,
          name: "N/A",
          boatType: "N/A",
          available: "N/A",
          reservedButUnpaid: "N/A",
          reservedAndPaid: "N/A",
          price: "N/A",
          maxDock: "N/A",
          water: "N/A",
          electricity: "N/A"
        };
      }

      const d = wellDataMap[svgKey];

      // overwrite ONLY if value exists in this row
      if (row[nameIndex]) d.name = row[nameIndex];
      if (row[boatIndex]) d.boatType = row[boatIndex];
      if (row[available]) d.available = row[available];
      if (row[reserved_but_unpaid]) d.reservedButUnpaid = row[reserved_but_unpaid];
      if (row[reserved_and_paid]) d.reservedAndPaid = row[reserved_and_paid];
      if (row[price]) d.price = row[price];
      if (row[MaxDock]) d.maxDock = row[MaxDock];
      if (row[Water]) d.water = row[Water];
      if (row[Electricity]) d.electricity = row[Electricity];

    });

    console.log("✅ wellDataMap ready:", wellDataMap);

    attachSvgEvents(wellDataMap);

  } catch (err) {
    console.error("❌ Fetch error:", err);
  }
}

/* ================================
   INTERACTIVE SVG TOOLTIP
================================ */
function attachSvgEvents(dataMap) {
  Object.keys(dataMap).forEach(key => {
    const el =
      document.getElementById(`interactive_${key}`) ||
      document.getElementById(key);

    if (!el) return;

    el.addEventListener("mousemove", e => {
      const d = dataMap[key];
      let status = "Available";
      // console.log(d.reservedButUnpaid.toLowerCase())
      if (d.available.toLowerCase() === "available") {
        status = "Available";
        // console.log(status)
      } else if (d.reservedButUnpaid.toLowerCase() === "reserved but unpaid") {
        status = "Reserved but unpaid";
        // console.log(status)
      } else if (d.reservedAndPaid.toLowerCase() === "reserved and paid") {
        status = "Reserved and paid";
        // console.log(status)
      }


      tooltipMove.innerHTML = `
  <div class="tt-header">Well ${d.well}</div>

  <div class="tt-row">
    <span>Water</span>
    <strong>${d.water}</strong>
  </div>

  <div class="tt-row">
    <span>Electricity</span>
    <strong>${d.electricity}</strong>
  </div>

  <div class="tt-row">
    <span>Max Dock</span>
    <strong>${d.maxDock}</strong>
  </div>

  <div class="tt-row">
    <span>Price</span>
    <strong>${d.price}</strong>
  </div>

  <div class="tt-status status-${status.replace(/\s+/g, '-').toLowerCase()}">
    ${status}
  </div>
`;



 tooltipMove.style.display = "block";
      placeSmartInContainer(tooltipMove, e, 12,false);


  el.classList.remove("available-hover", "unpaid-hover", "paid-hover");

  if (d.reservedAndPaid?.toLowerCase() === "reserved and paid") {
    el.classList.add("paid-hover");
  } 
  else if (d.reservedButUnpaid?.toLowerCase() === "reserved but unpaid") {
    el.classList.add("unpaid-hover");
  } 
  else {
    el.classList.add("available-hover");
  }



    });

    el.addEventListener("mouseleave", () => {
      tooltipMove.style.display = "none";
      el.classList.remove("available-hover", "unpaid-hover", "paid-hover");
    });













    // availability coloring
    const svgtextId = `interactive_${key}`;
    const svgtextEl = document.getElementById(svgtextId);

    if (!svgtextEl) return;
// console.log(dataMap[key].available)
    if (dataMap[key].available.toLowerCase() === "available") {
      svgtextEl.style.fill = "#2ECC71";
      // console.log(dataMap[key].available)
    } else if (dataMap[key].reservedButUnpaid.toLowerCase() === "reserved but unpaid") {
      svgtextEl.style.fill = "#F39C12";
    }
    else if (dataMap[key].reservedAndPaid.toLowerCase() === "reserved and paid") {
      svgtextEl.style.fill = "#E74C3C";
    }

  });
}

/* ================================
   INIT
================================ */
loadWellData();

const ikrsvg = document.getElementById("ikr_svg");
ikrZoom(ikrsvg);

/**
 * Smart tooltip positioning
 * @param {HTMLElement} el
 * @param {Event} ev
 * @param {number} pad
 * @param {boolean} centerValue
 */
function placeSmartInContainer(el, ev, pad = 8, centerValue = false) {
  el.style.position = "absolute";
// console.log(el)
  const parent = el.offsetParent || document.body;
  const rect = parent.getBoundingClientRect();

  const cs = getComputedStyle(parent);
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padT = parseFloat(cs.paddingTop) || 0;
  const padR = parseFloat(cs.paddingRight) || 0;
  const padB = parseFloat(cs.paddingBottom) || 0;

  const prevDisp = el.style.display;
  const prevVis = el.style.visibility;
  el.style.visibility = "hidden";
  el.style.display = "block";

  const w = el.offsetWidth;
  const h = el.offsetHeight;

  const contentW = rect.width - padL - padR;
  const contentH = rect.height - padT - padB;

  let left, top;

  /* ===========================
     MOBILE → CENTER SCREEN
  ============================ */
  if (isMobileDevice()) {
    left = (contentW - w) / 2;
    top = (contentH - h) / 2;
  }

  /* ===========================
     DESKTOP CENTER ON CLICK
  ============================ */
  else if (centerValue === true) {
    const pt = getClientPoint(ev);
    const relX = pt.x - rect.left - padL;
    const relY = pt.y - rect.top - padT;

    left = relX - w / 2;
    top = relY - h / 2;

    left = Math.max(0, Math.min(left, contentW - w));
    top = Math.max(0, Math.min(top, contentH - h));
  }

  /* ===========================
     DESKTOP SMART POSITIONING
  ============================ */
  else {
    const pt = getClientPoint(ev);
    const relX = pt.x - rect.left - padL;
    const relY = pt.y - rect.top - padT;

    left = relX + pad;
    top = relY + pad;

    if (left + w > contentW) left = relX - w - pad;
    left = Math.max(0, Math.min(left, contentW - w));

    if (top + h > contentH) top = relY - h - pad;
    top = Math.max(0, Math.min(top, contentH - h));
  }

  el.style.left = left + padL + tooltipLeft + "px";
  el.style.top = top + padT + tooltipTop + "px";
console.log(left + padL);
  el.style.visibility = prevVis || "visible";
  el.style.display = prevDisp || "block";
}
// ====== Utilities ======
function getClientPoint(ev) {
  if (ev.touches && ev.touches[0]) {
    return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
  }
  if (ev.changedTouches && ev.changedTouches[0]) {
    return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY };
  }
  return { x: ev.clientX, y: ev.clientY };
}