/* ================================
   CONFIG
================================ */
const CSV_URL = "./Copy of summer boat well customer organized by well number 1-16-25 (version 1) (1).csv"; // local CSV file
const tooltip = document.getElementById("ikr_toltipMove");

/* ================================
   REAL CSV PARSER
================================ */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current || row.length) {
        row.push(current);
        rows.push(row);
        row = [];
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

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
   FETCH + BUILD DATA MAP
================================ */
fetch(CSV_URL)
  .then(res => res.text())
  .then(csv => {
    const rows = parseCSV(csv);

    const headers = rows.shift().map(h =>
      h.replace(/^"|"$/g, "").trim()
    );

    const wellIndex = headers.findIndex(h =>
      h.toLowerCase().startsWith("well")
    );
    const nameIndex = headers.findIndex(h =>
      h.toLowerCase().startsWith("name")
    );
    const boatIndex = headers.findIndex(h =>
      h.toLowerCase().startsWith("boat type")
    );
    const wallAvailiablity = headers.findIndex(h =>
      h.toLowerCase().startsWith("reserved or available")
    );

    if (wellIndex === -1) {
      console.error("❌ Well column not found");
      return;
    }

    const wellDataMap = {};
    let currentWell = null;

    rows.forEach(row => {
      const rawWell = row[wellIndex];

      // carry forward grouped wells
      if (rawWell && rawWell.trim()) {
        currentWell = rawWell.trim();
      }

      if (!currentWell) return;

      const svgKey = normalizeWellForSvg(currentWell);

      // only set once per well
      if (!wellDataMap[svgKey]) {
        wellDataMap[svgKey] = {
          well: currentWell,
          name: row[nameIndex]?.trim() || "N/A",
          boatType: row[boatIndex]?.trim() || "N/A",
          availablity: row[wallAvailiablity]?.trim() || "N/A"
        };
      }
    });

    attachSvgEvents(wellDataMap);
  })
  .catch(err => console.error("❌ CSV load error:", err));

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

      tooltip.innerHTML = `
        <strong>Well ${d.well}</strong><br>
        ${d.name}<br>
        Boat: ${d.boatType}
      `;

      tooltip.style.display = "block";
      tooltip.style.left = e.pageX + 12 + "px";
      tooltip.style.top = e.pageY + 12 + "px";
    });

    el.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
    
  const svgtextId = `boat_wall_${key.toLocaleLowerCase()}`;

  const svgtextEl = document.getElementById(svgtextId);

  if(!svgtextEl) return;
 const check_availibality = dataMap[key];

    if (svgtextEl.id == `boat_wall_${check_availibality.well.toLocaleLowerCase()}` && check_availibality.availablity.toLowerCase() === "available") { 
       
    }else if (check_availibality.availablity.toLowerCase() === "reserved") {
        svgtextEl.style.fill = "red";
    }

  });

}

const ikrsvg = document.getElementById("ikr_svg");
ikrZoom(ikrsvg);