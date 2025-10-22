package tree_sitter_topineur_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_topineur "github.com/lg-epitech/tree-sitter-topineur/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_topineur.Language())
	if language == nil {
		t.Errorf("Error loading Topineur grammar")
	}
}
