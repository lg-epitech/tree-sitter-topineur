/**
 * @file Topineur grammar for tree-sitter
 * @author Laurent Gonzalez <laurent.gonzalez@epitech.eu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "topineur",

  extras: $ => [/\s/, $.comment],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.__top_level),

    comment: () => token(seq("|-", /.*/)),

    __top_level: $ =>
      choice($.package_decl, $.import_decl, $.function_definition),

    package_decl: ($) => seq("package", field("name", $.identifier)),

    import_decl: ($) => seq("import", field("name", $.identifier)),

    function_definition: ($) =>
      seq(
        optional(repeat(seq("@", field("decorator", $.identifier), optional(field("params", $.parameter_list))))),
        "def",
        field("name", $.identifier),
        field("params", $.parameter_list),
        optional(seq(":", field("return_type", $.type_identifier))),
        field("body", $.block)
      ),

    parameter_list: ($) =>
      seq(
        "(",
        optional(seq($.parameter, repeat(seq(",", $.identifier)))),
        ")"
      ),

    parameter: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", $.type_identifier)
      ),

    block: ($) => seq("{", repeat($._statement), "}"),

    _statement: ($) =>
      choice($.top_statement, $.if_expression, $.expression),

    _simple_statement: ($) =>
      choice($.top_statement, $.expression),

    if_expression: ($) =>
      seq(
        "if",
        field("condition", $.expression),
        "then",
        field("then_branch", $._simple_statement),
        optional(seq(
        "else",
        field("else_branch", $._simple_statement)))
      ),

    _primary_expression: ($) =>
      choice($.identifier, $.number, $.string, $.call_expression),

    call_expression: ($) =>
      seq(
        field("function", $.identifier),
        "(",
        optional(seq($.expression, repeat(seq(",", $.expression)))),
        ")"
      ),

    expression: ($) =>
      choice($.binary_expression, $._primary_expression),

    operators: () => choice("+", "-", "*", "/", "<=", ">=", "<", ">", "%", "==", "++"),

    binary_expression: ($) =>
      prec.left(
        1,
        seq(
          field("left", $.expression),
          field("operator", $.operators),
          field("right", $.expression)
        )
      ),

    top_statement: ($) => seq("top", $.expression),

    identifier: () => /[a-zA-Z_]\w*/,

    type_identifier: () => /[A-Z]\w*/,

    number: () => /\d+/,

    string: () => seq('"', /[^"]*/, '"'),
  }
});
