import path from "node:path";
import sharp from "sharp";

const imageCache = new Map();

function toHex({ r, g, b }) {
  const brightest = Math.max(r, g, b);
  const scale = brightest > 220 ? 190 / brightest : 1;
  return `#${[r, g, b].map((value) => Math.round(value * scale).toString(16).padStart(2, "0")).join("")}`;
}

function textProperty(node, key) {
  const value = node.properties?.[key];
  if (Array.isArray(value)) return value.join(" ");
  return typeof value === "string" ? value : "";
}

function localImagePath(src) {
  if (!src.startsWith("/") || src.startsWith("//")) return null;

  let pathname = src.split(/[?#]/, 1)[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch {}

  const imageRoot = path.resolve(process.cwd(), "public");
  const imagePath = path.resolve(imageRoot, pathname.replace(/^\/+/, ""));
  if (imagePath !== imageRoot && !imagePath.startsWith(`${imageRoot}${path.sep}`)) return null;
  return imagePath;
}

async function imageDetails(src) {
  const imagePath = localImagePath(src);
  if (!imagePath) return null;
  if (imageCache.has(imagePath)) return imageCache.get(imagePath);

  const pending = Promise.all([
    sharp(imagePath).metadata(),
    sharp(imagePath).flatten({ background: "#ffffff" }).stats(),
  ])
    .then(([metadata, stats]) => {
      const oriented = metadata.autoOrient ?? metadata;
      return {
        accent: toHex(stats.dominant),
        width: oriented.width,
        height: oriented.height,
      };
    })
    .catch((error) => {
      throw new Error(`Unable to read article image "${src}": ${error.message}`);
    });

  imageCache.set(imagePath, pending);
  return pending;
}

async function imageTrigger(image) {
  const src = textProperty(image, "src");
  const alt = textProperty(image, "alt");
  const title = textProperty(image, "title");
  const details = await imageDetails(src);
  const { title: _title, ...imagePropertiesWithoutTitle } = image.properties ?? {};
  const imageProperties = {
    ...imagePropertiesWithoutTitle,
    loading: "lazy",
    decoding: "async",
  };

  if (details?.width) imageProperties.width = details.width;
  if (details?.height) imageProperties.height = details.height;

  return {
    type: "element",
    tagName: "button",
    properties: {
      type: "button",
      className: ["article-image-trigger"],
      dataLightboxTrigger: "true",
      ariaLabel: alt ? `Open image: ${alt}` : "Open image",
      ariaHasPopup: "dialog",
    },
    children: [
      {
        type: "element",
        tagName: "img",
        properties: imageProperties,
        children: [],
      },
      {
        type: "element",
        tagName: "span",
        properties: {
          className: ["article-image-trigger__label"],
          ariaHidden: "true",
        },
        children: [{ type: "text", value: "Expand" }],
      },
    ],
    data: { title, accent: details?.accent },
  };
}

async function imageFigure(image) {
  const trigger = await imageTrigger(image);
  const title = textProperty(image, "title");
  const accent = trigger.data?.accent;
  const children = [trigger];

  if (title) {
    children.push({
      type: "element",
      tagName: "figcaption",
      properties: {},
      children: [{ type: "text", value: title }],
    });
  }

  return {
    type: "element",
    tagName: "figure",
    properties: {
      className: ["article-figure"],
      style: accent ? `--article-image-accent: ${accent}` : undefined,
    },
    children,
  };
}

function onlyImageParagraph(node) {
  if (node.type !== "element" || node.tagName !== "p") return false;
  const meaningfulChildren = node.children.filter(
    (child) => child.type !== "text" || child.value.trim(),
  );
  return (
    meaningfulChildren.length === 1 &&
    meaningfulChildren[0].type === "element" &&
    meaningfulChildren[0].tagName === "img"
  );
}

function onlyLinkedImageParagraph(node) {
  if (node.type !== "element" || node.tagName !== "p") return null;
  const meaningfulChildren = node.children.filter(
    (child) => child.type !== "text" || child.value.trim(),
  );
  if (meaningfulChildren.length !== 1 || meaningfulChildren[0].type !== "element" || meaningfulChildren[0].tagName !== "a") {
    return null;
  }

  const link = meaningfulChildren[0];
  const href = textProperty(link, "href").split(/[?#]/, 1)[0].toLowerCase();
  if (!/\.(avif|gif|jpe?g|png|svg|webp)$/.test(href)) return null;

  const imageChildren = link.children.filter(
    (child) => child.type !== "text" || child.value.trim(),
  );
  if (imageChildren.length !== 1 || imageChildren[0].type !== "element" || imageChildren[0].tagName !== "img") {
    return null;
  }
  return imageChildren[0];
}

async function transformChildren(parent) {
  if (!parent.children || parent.type === "element" && parent.tagName === "a") return;

  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index];

    if (onlyImageParagraph(child)) {
      parent.children[index] = await imageFigure(child.children.find(
        (candidate) => candidate.type === "element" && candidate.tagName === "img",
      ));
      continue;
    }

    const linkedImage = onlyLinkedImageParagraph(child);
    if (linkedImage) {
      parent.children[index] = await imageFigure(linkedImage);
      continue;
    }

    if (child.type === "element" && child.tagName === "img") {
      parent.children[index] = await imageTrigger(child);
      continue;
    }

    await transformChildren(child);
  }
}

export function rehypeArticleImages() {
  return async (tree) => {
    await transformChildren(tree);
  };
}
