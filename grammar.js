/**
 * @file Tree-sitter grammar for highlighting strings wrapped in backticks within comments
 * @author Ryan D. Najac <ryan.najac@columbia.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "comment",

  rules: {
    source_file: ($) => repeat($.comment),

    comment: ($) =>
      prec.right(
        repeat1(
          choice(
            $.text,
            // alias($._text, "text"),
            $.inline_code,
          ),
        ),
      ),

    inline_code: ($) => seq("`", $.source_code, "`"),

    // Matches any characters except backticks and newlines
    source_code: (_) => /[^\n`]+/,

    // Matches any text that isn't a backtick or newline
    text: (_) => /[^\n`]+/,
  },
});
