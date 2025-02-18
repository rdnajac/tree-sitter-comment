# tree-sitter-comment

Tree-sitter grammar for highlighting strings wrapped in backticks within comments

> [!CAUTION]
> This parser is incompatible with the
> [officially > supported](https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#supported-languages)
> parser of the same name. We're hijacking some of the default comment
> injections, so TODO/XXX/FIXME won't be highlighted with tree-sitter anymore.
> See [todo-comments.nvim](https://github.com/folke/todo-comments.nvim)

## Installation

Put this in your `init.lua` or somewhere similar:

```lua
-- TODO: get the actual url
require('nvim-treesitter.parsers').get_parser_configs().comment = {
  install_info = {
    url = '~/Desktop/GitHub/rdnajac/tree-sitter-comment',
    files = { 'src/parser.c' },
  },
}
```

## Highlighting

Create the file `~/.config/nvim/queries/comment/highlights.scm`:

```scheme
((source_code) @string
 (#set! "priority" 101))
```
