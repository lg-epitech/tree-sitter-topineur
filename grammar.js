/**
 * @file Topineur grammar for tree-sitter
 * @author Laurent Gonzalez <laurent.gonzalez@epitech.eu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "topineur",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
