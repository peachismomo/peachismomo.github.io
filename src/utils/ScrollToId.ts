export default function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 88; // offset for AppBar
  window.scrollTo({ top: y, behavior: "smooth" });
}
