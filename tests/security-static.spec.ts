import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import ts from "typescript";

test.describe("Static Security Guard: Server Actions & Admin Route Authorization", () => {
  // Helper to recursively collect files
  function getFiles(dir: string, ext = ".ts"): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...getFiles(fullPath, ext));
      } else if (entry.name.endsWith(ext) || entry.name.endsWith(".tsx")) {
        results.push(fullPath);
      }
    }
    return results;
  }

  test("1. Every exported server action function must enforce authorization (AST inspection)", () => {
    const srcDir = path.join(process.cwd(), "src");
    const allFiles = getFiles(srcDir);
    const serverActionFiles = allFiles.filter((filePath) => {
      const content = fs.readFileSync(filePath, "utf-8");
      return content.includes('"use server"') || content.includes("'use server'");
    });

    expect(serverActionFiles.length).toBeGreaterThanOrEqual(8);

    const unprotectedActions: string[] = [];

    // Explicit public action exemptions (e.g. read-only catalog queries or public form submission)
    const publicActionWhitelist = new Set([
      "getFaqs",
      "getTestimonials",
      "submitCommission", // guest brief submission; validates payload & optional session
    ]);

    for (const filePath of serverActionFiles) {
      const content = fs.readFileSync(filePath, "utf-8");
      const relPath = path.relative(process.cwd(), filePath);

      const sourceFile = ts.createSourceFile(
        filePath,
        content,
        ts.ScriptTarget.Latest,
        true
      );

      function visit(node: ts.Node) {
        if (ts.isFunctionDeclaration(node) && node.name) {
          const isExported = node.modifiers?.some(
            (m) => m.kind === ts.SyntaxKind.ExportKeyword
          );
          if (isExported && node.body) {
            const funcName = node.name.text;
            if (!publicActionWhitelist.has(funcName)) {
              const bodyText = node.body.getText(sourceFile);
              const hasGuard =
                bodyText.includes("requireAdmin") ||
                bodyText.includes("getServerSession") ||
                bodyText.includes("authOptions");

              if (!hasGuard) {
                unprotectedActions.push(`${relPath} -> ${funcName}()`);
              }
            }
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(sourceFile);
    }

    expect(
      unprotectedActions,
      `Detected exported server action functions lacking authorization: ${unprotectedActions.join(", ")}`
    ).toHaveLength(0);
  });

  test("2. Every /api/admin/** route must enforce admin authorization", () => {
    const adminApiDir = path.join(process.cwd(), "src", "app", "api", "admin");
    const adminRoutes = getFiles(adminApiDir).filter(
      (f) => f.endsWith("route.ts") || f.endsWith("route.js")
    );

    expect(adminRoutes.length).toBeGreaterThanOrEqual(2);

    const unverifiedRoutes: string[] = [];

    for (const routePath of adminRoutes) {
      const content = fs.readFileSync(routePath, "utf-8");
      const hasAdminGuard =
        content.includes("requireAdmin") ||
        (content.includes("getServerSession") && content.includes('"ADMIN"'));

      if (!hasAdminGuard) {
        unverifiedRoutes.push(path.relative(process.cwd(), routePath));
      }
    }

    expect(
      unverifiedRoutes,
      `Detected admin API routes lacking ADMIN session checks: ${unverifiedRoutes.join(", ")}`
    ).toHaveLength(0);
  });

  test("3. Upload endpoint (/api/upload) must enforce admin authorization", () => {
    const uploadRoutePath = path.join(process.cwd(), "src", "app", "api", "upload", "route.ts");
    expect(fs.existsSync(uploadRoutePath)).toBe(true);

    const content = fs.readFileSync(uploadRoutePath, "utf-8");
    const hasAdminGuard =
      content.includes("getServerSession") && /['"]ADMIN['"]/.test(content);

    expect(
      hasAdminGuard,
      "Upload route /api/upload must require ADMIN session to prevent unauthorized storage uploads"
    ).toBe(true);
  });
});
