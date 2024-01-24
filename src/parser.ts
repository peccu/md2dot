export type MdLine = {
  type: "subgraph" | "close";
  key: string;
  line: string;
  indent: string;
  content: string;
  label?: string;
  depth: number;
}

export const parser = (val: string): MdLine[] => {
  // input line format
  // <indent?>- <label>
  // <indent?>- <key>:<label>
  // comment (ignore line)
  // <indent?>#.*
  return val
    .split("\n")
    .filter((line)=> {
      // skip blank line and comment only line
      return line.trim().length > 0 && line.trim()[0] !== '#'
    })
    .map((line) => {
      // split indent and content
      const content = line.split("- ");
      if (content.length > 1) {
        return { line, indent: content[0], content: content[1] };
      }
      return { line, indent: "", content: content[0] };
    })
    .map((e) => {
      // calculate depth by indent
      return { depth: e.indent.length / 2, ...e };
    })
    .map((e) => {
      // split content into key and label
      const content = e.content.split(":");
      if (content.length > 1) {
        return {
          key: content[0].trim(),
          label: content.slice(1).join(":").trim(),
          ...e
        };
      }
      return { key: content[0], ...e };
    })
    .map((e, i, a) => {
      // detect start and end subgraph
      if (i + 1 == a.length) {
        // last = close
        return {
          type: "close",
          ...e
        } as MdLine;
      }
      if (i == 0 || e.depth < a[i + 1].depth) {
        // first or down = start subgraph
        return {
          type: "subgraph",
          ...e
        } as MdLine;
      }
      if (e.depth > a[i + 1].depth) {
        // up = end subgraph
        // TODO when the variance > 1, need to add more close
        return {
          type: "close",
          ...e
        } as MdLine;
      }
      return e as MdLine;
    });
}

export const generate = (header: string, val: MdLine[], footer: string) => {
  return (
    header +
      val
        .map((e) => {
          // TODO check indent level
          const close = e.type == "close" ? "\n" + e.indent + "}" : "";
          const delim =
            e.type == "subgraph" ? "subgraph cluster_" + e.key + " {" : e.key;
          let label = "";
          if (e.label) {
            label =
              "\n" +
              e.indent +
              (e.type == "subgraph"
                ? '    label = "' + e.label + '"'
                : '    [label = "' + e.label + '"]');
          }
          return {
            output:
            (e.type == "subgraph" ? "\n" : "") +
              "  " +
              e.indent +
              delim +
              label +
              close
          };
        })
        .map((e) => e.output)
        .join("\n") +
      footer
  )
}
