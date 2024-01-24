import { expect, test } from "bun:test";
import { generator } from "./generator"
import { type MdLine } from "./parser"

const header = `digraph{
  node [style=rounded, shape=rect];
  shape=rect;
  style=rounded;
`;
const footer = `
}`;

type Dot = string
type Case = [MdLine[], Dot]

const depthcases: Case[] = [
  [
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
      "key": "line",
      "depth": 1,
      "line": "  - line",
      "indent": "  ",
      "content": "line"
    },
     {
      "type": "close",
      "key": "ccc -> fetcher",
      "depth": 0,
      "line": "- ccc -> fetcher",
      "indent": "",
      "content": "ccc -> fetcher"
    }],
    `digraph{
  node [style=rounded, shape=rect];
  shape=rect;
  style=rounded;

  subgraph cluster_app {

    subgraph cluster_tumblr {

      subgraph cluster_bbb {
        ccc
      }
    }

    subgraph cluster_pipe {
      fetcher
    }
    line
  }
  ccc -> fetcher
}`
  ]
]

test.each(depthcases)("obj to dot depth test %#", (obj, expected) => {
  const dot = generator(header, obj, footer)
  // console.log(expected)
  // console.log(dot)
  expect(dot).toEqual(expected);
});
