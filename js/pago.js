/* Página de pago: rellena el producto elegido a partir de ?p= */
(function () {
  "use strict";
  var P = {
    "vivelo-15": { n: "Vívelo por dentro", i: "15 €", w: "Vívelo" },
    "vivelo-35": { n: "Vívelo por dentro, pase VIP", i: "35 €", w: "VIP" },
    "vivelo-vip-upgrade": { n: "Pase VIP (ampliación)", i: "20 €", w: "VIP" },
    "calendario": { n: "Calendario de Adviento", i: "11 €", w: "Calendario" },
    "mentoria-mes": { n: "Mentoría Equilíbrate, pago mensual", i: "300 € (primer mes)", w: "Mentoría" },
    "mentoria-unico": { n: "Mentoría Equilíbrate, pago único", i: "1.100 €", w: "Mentoría" },
    "sesion": { n: "Sesión 1 a 1", i: "150 €", w: "Sesión", cal: true },
    "reiki": { n: "Sesión de reiki", i: "40 €", w: "Reiki", cal: true }
  };
  var q = new URLSearchParams(location.search);
  var item = P[q.get("p")] || null;
  var name = (q.get("n") || "").slice(0, 40);
  function set(sel, txt) { document.querySelectorAll(sel).forEach(function (el) { el.textContent = txt; }); }
  if (item) {
    set("[data-f=producto]", item.n);
    set("[data-f=importe]", item.i);
    set("[data-f=concepto]", "Tu nombre completo + " + item.w);
    var wa = document.getElementById("wa-justificante");
    if (wa) wa.href = "https://wa.me/34655355826?text=" + encodeURIComponent("Hola Vero, soy " + (name || "…") + ". He hecho la transferencia de " + item.n + " (" + item.i + "). Te envío el justificante.");
    document.querySelectorAll("[data-cal]").forEach(function (el) { el.hidden = !item.cal; });
  }
  if (name) set("[data-f=nombre]", ", " + name);
  if (q.get("preview")) { var pv = document.getElementById("preview-note"); if (pv) pv.hidden = false; }
})();
