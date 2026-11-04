import assert from "node:assert/strict";
import test from "node:test";
import { rehypeArticleImages } from "../src/lib/rehype-article-images.mjs";

function imageParagraph(src, title = undefined) {
  return {
    type: "element",
    tagName: "p",
    properties: {},
    children: [
      {
        type: "element",
        tagName: "img",
        properties: {
          src,
          alt: "Example image",
          ...(title ? { title } : {}),
        },
        children: [],
      },
    ],
  };
}

test("wraps local article images with a colored expandable frame", async () => {
  const tree = {
    type: "root",
    children: [imageParagraph("/images/typesafe-hook-design.png", "Example caption")],
  };

  await rehypeArticleImages()(tree);

  const figure = tree.children[0];
  assert.equal(figure.tagName, "figure");
  assert.match(figure.properties.style, /^--article-image-accent: #[0-9a-f]{6}$/);
  assert.notEqual(figure.properties.style, "--article-image-accent: #f8f8f8");
  assert.equal(figure.children[0].tagName, "button");
  assert.equal(figure.children[0].properties.dataLightboxTrigger, "true");
  assert.equal(figure.children[0].properties.ariaHasPopup, "dialog");
  assert.equal(figure.children[0].children[0].properties.width, 3122);
  assert.equal(figure.children[1].tagName, "figcaption");
  assert.equal(figure.children[1].children[0].value, "Example caption");
});

test("keeps linked and remote images compatible", async () => {
  const linkedImage = {
    type: "element",
    tagName: "p",
    properties: {},
    children: [
      {
        type: "element",
        tagName: "a",
        properties: { href: "https://example.com" },
        children: [imageParagraph("https://example.com/image.jpg").children[0]],
      },
    ],
  };
  const remoteImage = imageParagraph("https://example.com/image.jpg");
  const tree = { type: "root", children: [linkedImage, remoteImage] };

  await rehypeArticleImages()(tree);

  assert.equal(tree.children[0].children[0].children[0].tagName, "img");
  assert.equal(tree.children[1].tagName, "figure");
  assert.equal(tree.children[1].properties.style, undefined);
});

test("converts linked local images into expandable figures", async () => {
  const linkedLocalImage = {
    type: "element",
    tagName: "p",
    properties: {},
    children: [
      {
        type: "element",
        tagName: "a",
        properties: { href: "/images/typesafe-hook-design.png" },
        children: [imageParagraph("/images/typesafe-hook-design.png").children[0]],
      },
    ],
  };
  const tree = { type: "root", children: [linkedLocalImage] };

  await rehypeArticleImages()(tree);

  assert.equal(tree.children[0].tagName, "figure");
  assert.equal(tree.children[0].children[0].tagName, "button");
});

test("fails the build for missing local images", async () => {
  const tree = { type: "root", children: [imageParagraph("/images/missing-image.png")] };

  await assert.rejects(
    () => rehypeArticleImages()(tree),
    /Unable to read article image "\/images\/missing-image\.png"/,
  );
});
