#!/usr/bin/env tsx

/**
 * Architecture Validation Script
 *
 * This script validates the project's architecture conventions as defined in ARCHITECTURE.md.
 * It checks:
 * 1. File naming conventions
 * 2. Folder naming conventions
 * 3. Import rules between layers
 *
 * Run with: pnpm validate:architecture
 *
 * Exit codes:
 * 0 - All validations passed
 * 1 - One or more validation errors found
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

interface ValidationError {
  file: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
  filesChecked: number;
  passed: boolean;
}

interface TraversalResult {
  files: string[];
  folders: string[];
}

// ============================================================================
// Configuration
// ============================================================================

const APP_DIR = path.join(process.cwd(), 'app');

// Import rules: what each layer CAN import from
const ALLOWED_IMPORTS: Record<string, string[]> = {
  _lib: ['_types'],
  _types: [],
  _assets: [],
  _components: ['_lib', '_types', '_assets'],
  _entities: ['_lib', '_types'],
  _hooks: ['_lib', '_types', '_entities'],
  _widgets: ['_entities', '_components', '_hooks', '_lib', '_types', '_assets'],
};

// File naming patterns
const FILE_PATTERNS: Record<string, RegExp> = {
  component: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.tsx$/,
  hook: /^use-[a-z][a-z0-9]*(-[a-z0-9]+)*\.ts$/,
  model: /^model\.ts$/,
  mutations: /^mutations\.ts$/,
  queries: /^queries\.ts$/,
  queryKeys: /^query-keys\.ts$/,
  schema: /^[a-z][a-z0-9]*(-[a-z0-9]+)*-schema\.ts$/,
  options: /^[a-z][a-z0-9]*(-[a-z0-9]+)*-options\.ts$/,
  context: /^[a-z][a-z0-9]*(-[a-z0-9]+)*-context\.tsx$/,
  test: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.test\.tsx?$/,
  page: /^page\.tsx$/,
  layout: /^layout\.tsx$/,
  loading: /^loading\.tsx$/,
  error: /^error\.tsx$/,
  notFound: /^not-found\.tsx$/,
  template: /^template\.tsx$/,
  default: /^default\.tsx$/,
  route: /^route\.ts$/,
  middleware: /^middleware\.ts$/,
  global: /^global\.d\.ts$/,
  index: /^index\.tsx?$/,
};

// Folder naming patterns
const FOLDER_PATTERNS = {
  private: /^_[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
  public: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
  dynamicRoute: /^\[.*\]$/,
  catchAll: /^\[\.\.\..+\]$/,
  optionalCatchAll: /^\[\[.*\]\]$/,
  routeGroup: /^\(.*\)$/,
  jestFixtures: /^__fixtures__$/,
  jestMocks: /^__mocks__$/,
  jestSnapshots: /^__snapshots__$/,
};

// Private layer folders
const PRIVATE_LAYERS = ['_entities', '_widgets', '_components', '_hooks', '_lib', '_types', '_assets'];

// Files to ignore
const IGNORED_FILES = ['.DS_Store', 'Thumbs.db', '.gitkeep'];
const IGNORED_EXTENSIONS = ['.css', '.scss', '.json', '.md', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Traverses a directory and collects all files and folders in a single pass.
 * This is more efficient than separate traversals for files and folders.
 */
function traverseDirectory(dir: string, result: TraversalResult = { files: [], folders: [] }): TraversalResult {
  if (!fs.existsSync(dir)) return result;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.folders.push(fullPath);
      traverseDirectory(fullPath, result);
    } else if (entry.isFile()) {
      result.files.push(fullPath);
    }
  }

  return result;
}

function getRelativePath(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}

function getLayerFromPath(filePath: string): string | null {
  const relativePath = path.relative(APP_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length === 0) return null;

  // Root-level files (page.tsx, layout.tsx, error.tsx, etc.)
  // They can import from any layer
  if (parts.length === 1) return 'app-root';

  const firstPart = parts[0];

  // Check if it's a private layer
  if (PRIVATE_LAYERS.includes(firstPart)) {
    return firstPart;
  }

  // Otherwise it's a feature route
  return 'feature';
}

function getFeatureFromPath(filePath: string): string | null {
  const relativePath = path.relative(APP_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length === 0) return null;

  // Root-level files (page.tsx, layout.tsx, error.tsx, etc.) are not features
  // They have only 1 part which is the filename itself
  if (parts.length === 1) return null;

  const firstPart = parts[0];

  // If it starts with underscore, it's not a feature
  if (firstPart.startsWith('_')) return null;

  return firstPart;
}

/**
 * Extracts import paths from file content.
 * Handles:
 * - Static imports: import { foo } from 'path'
 * - Dynamic imports: import('path')
 * - Re-exports: export { foo } from 'path'
 * - Require: require('path')
 */
function extractImports(fileContent: string): string[] {
  const imports: string[] = [];

  // Match various import patterns including dynamic imports, re-exports, and require
  const importRegex = /(?:import|export|from|require)\s*\(?['"](@\/app\/[^'"]+|\.\.?\/[^'"]+)['"]\)?/g;

  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

function resolveImportPath(importPath: string, sourceFile: string): string | null {
  if (importPath.startsWith('@/app/')) {
    // Absolute import
    return importPath.replace('@/app/', '');
  } else if (importPath.startsWith('.')) {
    // Relative import
    const sourceDir = path.dirname(path.relative(APP_DIR, sourceFile));
    const resolved = path.normalize(path.join(sourceDir, importPath));
    return resolved;
  }

  return null;
}

function getLayerFromImport(importPath: string): string | null {
  const parts = importPath.split('/');

  if (parts.length === 0) return null;

  const firstPart = parts[0];

  if (PRIVATE_LAYERS.includes(firstPart)) {
    return firstPart;
  }

  // Check if it's a feature (doesn't start with _)
  if (!firstPart.startsWith('_') && !firstPart.startsWith('.')) {
    return 'feature:' + firstPart;
  }

  return null;
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateFileName(filePath: string): ValidationError | null {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName);

  // Skip ignored files
  if (IGNORED_FILES.includes(fileName) || IGNORED_EXTENSIONS.includes(ext)) {
    return null;
  }

  // Only validate .ts and .tsx files
  if (ext !== '.ts' && ext !== '.tsx') {
    return null;
  }

  // Check if file matches any known pattern
  const matchesPattern = Object.values(FILE_PATTERNS).some((pattern) => pattern.test(fileName));

  if (!matchesPattern) {
    // Additional check for files that should follow kebab-case
    const kebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.tsx?$/;

    if (!kebabCase.test(fileName)) {
      return {
        file: getRelativePath(filePath),
        rule: 'file-naming',
        message: `File "${fileName}" does not follow kebab-case naming convention`,
        severity: 'error',
      };
    }
  }

  // Specific validations based on location
  const relativePath = path.relative(APP_DIR, filePath);
  const parts = relativePath.split(path.sep);

  // Check hooks naming (simplified condition, added index file exception)
  if (parts.includes('_hooks')) {
    const isTestFile = fileName.endsWith('.test.ts') || fileName.endsWith('.test.tsx');
    const isIndexFile = fileName === 'index.ts' || fileName === 'index.tsx';

    if (ext === '.ts' && !fileName.startsWith('use-') && !isTestFile && !isIndexFile) {
      return {
        file: getRelativePath(filePath),
        rule: 'hook-naming',
        message: `Hook file "${fileName}" should start with "use-" prefix`,
        severity: 'error',
      };
    }
  }

  return null;
}

function validateFolderName(folderPath: string): ValidationError | null {
  const folderName = path.basename(folderPath);
  const relativePath = path.relative(APP_DIR, folderPath);

  // Skip root app folder
  if (relativePath === '') return null;

  // Check if it's a valid Next.js special folder pattern
  const isRouteGroup = FOLDER_PATTERNS.routeGroup.test(folderName);
  const isDynamicRoute = FOLDER_PATTERNS.dynamicRoute.test(folderName);
  const isCatchAll = FOLDER_PATTERNS.catchAll.test(folderName);
  const isOptionalCatchAll = FOLDER_PATTERNS.optionalCatchAll.test(folderName);

  if (isRouteGroup || isDynamicRoute || isCatchAll || isOptionalCatchAll) {
    return null; // Valid Next.js patterns
  }

  // Check if it's a Jest special folder pattern
  const isJestFixtures = FOLDER_PATTERNS.jestFixtures.test(folderName);
  const isJestMocks = FOLDER_PATTERNS.jestMocks.test(folderName);
  const isJestSnapshots = FOLDER_PATTERNS.jestSnapshots.test(folderName);

  if (isJestFixtures || isJestMocks || isJestSnapshots) {
    return null; // Valid Jest patterns
  }

  // Check private folder pattern
  if (folderName.startsWith('_')) {
    if (!FOLDER_PATTERNS.private.test(folderName)) {
      return {
        file: getRelativePath(folderPath),
        rule: 'folder-naming',
        message: `Private folder "${folderName}" should follow _kebab-case pattern`,
        severity: 'error',
      };
    }
    return null;
  }

  // Check public folder pattern (kebab-case)
  if (!FOLDER_PATTERNS.public.test(folderName)) {
    return {
      file: getRelativePath(folderPath),
      rule: 'folder-naming',
      message: `Folder "${folderName}" should follow kebab-case pattern`,
      severity: 'error',
    };
  }

  return null;
}

function validateImports(filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const ext = path.extname(filePath);

  // Only validate .ts and .tsx files
  if (ext !== '.ts' && ext !== '.tsx') {
    return errors;
  }

  // Read file content with error handling
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    errors.push({
      file: getRelativePath(filePath),
      rule: 'file-read',
      message: `Could not read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'warning',
    });
    return errors;
  }

  const imports = extractImports(fileContent);
  const sourceLayer = getLayerFromPath(filePath);
  const sourceFeature = getFeatureFromPath(filePath);

  for (const importPath of imports) {
    const resolvedPath = resolveImportPath(importPath, filePath);

    if (!resolvedPath) continue;

    const targetLayer = getLayerFromImport(resolvedPath);

    if (!targetLayer) continue;

    // Handle feature-to-feature imports
    if (targetLayer.startsWith('feature:')) {
      const targetFeature = targetLayer.replace('feature:', '');

      // Features cannot import from other features
      if (sourceLayer === 'feature' && sourceFeature && sourceFeature !== targetFeature) {
        errors.push({
          file: getRelativePath(filePath),
          rule: 'cross-feature-import',
          message: `Feature "${sourceFeature}" cannot import from feature "${targetFeature}". Move shared code to _entities, _components, or _lib.`,
          severity: 'error',
        });
      }
      continue;
    }

    // Check layer import rules
    if (sourceLayer && sourceLayer !== 'feature' && ALLOWED_IMPORTS[sourceLayer]) {
      const allowedLayers = ALLOWED_IMPORTS[sourceLayer];

      if (!allowedLayers.includes(targetLayer) && targetLayer !== sourceLayer) {
        errors.push({
          file: getRelativePath(filePath),
          rule: 'layer-import',
          message: `Layer "${sourceLayer}" cannot import from "${targetLayer}". Allowed: ${allowedLayers.join(', ') || 'none'}`,
          severity: 'error',
        });
      }
    }
  }

  return errors;
}

/**
 * Validates that test files have corresponding source files (co-location).
 * Handles various source file patterns including context files.
 */
function validateTestFile(filePath: string): ValidationError | null {
  const fileName = path.basename(filePath);

  // Only process test files using regex to extract base name
  const testMatch = fileName.match(/^(.+)\.test\.(tsx?)$/);
  if (!testMatch) {
    return null;
  }

  const baseName = testMatch[1];
  const dir = path.dirname(filePath);

  // Check for possible source file variants
  const possibleSources = [
    `${baseName}.tsx`,
    `${baseName}.ts`,
  ];

  const sourceExists = possibleSources.some((source) =>
    fs.existsSync(path.join(dir, source))
  );

  if (!sourceExists) {
    // This is a warning, not an error, as some tests might be for deleted files during development
    return {
      file: getRelativePath(filePath),
      rule: 'test-colocation',
      message: `Test file "${fileName}" should have a corresponding source file`,
      severity: 'warning',
    };
  }

  return null;
}

// ============================================================================
// Main Validation
// ============================================================================

function validateArchitecture(): ValidationResult {
  const result: ValidationResult = {
    errors: [],
    warnings: [],
    filesChecked: 0,
    passed: true,
  };

  if (!fs.existsSync(APP_DIR)) {
    result.errors.push({
      file: 'app/',
      rule: 'directory-exists',
      message: 'The app/ directory does not exist',
      severity: 'error',
    });
    result.passed = false;
    return result;
  }

  // Get all files and folders in a single traversal (optimized)
  const { files, folders } = traverseDirectory(APP_DIR);

  console.log('\n[Validate] Validating architecture conventions...\n');

  // Validate folder names
  console.log('[Folders] Checking folder naming conventions...');
  for (const folder of folders) {
    const error = validateFolderName(folder);
    if (error) {
      if (error.severity === 'error') {
        result.errors.push(error);
      } else {
        result.warnings.push(error);
      }
    }
  }

  // Validate file names and imports
  console.log('[Files] Checking file naming conventions...');
  console.log('[Imports] Checking import rules...');

  for (const file of files) {
    result.filesChecked++;

    // Validate file name
    const fileError = validateFileName(file);
    if (fileError) {
      if (fileError.severity === 'error') {
        result.errors.push(fileError);
      } else {
        result.warnings.push(fileError);
      }
    }

    // Validate imports
    const importErrors = validateImports(file);
    for (const error of importErrors) {
      if (error.severity === 'error') {
        result.errors.push(error);
      } else {
        result.warnings.push(error);
      }
    }

    // Validate test file co-location
    const testError = validateTestFile(file);
    if (testError) {
      if (testError.severity === 'error') {
        result.errors.push(testError);
      } else {
        result.warnings.push(testError);
      }
    }
  }

  result.passed = result.errors.length === 0;

  return result;
}

function printResults(result: ValidationResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('ARCHITECTURE VALIDATION RESULTS');
  console.log('='.repeat(60) + '\n');

  console.log(`Files checked: ${result.filesChecked}`);
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
  console.log('');

  if (result.errors.length > 0) {
    console.log('ERRORS:\n');
    for (const error of result.errors) {
      console.log(`  ${error.file}`);
      console.log(`    Rule: ${error.rule}`);
      console.log(`    ${error.message}\n`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('WARNINGS:\n');
    for (const warning of result.warnings) {
      console.log(`  ${warning.file}`);
      console.log(`    Rule: ${warning.rule}`);
      console.log(`    ${warning.message}\n`);
    }
  }

  console.log('='.repeat(60));

  if (result.passed) {
    console.log('Architecture validation PASSED!');
  } else {
    console.log('Architecture validation FAILED!');
    console.log('Please fix the errors above before committing.');
  }

  console.log('='.repeat(60) + '\n');
}

// ============================================================================
// Entry Point
// ============================================================================

const result = validateArchitecture();
printResults(result);

// Exit codes:
// 0 - All validations passed
// 1 - One or more validation errors found
process.exit(result.passed ? 0 : 1);
