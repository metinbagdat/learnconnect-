import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Code Quality and Bug Detection Test
 * Tests code logic, error handling, and potential bugs
 */

function testCodeQuality() {
  console.log("=".repeat(60));
  console.log("Code Quality & Bug Detection Test");
  console.log("=".repeat(60));
  
  const issues = [];
  const warnings = [];
  
  // Test 1: Check .env file
  console.log("\n[Test 1] Checking .env configuration...");
  try {
    const envPath = join(process.cwd(), ".env");
    const envContent = readFileSync(envPath, "utf-8");
    
    if (envContent.includes("your_database_connection_string_here")) {
      issues.push("DATABASE_URL still contains placeholder");
      console.log("❌ DATABASE_URL placeholder not replaced");
    } else if (envContent.includes("DATABASE_URL=postgresql://")) {
      console.log("✅ DATABASE_URL is properly configured");
    } else {
      warnings.push("DATABASE_URL format may be incorrect");
      console.log("⚠️  DATABASE_URL format unclear");
    }
  } catch (error) {
    issues.push(".env file not found or unreadable");
    console.log("❌ Cannot read .env file");
  }
  
  // Test 2: Check routes.ts for our fixes
  console.log("\n[Test 2] Checking routes.ts for bug fixes...");
  try {
    const routesPath = join(process.cwd(), "server", "routes.ts");
    const routesContent = readFileSync(routesPath, "utf-8");
    
    // Check for invalid enrollment filtering
    if (routesContent.includes("validEnrolledCourseIds")) {
      console.log("✅ Invalid enrollment filtering implemented");
    } else {
      issues.push("Invalid enrollment filtering not found in routes.ts");
      console.log("❌ Invalid enrollment filtering missing");
    }
    
    // Check for diagnostic endpoint
    if (routesContent.includes("/api/user/courses/diagnostic")) {
      console.log("✅ Diagnostic endpoint implemented");
    } else {
      warnings.push("Diagnostic endpoint not found");
      console.log("⚠️  Diagnostic endpoint missing");
    }
    
    // Check for enhanced logging
    if (routesContent.includes("[Courses Tree] WARNING")) {
      console.log("✅ Enhanced logging implemented");
    } else {
      warnings.push("Enhanced logging may be missing");
      console.log("⚠️  Enhanced logging unclear");
    }
    
    // Check for error handling
    if (routesContent.includes("getAllAncestors") && routesContent.includes("courseMap.has")) {
      console.log("✅ Safe ancestor/descendant lookup implemented");
    } else {
      issues.push("Unsafe course lookup may exist");
      console.log("❌ Safe lookup checks missing");
    }
    
  } catch (error) {
    issues.push("Cannot read routes.ts file");
    console.log("❌ Cannot read routes.ts");
  }
  
  // Test 3: Check use-skill-challenge.tsx
  console.log("\n[Test 3] Checking use-skill-challenge.tsx...");
  try {
    const hookPath = join(process.cwd(), "client", "src", "hooks", "use-skill-challenge.tsx");
    const hookContent = readFileSync(hookPath, "utf-8");
    
    // Check for onSkipChallenge (should NOT exist)
    if (hookContent.includes("onSkipChallenge")) {
      issues.push("onSkipChallenge prop still exists in use-skill-challenge.tsx");
      console.log("❌ onSkipChallenge prop found (should be removed)");
    } else {
      console.log("✅ onSkipChallenge prop removed");
    }
    
    // Check for isValidChallenge helper
    if (hookContent.includes("isValidChallenge")) {
      console.log("✅ Type checking helper implemented");
    } else {
      warnings.push("Type checking could be improved");
      console.log("⚠️  Type checking helper not found");
    }
    
  } catch (error) {
    warnings.push("Cannot read use-skill-challenge.tsx");
    console.log("⚠️  Cannot read use-skill-challenge.tsx");
  }
  
  // Test 4: Check skill-challenge-popup.tsx
  console.log("\n[Test 4] Checking skill-challenge-popup.tsx...");
  try {
    const popupPath = join(process.cwd(), "client", "src", "components", "challenges", "skill-challenge-popup.tsx");
    const popupContent = readFileSync(popupPath, "utf-8");
    
    // Check for unused imports
    const unusedImports = ["Progress", "Clock", "Award"].filter(imp => 
      popupContent.includes(`import.*${imp}`) && !popupContent.match(new RegExp(`\\b${imp}\\b`, "g"))?.length
    );
    
    if (unusedImports.length > 0) {
      warnings.push(`Unused imports in skill-challenge-popup.tsx: ${unusedImports.join(", ")}`);
      console.log(`⚠️  Unused imports: ${unusedImports.join(", ")}`);
    } else {
      console.log("✅ No unused imports detected");
    }
    
    // Check for onSkipChallenge in props (should NOT exist)
    if (popupContent.includes("onSkipChallenge?: () => void")) {
      issues.push("onSkipChallenge prop still in SkillChallengePopupProps");
      console.log("❌ onSkipChallenge prop found in interface");
    } else {
      console.log("✅ onSkipChallenge prop removed from interface");
    }
    
  } catch (error) {
    warnings.push("Cannot read skill-challenge-popup.tsx");
    console.log("⚠️  Cannot read skill-challenge-popup.tsx");
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("CODE QUALITY SUMMARY");
  console.log("=".repeat(60));
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log("✅ All code quality checks passed!");
  } else {
    if (issues.length > 0) {
      console.log(`\n❌ ISSUES FOUND (${issues.length}):`);
      issues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
      warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
    }
  }
  
  console.log("=".repeat(60));
  
  return {
    issues,
    warnings,
    passed: issues.length === 0
  };
}

const results = testCodeQuality();
process.exit(results.passed ? 0 : 1);

