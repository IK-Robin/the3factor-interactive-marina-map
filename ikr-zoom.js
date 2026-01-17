function ikrZoom(ikrsvg) {
  let mouseX;
  let mouseY;
  let mouseTX;
  let mouseTY;
  let addTransformLavelX = 35;
  let addTransformLavelY = 10;
  let isZoom = true;
  let startX = 0;
  let startY = 0;
  let panning = false;

  const ts = {
    scale: 1,
    rotate: 0,
    translate: {
      x: 0,
      y: 0,
    },
  };
  var currentScale = 1;
  var step = 0.2;

  const zoomIN = document.getElementById("zoom_in");
  const zoomOut = document.getElementById("zoom_out");
  const resets = document.getElementById("reset");

  ikrsvg.style.scrollbarWidth = "none";

  zoomIN.addEventListener("click", (e) => {
    isZoom = true;
    currentScale < 8 ? (currentScale += step) : currentScale;

    applyZoom();
  });

  zoomOut.addEventListener("click", (e) => {
    isZoom = false;
    // currentScale > 1?currentScale -= step: currentScale;
    if (currentScale > 1) {
      currentScale -= step;
    } else {
      currentScale;
      var transformzoomOut = `translate(${0}px, ${0}px) ${
        currentScale > 1 ? `scale(${currentScale})` : `scale(1)`
      }`;
      ikrsvg.style.transform = transformzoomOut;
    }

    applyZoom();
  });




  function applyZoom(e) {
    var currentStyle = ikrsvg.getAttribute("style");
    var currentTranslate = parseTranslate(currentStyle);
    if (currentScale > 1 || currentTranslate.x > 0 || currentTranslate > 0) {
      resets.addEventListener("click", reset);
    }


    var transform = `translate(${currentTranslate.x}px, ${
      currentTranslate.y
    }px) ${currentScale > 1 ? `scale(${currentScale})` : `scale(1)`}`;
    var transformzoomOut = `translate(${0}px, ${0}px) ${
      currentScale > 1 ? `scale(${currentScale})` : `scale(1)`
    }`;
    ikrsvg.style.transform = transform;
    // Update the ts object with the currentScale value
    ts.scale = currentScale;
  }

  function parseTranslate(style) {
    var translateRegex = /translate\(([^,]+),([^)]+)\)/;
    var match = style.match(translateRegex);

    if (match) {
      return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
      };
    } else {
      return { x: 0, y: 0 };
    }
  }

  // rotate.oninput = function(event) {
  //   event.preventDefault();
  //   ts.rotate = event.target.value;
  //   setTransform();
  // };

  // ikrsvg.onwheel = function(event) {
  //   event.preventDefault();
  //   //need more handling  to avoid fast scrolls
  //   console.log(event)
  //   var func = ikrsvg.onwheel;
  //   ikrsvg.onwheel = null;
  //   console.log('hh');

  //   let rec = ikrsvg.getBoundingClientRect();
  //   let x = (event.clientX - rec.x) / ts.scale;
  //   let y = (event.clientY - rec.y) / ts.scale;

  //   let delta = (event.wheelDelta ? event.wheelDelta : -event.deltaY);
  //   ts.scale = (delta > 0) ? (ts.scale + 0.2) : (ts.scale - 0.2);

  //   //let m = (ts.scale - 1) / 2;
  //   let m = (delta > 0) ? 0.1 : -0.1;
  //   ts.translate.x += (-x * m * 2) + (ikrsvg.offsetWidth * m);
  //   ts.translate.y += (-y * m * 2) + (ikrsvg.offsetHeight * m);

  //   setTransform();
  //   ikrsvg.onwheel = func;
  // };

  function getTheMouseDownCordenet(event) {
    event.preventDefault();
    panning = true;

    ikrsvg.style.cursor = "grabbing";
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseTX = ts.translate.x;
    mouseTY = ts.translate.y;
  }

  function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }
  
  if (isMobile()) {
   


let touchIdentifier;
let touchStartX;
let touchStartY;
let touchStartTX;
let touchStartTY;
let panning = false;
let currentScale = 1;
const step = 0.2;

const ts = {
  scale: 1,
  rotate: 0,
  translate: {
    x: 0,
    y: 0
  }
};

function applyZoom() {
  const transform = `translate(${ts.translate.x}px, ${ts.translate.y}px) scale(${currentScale})`;
  ikrsvg.style.transform = transform;
}

ikrsvg.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    touchIdentifier = e.touches[0].identifier;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTX = ts.translate.x;
    touchStartTY = ts.translate.y;
  } else {
    panning = true;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    touchStartX = (touch1.clientX + touch2.clientX) / 2;
    touchStartY = (touch1.clientY + touch2.clientY) / 2;
  }
});

ikrsvg.addEventListener('touchmove', (e) => {
  // e.preventDefault();
  if (panning) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const touchCurrentX = (touch1.clientX + touch2.clientX) / 2;
    const touchCurrentY = (touch1.clientY + touch2.clientY) / 2;

    ts.translate.x = touchStartTX + (touchCurrentX - touchStartX);
    ts.translate.y = touchStartTY + (touchCurrentY - touchStartY);

    applyZoom();
  } else if (e.touches.length === 1 && e.touches[0].identifier === touchIdentifier) {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;

    ts.translate.x = touchStartTX + (touchCurrentX - touchStartX);
    ts.translate.y = touchStartTY + (touchCurrentY - touchStartY);

    applyZoom();
  }
});

ikrsvg.addEventListener('touchend', () => {
  panning = false;
  touchIdentifier = null;
});

const zoomIn = document.getElementById('zoom_in');
const zoomOut = document.getElementById('zoom_out');
const resets = document.getElementById('reset');

zoomIn.addEventListener('click', () => {
  currentScale < 8 ? (currentScale += step) : currentScale;
  applyZoom();
});

zoomOut.addEventListener('click', () => {
  if (currentScale > 1) {
    currentScale -= step;
  } else {
    currentScale = 1;
  }
  applyZoom();
});

resets.addEventListener('click', () => {
  currentScale = 1;
  ts.translate = { x: 0, y: 0 };
  applyZoom();
});

applyZoom();

  } else {
    console.log("Desktop device detected");
  }




  ikrsvg.addEventListener("mousedown", getTheMouseDownCordenet);

  ikrsvg.onmouseup = function (event) {
    panning = false;
    ikrsvg.style.cursor = "grab";
  };
  ikrsvg.onmouseout = function (event) {
    panning = false;
    ikrsvg.style.cursor = "auto";
  };

  ikrsvg.onmousemove = function (event) {
    event.preventDefault();
    let rec = ikrsvg.getBoundingClientRect();
    let xx = event.clientX - rec.x;
    let xy = event.clientY - rec.y;

    const x = event.clientX;
    const y = event.clientY;
    pointX = x - startX;
    pointY = y - startY;
    if (!panning) {
      return;
    }
    ts.translate.x = mouseTX + (x - mouseX);
    ts.translate.y = mouseTY + (y - mouseY);
    setTransform();
  };

  function setTransform() {
    const steps = `translate(${ts.translate.x}px,${ts.translate.y}px) scale(${ts.scale}) rotate(${ts.rotate}deg) translate3d(0,0,0)`;
    //console.log(steps);
    ikrsvg.style.transform = steps;
  }

  function reset() {
    ts.scale = 1;
    currentScale = 1;
    ts.translate = {
      x: 0,
      y: 0,
    };

    ikrsvg.style.transform = "none";
  }

  setTransform();
}

// Define a breakpoint value (you can adjust this based on your needs)

