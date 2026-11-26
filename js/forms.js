/* Formularios de la web de Verónica Salamanca.
 * Envío con Web3Forms: cada formulario llega al correo de Vero.
 * Fuera de veronicasalamanca.com (vista previa) no se envía nada: solo se muestra el siguiente paso. */
(function () {
  "use strict";
  var LIVE = /(^|\.)veronicasalamanca\.com$/.test(location.hostname);
  var WA = "https://wa.me/34655355826";

  function setMsg(form, text, kind) {
    var box = form.querySelector(".form-msg");
    if (!box) return;
    box.className = "form-msg" + (kind ? " " + kind : "");
    box.innerHTML = text;
  }

  function next(form, data) {
    var url = form.getAttribute("data-next");
    var key = form.getAttribute("data-product");
    var choice = form.querySelector("input[name=opcion]:checked");
    if (choice) key = choice.value;
    var first = (data.get("nombre") || "").toString().trim().split(/\s+/)[0];
    var q = "?p=" + encodeURIComponent(key) + "&n=" + encodeURIComponent(first) + (LIVE ? "" : "&preview=1");
    location.href = url + q;
  }

  function done(form, data) {
    if (form.getAttribute("data-next")) return next(form, data);
    var ok = form.getAttribute("data-ok") || "¡Recibido! Te escribo muy pronto.";
    setMsg(form, ok + (LIVE ? "" : " <em>(Vista previa: no se ha enviado nada.)</em>"), "ok");
    var reveal = document.getElementById(form.getAttribute("data-reveal") || "");
    if (reveal) reveal.hidden = false;
    form.querySelectorAll("input, select, textarea, button").forEach(function (el) { el.disabled = true; });
  }

  document.querySelectorAll("form[data-web3]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        setMsg(form, "Revisa los campos marcados, por favor.", "error");
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      var label = btn ? btn.textContent : "";
      var data = new FormData(form);
      var choice = form.querySelector("input[name=opcion]:checked");
      if (choice) data.set("opcion_elegida", choice.getAttribute("data-label") || choice.value);
      if (!LIVE) { done(form, data); return; }
      if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }
      setMsg(form, "", "");
      fetch("https://api.web3forms.com/submit", { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error("envio");
          done(form, data);
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          setMsg(form, 'No se ha podido enviar. Escríbeme por <a href="' + WA + '">WhatsApp al 655 355 826</a> y lo vemos.', "error");
        });
    });
  });

  /* Bloques que solo se muestran en unas fechas (venta de la mentoría) */
  var now = new Date();
  document.querySelectorAll("[data-open-from]").forEach(function (el) {
    var from = new Date(el.getAttribute("data-open-from"));
    var to = new Date(el.getAttribute("data-open-to"));
    var open = now >= from && now <= to;
    if (new URLSearchParams(location.search).get("venta") === "abierta") open = true;
    el.querySelectorAll("[data-when=open]").forEach(function (x) { x.hidden = !open; });
    el.querySelectorAll("[data-when=closed]").forEach(function (x) { x.hidden = open; });
  });

  /* Botones de copiar */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy");
      var done = function () { var t = b.textContent; b.textContent = "Copiado"; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });
})();
