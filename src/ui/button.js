export function createButton({ icon, label = "", variant = "default", title, onClick }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `savetube-btn savetube-btn--${variant}`;
  if (title) btn.title = title;

  const iconEl = document.createElement("span");
  iconEl.className = "savetube-btn__icon";
  iconEl.innerHTML = icon;
  btn.appendChild(iconEl);

  const labelEl = document.createElement("span");
  labelEl.className = "savetube-btn__label";
  labelEl.textContent = label;
  btn.appendChild(labelEl);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  });

  return btn;
}
