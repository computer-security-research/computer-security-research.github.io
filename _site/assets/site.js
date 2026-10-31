// Site interactive enhancements. Trusted-Types-safe; progressive.
(function () {
  "use strict";

  // Copy button on each cite-box / code <pre>.
  function addCopy(pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      if (!(navigator.clipboard && navigator.clipboard.writeText)) { return; }
      navigator.clipboard.writeText(pre.textContent).then(function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      }, function () { btn.textContent = "Copy failed"; });
    });
    pre.parentNode.insertBefore(btn, pre);
  }
  var pres = document.querySelectorAll("details.cite-this pre, article.body pre");
  for (var i = 0; i < pres.length; i++) { addCopy(pres[i]); }

  // Citation hovercards: hover/focus a [n] to preview its reference, with prev/next
  // stepping through the references in document order. The native title= is kept as a
  // JS-off fallback. TT-safe: the card is built with DOM APIs + cloneNode only (no
  // HTML-string sinks), so it survives a strict Content-Security-Policy.
  // citeproc renders each in-text cite as <span class="citation"><a href="#ref-KEY">;
  // a grouped cite holds several such anchors. The reference list uses .csl-entry,
  // never .citation, so this selector matches in-text cites only.
  var cites = [].slice.call(document.querySelectorAll("article.body .citation a[href^='#ref-']"));
  var refOrder = [];            // ref ids in first-citation document order (deduped)
  var seen = Object.create(null);
  for (var j = 0; j < cites.length; j++) {
    var href = cites[j].getAttribute("href");
    if (!href || href.charAt(0) !== "#") { continue; }
    var rid = href.slice(1);
    var ref = document.getElementById(rid);
    if (!ref) { continue; }
    cites[j].setAttribute("title", ref.textContent.replace(/\s+/g, " ").trim());
    if (!seen[rid]) { seen[rid] = true; refOrder.push(rid); }
  }
  if (refOrder.length) {
    var card = document.createElement("div");
    card.className = "hovercard";
    card.setAttribute("role", "dialog");
    card.hidden = true;
    var cbody = document.createElement("div");
    cbody.className = "hovercard-body";
    var cnav = document.createElement("div");
    cnav.className = "hovercard-nav";
    var cprev = document.createElement("button");
    cprev.type = "button"; cprev.className = "hovercard-navbtn";
    cprev.textContent = String.fromCharCode(0x25C0); cprev.setAttribute("aria-label", "Previous reference");
    var cpos = document.createElement("span");
    cpos.className = "hovercard-pos";
    var cnext = document.createElement("button");
    cnext.type = "button"; cnext.className = "hovercard-navbtn";
    cnext.textContent = String.fromCharCode(0x25B6); cnext.setAttribute("aria-label", "Next reference");
    cnav.appendChild(cprev); cnav.appendChild(cpos); cnav.appendChild(cnext);
    // Nav on TOP: prev/next buttons appended before the reference body.
    card.appendChild(cnav); card.appendChild(cbody);
    document.body.appendChild(card);

    var hideTimer = null, curIdx = -1, curAnchor = null, pinned = false;
    function refFragment(id) {
      var frag = document.createDocumentFragment();
      // Prefer the verbatim source-quote block when one is embedded for this key
      // (id is "ref-<key>"); fall back to the reference-list entry otherwise.
      var key = id.indexOf("ref-") === 0 ? id.slice(4) : id;
      var r = document.getElementById("cq-" + key) || document.getElementById(id);
      if (!r) { return frag; }
      var kids = r.childNodes;
      for (var i = 0; i < kids.length; i++) {
        frag.appendChild(kids[i].cloneNode(true));
      }
      return frag;
    }
    function populate(idx) {
      if (idx < 0 || idx >= refOrder.length) { return; }
      curIdx = idx;
      while (cbody.firstChild) { cbody.removeChild(cbody.firstChild); }
      cbody.appendChild(refFragment(refOrder[idx]));
      cpos.textContent = (idx + 1) + " / " + refOrder.length;
      cnav.hidden = refOrder.length < 2;
      cprev.disabled = idx === 0;
      cnext.disabled = idx === refOrder.length - 1;
    }
    function place(anchor) {
      var rect = anchor.getBoundingClientRect();
      var left = window.pageXOffset + rect.left;
      var maxLeft = window.pageXOffset + document.documentElement.clientWidth - card.offsetWidth - 8;
      if (left > maxLeft) { left = maxLeft; }
      if (left < window.pageXOffset + 8) { left = window.pageXOffset + 8; }
      card.style.left = left + "px";
      card.style.top = (window.pageYOffset + rect.bottom + 6) + "px";
    }
    function show(anchor, idx) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      pinned = false;            // a fresh hover/focus is transient again
      curAnchor = anchor;
      card.hidden = false;
      populate(idx);
      place(anchor);
    }
    // Pinned (the user clicked a nav button) overrides hover-to-hide, so stepping
    // through refs never auto-closes when the card resizes under the pointer.
    function hideSoon() { if (pinned) { return; } hideTimer = setTimeout(function () { card.hidden = true; }, 200); }
    function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }
    function dismiss() { card.hidden = true; pinned = false; cancelHide(); }
    function step(delta) {
      var ni = curIdx + delta;
      if (ni < 0 || ni >= refOrder.length) { return; }
      cancelHide();
      pinned = true;
      populate(ni);
      if (curAnchor) { place(curAnchor); }
    }
    for (var c = 0; c < cites.length; c++) {
      (function (a) {
        var h = a.getAttribute("href");
        if (!h || h.charAt(0) !== "#") { return; }
        var idx = refOrder.indexOf(h.slice(1));
        if (idx < 0) { return; }
        a.addEventListener("mouseenter", function () { show(a, idx); });
        a.addEventListener("mouseleave", hideSoon);
        a.addEventListener("focus", function () { show(a, idx); });
        a.addEventListener("blur", hideSoon);
      })(cites[c]);
    }
    card.addEventListener("mouseenter", cancelHide);
    card.addEventListener("mouseleave", hideSoon);
    cprev.addEventListener("click", function () { step(-1); });
    cnext.addEventListener("click", function () { step(1); });
    // Keyboard: Escape dismisses; Left/Right step prev/next while the card is
    // open and either pinned or the focus is on a cite anchor / inside the card
    // (so arrow keys are not hijacked from ordinary page scrolling).
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { dismiss(); return; }
      if (card.hidden) { return; }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") { return; }
      var ae = document.activeElement;
      if (!(pinned || card.contains(ae) || cites.indexOf(ae) >= 0)) { return; }
      e.preventDefault();
      step(e.key === "ArrowLeft" ? -1 : 1);
    });
    // A pinned card is dismissed by a click outside it (the nav click that pins
    // is inside the card, so it never self-dismisses).
    document.addEventListener("click", function (e) {
      if (pinned && !card.hidden && !card.contains(e.target)) { dismiss(); }
    });
  }

  // Figure lightbox: click a body image to view enlarged; click or Escape closes.
  function lightbox(img) {
    var ov = document.createElement("div");
    ov.className = "lightbox";
    var big = document.createElement("img");
    big.setAttribute("src", img.getAttribute("src"));
    big.setAttribute("alt", img.getAttribute("alt") || "");
    ov.appendChild(big);
    function close() { ov.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") { close(); } }
    ov.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(ov);
  }
  var imgs = document.querySelectorAll("article.body img");
  for (var k = 0; k < imgs.length; k++) {
    imgs[k].classList.add("zoomable");
    imgs[k].addEventListener("click", function (e) { lightbox(e.currentTarget); });
  }
})();
