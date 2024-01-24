import { type MdLine } from "./parser"

export const generator = (header: string, val: MdLine[], footer: string) => {
  return (
    header +
      val
        .map((e, i, a) => {
          // console.log(`${e.key} : e.depth ${e.depth}, next ${a[i+1] && a[i+1].depth}`)
          let close = ''
          if(e.type == "close"){
            const next = a[i+1] ? a[i+1].depth : 0
            const count = e.depth - next
            for(let i=0;i<count;i++){
              const rep = e.depth - i
              close += `\n${'  '.repeat(rep)}}`
            }
          }
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
