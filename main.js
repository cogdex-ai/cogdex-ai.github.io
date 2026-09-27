// Paste your beta signup form link here (for example a Tally form).
const SIGNUP_URL = "";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- signup links ---------- */

if (SIGNUP_URL) {
  document.querySelectorAll("[data-signup]").forEach((link) => {
    link.href = SIGNUP_URL;
    link.target = "_blank";
    link.rel = "noopener";
  });
} else {
  document.querySelector("[data-signup-primary]").hidden = true;
  document.querySelector(".signup-pending").hidden = false;
}

/* ---------- nav background once scrolled ---------- */

const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- reveal on scroll ---------- */

const revealer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("shown");
      revealer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll(".reveal").forEach((el, index) => {
  if (el.closest(".hero")) el.style.transitionDelay = `${index * 70}ms`;
  revealer.observe(el);
});

/* ---------- hero chat demo ---------- */

const chat = document.getElementById("chat");
const composer = document.querySelector(".composer");
const composerText = document.getElementById("composer-text");
const scenes = [...document.getElementById("scenes").content.children];
const PLACEHOLDER = composerText.textContent;
const MAX_MESSAGES = 8;

let onScreen = false;
new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting)).observe(chat);

async function whenWatched() {
  while (!onScreen || document.hidden) await sleep(400);
}

function add(className, html) {
  const node = document.createElement("div");
  node.className = `msg ${className} enter`;
  node.innerHTML = html;
  chat.append(node);
  while (chat.children.length > MAX_MESSAGES) chat.firstElementChild.remove();
  return node;
}

async function play(scene) {
  const question = scene.dataset.q;
  await whenWatched();

  composer.classList.add("typing");
  composerText.textContent = "";
  for (const char of question) {
    composerText.textContent += char;
    await sleep(28 + Math.random() * 40);
  }
  await sleep(450);
  composer.classList.remove("typing");
  composerText.textContent = PLACEHOLDER;

  add("user", "");
  chat.lastElementChild.textContent = question;
  await sleep(350);

  const thinking = add("bot thinking", "<i></i><i></i><i></i>");
  await sleep(900 + Math.random() * 500);
  thinking.remove();
  add("bot", scene.innerHTML);

  await sleep(scene.querySelector("table") ? 5200 : 3400);
}

async function runDemo() {
  await sleep(2600);
  for (let i = 1; ; i = (i + 1) % scenes.length) {
    await play(scenes[i]);
  }
}

if (!reducedMotion) runDemo();
