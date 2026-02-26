/**
 * Browser-side PDF generator for patent disclosure documents.
 * Uses jspdf (dynamic import for bundle splitting).
 */

import type { Idea, InventorInfo } from "./types";

// ─── Layout constants ──────────────────────────────────────
const PAGE_WIDTH = 210; // A4 mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const LINE_HEIGHT = 6;
const SECTION_GAP = 10;

// ─── Helpers ────────────────────────────────────────────────

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function scoreLabel(score: number | null | undefined): string {
  if (!score && score !== 0) return "N/A";
  return `${score}/9`;
}

function aliceRiskLabel(risk: string | null | undefined): string {
  if (!risk) return "Not assessed";
  return `${risk.charAt(0).toUpperCase()}${risk.slice(1)} Risk`;
}

// ─── Main generator ─────────────────────────────────────────

export async function generatePatentDisclosurePDF(
  idea: Idea,
  inventor: InventorInfo
): Promise<void> {
  // Dynamic import for code splitting
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  let y = 0;

  // ─── Utility functions (scoped to doc instance) ─────────

  function addPage() {
    doc.addPage();
    y = MARGIN;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > 277) { // 297 - 20 margin
      addPage();
    }
  }

  function drawTitle(text: string, size: number = 16) {
    checkPageBreak(size + 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(17, 24, 39); // ink
    doc.text(text, MARGIN, y);
    y += size * 0.5 + 2;
  }

  function drawSectionHeader(text: string) {
    checkPageBreak(14);
    y += 4;
    doc.setFillColor(245, 247, 250); // panel bg
    doc.rect(MARGIN, y - 4, CONTENT_WIDTH, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(31, 76, 235); // blue-ribbon
    doc.text(text.toUpperCase(), MARGIN + 2, y);
    y += 8;
  }

  function drawLabel(label: string) {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99); // text-muted
    doc.text(label, MARGIN, y);
    y += LINE_HEIGHT;
  }

  function drawText(text: string | null | undefined, maxWidth?: number) {
    if (!text) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text("Not provided", MARGIN, y);
      y += LINE_HEIGHT;
      return;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81); // neutral-dark
    const lines = doc.splitTextToSize(text, maxWidth ?? CONTENT_WIDTH);
    for (const line of lines) {
      checkPageBreak(LINE_HEIGHT);
      doc.text(line, MARGIN, y);
      y += LINE_HEIGHT;
    }
  }

  function drawBulletList(items: string[] | null | undefined) {
    if (!items || items.length === 0) {
      drawText(null);
      return;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    for (const item of items) {
      const lines = doc.splitTextToSize(`\u2022 ${item}`, CONTENT_WIDTH - 4);
      for (const line of lines) {
        checkPageBreak(LINE_HEIGHT);
        doc.text(line, MARGIN + 2, y);
        y += LINE_HEIGHT;
      }
    }
  }

  function drawKeyValue(key: string, value: string | null | undefined) {
    checkPageBreak(LINE_HEIGHT + 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text(`${key}: `, MARGIN, y);
    const keyWidth = doc.getTextWidth(`${key}: `);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    const remaining = CONTENT_WIDTH - keyWidth;
    const valText = value || "N/A";
    const lines = doc.splitTextToSize(valText, remaining);
    doc.text(lines[0], MARGIN + keyWidth, y);
    y += LINE_HEIGHT;
    for (let i = 1; i < lines.length; i++) {
      checkPageBreak(LINE_HEIGHT);
      doc.text(lines[i], MARGIN + keyWidth, y);
      y += LINE_HEIGHT;
    }
  }

  function drawDivider() {
    checkPageBreak(4);
    doc.setDrawColor(229, 231, 235); // border
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
    y += 4;
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 1: COVER PAGE
  // ═══════════════════════════════════════════════════════════

  y = 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(17, 24, 39);
  doc.text("Patent Disclosure Document", MARGIN, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(55, 65, 81);
  const titleLines = doc.splitTextToSize(idea.title || "Untitled Idea", CONTENT_WIDTH);
  for (const line of titleLines) {
    doc.text(line, MARGIN, y);
    y += 8;
  }

  y += 20;
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);

  drawKeyValue("Inventor", inventor.name);
  drawKeyValue("Department", inventor.department);
  drawKeyValue("Email", inventor.email);
  y += 4;
  drawKeyValue("Date", formatDate());
  drawKeyValue("Idea ID", idea.id);
  drawKeyValue("Status", idea.status.charAt(0).toUpperCase() + idea.status.slice(1));
  drawKeyValue("Phase", idea.phase.charAt(0).toUpperCase() + idea.phase.slice(1));

  y += 20;
  doc.setDrawColor(31, 76, 235);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("Generated by IP Ramp — Open Source Patent Ideation Platform", MARGIN, y);
  doc.text("CONFIDENTIAL — For Internal Use Only", MARGIN, y + 5);

  // ═══════════════════════════════════════════════════════════
  // PAGE 2: EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════

  addPage();
  drawTitle("Executive Summary");
  y += 4;

  drawSectionHeader("Problem Statement");
  drawText(idea.problemStatement);
  y += SECTION_GAP;

  drawSectionHeader("Proposed Solution");
  drawText(idea.proposedSolution);
  y += SECTION_GAP;

  drawSectionHeader("Existing Approach");
  drawText(idea.existingApproach);
  y += SECTION_GAP;

  if (idea.techStack.length > 0) {
    drawSectionHeader("Tech Stack");
    drawText(idea.techStack.join(", "));
    y += SECTION_GAP;
  }

  drawSectionHeader("Scores");
  const totalScore = idea.score
    ? idea.score.inventiveStep + idea.score.defensibility + idea.score.productFit
    : null;
  drawKeyValue("Patent Readiness (3×3)", scoreLabel(totalScore));
  if (idea.score) {
    drawKeyValue("  Inventive Step", `${idea.score.inventiveStep}/3`);
    drawKeyValue("  Defensibility", `${idea.score.defensibility}/3`);
    drawKeyValue("  Product Fit", `${idea.score.productFit}/3`);
  }
  drawKeyValue("Alice / 101 Score", idea.aliceScore ? `${idea.aliceScore.overallScore}/100` : "Not assessed");
  drawKeyValue("Alice Risk", aliceRiskLabel(idea.aliceScore?.abstractIdeaRisk));
  drawKeyValue("Framework", idea.frameworkUsed === "none" ? "Freeform" : idea.frameworkUsed.toUpperCase());

  // ═══════════════════════════════════════════════════════════
  // PAGE 3: TECHNICAL APPROACH
  // ═══════════════════════════════════════════════════════════

  addPage();
  drawTitle("Technical Approach");
  y += 4;

  drawSectionHeader("Technical Approach");
  drawText(idea.technicalApproach);
  y += SECTION_GAP;

  drawSectionHeader("Contradiction Resolved");
  drawText(idea.contradictionResolved);

  // ═══════════════════════════════════════════════════════════
  // PAGE 4: ALICE / 101 ANALYSIS
  // ═══════════════════════════════════════════════════════════

  if (idea.aliceScore) {
    addPage();
    drawTitle("Alice / Section 101 Analysis");
    y += 4;

    drawSectionHeader("Overall Assessment");
    drawKeyValue("Score", `${idea.aliceScore.overallScore}/100`);
    drawKeyValue("Risk Level", aliceRiskLabel(idea.aliceScore.abstractIdeaRisk));
    y += 4;

    drawSectionHeader("Abstract Idea Analysis");
    drawText(idea.aliceScore.abstractIdeaAnalysis);
    y += SECTION_GAP;

    drawSectionHeader("Practical Application");
    drawText(idea.aliceScore.practicalApplication);
    y += SECTION_GAP;

    drawSectionHeader("Inventive Concept");
    drawText(idea.aliceScore.inventiveConcept);
    y += SECTION_GAP;

    if (idea.aliceScore.recommendations.length > 0) {
      drawSectionHeader("Recommendations");
      drawBulletList(idea.aliceScore.recommendations);
      y += SECTION_GAP;
    }

    if (idea.aliceScore.comparableCases.length > 0) {
      drawSectionHeader("Comparable Cases");
      drawBulletList(idea.aliceScore.comparableCases);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 5: INVENTIVE STEP ANALYSIS
  // ═══════════════════════════════════════════════════════════

  if (idea.inventiveStepAnalysis) {
    addPage();
    drawTitle("Inventive Step Analysis");
    y += 4;

    const isa = idea.inventiveStepAnalysis;

    drawSectionHeader("Primary Inventive Step");
    drawText(isa.primaryInventiveStep);
    y += SECTION_GAP;

    if (isa.secondarySteps.length > 0) {
      drawSectionHeader("Secondary Steps");
      drawBulletList(isa.secondarySteps);
      y += SECTION_GAP;
    }

    drawSectionHeader("Non-Obviousness Argument");
    drawText(isa.nonObviousnessArgument);
    y += SECTION_GAP;

    drawSectionHeader("Technical Advantage");
    drawText(isa.technicalAdvantage);
    y += SECTION_GAP;

    if (isa.closestPriorArt.length > 0) {
      drawSectionHeader("Closest Prior Art");
      drawBulletList(isa.closestPriorArt);
      y += SECTION_GAP;
    }

    if (isa.differentiatingFactors.length > 0) {
      drawSectionHeader("Differentiating Factors");
      drawBulletList(isa.differentiatingFactors);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 6: CLAIMS
  // ═══════════════════════════════════════════════════════════

  if (idea.claimDraft) {
    addPage();
    drawTitle("Patent Claims");
    y += 4;

    const cd = idea.claimDraft;

    if (cd.claimStrategy) {
      drawSectionHeader("Claim Strategy");
      drawText(cd.claimStrategy);
      y += SECTION_GAP;
    }

    drawSectionHeader("Method Claim (Independent)");
    drawText(cd.methodClaim);
    if (cd.methodDependentClaims.length > 0) {
      drawLabel("Dependent Claims:");
      for (const dep of cd.methodDependentClaims) {
        drawText(`${dep.claimNumber}. ${dep.text}`);
      }
    }
    y += SECTION_GAP;

    drawSectionHeader("System Claim (Independent)");
    drawText(cd.systemClaim);
    if (cd.systemDependentClaims.length > 0) {
      drawLabel("Dependent Claims:");
      for (const dep of cd.systemDependentClaims) {
        drawText(`${dep.claimNumber}. ${dep.text}`);
      }
    }
    y += SECTION_GAP;

    drawSectionHeader("Computer-Readable Medium Claim (Independent)");
    drawText(cd.crmClaim);
    if (cd.crmDependentClaims.length > 0) {
      drawLabel("Dependent Claims:");
      for (const dep of cd.crmDependentClaims) {
        drawText(`${dep.claimNumber}. ${dep.text}`);
      }
    }

    if (cd.abstractText) {
      y += SECTION_GAP;
      drawSectionHeader("Abstract");
      drawText(cd.abstractText);
    }

    if (cd.aliceMitigationNotes) {
      y += SECTION_GAP;
      drawSectionHeader("Alice Mitigation Notes");
      drawText(cd.aliceMitigationNotes);
    }

    if (cd.prosecutionTips.length > 0) {
      y += SECTION_GAP;
      drawSectionHeader("Prosecution Tips");
      drawBulletList(cd.prosecutionTips);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 7: RED TEAM / PRIOR ART
  // ═══════════════════════════════════════════════════════════

  if (idea.redTeamNotes || idea.priorArtNotes) {
    addPage();
    drawTitle("Red Team & Prior Art");
    y += 4;

    if (idea.redTeamNotes) {
      drawSectionHeader("Red Team Notes");
      drawText(idea.redTeamNotes);
      y += SECTION_GAP;
    }

    if (idea.priorArtNotes) {
      drawSectionHeader("Prior Art Notes");
      drawText(idea.priorArtNotes);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 8: MARKET ANALYSIS
  // ═══════════════════════════════════════════════════════════

  if (idea.marketNeedsAnalysis) {
    addPage();
    drawTitle("Market Analysis");
    y += 4;

    const mna = idea.marketNeedsAnalysis;

    drawSectionHeader("Market Size");
    drawText(mna.marketSize);
    y += SECTION_GAP;

    if (mna.targetSegments.length > 0) {
      drawSectionHeader("Target Segments");
      drawBulletList(mna.targetSegments);
      y += SECTION_GAP;
    }

    if (mna.painPointsSolved.length > 0) {
      drawSectionHeader("Pain Points Solved");
      drawBulletList(mna.painPointsSolved);
      y += SECTION_GAP;
    }

    drawSectionHeader("Competitive Landscape");
    drawText(mna.competitiveLandscape);
    y += SECTION_GAP;

    drawSectionHeader("Commercialization Potential");
    drawText(mna.commercializationPotential);
    y += SECTION_GAP;

    if (mna.licensingOpportunities.length > 0) {
      drawSectionHeader("Licensing Opportunities");
      drawBulletList(mna.licensingOpportunities);
      y += SECTION_GAP;
    }

    drawSectionHeader("Strategic Value");
    drawText(mna.strategicValue);
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 9: FRAMEWORK DATA
  // ═══════════════════════════════════════════════════════════

  const hasFwData =
    idea.frameworkData.triz ||
    idea.frameworkData.sit ||
    idea.frameworkData.ck ||
    (idea.frameworkData.fmea && idea.frameworkData.fmea.length > 0);

  if (hasFwData) {
    addPage();
    drawTitle("Framework Data");
    y += 4;

    if (idea.frameworkData.triz) {
      const t = idea.frameworkData.triz;
      drawSectionHeader("TRIZ Contradiction Analysis");
      drawKeyValue("Improving Parameter", t.improving);
      drawKeyValue("Worsening Parameter", t.worsening);
      if (t.principles.length > 0) {
        drawKeyValue("Suggested Principles", t.principles.join(", "));
      }
      if (t.resolution) {
        drawLabel("Resolution:");
        drawText(t.resolution);
      }

      // 3-Layer Drills
      if (t.layerDrills && t.layerDrills.length > 0) {
        y += SECTION_GAP;
        drawSectionHeader("3-Layer Patent Drills");
        for (const drill of t.layerDrills) {
          drawDivider();
          drawKeyValue("Principle", `#${drill.principleId}`);
          if (drill.layer1) {
            drawLabel("Layer 1 (Obvious):");
            drawText(drill.layer1);
          }
          if (drill.layer2) {
            drawLabel("Layer 2 (Architectural):");
            drawText(drill.layer2);
          }
          if (drill.layer3) {
            drawLabel("Layer 3 (Inventive Mechanism):");
            drawText(drill.layer3);
          }
          y += 4;
        }
      }

      // Alice Pre-Screen
      if (t.alicePreScreen) {
        y += SECTION_GAP;
        drawSectionHeader("Alice Pre-Screen Results");
        drawKeyValue("Technical Problem", t.alicePreScreen.technicalProblem ? "Yes" : "No");
        drawKeyValue("Specific Solution", t.alicePreScreen.specificSolution ? "Yes" : "No");
        drawKeyValue("Technical Improvement", t.alicePreScreen.technicalImprovement ? "Yes" : "No");
        drawKeyValue("Non-Conventional", t.alicePreScreen.notConventional ? "Yes" : "No");
        drawKeyValue("Score", `${t.alicePreScreen.score}/4`);
        drawKeyValue("Verdict", t.alicePreScreen.verdict.charAt(0).toUpperCase() + t.alicePreScreen.verdict.slice(1));
      }
    }

    if (idea.frameworkData.ck) {
      drawSectionHeader("C-K Theory");
      drawLabel("Concepts:");
      drawText(idea.frameworkData.ck.concepts);
      drawLabel("Knowledge:");
      drawText(idea.frameworkData.ck.knowledge);
      drawLabel("Opportunity:");
      drawText(idea.frameworkData.ck.opportunity);
    }

    if (idea.frameworkData.sit) {
      drawSectionHeader("SIT Templates");
      for (const [key, value] of Object.entries(idea.frameworkData.sit)) {
        drawLabel(`${key.charAt(0).toUpperCase()}${key.slice(1)}:`);
        drawText(value);
      }
    }

    if (idea.frameworkData.fmea && idea.frameworkData.fmea.length > 0) {
      drawSectionHeader("FMEA Inversion");
      for (const entry of idea.frameworkData.fmea) {
        drawDivider();
        drawKeyValue("Failure Mode", entry.failureMode);
        drawKeyValue("Effect", entry.effect);
        drawKeyValue("Severity", `${entry.severity}/10`);
        drawKeyValue("Novel Mitigation", entry.novelMitigation);
        drawKeyValue("Patent Candidate", entry.patentCandidate ? "Yes" : "No");
      }
    }
  }

  // ─── Footer on all pages ───────────────────────────────────

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(`Page ${i} of ${totalPages}`, MARGIN, 290);
    doc.text("IP Ramp — Confidential", PAGE_WIDTH - MARGIN, 290, { align: "right" });
  }

  // ─── Download ───────────────────────────────────────────────

  const filename = `patent-disclosure-${idea.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
