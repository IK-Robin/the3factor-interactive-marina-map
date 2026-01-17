 function init_interactive_map({
    mapData,
    mapId,
    tooltipElementId = "ikr_toltipMove",
    svgElementId = "ikr_svg",
    renderTooltipContent,
    tooltipLeft = 0,
    tooltipTop = 0,
    onLotHoverIn,
    onLotHoverOut
  }) {
    console.log(renderTooltipContent)
    console.log('hello')
    const ikr_svg = document.getElementById(svgElementId);
    // console.log(ikr_svg)
    const tooltipMove = document.getElementById(tooltipElementId);

    if (!tooltipMove) {
      console.warn("Tooltip element not found:", tooltipElementId);
      return;
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

/* ===========================
   MOBILE DETECTION
=========================== */
function isMobileDevice() {
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    "ontouchstart" in window
  );
}

/**
 * Smart tooltip positioning
 * @param {HTMLElement} el
 * @param {Event} ev
 * @param {number} pad
 * @param {boolean} centerValue
 */
function placeSmartInContainer(el, ev, pad = 8, centerValue = false) {
  el.style.position = "absolute";

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

  el.style.visibility = prevVis || "visible";
  el.style.display = prevDisp || "block";
}




    function isMobile() {
      return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }

    function handleShow(ev, ct, mapD) {
      // if (!mapD || !renderTooltipContent) return;
    

      // tooltipMove.innerHTML = renderTooltipContent(mapD);
      // tooltipMove.style.display = "block";
      // placeSmartInContainer(tooltipMove, ev, 12);
    }

    function handleHide(ct) {
      // tooltipMove.style.display = "none";
      // tooltipMove.innerHTML = "";
    }

    let currentlyHoveredElement = null; // tracks the element currently on top due to hover

/**
 * Bring SVG element to the very top (same trick as click)
 * @param {Element} el - The SVG element (path, rect, etc.)
 */
// function bringToTopOnHover(el) {
//   if (!el || !(el instanceof Element)) return;

//   // If something else is already hovered → restore it first
//   if (currentlyHoveredElement && currentlyHoveredElement !== el) {
//     restoreOriginalPosition(currentlyHoveredElement);
//   }

//   // Save where it was
//   el.originalNextSibling = el.nextSibling;

//   // Move to the end → draws on top of everything
//   el.parentNode.appendChild(el);

//   // Optional: add a class for styling (glow, thicker stroke, etc.)
//   el.classList.add("hover-top");

//   currentlyHoveredElement = el;
// }

/**
 * Restore SVG element to its exact original DOM position
 * @param {Element} el - The SVG element to restore
 */
function restoreOriginalPosition(el) {
  if (!el || !el.parentNode || !el.originalNextSibling) return;

  const savedNextSibling = el.originalNextSibling;

  if (savedNextSibling && savedNextSibling.parentNode) {
    el.parentNode.insertBefore(el, savedNextSibling);
  } else {
    // It was the last child
    el.parentNode.appendChild(el);
  }

  // Clean up
  delete el.originalNextSibling;
  el.classList.remove("hover-top");
  currentlyHoveredElement = null;
}

    function handleHideOnMobile(ct) {
      // could call handleHide(ct) if you want
    }

function rcostClick_func(ev, ct, mapD) {
  console.log(ev)
  if (!mapD || !mapD.id ) return;

   if (!mapD || !renderTooltipContent) return;
    

      tooltipMove.innerHTML = renderTooltipContent(mapD);
      tooltipMove.style.display = "block";
      placeSmartInContainer(tooltipMove, ev, 12,true);
  // console.log("Clicked lot:", mapD.id, "->", mapD.link);
console.log('hello')
  // --- sanitize input, prevents injection ---
  const unit = encodeURIComponent(mapD.id.trim());

  const pathname = window.location.pathname || '/';
  console.log('pathname',pathname)
  const basePath = pathname.replace(/\/[^/]*$/, '/');
  console.log('base path', basePath)
  let baseURL = window.location.origin;

      let finalURL = baseURL;
      
      if (basePath === "/all-nodes/"){
         finalURL = new URL(mapD.link, baseURL);
      } else{ 
            finalURL = new URL(mapD.link, baseURL + basePath);
      }
      finalURL.searchParams.set("unit", unit);
     
  
      // window.location.href = finalURL.href;
}



    // Init default colors if provided
    window.addEventListener("load", () => {
      mapId.forEach((id) => {
        const el = document.querySelector(`#${id}`);
        if (!el) return;
        const data = mapData.find((d) => d.id === id);
        if (data && data.mapColor) {
          el.style.fill = `#${data.mapColor}`;
        }
      });
    });

    // Bind events
    mapId.forEach((id) => {
      const el = document.querySelector(`#${id}`);
      if (!el) return;

      const mapD = mapData.find((d) => d.id === id);
      if (!mapD) return;

      if (isMobile()) {
        el.addEventListener(
          "touchstart",
          (ev) => {
            ev.preventDefault();
            if (typeof onLotHoverIn === "function") {
              onLotHoverIn(el, mapD, ev);
            }
            handleShow(ev, el, mapD);
            rcostClick_func(ev, el, mapD);
          },
          { passive: false }
        );

        el.addEventListener("touchend", (ev) => {
          if (typeof onLotHoverOut === "function") {
           setTimeout(() => {
             onLotHoverOut(el, mapD, ev);
           }, 500);
          }
          handleHideOnMobile(el);
        });

        el.addEventListener("click", (ev) => {
          handleShow(ev, el, mapD);
        });
      } else {
        el.addEventListener("mouseenter", (ev) => {
          if (typeof onLotHoverIn === "function") {
            onLotHoverIn(el, mapD, ev);
          }
          // bringToTopOnHover(el);
          // handleShow(ev, el, mapD);
        });

        el.addEventListener("mousemove", (ev) => {
          // handleShow(ev, el, mapD);
        });

        el.addEventListener("mouseleave", (ev) => {
          if (typeof onLotHoverOut === "function") {
            onLotHoverOut(el, mapD, ev);
          }
          //  handleHide(el);
          restoreOriginalPosition(el);
        });

        el.addEventListener("click", (ev) => {
          rcostClick_func(ev, el, mapD);
        });
      }
    });

    // Hide tooltip when clicking outside paths
    window.addEventListener("click", (ev) => {
      if (ev.target && ev.target.tagName.toLowerCase() !== "path") {
        // tooltipMove.style.display = "none";
      }
    });
  }
// console.log(hello)