;; ──────────────────────────────
;;  Topineur highlight queries
;; ──────────────────────────────

;; ------------------------------
;; Keywords and builtins
;; ------------------------------
[
  "def"
  "if"
  "then"
  "else"
  "top"
  "package"
  "import"
  "object"
  "type"
  "let"
  "in"
  "fun"
  "while"
  "for"
  "do"
  "end"
  "in"
] @keyword

;; Operators
(operators) @operator

;; ------------------------------
;; Comments
;; ------------------------------
(comment) @comment

;; ------------------------------
;; Punctuation
;; ------------------------------
[
  "(" ")" "{" "}" "[" "]"
  ":" "." ".."
  ","
  "=" "->"
] @punctuation.bracket

[
  "@"
] @constant.builtin

;; ------------------------------
;; General identifiers (fallback)
;; ------------------------------
(identifier) @variable

;; ------------------------------
;; Object types
;; ------------------------------
(object_type_declaration name: (identifier) @type)
(field_declaration name: (identifier) @variable.other.member)
(field_declaration type: (type) @type)

;; ------------------------------
;; Let bindings
;; ------------------------------
(let_binding name: (identifier) @variable)
(let_binding type: (type) @type)
(let_expression name: (identifier) @variable)

;; ------------------------------
;; Self references
;; ------------------------------
(self_reference) @variable.builtin

;; ------------------------------
;; Member access
;; ------------------------------
(member_expression member: (identifier) @variable.other.member)

;; ------------------------------
;; Method calls
;; ------------------------------
(method_call method: (identifier) @function.method)

;; ------------------------------
;; Object literals
;; ------------------------------
(object_literal type: (identifier) @type)
(field_assignment) @variable.other.member

;; ------------------------------
;; Function definitions (override variable for function names)
;; ------------------------------
(function_definition name: (identifier) @function)
(function_definition decorator: (identifier) @constant.builtin)
(function_definition return_type: (type) @type)
(parameter name: (identifier) @variable.parameter)
(parameter type: (type) @type)

;; ------------------------------
;; Function calls (override variable for function names)
;; ------------------------------
(call_expression function: (identifier) @function)

;; Builtin function calls
(call_expression function: (identifier) @function.builtin
  (#match? @function.builtin "^(println|show)$"))

;; Anonymous functions
(anonymous_function) @function

;; ------------------------------
;; Declarations
;; ------------------------------
(package_decl name: (dotted_identifier path: (identifier) @namespace))
(import_decl name: (dotted_identifier path: (identifier) @namespace))

;; ------------------------------
;; Type identifiers and their contents
;; ------------------------------
;; Builtin types (must come before general type rule)
((type_identifier) @type.builtin
  (#match? @type.builtin "^(Int|String|List|Float|Tuple)$"))

;; Builtin types in generic types
((generic_type name: (identifier) @type.builtin)
  (#match? @type.builtin "^(Int|String|List|Float|Tuple)$"))

;; Builtin types in type annotations
((type (type_identifier) @type.builtin)
  (#match? @type.builtin "^(Int|String|List|Float|Tuple)$"))

;; Builtin types as identifiers in type contexts
((type (identifier) @type.builtin)
  (#match? @type.builtin "^(Int|String|List|Float|Tuple)$"))

;; General type identifiers
(type_identifier) @type

;; Generic types - highlight name and type parameters
(generic_type name: (identifier) @type)
(generic_type) @type

;; Recursively highlight types inside types
(type (type_identifier) @type)
(type (identifier) @type)
(type (generic_type) @type)

;; ------------------------------
;; Literals
;; ------------------------------
(string) @string
(number) @number
(float_number) @number
(tuple_expression) @constructor
(array_expression) @constructor

