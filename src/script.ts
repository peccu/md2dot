// @ts-nocheck
import { parser } from "./parser"
import { generator } from "./generator"
import { sample } from "./sample"

const header = `digraph{
  fontname="Helvetica,Arial,sans-serif";
  node [fontname="Helvetica,Arial,sans-serif", style=rounded, shape=rect];
  edge [fontname="Helvetica,Arial,sans-serif"];
  shape=rect;
  style=rounded;
`;
const footer = `
}`;

new Vue({
  el: "#app",
  data: {
    header,
    parsed: null,
    viz: null,
    message: null,
    code: sample,
    // https://stackoverflow.com/a/54605631
    graph: ""
  },
  mounted() {
    // TODO load from localstorage
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
      return generator(this.header, this.parsed, footer);
    }
  },
  watch: {
    code() {
      // TODO store into localstorsge
      // redraw on code changed
      this.draw(this.dot);
    },
    header() {
      // TODO store into localstorsge
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
