// @ts-nocheck
import { parser, generate } from "./parser"
import { sample } from "./sample"

const header = `digraph{
  node [style=rounded, shape=rect];
  shape=rect;
  style=rounded;
`;
const footer = `}`;

new Vue({
  el: "#app",
  data: {
    parsed: null,
    viz: null,
    message: null,
    code: sample,
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
      this.message = null;
      // parse and generate dot
      this.parsed = parser(this.code);
      return generate(header, this.parsed, footer);
    }
  },
  watch: {
    code() {
      // redraw on code changed
      this.draw(this.dot);
    }
  },
  methods: {
    draw(code: string) {
      // https://stackoverflow.com/a/54605631/514411
      const self = this;
      this.viz
        .renderSVGElement(code)
        .then((element: SVGSVGElement) => {
          const current = self.$refs.graph.firstChild;
          self.$refs.graph.replaceChild(element, current);
        })
        .catch((error: Error) => {
          this.viz = new Viz();
          self.message = error;
          console.error(error);
        });
    }
  }
});
