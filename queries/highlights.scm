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
  "(" ")" "{" "}"
  ":"
] @punctuation.bracket

[
  "@"
] @constant.builtin

;; ------------------------------
;; General identifiers (fallback - must be FIRST)
;; ------------------------------
(identifier) @variable

;; ------------------------------
;; Function definitions (override variable for function names)
;; ------------------------------
(function_definition name: (identifier) @function)
(function_definition decorator: (identifier) @constant.builtin)
(function_definition return_type: (type_identifier) @type)
(parameter name: (identifier) @variable.parameter)

;; ------------------------------
;; Function calls (override variable for function names)
;; ------------------------------
(call_expression function: (identifier) @function)

;; Builtin function calls
(call_expression function: (identifier) @function.builtin
  (#match? @function.builtin "^(println|show)$"))

;; ------------------------------
;; Declarations
;; ------------------------------
(package_decl name: (identifier) @namespace)
(import_decl name: (identifier) @namespace)

;; ------------------------------
;; Literals
;; ------------------------------
(string) @string
(number) @number
(type_identifier) @type
