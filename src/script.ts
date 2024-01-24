import { parser, generate } from "./parser"

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
  - sources -> fetcher : target and \\n when to retrieve
  - fetcher -> sources : time \\n to fetched
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
          self.message = error;
          console.error(error);
        });
    }
  }
});
