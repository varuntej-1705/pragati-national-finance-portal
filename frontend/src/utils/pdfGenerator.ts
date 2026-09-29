import { jsPDF } from 'jspdf';
import { UserProfile } from '../types';

export interface RepaymentPdfData {
  profile: UserProfile;
  schemeType: 'term' | 'micro';
  projectCost: number;
  nsfdcShare: number;
  marginShare: number;
  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
  monthlyEmi: number;
  commercialEmi: number;
  totalSubsidySavings: number;
}

export function generateRepaymentSchedulePdf(data: RepaymentPdfData): void {
  const {
    profile,
    schemeType,
    projectCost,
    nsfdcShare,
    marginShare,
    interestRate,
    tenureYears,
    moratoriumMonths,
    monthlyEmi,
    commercialEmi,
    totalSubsidySavings
  } = data;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm
  const rightEdge = margin + contentWidth;     // 196 mm

  // ─────────────────────────────────────────────────────────────
  // 1. TRICOLOR TOP ACCENT BAR
  // ─────────────────────────────────────────────────────────────
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(0, 0, pageWidth, 2.5, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(0, 2.5, pageWidth, 1, 'F');
  doc.setFillColor(19, 136, 8);   // Green
  doc.rect(0, 3.5, pageWidth, 2.5, 'F');

  // ─────────────────────────────────────────────────────────────
  // 2. OFFICIAL HEADER BANNER
  // ─────────────────────────────────────────────────────────────
  doc.setFillColor(10, 37, 96); // Deep Navy (#0a2560)
  doc.rect(0, 6, pageWidth, 26, 'F');

  doc.setTextColor(251, 191, 36); // Amber 400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(
    'GOVERNMENT OF INDIA  •  MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT',
    pageWidth / 2,
    11.5,
    { align: 'center' }
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12.5);
  doc.text(
    'PRAGATI • NATIONAL CONCESSIONAL CREDIT GATEWAY',
    pageWidth / 2,
    18,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(
    'National Scheduled Castes & Backward Classes Finance and Development Corporations (NSFDC / NBCFDC)',
    pageWidth / 2,
    23,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(147, 197, 253); // Light Blue
  doc.text(
    'OFFICIAL LOAN FEASIBILITY & INDICATIVE REPAYMENT STATEMENT',
    pageWidth / 2,
    28,
    { align: 'center' }
  );

  let y = 35;

  // ─────────────────────────────────────────────────────────────
  // 3. REFERENCE ID & STATUS RIBBON
  // ─────────────────────────────────────────────────────────────
  const refNumber = `PRAGATI/2026/FIN-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 11, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`REFERENCE ID: ${refNumber}`, margin + 4, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`GENERATED ON: ${dateStr}`, margin + 4, y + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 55, 176);
  doc.text('NIC CERTIFIED DBT REPOSITORY', rightEdge - 4, y + 4.5, { align: 'right' });
  doc.setTextColor(16, 149, 102);
  doc.text('STATUS: CONCESSIONAL SANCTION ELIGIBLE', rightEdge - 4, y + 8.5, { align: 'right' });

  y += 14;

  // Helper for Section Titles
  const drawSectionHeader = (title: string, currentY: number): number => {
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, currentY, contentWidth, 5.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(title, margin + 4, currentY + 3.8);
    return currentY + 5.5;
  };

  // ─────────────────────────────────────────────────────────────
  // 4. SECTION 1: BENEFICIARY PROFILE & REGISTRATION SUMMARY
  // ─────────────────────────────────────────────────────────────
  y = drawSectionHeader('SECTION 1: BENEFICIARY PROFILE & REGISTRATION SUMMARY', y);

  const sec1Height = 22;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, sec1Height, 'FD');

  // Two balanced columns: Left (width = 91mm), Right (width = 91mm)
  const midX = margin + contentWidth / 2; // 14 + 91 = 105
  doc.setDrawColor(241, 245, 249);
  doc.line(midX, y, midX, y + sec1Height);

  // Left Column fields
  const leftFields = [
    { label: 'Beneficiary Name', val: profile.name || 'Varun Kumar' },
    { label: 'Registered Mobile', val: `+91 ${profile.phone || '9959999429'}` },
    { label: 'Target District / State', val: `${profile.location?.district || 'Mohanlalganj'}, ${profile.location?.state || 'Uttar Pradesh'}` }
  ];

  // Right Column fields
  const rightFields = [
    { label: 'Social Category', val: `${(profile.caste || 'OBC')} (Priority Concession)` },
    { label: 'Concession Tier', val: 'Direct Subvention Scheme' },
    { label: 'Target Activity', val: profile.projectType || 'Small Business / MSME' }
  ];

  let fieldY = y + 4.5;
  for (let i = 0; i < 3; i++) {
    // Left column
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(leftFields[i].label + ':', margin + 4, fieldY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(leftFields[i].val, margin + 38, fieldY);

    // Right column
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(rightFields[i].label + ':', midX + 4, fieldY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(rightFields[i].val, midX + 34, fieldY);

    fieldY += 6;
  }

  y += sec1Height + 3;

  // ─────────────────────────────────────────────────────────────
  // 5. SECTION 2: CONCESSIONAL FINANCIAL STRUCTURE & CAPITAL ALLOCATION
  // ─────────────────────────────────────────────────────────────
  y = drawSectionHeader('SECTION 2: CONCESSIONAL FINANCIAL STRUCTURE & CAPITAL ALLOCATION', y);

  const schemeName = schemeType === 'term' ? 'Term Loan Scheme (TL-90)' : 'Micro Credit Finance (MCF-100)';

  // Financial parameter table: 4 clean rows + 1 highlighted summary strip
  const finTableRows: { label1: string; val1: string; highlight1?: boolean; label2: string; val2: string; highlight2?: boolean }[] = [
    {
      label1: 'Recommended Scheme Facility',
      val1: schemeName,
      highlight1: true,
      label2: 'Total Assessed Project Outlay',
      val2: `Rs. ${projectCost.toLocaleString('en-IN')}`
    },
    {
      label1: 'Concessional Debt (Principal)',
      val1: `Rs. ${nsfdcShare.toLocaleString('en-IN')}`,
      highlight1: true,
      label2: 'Promoter Margin Contribution',
      val2: `Rs. ${marginShare.toLocaleString('en-IN')}`
    },
    {
      label1: 'Effective Subsidized Rate',
      val1: `${interestRate.toFixed(2)}% p.a. (Fixed)`,
      highlight1: true,
      label2: 'Commercial Benchmark Rate',
      val2: '11.50% p.a. (Open Market)'
    },
    {
      label1: 'Loan Tenure & Moratorium',
      val1: `${tenureYears} Years (${moratoriumMonths}m Moratorium)`,
      label2: 'Subsidized Monthly EMI',
      val2: `Rs. ${monthlyEmi.toLocaleString('en-IN')} / mo`,
      highlight2: true
    }
  ];

  const rowH = 6;
  const sec2TableHeight = finTableRows.length * rowH;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, sec2TableHeight, 'FD');

  // Vertical divider down middle
  doc.setDrawColor(241, 245, 249);
  doc.line(midX, y, midX, y + sec2TableHeight);

  let finY = y + 4.2;
  finTableRows.forEach((r, idx) => {
    // Alternating faint row shading
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y + idx * rowH, contentWidth, rowH, 'F');
    }

    // Left column: label left-aligned, value right-aligned at midX - 4
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(r.label1, margin + 4, finY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r.highlight1 ? 0 : 15, r.highlight1 ? 55 : 23, r.highlight1 ? 176 : 42);
    doc.text(r.val1, midX - 4, finY, { align: 'right' });

    // Right column: label left-aligned, value right-aligned at rightEdge - 4
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(r.label2, midX + 4, finY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r.highlight2 ? 16 : 15, r.highlight2 ? 149 : 23, r.highlight2 ? 102 : 42);
    doc.text(r.val2, rightEdge - 4, finY, { align: 'right' });

    finY += rowH;
  });

  y += sec2TableHeight;

  // Subvention Savings Highlight Strip
  doc.setFillColor(240, 253, 244); // Light Emerald bg
  doc.setDrawColor(187, 247, 208); // Emerald border
  doc.rect(margin, y, contentWidth, 7, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52); // Dark Emerald
  doc.text('DIRECT BENEFICIARY SUBVENTION BENEFIT:', margin + 4, y + 4.5);

  const savingsText = `Total Interest Savings of Rs. ${totalSubsidySavings.toLocaleString('en-IN')} over commercial bank rates (Estimated at Rs. ${commercialEmi.toLocaleString('en-IN')}/mo)`;
  doc.setFont('helvetica', 'normal');
  doc.text(savingsText, rightEdge - 4, y + 4.5, { align: 'right' });

  y += 10;

  // ─────────────────────────────────────────────────────────────
  // 6. SECTION 3: INDICATIVE AMORTIZATION & DEBT SERVICE SCHEDULE
  // ─────────────────────────────────────────────────────────────
  y = drawSectionHeader('SECTION 3: INDICATIVE YEAR-BY-YEAR AMORTIZATION & DEBT SERVICE SCHEDULE', y);

  // Column geometry (total width = 182mm)
  // Col 0: PERIOD (22mm)           -> [14, 36]
  // Col 1: OPENING DEBT (32mm)     -> [36, 68]     right-align at 66
  // Col 2: PRINCIPAL REPAID (32mm) -> [68, 100]    right-align at 98
  // Col 3: INTEREST CHARGED (32mm) -> [100, 132]   right-align at 130
  // Col 4: ANNUAL EMI (32mm)       -> [132, 164]   right-align at 162
  // Col 5: CLOSING DEBT (32mm)     -> [164, 196]   right-align at 194
  const colDefs = [
    { label: 'PERIOD', xLeft: margin + 3, xRight: margin + 20, align: 'left' as const },
    { label: 'OPENING DEBT (Rs.)', xLeft: margin + 22, xRight: margin + 52, align: 'right' as const },
    { label: 'PRINCIPAL REPAID (Rs.)', xLeft: margin + 54, xRight: margin + 84, align: 'right' as const },
    { label: 'INTEREST (Rs.)', xLeft: margin + 86, xRight: margin + 116, align: 'right' as const },
    { label: 'ANNUAL EMI (Rs.)', xLeft: margin + 118, xRight: margin + 148, align: 'right' as const },
    { label: 'CLOSING DEBT (Rs.)', xLeft: margin + 150, xRight: rightEdge - 3, align: 'right' as const }
  ];

  // Table Header Row
  const thHeight = 6;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, thHeight, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y + thHeight, rightEdge, y + thHeight);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);

  colDefs.forEach(col => {
    if (col.align === 'right') {
      doc.text(col.label, col.xRight, y + 4.2, { align: 'right' });
    } else {
      doc.text(col.label, col.xLeft, y + 4.2);
    }
  });

  y += thHeight;

  // Calculate Amortization Rows (cap display at 10 years to preserve 1-page layout)
  let currentBalance = nsfdcShare;
  const annualEmi = monthlyEmi * 12;
  const monthlyRate = interestRate / 100 / 12;
  const displayYears = Math.min(tenureYears, 10);
  const rowHeight = 5.2;

  for (let year = 1; year <= displayYears; year++) {
    const openingYearBalance = currentBalance;
    let interestPaidThisYear = 0;
    let principalPaidThisYear = 0;

    for (let m = 1; m <= 12; m++) {
      const monthInterest = currentBalance * monthlyRate;
      let monthPrincipal = monthlyEmi - monthInterest;
      if (monthPrincipal > currentBalance) monthPrincipal = currentBalance;

      interestPaidThisYear += monthInterest;
      principalPaidThisYear += monthPrincipal;
      currentBalance -= monthPrincipal;
      if (currentBalance < 0) currentBalance = 0;
    }

    // Row Background (zebra stripe)
    const isEven = year % 2 === 0;
    doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');

    // Row Bottom Border
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowHeight, rightEdge, y + rowHeight);

    // Row Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);

    const periodStr = `Year ${year}`;
    const openingStr = Math.round(openingYearBalance).toLocaleString('en-IN');
    const principalStr = Math.round(principalPaidThisYear).toLocaleString('en-IN');
    const interestStr = Math.round(interestPaidThisYear).toLocaleString('en-IN');
    const emiStr = Math.round(annualEmi).toLocaleString('en-IN');
    const closingStr = Math.round(currentBalance).toLocaleString('en-IN');

    doc.text(periodStr, colDefs[0].xLeft, y + 3.7);
    doc.text(openingStr, colDefs[1].xRight, y + 3.7, { align: 'right' });
    doc.text(principalStr, colDefs[2].xRight, y + 3.7, { align: 'right' });
    doc.text(interestStr, colDefs[3].xRight, y + 3.7, { align: 'right' });
    doc.text(emiStr, colDefs[4].xRight, y + 3.7, { align: 'right' });

    // Closing debt bolded
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(closingStr, colDefs[5].xRight, y + 3.7, { align: 'right' });

    y += rowHeight;
  }

  y += 3;

  // ─────────────────────────────────────────────────────────────
  // 7. SECURITY HASH, VERIFICATION STAMP & LEGAL DISCLAIMER
  // ─────────────────────────────────────────────────────────────
  const footerCardHeight = 22;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, footerCardHeight, 1.5, 1.5, 'FD');

  // Left Legal Notes (Width = 120mm)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('ELECTRONIC AUTHENTICATION & STATUTORY COMPLIANCE', margin + 4, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text(
    '1. Digitally compiled via PRAGATI Concessional Finance Engine for beneficiary loan facilitation and assessment.',
    margin + 4,
    y + 8.5
  );
  doc.text(
    '2. Concession subventions and terms are governed strictly under NBCFDC / NSFDC / NSKFDC statutory guidelines.',
    margin + 4,
    y + 12.5
  );
  doc.text(
    '3. Present this document with Aadhaar and caste credentials at your nearest State Channelising Agency (SCA) or RRB branch.',
    margin + 4,
    y + 16.5
  );

  // Right Digital Stamp Box (Width = 50mm, from rightEdge - 52 to rightEdge - 2)
  const stampWidth = 50;
  const stampX = rightEdge - stampWidth - 2;
  const stampCenter = stampX + stampWidth / 2;

  doc.setDrawColor(0, 55, 176);
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(stampX, y + 2.5, stampWidth, 17, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 55, 176);
  doc.text('NIC DIGITAL GATEWAY', stampCenter, y + 6.8, { align: 'center' });

  doc.setTextColor(16, 149, 102);
  doc.setFontSize(7);
  doc.text('✓ DIGITALLY VERIFIED', stampCenter, y + 10.8, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`HASH: ${Math.random().toString(36).substring(2, 10).toUpperCase()}-DBT-2026`, stampCenter, y + 15, { align: 'center' });

  // ─────────────────────────────────────────────────────────────
  // 8. PAGE FOOTER & TRICOLOR ACCENT
  // ─────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('PRAGATI • Ministry of Social Justice & Empowerment • Government of India', margin, 290);
  doc.text('Page 1 of 1 • System Generated Official Document', rightEdge, 290, { align: 'right' });

  // Tricolor Bottom Strip
  doc.setFillColor(255, 153, 51);
  doc.rect(0, 292.5, pageWidth, 1.5, 'F');
  doc.setFillColor(19, 136, 8);
  doc.rect(0, 294, pageWidth, 3, 'F');

  // ─────────────────────────────────────────────────────────────
  // 9. SAVE FILE
  // ─────────────────────────────────────────────────────────────
  const safeName = (profile.name || 'Citizen').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`PRAGATI_Loan_Schedule_${safeName}.pdf`);
}
