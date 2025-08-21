import { BlockquotePlugin, BoldPlugin, H1Plugin, H2Plugin, H3Plugin, H4Plugin, H5Plugin, ItalicPlugin, StrikethroughPlugin, UnderlinePlugin } from "@platejs/basic-nodes/react";
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from "@platejs/code-block/react";
import { ImagePlugin } from "@platejs/media/react";
import CodeBlockElement from "../components/plateElements/CodeBlockElement";
import CodeLineElement from "../components/plateElements/CodeLineElement";
import CodeSyntaxLeaf from "../components/plateElements/CodeSyntaxLeaf";
import { lowlight } from "./lowlight";
import ImageElement from "../components/plateElements/ImageElement";

export const plugins = [
    BlockquotePlugin,
    BoldPlugin,
    ItalicPlugin, 
    UnderlinePlugin,
    StrikethroughPlugin,
    ImagePlugin.withComponent(ImageElement),
    CodeBlockPlugin.configure({
      node: { component: CodeBlockElement },
      options: { lowlight, defaultLanguage: "js" },
      shortcuts: { toggle: { keys: "mod+alt+8" } },
    }),
    CodeLinePlugin.withComponent(CodeLineElement),
    CodeSyntaxPlugin.withComponent(CodeSyntaxLeaf),
    H1Plugin,
    H2Plugin,
    H3Plugin,
    H4Plugin,
    H5Plugin,
]