const dialog = document.querySelector<HTMLDialogElement>("[data-image-dialog]");
const dialogImage = document.querySelector<HTMLImageElement>("[data-image-dialog-image]");
const closeButton = document.querySelector<HTMLButtonElement>("[data-image-dialog-close]");

if (dialog && dialogImage && closeButton) {
  let opener: HTMLElement | null = null;

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const open = (trigger: HTMLElement) => {
    const image = trigger.querySelector<HTMLImageElement>("img");
    if (!image) return;

    dialogImage.src = image.currentSrc || image.src;
    dialogImage.alt = image.alt;
    opener = trigger;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("image-dialog-open");
  };

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>("[data-lightbox-trigger]");
    if (trigger) open(trigger);
  });

  closeButton.addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("image-dialog-open");
    dialogImage.removeAttribute("src");
    opener?.focus();
    opener = null;
  });
}

export {};
