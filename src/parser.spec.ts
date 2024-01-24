import { expect, test } from "bun:test";
import { parser, generate, type MdLine } from "./parser"

type Md = string
type Case = [Md, MdLine[]]

const depthcases: Case[] = [
  [
    `- parent`,
    [{
      key: "parent",
      depth: 0,
      line: "- parent",
      indent: "",
      content: "parent",
      type: "close"
    }] as MdLine[]
  ],
  [
    `- parent
  - child`,
    [{
      key: "parent",
      depth: 0,
      line: "- parent",
      indent: "",
      content: "parent",
      type: "subgraph"
    },{
      key: "child",
      depth: 1,
      line: "  - child",
      indent: "  ",
      content: "child",
      type: "close"
    }] as MdLine[]
  ],
  [
    `- parent
  - child
    - grand child`,
    [{
      key: "parent",
      depth: 0,
      line: "- parent",
      indent: "",
      content: "parent",
      type: "subgraph"
    },{
      key: "child",
      depth: 1,
      line: "  - child",
      indent: "  ",
      content: "child",
      type: "subgraph"
    },{
      key: "grand child",
      depth: 2,
      line: "    - grand child",
      indent: "    ",
      content: "grand child",
      type: "close"
    }] as MdLine[]
  ],
  [
    `- parent
  - child
    - grand child
  - child2`,
    [{
      key: "parent",
      depth: 0,
      line: "- parent",
      indent: "",
      content: "parent",
      type: "subgraph"
    },{
      key: "child",
      depth: 1,
      line: "  - child",
      indent: "  ",
      content: "child",
      type: "subgraph"
    },{
      key: "grand child",
      depth: 2,
      line: "    - grand child",
      indent: "    ",
      content: "grand child",
      type: "close"
    },{
      key: "child2",
      depth: 1,
      line: "  - child2",
      indent: "  ",
      content: "child2",
      type: "close"
    }] as MdLine[]
  ],
  [
    `- parent
  - child
    - grand child
- child2`,
    [{
      key: "parent",
      depth: 0,
      line: "- parent",
      indent: "",
      content: "parent",
      type: "subgraph"
    },{
      key: "child",
      depth: 1,
      line: "  - child",
      indent: "  ",
      content: "child",
      type: "subgraph"
    },{
      key: "grand child",
      depth: 2,
      line: "    - grand child",
      indent: "    ",
      content: "grand child",
      type: "close"
    },{
      key: "child2",
      depth: 0,
      line: "- child2",
      indent: "",
      content: "child2",
      type: "close"
    }] as MdLine[]
  ],
  [
    `- parent
  - child
    - grand child
      - grand grand child
- child2`,
    [{
      key: "parent",
      depth: 0,
      line: "- parent",
      indent: "",
      content: "parent",
      type: "subgraph"
    },{
      key: "child",
      depth: 1,
      line: "  - child",
      indent: "  ",
      content: "child",
      type: "subgraph"
    },{
      key: "grand child",
      depth: 2,
      line: "    - grand child",
      indent: "    ",
      content: "grand child",
      type: "subgraph"
    },{
      key: "grand grand child",
      depth: 3,
      line: "      - grand grand child",
      indent: "      ",
      content: "grand grand child",
      type: "close"
    },{
      key: "child2",
      depth: 0,
      line: "- child2",
      indent: "",
      content: "child2",
      type: "close"
    }] as MdLine[]
  ],
  [`- app
  - tumblr
    - bbb
      - ccc
  - pipe
    - fetcher
- ccc-> fetcher`,
   [{
     "type": "subgraph",
     "key": "app",
     "depth": 0,
     "line": "- app",
     "indent": "",
     "content": "app"
   },
    {
     "type": "subgraph",
     "key": "tumblr",
     "depth": 1,
     "line": "  - tumblr",
     "indent": "  ",
     "content": "tumblr"
   },
    {
     "type": "subgraph",
     "key": "bbb",
     "depth": 2,
     "line": "    - bbb",
     "indent": "    ",
     "content": "bbb"
   },
    {
     "type": "close",
     "key": "ccc",
     "depth": 3,
     "line": "      - ccc",
     "indent": "      ",
     "content": "ccc"
   },
    {
     "type": "subgraph",
     "key": "pipe",
     "depth": 1,
     "line": "  - pipe",
     "indent": "  ",
     "content": "pipe"
   },
    {
     "type": "close",
     "key": "fetcher",
     "depth": 2,
     "line": "    - fetcher",
     "indent": "    ",
     "content": "fetcher"
   },
    {
     "type": "close",
     "key": "ccc-> fetcher",
     "depth": 0,
     "line": "- ccc-> fetcher",
     "indent": "",
     "content": "ccc-> fetcher"
   }]
  ]
]

test.each(depthcases)("md to obj depth test %#", (md, expected) => {
  const parsed = parser(md)
  // console.log(JSON.stringify(parsed, null, 2));
  expect(parsed).toEqual(expected);
});

const commentcases: Case[] = [
  [`- parent
  # comment
  - child`,
   [{
     key: "parent",
     depth: 0,
     line: "- parent",
     indent: "",
     content: "parent",
     type: "subgraph"
   },{
     key: "child",
     depth: 1,
     line: "  - child",
     indent: "  ",
     content: "child",
     type: "close"
   }] as MdLine[]
  ],
  [`- parent

  - child
`,
   [{
     key: "parent",
     depth: 0,
     line: "- parent",
     indent: "",
     content: "parent",
     type: "subgraph"
   },{
     key: "child",
     depth: 1,
     line: "  - child",
     indent: "  ",
     content: "child",
     type: "close"
   }] as MdLine[]
  ]
]

test.each(commentcases)("md to obj comment test %#", (md, expected) => {
  const parsed = parser(md)
  // console.log(JSON.stringify(parsed, null, 2));
  expect(parsed).toEqual(expected);
});
