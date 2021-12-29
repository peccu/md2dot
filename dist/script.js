const header = `digraph{
  node [style=rounded, shape=rect];
  shape=rect;
  style=rounded; 
`;
const footer = `}`;

new Vue({
  el: "#app",
  data: {
    doc: null,
    viz: null,
    code: `- app : feed text app
  - browser
  - mail
  - rss
  - twitter
  - tumblr
  - front : front vue
    - tmbr
  - pipe : pipedream apis
    - mail_parser : mail parser
    - pipe_items : items
    - action
    - fetcher
  - mongo : mongodb
    - mongo_items : items
    - sources
    - label_category : label category
  - browser -> tmbr
  - tmbr -> action
  - pipe_items -> tmbr
  - mail -> mail_parser
  - mail_parser -> mongo_items
  - mongo_items->pipe_items
  - action -> twitter
  - action-> tumblr
  - action -> label_category
  - rss -> fetcher
  - twitter -> fetcher
  - tumblr -> fetcher
  - fetcher -> mongo_items
  - sources -> fetcher : target and when to retrieve
  - fetcher -> sources : time to fetched
`,
    // https://stackoverflow.com/a/54605631
    graph: ""
  },
  mounted() {
    // initialize
    this.viz = new Viz();
    // draw sample
    this.$nextTick(() => {
      this.draw(this.dot);
    });
  },
  computed: {
    dot() {
      // parse and generate dot
      this.doc = this.parse(this.code);
      return this.gendot(this.doc);
    }
  },
  watch: {
    code() {
      // redraw on code changed
      this.draw(this.dot);
    }
  },
  methods: {
    parse(val) {
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
            return {
              type: "close",
              ...e
            };
          }
          return e;
        });
    },
    gendot(val) {
      // generate dot
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
      );
    },
    draw(code) {
      // https://stackoverflow.com/a/54605631/514411
      const self = this;
      this.viz
        .renderSVGElement(code)
        .then(function (element) {
          const current = self.$refs.graph.firstChild;
          self.$refs.graph.replaceChild(element, current);
        })
        .catch((error) => {
          this.viz = new Viz();
          console.error(error);
        });
    }
  }
});