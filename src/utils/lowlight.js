import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml"; // HTML

export const lowlight = createLowlight();
lowlight.register("html", xml);
lowlight.register("css", css);
lowlight.register("js", javascript);
lowlight.register("ts", typescript);