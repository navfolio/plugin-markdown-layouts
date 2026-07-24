type AttributeValue = string | true;
type LayoutMarker = {
    type: "columns" | "column" | "timeline" | "event";
    attributes: Record<string, AttributeValue>;
};
type MdastNode = {
    type?: string;
    value?: string;
    children?: MdastNode[];
    data?: {
        hName?: string;
        hProperties?: Record<string, unknown>;
    };
};
export declare function parseLayoutMarker(value: string): LayoutMarker | undefined;
export default function remarkLayouts(): (tree: MdastNode) => void;
export {};
//# sourceMappingURL=remark-layouts.d.ts.map