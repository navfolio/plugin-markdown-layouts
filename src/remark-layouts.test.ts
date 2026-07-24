import { describe, expect, test } from "bun:test";

import remarkLayouts, { parseLayoutMarker } from "./remark-layouts";

function paragraph(value: string) {
  return { type: "paragraph", children: [{ type: "text", value }] };
}

describe("parseLayoutMarker", () => {
  test("parses a directive and quoted attributes", () => {
    expect(
      parseLayoutMarker('::: columns{cols=2 ratio="1:2" mobile="media-first"}'),
    ).toEqual({
      type: "columns",
      attributes: { cols: "2", ratio: "1:2", mobile: "media-first" },
    });
    expect(parseLayoutMarker("::: column{media}")).toEqual({
      type: "column",
      attributes: { media: true },
    });
  });
});

describe("remarkLayouts", () => {
  test("turns a columns directive into a semantic section", () => {
    const tree = {
      type: "root",
      children: [
        paragraph('::: columns{cols=2 ratio="1:2" mobile="media-first"}'),
        paragraph("::: column"),
        paragraph("Main content."),
        paragraph(":::"),
        paragraph("::: column{media}"),
        paragraph("Image content."),
        paragraph(":::"),
        paragraph(":::"),
      ],
    };

    remarkLayouts()(tree);

    const layout = tree.children[0];
    expect(layout?.data?.hName).toBe("section");
    expect(layout?.data?.hProperties?.className).toEqual(
      expect.arrayContaining([
        "markdown-columns",
        "markdown-columns-2",
        "is-media-first",
      ]),
    );
    expect(layout?.data?.hProperties?.style).toContain("1fr) minmax(0, 2fr");
    expect(layout?.children?.[1]?.data?.hProperties?.className).toContain(
      "is-media",
    );
  });

  test("renders horizontal timelines as a scrollable semantic list", () => {
    const tree = {
      type: "root",
      children: [
        paragraph('::: timeline{direction="horizontal"}'),
        paragraph('::: event{date="2026.07"}'),
        paragraph("Released."),
        paragraph(":::"),
        paragraph('::: event{date="2026.08"}'),
        paragraph("Documented."),
        paragraph(":::"),
        paragraph(":::"),
      ],
    };

    remarkLayouts()(tree);

    const timeline = tree.children[0];
    const list = timeline?.children?.[0];
    expect(timeline?.data?.hProperties?.className).toContain("is-horizontal");
    expect(list?.data?.hName).toBe("ol");
    expect(list?.children?.[0]?.data?.hName).toBe("li");
    expect(list?.children?.[0]?.data?.hProperties?.dataTimelineDate).toBe(
      "2026.07",
    );
  });

  test("leaves incomplete directives untouched", () => {
    const tree = {
      type: "root",
      children: [
        paragraph("::: columns{cols=2}"),
        paragraph("::: column"),
        paragraph("Missing close"),
      ],
    };

    remarkLayouts()(tree);

    expect(tree.children).toHaveLength(3);
    expect(tree.children[0]?.data).toBeUndefined();
  });

  test("leaves a columns directive untouched when its column count is invalid", () => {
    const tree = {
      type: "root",
      children: [
        paragraph('::: columns{cols=3 ratio="1:2"}'),
        paragraph("::: column"),
        paragraph("First."),
        paragraph(":::"),
        paragraph("::: column"),
        paragraph("Second."),
        paragraph(":::"),
        paragraph(":::"),
      ],
    };

    remarkLayouts()(tree);

    expect(tree.children).toHaveLength(8);
    expect(tree.children[0]?.data).toBeUndefined();
  });
});
