# tree-sitter-comment

Tree-sitter grammar for highlighting strings wrapped in backticks within comments;
like setting `let c_comment_strings = 1`, but for tree-sitter injections into
comments across multiple languages.

> [!CAUTION]
> This parser is incompatible with the [officially supported](https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#supported-languages)
> parser of the same name. We're hijacking some of the default comment
> injections so they don't need to be rewritten, but that means TODO/XXX/FIXME
> won't be highlighted by tree-sitter anymore. See [todo-comments.nvim](https://github.com/folke/todo-comments.nvim)
> for an alternative that uses exmarks to highlight those keywords.

## Installation

Put this in your `init.lua` or somewhere similar:

```lua
require('nvim-treesitter.parsers').get_parser_configs().comment = {
  install_info = {
    url = 'https://github.com/rdnajac/tree-sitter-comment',
    files = { 'src/parser.c' },
    branch = 'main',
    requires_generate_from_grammar = true,
  },
}
```

## Highlighting

Create the file `~/.config/nvim/queries/comment/highlights.scm`:

```scheme
((source_code) @string
(#set! "priority" 101))
```

## How it works

[Browse the grammar](https://github.com/rdnajac/tree-sitter-comment/blob/main/grammar.js).

The lua/tree-sitter equivalent of `let c_comment_strings = 1` is:

```lua
vim.treesitter.query.set("c", "injections", "(comment) @comment")
```

> [!CAUTION]
> This is inaccurate...

### Injections

Many [Nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) built-in
queries are already configured to inject into comments:

```scheme
; queries/{language}/injections.scm

((comment) @injection.content
(#set! injection.language "comment"))
```

Since this parser is called `comment`, it will be injected into comments by
default, using these existing queries.

## Vim

Relevant code from the Vim syntax file `c.vim`

```vim
if exists("c_comment_strings")
" A comment can contain cString, cCharacter and cNumber.
" But a "*/" inside a cString in a cComment DOES end the comment!  So we
" need to use a special type of cString: cCommentString, which also ends on
" "*/", and sees a "*" at the start of the line as comment again.
" Unfortunately this doesn't very well work for // type of comments :-(
syn match cCommentSkip contained "^\s*\*\%($\|\s\+\)"
syn region cCommentString contained start=+L\=\\\@<!"+ skip=+\\\\\|\\"+ end=+"+ end=+\*/+me=s-1 contains=cSpecial,cCommentSkip
syn region cComment2String contained start=+L\=\\\@<!"+ skip=+\\\\\|\\"+ end=+"+ end="$" contains=cSpecial
syn region  cCommentL start="//" skip="\\$" end="$" keepend contains=@cCommentGroup,cComment2String,cCharacter,cNumbersCom,cSpaceError,cWrongComTail,@Spell
if exists("c_no_comment_fold")
" Use "extend" here to have preprocessor lines not terminate halfway a
" comment.
syn region cComment matchgroup=cCommentStart start="/\*" end="\*/" contains=@cCommentGroup,cCommentStartError,cCommentString,cCharacter,cNumbersCom,cSpaceError,@Spell extend
else
syn region cComment matchgroup=cCommentStart start="/\*" end="\*/" contains=@cCommentGroup,cCommentStartError,cCommentString,cCharacter,cNumbersCom,cSpaceError,@Spell fold extend
endif
else
syn region cCommentL start="//" skip="\\$" end="$" keepend contains=@cCommentGroup,cSpaceError,@Spell
if exists("c_no_comment_fold")
syn region cComment matchgroup=cCommentStart start="/\*" end="\*/" contains=@cCommentGroup,cCommentStartError,cSpaceError,@Spell extend
else
syn region cComment matchgroup=cCommentStart start="/\*" end="\*/" contains=@cCommentGroup,cCommentStartError,cSpaceError,@Spell fold extend
endif
endif
```

### Syntax

The vimscript to achieve the most basic highlighting can be written like this:

```vim
highlight CommentStringInBackticks String
syntax region CommentStringInBackticks start=/`/ end=/`/ contained containedin=.*Comment
```

> [!NOTE]
> It may also be possible to configure `nvim-treesitter` to also apply
> [`additional_vim_regex_highlighting`](https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#highlight).

## References

- <https://tree-sitter.github.io/tree-sitter/index.html>
- <https://slar.se/syntax-highlight-anything-with-tree-sitter.html>
