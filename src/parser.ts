export const parser = (val) => {
  return val
    .split("\n")
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
      // extract label
      const content = e.content.split(":");
      if (content.length > 1) {
        return {
          key: content[0].trim(),
          label: content[1].trim(),
          ...e
        };
      }
      return { key: content[0], ...e };
    })
    .map((e, i, a) => {
      // detect start and end subgraph
      if (i + 1 == a.length) {
        // last = close
        return e;
      }
      if (i == 0 || e.depth < a[i + 1].depth) {
        // first and down = start subgraph
        return {
          type: "subgraph",
          ...e
        };
      }
      if (e.depth > a[i + 1].depth) {
        // up = end subgraph
        // TODO when the variance > 1, need to add more close
        return {
          type: "close",
          ...e
        };
      }
      return e;
    });
}

export const generate = (header, val, footer) => {
  return (
    header +
      val
        .map((e) => {
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
