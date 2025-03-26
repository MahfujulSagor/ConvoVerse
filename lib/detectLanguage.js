// detectLanguage.js
export function detectLanguage(text) {
  if (!text) return "Unknown";

  // Python
  if (
    text.includes("def ") ||
    text.includes("import ") ||
    text.includes("print(") ||
    text.includes("self.") ||
    text.includes("lambda")
  ) {
    return "Python";
  }

  // JavaScript
  if (
    text.includes("function ") ||
    text.includes("console.log(") ||
    text.includes("const ") ||
    text.includes("let ") ||
    text.includes("=>")
  ) {
    return "JavaScript";
  }

  // TypeScript
  if (
    text.includes("interface ") ||
    text.includes("type ") ||
    text.includes(": string") ||
    text.includes(": number") ||
    text.includes("readonly ")
  ) {
    return "TypeScript";
  }

  // C/C++
  if (
    text.includes("#include") ||
    text.includes("int main(") ||
    text.includes("std::") ||
    text.includes("printf(") ||
    text.includes("cout <<")
  ) {
    return "C/C++";
  }

  // Java
  if (
    text.includes("public class ") ||
    text.includes("System.out.println(") ||
    text.includes("void main(") ||
    text.includes("import java.")
  ) {
    return "Java";
  }

  // C#
  if (
    text.includes("using System;") ||
    text.includes("namespace ") ||
    text.includes("public class ") ||
    text.includes("Console.WriteLine(")
  ) {
    return "C#";
  }

  // PHP
  if (
    text.includes("<?php") ||
    text.includes("echo ") ||
    text.includes("$") ||
    text.includes("->") ||
    text.includes("function ")
  ) {
    return "PHP";
  }

  // Ruby
  if (
    text.includes("def ") ||
    text.includes("puts ") ||
    text.includes("end") ||
    text.includes("do ") ||
    text.includes(":symbol")
  ) {
    return "Ruby";
  }

  // Swift
  if (
    text.includes("func ") ||
    text.includes("import Swift") ||
    text.includes("let ") ||
    text.includes("print(")
  ) {
    return "Swift";
  }

  // Go
  if (
    text.includes("package main") ||
    text.includes("func main()") ||
    text.includes("import ") ||
    text.includes("fmt.")
  ) {
    return "Go";
  }

  // Kotlin
  if (
    text.includes("fun main()") ||
    text.includes("val ") ||
    text.includes("var ") ||
    text.includes("println(")
  ) {
    return "Kotlin";
  }

  // Rust
  if (
    text.includes("fn main()") ||
    text.includes("let mut ") ||
    text.includes("println!") ||
    text.includes("use std::")
  ) {
    return "Rust";
  }

  return "Unknown";
}
