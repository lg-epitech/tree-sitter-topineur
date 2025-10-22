import XCTest
import SwiftTreeSitter
import TreeSitterTopineur

final class TreeSitterTopineurTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_topineur())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Topineur grammar")
    }
}
