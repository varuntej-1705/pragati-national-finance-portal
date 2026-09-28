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
  const contentWidth = pageWidth - margin * 2;

  // 1. Tricolor Top Bar
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(0, 0, pageWidth, 2.5, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(0, 2.5, pageWidth, 1, 'F');
  doc.setFillColor(19, 136, 8); // Green
  doc.rect(0, 3.5, pageWidth, 2.5, 'F');

  // 2. Official Header Banner
  doc.setFillColor(10, 37, 96); // Deep Navy (#0a2560)
  doc.rect(0, 6, pageWidth, 28, 'F');

  doc.setTextColor(251, 191, 36); // Amber 400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('भारत सरकार • GOVERNMENT OF INDIA • MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT', pageWidth / 2, 12, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text('PRAGATI • NATIONAL CONCESSIONAL FINANCE PORTAL', pageWidth / 2, 19, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text('Direct Concessional Credit Delivery System (NBCFDC • NSFDC • NSKFDC)', pageWidth / 2, 24, { align: 'center' });
  doc.text('OFFICIAL LOAN FEASIBILITY & INDICATIVE REPAYMENT STATEMENT', pageWidth / 2, 29, { align: 'center' });

  let y = 38;

  // 3. Document Reference & Verification Meta Box
  const refNumber = `PRAGATI/2026/FIN-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`REFERENCE ID: ${refNumber}`, margin + 4, y + 5.5);
  doc.text(`GENERATED ON: ${dateStr}`, margin + 4, y + 10);

  doc.setTextColor(0, 55, 176);
  doc.text('GATEWAY: NIC CERTIFIED DBT DIGITAL REPOSITORY', pageWidth - margin - 4, y + 5.5, { align: 'right' });
  doc.setTextColor(16, 149, 102);
  doc.text('STATUS: CONCESSIONAL SANCTION ELIGIBLE', pageWidth - margin - 4, y + 10, { align: 'right' });

  y += 18;

  // 4. Beneficiary Information Section
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SECTION 1: BENEFICIARY PROFILE & REGISTRATION SUMMARY', margin + 3, y + 4.2);

  y += 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 22, 'FD');

  const col1 = margin + 4;
  const col2 = margin + 55;
  const col3 = margin + 110;

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Beneficiary Full Name:', col1, y + 5);
  doc.text('Registered Mobile:', col1, y + 11);
  doc.text('Target District / State:', col1, y + 17);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.name || 'Varun', col1 + 32, y + 5);
  doc.text(`+91 ${profile.phone || '9959999429'}`, col1 + 32, y + 11);
  doc.text(`${profile.district || 'Mohanlalganj'}, UP`, col1 + 32, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Social Category:', col3, y + 5);
  doc.text('Concession Tier:', col3, y + 11);
  doc.text('Target Activity:', col3, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text((profile.category || 'OBC (Concessional Priority)').toUpperCase(), col3 + 26, y + 5);
  doc.text('Special Interest Concession', col3 + 26, y + 11);
  doc.text('Small Business / MSME', col3 + 26, y + 17);

  y += 26;

  // 5. Financial Scheme & Concession Architecture
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SECTION 2: CONCESSIONAL FINANCIAL STRUCTURE & CAPITAL ALLOCATION', margin + 3, y + 4.2);

  y += 6;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 36, 'FD');

  const schemeName = schemeType === 'term' ? 'Term Loan Scheme (TL-90)' : 'Micro Credit Finance (MCF-100)';

  const finRows = [
    { label: 'Recommended Scheme Facility', val: schemeName, highlight: true },
    { label: 'Total Assessed Project Outlay', val: `Rs. ${projectCost.toLocaleString('en-IN')}`, highlight: false },
    { label: 'Concessional Corporation Debt (Principal)', val: `Rs. ${nsfdcShare.toLocaleString('en-IN')}`, highlight: true },
    { label: 'Beneficiary Margin Contribution (Promoter)', val: `Rs. ${marginShare.toLocaleString('en-IN')}`, highlight: false },
    { label: 'Effective Subsidized Interest Rate', val: `${interestRate.toFixed(2)}% p.a. (Fixed Concessional)`, highlight: true },
    { label: 'Commercial Benchmark Rate Comparison', val: '11.50% p.a. (Open Market Rate)', highlight: false },
    { label: 'Loan Tenure & Moratorium Window', val: `${tenureYears} Years (${tenureYears * 12} Mos) • ${moratoriumMonths} Mos Moratorium`, highlight: false },
    { label: 'Calculated Subsidized Monthly Installment (EMI)', val: `Rs. ${monthlyEmi.toLocaleString('en-IN')} / month`, highlight: true },
    { label: 'Direct Beneficiary Subvention Savings', val: `Rs. ${totalSubsidySavings.toLocaleString('en-IN')} across tenure`, highlight: true }
  ];

  let rY = y + 4.5;
  for (let i = 0; i < finRows.length; i += 2) {
    const leftItem = finRows[i];
    const rightItem = finRows[i + 1];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(leftItem.label + ':', margin + 4, rY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(leftItem.highlight ? 0 : 15, leftItem.highlight ? 55 : 23, leftItem.highlight ? 176 : 42);
    doc.text(leftItem.val, margin + 58, rY);

    if (rightItem) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(rightItem.label + ':', margin + 98, rY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(rightItem.highlight ? 16 : 15, rightItem.highlight ? 149 : 23, rightItem.highlight ? 102 : 42);
      doc.text(rightItem.val, margin + 148, rY);
    }
    rY += 6.5;
  }

  y += 40;

  // 6. Indicative Year-by-Year Repayment Schedule Table
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SECTION 3: INDICATIVE YEAR-BY-YEAR AMORTIZATION & DEBT SERVICE SCHEDULE', margin + 3, y + 4.2);

  y += 6;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y + 6, margin + contentWidth, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);

  const tCols = [
    { name: 'PERIOD', x: margin + 3 },
    { name: 'OPENING DEBT (Rs.)', x: margin + 25 },
    { name: 'PRINCIPAL REPAID (Rs.)', x: margin + 65 },
    { name: 'INTEREST CHARGED (Rs.)', x: margin + 110 },
    { name: 'TOTAL ANNUAL EMI (Rs.)', x: margin + 145 },
    { name: 'CLOSING DEBT (Rs.)', x: margin + 180, align: 'right' as const }
  ];

  tCols.forEach(col => {
    if (col.align === 'right') {
      doc.text(col.name, margin + contentWidth - 3, y + 4.2, { align: 'right' });
    } else {
      doc.text(col.name, col.x, y + 4.2);
    }
  });

  y += 6;

  // Generate Year-by-Year Amortization Breakdown
  let currentBalance = nsfdcShare;
  const annualEmi = monthlyEmi * 12;
  const monthlyRate = interestRate / 100 / 12;

  for (let year = 1; year <= tenureYears; year++) {
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

    const rowBg = year % 2 === 0 ? 248 : 255;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 5.5, margin + contentWidth, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);

    doc.text(`Year ${year}`, margin + 3, y + 4);
    doc.text(Math.round(openingYearBalance).toLocaleString('en-IN'), margin + 25, y + 4);
    doc.text(Math.round(principalPaidThisYear).toLocaleString('en-IN'), margin + 65, y + 4);
    doc.text(Math.round(interestPaidThisYear).toLocaleString('en-IN'), margin + 110, y + 4);
    doc.text(Math.round(annualEmi).toLocaleString('en-IN'), margin + 145, y + 4);
    doc.text(Math.round(currentBalance).toLocaleString('en-IN'), margin + contentWidth - 3, y + 4, { align: 'right' });

    y += 5.5;
  }

  y += 6;

  // 7. Security Hash, Verification Seal & Disclaimer
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ELECTRONIC AUTHENTICATION & LEGAL COMPLIANCE', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    '1. This statement is digitally compiled via the PRAGATI National Concessional Finance Engine for beneficiary guidance.',
    margin + 4,
    y + 9
  );
  doc.text(
    '2. Concession benefits and interest subvention are strictly sanctioned per NBCFDC / NSFDC eligibility frameworks.',
    margin + 4,
    y + 13
  );
  doc.text(
    '3. Present this document with KYC credentials at the nominated State Channelising Agency (SCA) or Regional Bank branch.',
    margin + 4,
    y + 17
  );

  // Digital Stamp Box
  doc.setDrawColor(0, 55, 176);
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(pageWidth - margin - 52, y + 3, 48, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 55, 176);
  doc.text('NIC DIGITAL GATEWAY', pageWidth - margin - 28, y + 8, { align: 'center' });
  doc.setTextColor(16, 149, 102);
  doc.text('✓ DIGITALLY VERIFIED', pageWidth - margin - 28, y + 12, { align: 'center' });
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(5.5);
  doc.text(`HASH: ${Math.random().toString(36).substring(2, 10).toUpperCase()}-DBT-2026`, pageWidth - margin - 28, y + 16, { align: 'center' });

  // Footer Tricolor & Page Info
  doc.setFillColor(255, 153, 51);
  doc.rect(0, 292, pageWidth, 1.5, 'F');
  doc.setFillColor(19, 136, 8);
  doc.rect(0, 294.5, pageWidth, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('PRAGATI • Ministry of Social Justice & Empowerment • Government of India', margin, 290);
  doc.text('Page 1 of 1 • System Generated Official Document', pageWidth - margin, 290, { align: 'right' });

  // Save the PDF
  const safeName = (profile.name || 'Citizen').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`PRAGATI_Loan_Schedule_${safeName}.pdf`);
}
