/**
 * @file Topineur grammar for tree-sitter
 * @author Laurent Gonzalez <laurent.gonzalez@epitech.eu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "topineur",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat($.__top_level),

    comment: () => token(seq("|-", /.*/)),

    __top_level: ($) =>
      choice(
        $.package_decl,
        $.import_decl,
        $.function_definition,
        $.object_type_declaration,
        $.let_binding,
        $.variable_assignment,
      ),

    package_decl: ($) => seq("package", field("name", $.identifier)),

    import_decl: ($) => seq("import", field("name", $.identifier)),

    function_definition: ($) =>
      seq(
        optional(
          repeat(
            seq(
              "@",
              field("decorator", $.identifier),
              optional($._argument_sequence),
            ),
          ),
        ),
        "def",
        field("name", $.identifier),
        field("params", $.parameter_list),
        optional(seq(":", field("return_type", $.type))),
        field("body", $.block),
      ),

    object_type_declaration: ($) =>
      seq(
        "object",
        "type",
        field("name", $.identifier),
        "{",
        repeat(choice($.field_declaration, $.function_definition)),
        "}",
      ),

    field_declaration: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", $.type),
        optional(seq("=", field("default", $._expression))),
      ),

    let_binding: ($) =>
      seq(
        "let",
        field("name", choice($.identifier, $.tuple_pattern)),
        optional(seq(":", field("type", $.type))),
        "=",
        field("value", $._expression),
      ),

    variable_assignment: ($) =>
      seq(
        field("name", choice($.identifier, $.tuple_pattern)),
        "=",
        field("value", $._expression),
      ),

    tuple_pattern: ($) =>
      prec.right(
        10,
        seq(
          "(",
          $.identifier,
          ",",
          seq($.identifier, repeat(seq(",", $.identifier))),
          ")",
        ),
      ),

    parameter_list: ($) => seq("(", optional($._parameter_sequence), ")"),

    _parameter_sequence: ($) =>
      seq($.parameter_or_tuple, repeat(seq(",", $.parameter_or_tuple))),

    parameter_or_tuple: ($) => choice($.parameter, $.tuple_pattern),

    parameter: ($) =>
      seq(field("name", $.identifier), ":", field("type", $.type)),

    block: ($) => seq("{", repeat($._statement), "}"),

    _statement: ($) =>
      choice(
        $.top_statement,
        $.if_expression,
        $.for_expression,
        $.while_expression,
        $.let_binding,
        $.variable_assignment,
        $._expression,
      ),

    for_expression: ($) =>
      seq(
        "for",
        field("variable", $.identifier),
        "in",
        field("start", choice($.number, $.float_number, $.identifier)),
        "..",
        field("end", choice($.number, $.float_number, $.identifier)),
        "do",
        repeat($._statement),
        "end",
      ),

    while_expression: ($) =>
      seq(
        "while",
        field("condition", $._expression),
        "do",
        repeat($._statement),
        "end",
      ),

    if_expression: ($) =>
      prec.left(
        1,
        seq(
          "if",
          field("condition", $._expression),
          "then",
          field("then_branch", $._statement),
          optional(seq("else", field("else_branch", $._statement))),
        ),
      ),

    _expression: ($) =>
      prec.right(
        2,
        choice(
          $.let_expression,
          $.binary_expression,
          $._call_or_member_expression,
        ),
      ),

    let_expression: ($) =>
      prec.right(
        3,
        seq(
          "let",
          field("name", $.identifier),
          "=",
          field("value", $._expression),
          "in",
          field("body", $._expression),
        ),
      ),

    _call_or_member_expression: ($) =>
      choice(
        $.method_call,
        $.call_expression,
        $.member_expression,
        $._primary_expression,
      ),

    _primary_expression: ($) =>
      choice(
        $.identifier,
        $.self_reference,
        $.number,
        $.float_number,
        $.string,
        $.tuple_expression,
        $.array_expression,
        $.object_literal,
        $.parenthesized_expression,
        prec(1, $.anonymous_function),
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    member_expression: ($) =>
      prec.left(
        1,
        seq(
          field("object", $._primary_expression),
          ".",
          field("member", $.identifier),
        ),
      ),

    call_expression: ($) =>
      prec.left(
        1,
        seq(
          field("function", $._primary_expression),
          "(",
          optional($._argument_sequence),
          ")",
        ),
      ),

    _argument_sequence: ($) =>
      seq($._expression, repeat(seq(",", $._expression))),

    method_call: ($) =>
      prec.left(
        2,
        seq(
          field("object", $._primary_expression),
          ".",
          field("method", $.identifier),
          "(",
          optional($._argument_sequence),
          ")",
        ),
      ),

    self_reference: () => "self",

    object_literal: ($) =>
      seq(
        field("type", $.identifier),
        "{",
        optional($._field_assignment_sequence),
        "}",
      ),

    _field_assignment_sequence: ($) =>
      seq($.field_assignment, repeat(seq(",", $.field_assignment))),

    field_assignment: ($) =>
      seq(
        field("name", $.member_or_identifier),
        "=",
        field("value", $._expression),
      ),

    member_or_identifier: ($) => choice($.member_expression, $.identifier),

    array_expression: ($) => seq("[", optional($._array_elements), "]"),

    _array_elements: ($) => seq($._expression, repeat(seq(",", $._expression))),

    tuple_expression: ($) =>
      seq(
        "(",
        $._expression,
        ",",
        seq($._expression, repeat(seq(",", $._expression))),
        ")",
      ),

    anonymous_function: ($) =>
      prec.left(
        10,
        seq(
          "fun",
          $.untyped_parameter_list,
          "->",
          field("body", $._expression),
        ),
      ),

    untyped_parameter_list: ($) =>
      seq("(", optional($._untyped_parameter_sequence), ")"),

    _untyped_parameter_sequence: ($) =>
      seq($.identifier_or_tuple, repeat(seq(",", $.identifier_or_tuple))),

    identifier_or_tuple: ($) => choice($.identifier, $.tuple_pattern),

    expression: ($) => choice($.binary_expression, $._primary_expression),

    operators: () =>
      choice("+", "-", "*", "/", "<=", ">=", "<", ">", "%", "==", "++"),

    binary_expression: ($) =>
      prec.left(
        1,
        seq(
          field("left", $._expression),
          field("operator", $.operators),
          field("right", $._expression),
        ),
      ),

    top_statement: ($) => seq("top", $._expression),

    type: ($) => choice($.generic_type, $.type_identifier, $.identifier),

    generic_type: ($) =>
      seq(
        field("name", $.identifier),
        "[",
        $._type_spec,
        repeat(seq(",", $._type_spec)),
        "]",
      ),

    _type_spec: ($) => choice($.generic_type, $.type_identifier, $.identifier),

    identifier: () => /[a-zA-Z_]\w*/,

    type_identifier: () => /[A-Z]\w*/,

    number: () => /\d+/,

    float_number: () => /\d+\.\d+/,

    string: () => seq('"', /[^"]*/, '"'),
  },
});
