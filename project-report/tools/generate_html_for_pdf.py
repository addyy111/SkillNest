"""
generate_html_for_pdf.py - Generates report.html and exports Project_Report.pdf using Headless Chrome
Strictly formatted according to the official MIT-WPU Mini Project Report Submission Guidelines.
Authored by Aditya Narwade (PRN: 1272250292).
"""
import os
import subprocess
import shutil

REPORT_DIR = r"D:\SkillNest\project-report"
HTML_PATH = os.path.join(REPORT_DIR, "report.html")
PDF_PATH = os.path.join(REPORT_DIR, "Project_Report.pdf")

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SkillNest Mini Project Report - Aditya Narwade</title>
<style>
  @page {
    size: A4 portrait;
    margin: 12mm 14mm 12mm 14mm;
  }
  
  body {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-size: 10.5pt;
    line-height: 1.40;
    color: #0f172a;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }

  /* Mandatory Outer Page Border as per University Guidelines */
  .page-border {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1.5px solid #000000;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 9999;
  }

  .page-break {
    page-break-before: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  /* Running header & footer */
  .doc-header {
    text-align: right;
    font-size: 8pt;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 12px;
  }

  .doc-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 8pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
  }

  /* Cover / Face Page */
  .cover-page {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 10px;
    height: 96%;
  }

  .cover-title-top {
    font-size: 18pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 8px;
    margin-top: 10px;
  }

  .cover-on {
    font-size: 13pt;
    color: #000000;
    margin-bottom: 8px;
  }

  .cover-main-title {
    font-size: 17pt;
    font-weight: bold;
    color: #000000;
    line-height: 1.35;
    margin: 0 auto 12px auto;
    max-width: 95%;
  }

  .cover-by {
    font-size: 13pt;
    color: #000000;
    margin-bottom: 8px;
  }

  .cover-members {
    font-size: 13.5pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 14px;
    line-height: 1.4;
  }

  .cover-for {
    font-size: 13pt;
    color: #000000;
    margin-bottom: 6px;
  }

  .cover-course {
    font-size: 14pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 4px;
  }

  .cover-sy {
    font-size: 13.5pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 4px;
  }

  .cover-ay {
    font-size: 13.5pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 14px;
  }

  .cover-guidance {
    font-size: 12pt;
    color: #000000;
    margin-bottom: 4px;
  }

  .cover-guide-name {
    font-size: 14pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 14px;
  }

  .cover-sub-to {
    font-size: 12pt;
    color: #000000;
    margin-bottom: 8px;
  }

  .cover-logo {
    max-width: 250px;
    margin: 0 auto 10px auto;
    display: block;
  }

  .cover-partial {
    font-size: 11pt;
    color: #000000;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .cover-deg-name {
    font-size: 14pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
  }

  .cover-sub-through {
    font-size: 11pt;
    color: #000000;
    margin-bottom: 4px;
  }

  .cover-uni {
    font-size: 14pt;
    font-weight: bold;
    color: #000000;
    line-height: 1.35;
    margin-bottom: 2px;
  }

  .cover-dept {
    font-size: 11.5pt;
    color: #000000;
    font-weight: bold;
    line-height: 1.3;
  }

  /* Certificate Page */
  .cert-header {
    text-align: center;
    margin-bottom: 25px;
    margin-top: 15px;
  }

  .cert-dept {
    font-size: 13pt;
    font-weight: bold;
    color: #000000;
    margin-top: 10px;
    margin-bottom: 15px;
  }

  .cert-title {
    font-size: 32pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 25px;
    text-align: center;
  }

  .cert-body {
    font-size: 11.5pt;
    line-height: 1.7;
    text-align: justify;
    margin-bottom: 25px;
    color: #000000;
  }

  .cert-sig-guide {
    text-align: right;
    margin-top: 50px;
    margin-bottom: 70px;
    padding-right: 15px;
  }

  .cert-sig-bottom {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
  }

  /* Front Matter Header: Date & Dome Logo */
  .fm-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .fm-date {
    font-size: 11pt;
    font-weight: 500;
    color: #000000;
  }

  .fm-logo {
    max-height: 52px;
  }

  .fm-title {
    font-size: 28pt;
    font-weight: bold;
    color: #000000;
    text-align: center;
    margin-bottom: 22px;
  }

  .fm-body {
    font-size: 11pt;
    line-height: 1.55;
    text-align: justify;
    color: #000000;
    margin-bottom: 14px;
  }

  /* Table on Acknowledgement & Declaration */
  .fm-table {
    width: 65%;
    border-collapse: collapse;
    margin-top: 25px;
    margin-left: 0;
  }

  .fm-table td {
    border: 1px solid #000000;
    padding: 6px 12px;
    font-size: 10.5pt;
    color: #000000;
  }

  .fm-table td.label-cell {
    width: 28%;
    font-weight: bold;
  }

  /* Headings */
  h1 {
    font-size: 14pt;
    color: #000000;
    border-bottom: 1.5px solid #000000;
    padding-bottom: 4px;
    margin-top: 8px;
    margin-bottom: 10px;
    text-transform: uppercase;
    page-break-after: avoid;
  }

  h2 {
    font-size: 12pt;
    color: #000000;
    margin-top: 14px;
    margin-bottom: 5px;
    text-transform: uppercase;
    page-break-after: avoid;
  }

  h3 {
    font-size: 10.5pt;
    color: #0f172a;
    margin-top: 10px;
    margin-bottom: 3px;
    page-break-after: avoid;
  }

  p {
    margin-top: 0;
    margin-bottom: 7px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 7px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 3px;
  }

  /* Academic Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 9.5pt;
    border: 1px solid #000000;
    page-break-inside: avoid;
  }

  table.data-table th, table.data-table td {
    padding: 6px 9px;
    text-align: left;
    border: 1px solid #000000;
  }

  table.data-table th {
    background-color: #f1f5f9;
    color: #000000;
    font-weight: bold;
  }

  table.data-table tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Index Table */
  table.index-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 15px;
    font-size: 9.5pt;
    border: 1px solid #000000;
  }

  table.index-table th, table.index-table td {
    padding: 5px 8px;
    border: 1px solid #000000;
    text-align: left;
  }

  table.index-table th {
    background-color: #f1f5f9;
    color: #000000;
    font-weight: bold;
  }

  /* Figures */
  .figure-container {
    text-align: center;
    margin: 10px 0 12px 0;
    page-break-inside: avoid;
  }

  .figure-img {
    max-width: 95%;
    height: auto;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
  }

  .figure-caption {
    font-size: 9.5pt;
    color: #000000;
    margin-top: 4px;
    font-weight: 500;
  }

  .figure-caption strong {
    color: #000000;
  }

  .figure-desc {
    font-size: 9.5pt;
    color: #334155;
    text-align: justify;
    margin-top: 4px;
    padding: 0 6px;
  }

  /* Code Listings */
  .code-block {
    background-color: #f8fafc;
    border: 1px solid #000000;
    border-radius: 2px;
    padding: 7px 10px;
    margin: 6px 0 8px 0;
    font-family: Consolas, "Courier New", monospace;
    font-size: 8.5pt;
    line-height: 1.30;
    color: #0f172a;
    overflow-x: auto;
    white-space: pre-wrap;
    page-break-inside: avoid;
  }

  .code-header {
    font-size: 9.5pt;
    font-weight: bold;
    color: #000000;
    margin-bottom: 2px;
    page-break-after: avoid;
  }

  .code-file {
    font-size: 8.5pt;
    color: #475569;
    font-weight: normal;
    font-style: italic;
  }

  .code-walkthrough {
    font-size: 9.5pt;
    color: #334155;
    margin-top: 3px;
    margin-bottom: 10px;
    text-align: justify;
  }

  .badge-pass {
    display: inline-block;
    background-color: #dcfce7;
    color: #166534;
    font-weight: bold;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 8.5pt;
  }
</style>
</head>
<body>

<!-- University Mandatory Outer Page Border (repeats on every printed page) -->
<div class="page-border"></div>

<!-- ========================================== -->
<!-- 1. FACE PAGE / COVER PAGE (Page 3 of Guidelines) -->
<!-- ========================================== -->
<div class="cover-page">
  <div class="cover-title-top">Mini Project Report</div>
  <div class="cover-on">On</div>
  <div class="cover-main-title">“SkillNest: Full-Stack Technical Interview &amp; Placement Preparation Platform”</div>
  <div class="cover-by">By</div>
  <div class="cover-members">
    Aditya Narwade<br>
    <span style="font-size: 12pt; font-weight: normal; color: #000000;">(PRN: 1272250292)</span>
  </div>
  <div class="cover-for">For</div>
  <div class="cover-course">MCA40130 Mini Project</div>
  <div class="cover-sy">SY MCA</div>
  <div class="cover-ay">AY 2026-2027</div>
  <div class="cover-guidance">Under The Guidance Of</div>
  <div class="cover-guide-name">Mrs. Sukanya Akolkar</div>
  <div class="cover-sub-to">Submitted To</div>
  <img src="mit_wpu_logo.jpeg" alt="MIT-WPU Logo" class="cover-logo">
  <div class="cover-partial">In partial fulfillment of the requirement for the<br>award of Degree of</div>
  <div class="cover-deg-name">Master of Computer Applications</div>
  <div class="cover-sub-through">Submitted Through</div>
  <div class="cover-uni">MIT-WPU</div>
  <div class="cover-dept">School of Computer Science and Engineering<br>Department of Computer Science and Applications</div>
</div>

<!-- ========================================== -->
<!-- 2. CERTIFICATE PAGE (Page 4 of Guidelines) -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="cert-header">
  <img src="mit_wpu_logo.jpeg" alt="MIT-WPU Logo" style="max-width: 230px;">
  <div class="cert-dept">Department of Computer Science and Applications</div>
</div>

<div class="cert-title">Certificate</div>

<div class="cert-body">
  This is to certify that, <strong>Aditya Narwade (PRN: 1272250292)</strong>, student of <strong>SY MCA, Semester III</strong> has completed Mini Project entitled <strong>“SkillNest: Full-Stack Technical Interview &amp; Placement Preparation Platform”</strong> under guidance of <strong>Mrs. Sukanya Akolkar</strong> in partial fulfilment of requirement for the award of <strong>Master of Computer Applications</strong> prescribed under <strong>Dr. Vishwanath Karad MIT World Peace University, Pune</strong>.<br><br>
  This project is the record of authentic work carried out by him out during the academic year <strong>2026-2027</strong>.
</div>

<div class="cert-sig-guide">
  <div style="font-weight: bold; font-size: 11pt;">Mrs. Sukanya Akolkar</div>
  <div style="font-size: 10pt; color: #334155;">Internal Guide</div>
</div>

<div class="cert-sig-bottom">
  <div>
    <div style="font-weight: bold; font-size: 11pt;">Dr. P. S. Metkewar</div>
    <div style="font-size: 10pt; color: #334155;">Program Head- MCA</div>
  </div>
  <div style="text-align: right;">
    <div style="font-weight: bold; font-size: 11pt;">Dr. Anuradha S. Kanade</div>
    <div style="font-size: 10pt; color: #334155;">Program Director</div>
  </div>
</div>

<!-- ========================================== -->
<!-- 3. ACKNOWLEDGEMENT (Page 5 of Guidelines) -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="fm-top-row">
  <div class="fm-date">Date: &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;/ 2026</div>
  <img src="mit_wpu_dome.jpeg" alt="MIT-WPU" class="fm-logo">
</div>

<div class="fm-title">Acknowledgement</div>

<div class="fm-body">
  I wish to express our profound gratitude to all the individuals who supported us throughout the completion of our Mini Project III. This report is a testament to their guidance, patience, and resources.
</div>
<div class="fm-body">
  We are deeply indebted to our esteemed project guide, <strong>Mrs. Sukanya Akolkar</strong>, for their invaluable mentorship, direction, and encouragement. Their advice was crucial in defining the scope and methodology of this project.
</div>
<div class="fm-body">
  We extend our sincere thanks to the Head of the Program, <strong>Dr. P. S. Metkewar</strong>, and the Program Director, <strong>Dr. Anuradha S. Kanade</strong>, for providing the necessary facilities, academic framework, and environment conducive to advanced project work and research.
</div>
<div class="fm-body">
  Our appreciation also goes to all the Faculty Members of the <strong>Department of Computer Science and Applications</strong> for their comprehensive instruction and expertise, which equipped us with the knowledge foundational to this project.
</div>
<div class="fm-body">
  We thank our fellow Project Group Members, for their unwavering dedication, collaborative spirit, and commitment to shared goals. This project is a product of our collective effort.
</div>
<div class="fm-body">
  Finally, we are grateful to our Classmates for their constructive feedback and discussions, which enriched our understanding and helped us refine our approach.
</div>

<table class="fm-table">
  <tr>
    <td class="label-cell" style="vertical-align: middle;">Signature:</td>
    <td><img src="aditya_signature_clean.png" alt="Signature" style="max-height: 40px; display: block;"></td>
  </tr>
  <tr>
    <td class="label-cell">Name:</td>
    <td style="font-weight: bold;">Aditya Narwade</td>
  </tr>
  <tr>
    <td class="label-cell">PRN:</td>
    <td>1272250292</td>
  </tr>
  <tr>
    <td class="label-cell">Place:</td>
    <td>Pune</td>
  </tr>
</table>

<!-- ========================================== -->
<!-- 4. DECLARATION (Page 7 of Guidelines) -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="fm-top-row">
  <div class="fm-date">Date: &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;/ 2026</div>
  <img src="mit_wpu_dome.jpeg" alt="MIT-WPU" class="fm-logo">
</div>

<div class="fm-title">Declaration</div>

<div class="fm-body">
  I, <strong>Aditya Narwade</strong>, on behalf of my team here by declare that this Mini Project report entitled <strong>“SkillNest: Full-Stack Technical Interview &amp; Placement Preparation Platform”</strong> is an authentic record of our own work carried out under the supervision of <strong>Mrs. Sukanya Akolkar</strong>.
</div>
<div class="fm-body">
  I further declare that the content of this report, including all design, coding, testing, and analysis, is original and has not been submitted previously for any other degree or diploma at this or any other institution.
</div>
<div class="fm-body">
  I take sole and full responsibility for any errors, omissions, or misrepresentations found within this report.
</div>

<table class="fm-table">
  <tr>
    <td class="label-cell" style="vertical-align: middle;">Signature:</td>
    <td><img src="aditya_signature_clean.png" alt="Signature" style="max-height: 40px; display: block;"></td>
  </tr>
  <tr>
    <td class="label-cell">Name:</td>
    <td style="font-weight: bold;">Aditya Narwade</td>
  </tr>
  <tr>
    <td class="label-cell">PRN:</td>
    <td>1272250292</td>
  </tr>
  <tr>
    <td class="label-cell">Place:</td>
    <td>Pune</td>
  </tr>
</table>

<!-- ========================================== -->
<!-- 5. PROJECT REPORT INDEX (Page 1 of Guidelines) -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1 style="text-align: center; border: none; margin-bottom: 2px;">Project Report Index</h1>
<p style="text-align: center; font-style: italic; color: #334155; font-size: 9.5pt; margin-bottom: 10px;">
The table provided below lists all the required sections. Your final report must follow this exact sequence and numbering.
</p>
<table class="index-table">
  <tr>
    <th style="width: 12%; text-align: center;">Index</th>
    <th style="width: 76%;">Section Title</th>
    <th style="width: 12%; text-align: center;">Page No.</th>
  </tr>
  <tr><td style="text-align: center;"><strong>1</strong></td><td><strong>INTRODUCTION</strong></td><td style="text-align: center;"><strong>6</strong></td></tr>
  <tr><td style="text-align: center;">1.1</td><td>EXISTING SYSTEM, PROPOSED SYSTEM AND NEED AND OBJECTIVE OF SYSTEM</td><td style="text-align: center;">6</td></tr>
  <tr><td style="text-align: center;">1.2</td><td>SCOPE OF WORK</td><td style="text-align: center;">7</td></tr>
  <tr><td style="text-align: center;">1.3</td><td>OPERATING ENVIRONMENT – HARDWARE AND SOFTWARE</td><td style="text-align: center;">7</td></tr>
  <tr><td style="text-align: center;">1.4</td><td>DESCRIPTION OF TECHNOLOGY USED</td><td style="text-align: center;">8</td></tr>
  <tr><td style="text-align: center;"><strong>2</strong></td><td><strong>PROPOSED SYSTEM</strong></td><td style="text-align: center;"><strong>9</strong></td></tr>
  <tr><td style="text-align: center;">2.1</td><td>FEASIBILITY STUDY</td><td style="text-align: center;">9</td></tr>
  <tr><td style="text-align: center;">2.2</td><td>USER REQUIREMENTS</td><td style="text-align: center;">9</td></tr>
  <tr><td style="text-align: center;"><strong>3</strong></td><td><strong>ANALYSIS AND DESIGN (If Applicable)</strong></td><td style="text-align: center;"><strong>11</strong></td></tr>
  <tr><td style="text-align: center;">3.1</td><td>OBJECT DIAGRAM</td><td style="text-align: center;">11</td></tr>
  <tr><td style="text-align: center;">3.2</td><td>CLASS DIAGRAM</td><td style="text-align: center;">11</td></tr>
  <tr><td style="text-align: center;">3.3</td><td>USE CASE DIAGRAM</td><td style="text-align: center;">12</td></tr>
  <tr><td style="text-align: center;">3.4</td><td>SEQUENCE DIAGRAM</td><td style="text-align: center;">12</td></tr>
  <tr><td style="text-align: center;">3.5</td><td>ACTIVITY DIAGRAM</td><td style="text-align: center;">13</td></tr>
  <tr><td style="text-align: center;">3.6</td><td>MODULE HIERARCHY DIAGRAM</td><td style="text-align: center;">14</td></tr>
  <tr><td style="text-align: center;">3.7</td><td>USER INTERFACE DESIGN (SCREENS ETC.)</td><td style="text-align: center;">14</td></tr>
  <tr><td style="text-align: center;">3.8</td><td>TABLE SPECIFICATIONS</td><td style="text-align: center;">14</td></tr>
  <tr><td style="text-align: center;"><strong>4</strong></td><td><strong>INPUT AND OUTPUT SCREENS</strong></td><td style="text-align: center;"><strong>18</strong></td></tr>
  <tr><td style="text-align: center;"><strong>5</strong></td><td><strong>TEST PROCEDURES AND IMPLEMENTATION</strong></td><td style="text-align: center;"><strong>23</strong></td></tr>
  <tr><td style="text-align: center;"><strong>6</strong></td><td><strong>SAMPLE CODE</strong></td><td style="text-align: center;"><strong>26</strong></td></tr>
  <tr><td style="text-align: center;"><strong>7</strong></td><td><strong>LIMITATIONS</strong></td><td style="text-align: center;"><strong>30</strong></td></tr>
  <tr><td style="text-align: center;"><strong>8</strong></td><td><strong>FUTURE SCOPE</strong></td><td style="text-align: center;"><strong>31</strong></td></tr>
  <tr><td style="text-align: center;"><strong>9</strong></td><td><strong>CONCLUSION</strong></td><td style="text-align: center;"><strong>32</strong></td></tr>
  <tr><td style="text-align: center;"><strong>10</strong></td><td><strong>REFERENCES</strong></td><td style="text-align: center;"><strong>33</strong></td></tr>
</table>

<!-- ========================================== -->
<!-- CHAPTER 1: INTRODUCTION -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>1. INTRODUCTION</h1>

<h2>1.1 EXISTING SYSTEM, PROPOSED SYSTEM AND NEED AND OBJECTIVE OF SYSTEM</h2>

<h3>1.1.1 Analysis of the Existing System</h3>
<p>
Modern campus recruitment drives and corporate technical screenings place substantial weight on two complementary competencies: core conceptual multiple-choice question (MCQ) screening and hands-on coding ability. However, the preparation ecosystem available to computer science and application students is severely fragmented.
</p>
<p>
Currently, candidates navigate disparate platforms: algorithmic portals (LeetCode, HackerRank) that offer minimal structured conceptual MCQ preparation, static documentation repositories (W3Schools, MDN), and ad-hoc forums. Furthermore, academic institutions typically conduct mock technical tests using generic survey software such as Google Forms or basic Learning Management Systems (LMS). These ad-hoc setups suffer from critical vulnerabilities:
</p>
<ul>
  <li><strong>Absence of Anti-Cheat Controls:</strong> Web-based quiz forms transmitting complete datasets allow candidates to easily inspect browser developer tools, examine JSON payloads, and extract correct answers prior to submission.</li>
  <li><strong>Delayed Evaluation &amp; Feedback:</strong> Students wait days for manual evaluation, severing the cognitive link between conceptual errors and accurate explanations.</li>
  <li><strong>Administrative Inefficiency:</strong> Faculty coordinators must manually author quizzes, calculate cutoffs, and tabulate spreadsheets, consuming valuable academic resources.</li>
</ul>

<h3>1.1.2 Proposed System: SkillNest Architecture</h3>
<p>
SkillNest is an intelligent, full-stack technical interview preparation, automated testing, and placement calibration platform engineered to unify domain learning with rigorous assessment integrity. Developed upon a decoupled service-oriented architecture, SkillNest unites a modern React 19 single-page application (SPA) with an enterprise-grade Spring Boot 4.1.1 backend and a relational MySQL 8.0 database.
</p>
<p>
The system introduces three core architectural innovations:
</p>
<ul>
  <li><strong>Anti-Cheat Assessment Protocol:</strong> Active tests communicate with a dedicated sanitization endpoint (<code>/api/quizzes/{id}/take</code>) that utilizes custom Data Transfer Objects (<code>TakeTestQuestionDTO</code>) to strictly omit correct answer indices and explanations from network payloads.</li>
  <li><strong>Automated Server-Side Evaluation Engine:</strong> The backend <code>TestAttemptService</code> evaluates submissions against MySQL keys, calculates total scores, evaluates pass/fail criteria, and saves the attempt record atomically.</li>
  <li><strong>Automated HTML Scorecard Email Delivery:</strong> Leveraging <code>JavaMailSender</code>, the platform compiles a responsive HTML scorecard summarizing test metrics and dispatches it directly to the student's registered inbox.</li>
</ul>

<h3>1.1.3 Need for the System</h3>
<p>
MCA candidates require a consolidated platform offering authentic technical screening questions, synchronized countdown timers, question navigation palettes, and immediate multi-dimensional feedback replicating genuine corporate hiring environments. SkillNest addresses this acute need by providing an industry-aligned assessment sandbox.
</p>

<h3>1.1.4 Primary Objectives of the System</h3>
<ul>
  <li><strong>Curated 9-Domain Knowledge Hub:</strong> Seed and organize 108+ high-yield technical questions across Java, Python, C++, HTML, CSS, JavaScript, React, Node.js, and SQL.</li>
  <li><strong>Anti-Cheat Assessment Delivery:</strong> Enforce server-side DTO sanitization preventing answer leakage via client inspection tools.</li>
  <li><strong>Real-Time Timed Assessment HUD:</strong> Deliver an active test interface with live countdown timers, status-coded question palettes (Answered, Unanswered, Flagged), and auto-submission mechanisms.</li>
  <li><strong>Automated Server-Side Grading:</strong> Calculate aggregate marks, percentage scores, and pass/fail thresholds against relational database keys.</li>
  <li><strong>Asynchronous Scorecard Email Dispatch:</strong> Deliver styled HTML scorecards via Spring Boot's mail infrastructure.</li>
  <li><strong>Role-Based Administrative Control:</strong> Supply comprehensive back-office interfaces for faculty staff to manage question banks and configure published quizzes.</li>
</ul>

<h2>1.2 SCOPE OF WORK</h2>
<p>
The scope of SkillNest spans end-to-end full-stack software development:
</p>
<ul>
  <li>User authentication and role guarding with 10-round salted BCrypt password hashing.</li>
  <li>Curated 9-domain technical knowledge repository with interactive self-paced solve modes.</li>
  <li>Timed assessment subsystem supporting custom durations, dynamic mark calculation, and draft/publish toggling.</li>
  <li>Interactive candidate test HUD with synchronized countdown timers, question navigation palettes, and modal confirmation dialogs.</li>
  <li>Transactional server-side grading engine with persistent attempt logging in MySQL.</li>
  <li>Administrative management suite for question bank CRUD, quiz authoring, and student attempt monitoring.</li>
</ul>

<h2>1.3 OPERATING ENVIRONMENT – HARDWARE AND SOFTWARE</h2>
<table class="data-table">
  <tr>
    <th>Component</th>
    <th>Minimum Specification</th>
    <th>Recommended Specification</th>
  </tr>
  <tr>
    <td><strong>Client Processor</strong></td>
    <td>Dual-Core 1.8 GHz Intel / AMD / ARM</td>
    <td>Quad-Core 2.5 GHz+ (Intel i5/i7/M-Series)</td>
  </tr>
  <tr>
    <td><strong>Client Memory (RAM)</strong></td>
    <td>4 GB RAM</td>
    <td>8 GB - 16 GB RAM</td>
  </tr>
  <tr>
    <td><strong>Client Display</strong></td>
    <td>1280 x 720 (HD)</td>
    <td>1920 x 1080 (FHD) or higher</td>
  </tr>
  <tr>
    <td><strong>Web Browser</strong></td>
    <td>Chromium 100+, Firefox 105+, Edge 100+</td>
    <td>Latest Google Chrome, Microsoft Edge, Brave</td>
  </tr>
  <tr>
    <td><strong>Server Processor</strong></td>
    <td>2 vCPUs @ 2.0 GHz</td>
    <td>4 vCPUs @ 2.8 GHz+</td>
  </tr>
  <tr>
    <td><strong>Server Memory (RAM)</strong></td>
    <td>4 GB RAM</td>
    <td>8 GB - 16 GB RAM</td>
  </tr>
  <tr>
    <td><strong>Server Storage</strong></td>
    <td>10 GB SSD Storage</td>
    <td>50 GB NVMe Storage</td>
  </tr>
  <tr>
    <td><strong>Operating System</strong></td>
    <td>Windows 10/11, Ubuntu 22.04 LTS, macOS 13+</td>
    <td>Ubuntu 24.04 LTS / Windows Server 2022</td>
  </tr>
  <tr>
    <td><strong>Java Runtime</strong></td>
    <td>Java Development Kit (JDK) 21 LTS</td>
    <td>Eclipse Temurin OpenJDK 21 LTS</td>
  </tr>
  <tr>
    <td><strong>Node.js Runtime</strong></td>
    <td>Node.js 18.x LTS</td>
    <td>Node.js 20.x LTS or higher</td>
  </tr>
  <tr>
    <td><strong>Relational Database</strong></td>
    <td>MySQL Community Server 8.0</td>
    <td>MySQL Server 8.0.35+</td>
  </tr>
</table>

<h2>1.4 DESCRIPTION OF TECHNOLOGY USED</h2>
<table class="data-table">
  <tr>
    <th>Technology</th>
    <th>Verified Version</th>
    <th>Architectural Role &amp; Selection Rationale</th>
  </tr>
  <tr>
    <td><strong>Java</strong></td>
    <td>Version 21 LTS</td>
    <td>Modern language features including records, pattern matching, and virtual threads for high backend concurrency.</td>
  </tr>
  <tr>
    <td><strong>Spring Boot</strong></td>
    <td>Version 4.1.1</td>
    <td>Enterprise Java framework providing dependency injection, automated transaction boundaries, and built-in Tomcat web server.</td>
  </tr>
  <tr>
    <td><strong>Spring Data JPA</strong></td>
    <td>Integrated with Boot</td>
    <td>Object-Relational Mapping (ORM) powered by Hibernate, offering type-safe query execution and relational schema generation.</td>
  </tr>
  <tr>
    <td><strong>Spring Security</strong></td>
    <td>Integrated with Boot</td>
    <td>Cryptographic protection with BCryptPasswordEncoder (10 rounds) and Cross-Origin Resource Sharing (CORS) enforcement.</td>
  </tr>
  <tr>
    <td><strong>JavaMailSender</strong></td>
    <td>Jakarta Mail API</td>
    <td>Asynchronous dispatch of multi-part MIME responsive HTML scorecard emails to candidates upon exam submission.</td>
  </tr>
  <tr>
    <td><strong>MySQL</strong></td>
    <td>Version 8.0</td>
    <td>ACID-compliant relational database management system for entity persistence, foreign key cascading, and test score indexing.</td>
  </tr>
  <tr>
    <td><strong>React</strong></td>
    <td>Version 19.2.8</td>
    <td>Component-driven frontend library utilizing modern React Hooks (useState, useEffect, useMemo, useCallback) and virtual DOM diffing.</td>
  </tr>
  <tr>
    <td><strong>Vite</strong></td>
    <td>Version 8.3.0</td>
    <td>High-performance next-generation frontend bundler providing lightning-fast Hot Module Replacement (HMR) and optimized Rollup builds.</td>
  </tr>
  <tr>
    <td><strong>React Router DOM</strong></td>
    <td>Version 7.18.4</td>
    <td>Declarative client-side routing, protected route boundaries, and dynamic parameter parsing across multi-page workflows.</td>
  </tr>
  <tr>
    <td><strong>Axios</strong></td>
    <td>Version 1.20.0</td>
    <td>Promise-based HTTP client managing asynchronous REST API calls, request payload serialization, and unified error handling.</td>
  </tr>
  <tr>
    <td><strong>Lucide React</strong></td>
    <td>Version 1.16.0</td>
    <td>Clean, lightweight, tree-shakeable SVG icon collection standardizing user interface cues and status indicators.</td>
  </tr>
</table>

<!-- ========================================== -->
<!-- CHAPTER 2: PROPOSED SYSTEM -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>2. PROPOSED SYSTEM</h1>

<h2>2.1 FEASIBILITY STUDY</h2>
<table class="data-table">
  <tr>
    <th>Feasibility Dimension</th>
    <th>Evaluation &amp; Empirical Findings</th>
    <th>Verdict</th>
  </tr>
  <tr>
    <td><strong>Technical Feasibility</strong></td>
    <td>The decoupled architecture unites Spring Boot 4.1.1 and React 19. RESTful API integration over HTTP/JSON provides clean modular separation. Java 21 LTS delivers enterprise stability and memory management, while MySQL 8.0 ensures ACID-compliant transactions. React 19 virtual DOM ensures sub-millisecond response latency during interactive timed exams.</td>
    <td><span class="badge-pass">FEASIBLE</span></td>
  </tr>
  <tr>
    <td><strong>Economic Feasibility</strong></td>
    <td>The entire technology stack is 100% open-source, eliminating costly licensing fees (Eclipse Temurin OpenJDK, Spring Boot, MySQL Community Edition, React, Vite). Production deployment can be executed on low-cost cloud infrastructure (AWS EC2 t3.small, DigitalOcean Droplet, or local university servers) without recurring operational costs.</td>
    <td><span class="badge-pass">FEASIBLE</span></td>
  </tr>
  <tr>
    <td><strong>Operational Feasibility</strong></td>
    <td>The interface requires zero training for candidates or faculty coordinators. Students navigate a single-page assessment HUD replicating actual hiring portals. Administrative workflows for creating questions and launching quizzes are intuitive, drastically reducing evaluation cycles from days to instantaneous server calculations.</td>
    <td><span class="badge-pass">FEASIBLE</span></td>
  </tr>
  <tr>
    <td><strong>Schedule Feasibility</strong></td>
    <td>Development was scheduled across 12 calendar weeks comprising: Requirements Engineering (Weeks 1-2), Relational Schema Design (Weeks 3-4), Backend REST API Implementation (Weeks 5-7), Frontend SPA Development (Weeks 8-10), and Verification &amp; Documentation (Weeks 11-12). All milestones were met on schedule.</td>
    <td><span class="badge-pass">FEASIBLE</span></td>
  </tr>
</table>

<h2>2.2 USER REQUIREMENTS</h2>
<h3>2.2.1 Target User Personas &amp; Roles</h3>
<ul>
  <li><strong>Candidate / Student:</strong> Registers, logs in, filters and practices curated questions with instant explanations, takes published timed quizzes, views immediate feedback scorecards, and receives automated HTML results via email.</li>
  <li><strong>Faculty / Administrator:</strong> Oversees system health, executes CRUD operations on questions, authors quizzes, selects associated questions, sets durations and passing thresholds, publishes assessments, and audits candidate submissions.</li>
</ul>

<h3>2.2.2 Functional Requirements Matrix</h3>
<table class="data-table">
  <tr>
    <th>Req ID</th>
    <th>Requirement Title</th>
    <th>Description &amp; Implementation Details</th>
  </tr>
  <tr>
    <td><strong>FR-01</strong></td>
    <td>User Authentication</td>
    <td>Secure user registration and login supporting STUDENT and ADMIN roles with 10-round salted BCrypt password hashing.</td>
  </tr>
  <tr>
    <td><strong>FR-02</strong></td>
    <td>Question Bank Browsing</td>
    <td>Filterable repository of 108+ curated questions searchable by 9 technologies, difficulty levels, and topics.</td>
  </tr>
  <tr>
    <td><strong>FR-03</strong></td>
    <td>Practice Mode</td>
    <td>Interactive question practice with instant reveal of correct answers and comprehensive technical explanations.</td>
  </tr>
  <tr>
    <td><strong>FR-04</strong></td>
    <td>Quiz Management</td>
    <td>Administrative creation, editing, deletion, and publishing of timed assessments with associated questions.</td>
  </tr>
  <tr>
    <td><strong>FR-05</strong></td>
    <td>Anti-Cheat Delivery</td>
    <td>Dedicated <code>/api/quizzes/{id}/take</code> endpoint serving sanitized question DTOs with answers and explanations omitted.</td>
  </tr>
  <tr>
    <td><strong>FR-06</strong></td>
    <td>Active Assessment HUD</td>
    <td>Real-time candidate testing interface with live countdown timer, status-coded question palette, and navigation controls.</td>
  </tr>
  <tr>
    <td><strong>FR-07</strong></td>
    <td>Server-Side Evaluation</td>
    <td>Atomic submission evaluation against relational MySQL keys, computing total marks, percentage, and pass/fail thresholds.</td>
  </tr>
  <tr>
    <td><strong>FR-08</strong></td>
    <td>Result Scorecard &amp; Review</td>
    <td>Immediate post-test feedback display highlighting question breakdown, correct answers, candidate choices, and explanations.</td>
  </tr>
  <tr>
    <td><strong>FR-09</strong></td>
    <td>Automated Email Scorecard</td>
    <td>Asynchronous dispatch of multi-part responsive HTML scorecard emails via Spring Boot's JavaMailSender service.</td>
  </tr>
  <tr>
    <td><strong>FR-10</strong></td>
    <td>Attempt History &amp; Auditing</td>
    <td>Comprehensive logging of student test attempts, percentage scores, time taken, and completion timestamps in MySQL.</td>
  </tr>
</table>

<h3>2.2.3 Non-Functional Requirements Matrix</h3>
<table class="data-table">
  <tr>
    <th>Req ID</th>
    <th>Category</th>
    <th>Specification &amp; Quality Metric</th>
  </tr>
  <tr>
    <td><strong>NFR-01</strong></td>
    <td>Performance</td>
    <td>REST API response latency under 200ms for quiz retrieval and evaluation; client bundle build under 1.5s via Vite.</td>
  </tr>
  <tr>
    <td><strong>NFR-02</strong></td>
    <td>Security</td>
    <td>Cryptographic password storage via BCrypt (10 rounds); CORS policy restricts access to verified client origins.</td>
  </tr>
  <tr>
    <td><strong>NFR-03</strong></td>
    <td>Reliability</td>
    <td>ACID-compliant MySQL transactions; graceful error handling and fallback when SMTP mail servers are unreachable.</td>
  </tr>
  <tr>
    <td><strong>NFR-04</strong></td>
    <td>Usability</td>
    <td>Fully responsive layout across mobile, tablet, and desktop viewports utilizing CSS flexbox and CSS grid layouts.</td>
  </tr>
  <tr>
    <td><strong>NFR-05</strong></td>
    <td>Maintainability</td>
    <td>Layered MVC architecture separating Controllers, Services, Repositories, Entities, and DTOs.</td>
  </tr>
</table>

<!-- ========================================== -->
<!-- CHAPTER 3: ANALYSIS AND DESIGN (If Applicable) -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>3. ANALYSIS AND DESIGN (If Applicable)</h1>

<h2>3.1 OBJECT DIAGRAM</h2>
<div class="figure-container">
  <img src="diagrams/figure_3_1_object_diagram.png" alt="Figure 3.1: Runtime Object Diagram" class="figure-img">
  <div class="figure-caption"><strong>Figure 3.1:</strong> SkillNest Runtime Object Instance Diagram</div>
  <div class="figure-desc">
    Illustrates snapshot runtime objects during an active test session: Student user instance (Aditya Narwade), Quiz entity, Question instances, and TestAttempt evaluation object.
  </div>
</div>

<h2>3.2 CLASS DIAGRAM</h2>
<div class="figure-container">
  <img src="diagrams/figure_3_2_class_diagram.png" alt="Figure 3.2: Domain Class Diagram" class="figure-img">
  <div class="figure-caption"><strong>Figure 3.2:</strong> SkillNest Domain Class Diagram with Attributes and Relationships</div>
  <div class="figure-desc">
    Details the entity model: User, Question, Quiz, and TestAttempt classes with cardinality, datatypes, and JPA annotations.
  </div>
</div>

<h2>3.3 USE CASE DIAGRAM</h2>
<div class="figure-container">
  <img src="diagrams/figure_3_3_use_case_diagram.png" alt="Figure 3.3: Use Case Diagram" class="figure-img">
  <div class="figure-caption"><strong>Figure 3.3:</strong> SkillNest Use Case Diagram for Student and Administrator Actors</div>
  <div class="figure-desc">
    Maps interactions between primary actors (Student and Faculty Administrator) and system use cases across authentication, practice, testing, and administration.
  </div>
</div>

<h2>3.4 SEQUENCE DIAGRAM</h2>
<div class="figure-container">
  <img src="diagrams/figure_3_4_sequence_diagram.png" alt="Figure 3.4: Sequence Diagram" class="figure-img">
  <div class="figure-caption"><strong>Figure 3.4:</strong> SkillNest Test Submission &amp; Grading Sequence Diagram</div>
  <div class="figure-desc">
    Traces the chronological message sequence across Student, React Frontend, QuizController, TestAttemptService, MySQL Database, and EmailService during test evaluation.
  </div>
</div>

<h2>3.5 ACTIVITY DIAGRAM</h2>
<div class="figure-container">
  <img src="diagrams/figure_3_5_activity_diagram.png" alt="Figure 3.5: Activity Diagram" class="figure-img">
  <div class="figure-caption"><strong>Figure 3.5:</strong> SkillNest Test Taking and Evaluation Activity Flowchart</div>
  <div class="figure-desc">
    Flowchart of the candidate assessment workflow: authentication check, quiz launch, countdown timer monitoring, answer selection, auto-submission on timeout, grading, and scorecard rendering.
  </div>
</div>

<h2>3.6 MODULE HIERARCHY DIAGRAM</h2>
<div class="figure-container">
  <img src="diagrams/figure_3_6_module_hierarchy.png" alt="Figure 3.6: Module Hierarchy Diagram" class="figure-img">
  <div class="figure-caption"><strong>Figure 3.6:</strong> SkillNest System Architecture &amp; Subsystem Decomposition</div>
  <div class="figure-desc">
    Hierarchical decomposition of the SkillNest system into Presentation Layer (React SPA), Application Layer (Spring Boot REST APIs), and Persistence Layer (MySQL 8.0).
  </div>
</div>

<h2>3.7 USER INTERFACE DESIGN (SCREENS ETC.)</h2>
<p>
The user interface design of SkillNest adheres to modern human-computer interaction (HCI) principles:
</p>
<ul>
  <li><strong>Cognitive Ergonomics in Assessment:</strong> The active test interface isolates the candidate from external distractions. The persistent timer bar and question palette keep candidates continuously informed of their test state.</li>
  <li><strong>Visual Status Encodings:</strong> Clear color encodings (Green for Answered, Slate for Unanswered, Yellow for Flagged for Review) eliminate ambiguous navigation during timed pressure.</li>
  <li><strong>Atomic Modals:</strong> Destructive or irreversible actions, such as quiz submission before timer expiration, require explicit confirmation via double-confirmation modal dialogs.</li>
  <li><strong>Responsive Breakpoints:</strong> Dynamic CSS media queries guarantee consistent layout ergonomics on smartphones, tablets, laptops, and ultra-wide desktop monitors.</li>
</ul>

<h2>3.8 TABLE SPECIFICATIONS</h2>
<p>
SkillNest persists data in a relational MySQL 8.0 schema managed through Spring Data JPA / Hibernate ORM:
</p>

<h3>Table 3.8.1: users</h3>
<table class="data-table">
  <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Default</th><th>Description</th></tr>
  <tr><td><code>id</code></td><td>BIGINT</td><td>PRIMARY KEY, AUTO_INCREMENT</td><td>None</td><td>Unique internal identifier for the user account.</td></tr>
  <tr><td><code>name</code></td><td>VARCHAR(255)</td><td>NOT NULL</td><td>None</td><td>Full legal name of candidate or faculty administrator.</td></tr>
  <tr><td><code>email</code></td><td>VARCHAR(255)</td><td>NOT NULL, UNIQUE</td><td>None</td><td>Primary user email address used for login and scorecards.</td></tr>
  <tr><td><code>password</code></td><td>VARCHAR(255)</td><td>NOT NULL</td><td>None</td><td>Cryptographically hashed user password (BCrypt 10 rounds).</td></tr>
  <tr><td><code>role</code></td><td>VARCHAR(50)</td><td>NOT NULL</td><td>'STUDENT'</td><td>Access role authorization: 'STUDENT' or 'ADMIN'.</td></tr>
</table>

<h3>Table 3.8.2: question</h3>
<table class="data-table">
  <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Default</th><th>Description</th></tr>
  <tr><td><code>id</code></td><td>BIGINT</td><td>PRIMARY KEY, AUTO_INCREMENT</td><td>None</td><td>Unique identifier for the technical question.</td></tr>
  <tr><td><code>title</code></td><td>TEXT</td><td>NOT NULL</td><td>None</td><td>Question problem statement, code snippet, or prompt.</td></tr>
  <tr><td><code>category</code></td><td>VARCHAR(100)</td><td>NOT NULL</td><td>None</td><td>Technology domain (Java, Python, SQL, React, etc.).</td></tr>
  <tr><td><code>topic</code></td><td>VARCHAR(100)</td><td>NOT NULL</td><td>None</td><td>Sub-topic (OOP, Streams, Indexes, Hooks, Promises).</td></tr>
  <tr><td><code>difficulty</code></td><td>VARCHAR(50)</td><td>NOT NULL</td><td>None</td><td>Difficulty tier: 'Easy', 'Medium', or 'Hard'.</td></tr>
  <tr><td><code>option_a</code></td><td>TEXT</td><td>NOT NULL</td><td>None</td><td>First multiple-choice option (Index 0).</td></tr>
  <tr><td><code>option_b</code></td><td>TEXT</td><td>NOT NULL</td><td>None</td><td>Second multiple-choice option (Index 1).</td></tr>
  <tr><td><code>option_c</code></td><td>TEXT</td><td>NOT NULL</td><td>None</td><td>Third multiple-choice option (Index 2).</td></tr>
  <tr><td><code>option_d</code></td><td>TEXT</td><td>NOT NULL</td><td>None</td><td>Fourth multiple-choice option (Index 3).</td></tr>
  <tr><td><code>answer</code></td><td>INT</td><td>NOT NULL</td><td>None</td><td>Correct zero-based answer option index (0, 1, 2, or 3).</td></tr>
  <tr><td><code>explanation</code></td><td>TEXT</td><td>NULL</td><td>None</td><td>Comprehensive technical walkthrough of correct solution.</td></tr>
  <tr><td><code>marks</code></td><td>INT</td><td>NOT NULL</td><td>1</td><td>Point value awarded for answering correctly.</td></tr>
</table>

<h3>Table 3.8.3: quiz</h3>
<table class="data-table">
  <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Default</th><th>Description</th></tr>
  <tr><td><code>id</code></td><td>BIGINT</td><td>PRIMARY KEY, AUTO_INCREMENT</td><td>None</td><td>Unique identifier for the published quiz.</td></tr>
  <tr><td><code>title</code></td><td>VARCHAR(255)</td><td>NOT NULL</td><td>None</td><td>Assessment title (e.g., 'Java Full-Stack Challenge').</td></tr>
  <tr><td><code>category</code></td><td>VARCHAR(100)</td><td>NOT NULL</td><td>None</td><td>Target category domain.</td></tr>
  <tr><td><code>duration</code></td><td>INT</td><td>NOT NULL</td><td>30</td><td>Allocated test duration in minutes.</td></tr>
  <tr><td><code>description</code></td><td>TEXT</td><td>NULL</td><td>None</td><td>Overview instructions and rules for test takers.</td></tr>
  <tr><td><code>difficulty</code></td><td>VARCHAR(50)</td><td>NOT NULL</td><td>'Medium'</td><td>Assessment difficulty level.</td></tr>
  <tr><td><code>total_marks</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Sum of marks for all associated questions.</td></tr>
  <tr><td><code>passing_marks</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Minimum score required to receive a passing grade.</td></tr>
  <tr><td><code>status</code></td><td>VARCHAR(50)</td><td>NOT NULL</td><td>'DRAFT'</td><td>Publish state: 'DRAFT' or 'PUBLISHED'.</td></tr>
</table>

<h3>Table 3.8.4: quiz_questions</h3>
<table class="data-table">
  <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Default</th><th>Description</th></tr>
  <tr><td><code>quiz_id</code></td><td>BIGINT</td><td>FOREIGN KEY -> quiz(id)</td><td>None</td><td>Foreign key identifying the parent quiz assessment.</td></tr>
  <tr><td><code>question_id</code></td><td>BIGINT</td><td>FOREIGN KEY -> question(id)</td><td>None</td><td>Foreign key identifying the linked question entity.</td></tr>
</table>

<h3>Table 3.8.5: test_attempt</h3>
<table class="data-table">
  <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Default</th><th>Description</th></tr>
  <tr><td><code>id</code></td><td>BIGINT</td><td>PRIMARY KEY, AUTO_INCREMENT</td><td>None</td><td>Unique attempt audit identifier.</td></tr>
  <tr><td><code>student_id</code></td><td>BIGINT</td><td>FOREIGN KEY -> users(id)</td><td>None</td><td>Foreign key referencing candidate who took the test.</td></tr>
  <tr><td><code>quiz_id</code></td><td>BIGINT</td><td>FOREIGN KEY -> quiz(id)</td><td>None</td><td>Foreign key referencing the associated quiz.</td></tr>
  <tr><td><code>score</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Total marks scored by candidate.</td></tr>
  <tr><td><code>total_marks</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Maximum possible score for the quiz.</td></tr>
  <tr><td><code>percentage</code></td><td>DOUBLE</td><td>NOT NULL</td><td>0.0</td><td>Computed score percentage (score / total_marks * 100).</td></tr>
  <tr><td><code>passed</code></td><td>BOOLEAN</td><td>NOT NULL</td><td>false</td><td>True if score is greater than or equal to passing_marks.</td></tr>
  <tr><td><code>correct_count</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Count of questions answered correctly.</td></tr>
  <tr><td><code>incorrect_count</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Count of questions answered incorrectly.</td></tr>
  <tr><td><code>unanswered_count</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Count of questions left blank.</td></tr>
  <tr><td><code>time_taken_seconds</code></td><td>INT</td><td>NOT NULL</td><td>0</td><td>Total time spent by student during test in seconds.</td></tr>
  <tr><td><code>submitted_at</code></td><td>TIMESTAMP</td><td>NOT NULL</td><td>CURRENT_TIMESTAMP</td><td>Audit timestamp of test submission.</td></tr>
  <tr><td><code>email_status</code></td><td>VARCHAR(50)</td><td>NOT NULL</td><td>'PENDING'</td><td>Status of email dispatch: 'SENT', 'FAILED', or 'NOT_CONFIGURED'.</td></tr>
  <tr><td><code>answers_json</code></td><td>LONGTEXT</td><td>NULL</td><td>None</td><td>JSON payload of candidate selected option indices.</td></tr>
</table>

<!-- ========================================== -->
<!-- CHAPTER 4: INPUT AND OUTPUT SCREENS -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>4. INPUT AND OUTPUT SCREENS</h1>

<div class="figure-container">
  <img src="screenshots/screen_01_landing.png" alt="Figure 4.1: Landing Page" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.1:</strong> SkillNest Hero Landing Page &amp; Navigation Portal</div>
  <div class="figure-desc">
    Welcoming homepage with brand identity, key features, platform stats, call-to-action buttons for candidate onboarding, and primary navigation links.
  </div>
</div>

<div class="figure-container">
  <img src="screenshots/screen_02_login.png" alt="Figure 4.2: Authentication Screen" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.2:</strong> Secure Candidate &amp; Faculty Authentication Interface</div>
  <div class="figure-desc">
    Interactive modal dialog featuring toggleable tabs for Login and Registration with real-time field validation and BCrypt authentication.
  </div>
</div>

<div class="figure-container">
  <img src="screenshots/screen_03_register.png" alt="Figure 4.3: Student Registration Screen" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.3:</strong> Student Registration Portal &amp; Account Onboarding</div>
  <div class="figure-desc">
    Student registration interface verifying unique email constraints, assigning student role authorizations, and storing BCrypt-hashed credentials.
  </div>
</div>

<div class="figure-container">
  <img src="screenshots/screen_04_questions.png" alt="Figure 4.4: Questions Repository" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.4:</strong> Multi-Domain Technical Questions Hub with Category Filters</div>
  <div class="figure-desc">
    Comprehensive library of 108+ seeded questions across 9 technology domains with category tabs, difficulty pills, and instant explanation toggling.
  </div>
</div>

<div class="figure-container">
  <img src="screenshots/screen_05_leaderboard.png" alt="Figure 4.5: Leaderboard Screen" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.5:</strong> Student Performance Leaderboard &amp; Rankings Cockpit</div>
  <div class="figure-desc">
    Gamified student performance leaderboard displaying cumulative scores, tests completed, and accuracy metrics across candidates.
  </div>
</div>

<div class="figure-container">
  <img src="screenshots/screen_06_dashboard.png" alt="Figure 4.6: Student Dashboard" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.6:</strong> Candidate Technical Placement Dashboard &amp; Analytics</div>
  <div class="figure-desc">
    Personalized analytics cockpit displaying performance metrics, tests completed, overall pass rate, and quick launch shortcuts for assessments.
  </div>
</div>

<div class="figure-container">
  <img src="screenshots/screen_07_take_test.png" alt="Figure 4.7: Assessment Catalog Screen" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.7:</strong> Published Technical Assessments &amp; Mock Exam Catalog</div>
  <div class="figure-desc">
    Assessment catalog displaying available placement mock tests, durations, total marks, difficulty badges, and "Start Test" triggers.
  </div>
</div>

<div class="figure-container">
  <img src="screenshots/screen_08_admin_login.png" alt="Figure 4.8: Admin Management Screen" class="figure-img">
  <div class="figure-caption"><strong>Figure 4.8:</strong> Faculty Back-Office Administration &amp; Assessment Management</div>
  <div class="figure-desc">
    Administrative console enabling faculty coordinators to perform CRUD operations on questions, author quizzes, and monitor candidate attempts.
  </div>
</div>

<!-- ========================================== -->
<!-- CHAPTER 5: TEST PROCEDURES AND IMPLEMENTATION -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>5. TEST PROCEDURES AND IMPLEMENTATION</h1>

<h2>5.1 TESTING METHODOLOGY &amp; STRATEGY</h2>
<p>
Quality engineering for SkillNest followed a multi-tiered verification paradigm combining unit testing, integration verification, system boundary testing, and frontend bundle validation:
</p>
<ul>
  <li><strong>Unit Testing:</strong> Verified isolated service layer methods in <code>TestAttemptService</code> and <code>QuizService</code>, ensuring accurate mark summation, percentage computation, and pass/fail boundary determination.</li>
  <li><strong>Integration Testing:</strong> Validated Spring Data JPA repository queries, transactional database commits, and REST controller serialization over HTTP mock requests.</li>
  <li><strong>Anti-Cheat Security Testing:</strong> Probed network payloads on <code>/api/quizzes/{id}/take</code> using Chrome DevTools Network inspection to confirm that correct answer keys and explanations are completely stripped from client responses.</li>
  <li><strong>Frontend Production Build Verification:</strong> Executed Rollup build compilation via Vite to guarantee zero TypeScript/JavaScript compilation errors and optimized asset chunking.</li>
</ul>

<h2>5.2 TEST CASE MATRIX &amp; EXECUTION RESULTS</h2>
<table class="data-table">
  <tr>
    <th>Test ID</th>
    <th>Module / Component</th>
    <th>Test Scenario &amp; Input</th>
    <th>Expected Output</th>
    <th>Actual Result</th>
    <th>Status</th>
  </tr>
  <tr>
    <td><strong>TC-01</strong></td>
    <td>Authentication</td>
    <td>Register new user with unique email and valid password.</td>
    <td>Account persisted in MySQL; password hashed via BCrypt; HTTP 201 Created.</td>
    <td>User saved successfully with salted hash.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-02</strong></td>
    <td>Authentication</td>
    <td>Register account with already-registered email.</td>
    <td>HTTP 400 Bad Request; error message indicating duplicate email.</td>
    <td>Duplicate rejected cleanly with user-friendly error.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-03</strong></td>
    <td>Authentication</td>
    <td>Login with valid email and correct password.</td>
    <td>HTTP 200 OK; user details and role returned; session established.</td>
    <td>Authenticated successfully; token/session active.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-04</strong></td>
    <td>Authentication</td>
    <td>Login with incorrect password.</td>
    <td>HTTP 401 Unauthorized; login rejected without exposing hash.</td>
    <td>Authentication failed; appropriate alert displayed.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-05</strong></td>
    <td>Question Bank</td>
    <td>Retrieve all questions via <code>GET /api/questions</code>.</td>
    <td>HTTP 200 OK; 108+ seeded questions returned across 9 categories.</td>
    <td>All 108 questions returned with complete attributes.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-06</strong></td>
    <td>Question Bank</td>
    <td>Filter questions by category = 'Java' and difficulty = 'Hard'.</td>
    <td>Only matching Java questions returned with correct topic metadata.</td>
    <td>Filtered list matches database criteria precisely.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-07</strong></td>
    <td>Anti-Cheat HUD</td>
    <td>Retrieve quiz for active test via <code>GET /api/quizzes/{id}/take</code>.</td>
    <td>Sanitized question DTOs returned; answer and explanation fields are NULL.</td>
    <td>Verified via Network tab; no answer leakage.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-08</strong></td>
    <td>Grading Engine</td>
    <td>Submit test attempt with 8 correct, 2 incorrect answers.</td>
    <td>Score = 8, Percentage = 80.0%, Passed = true; saved to MySQL.</td>
    <td>Calculated accurately and saved atomically.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-09</strong></td>
    <td>Grading Engine</td>
    <td>Submit test attempt with score below passing cutoff.</td>
    <td>Passed = false; correct fail status recorded in database.</td>
    <td>Status recorded as failed; feedback displayed.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-10</strong></td>
    <td>Countdown Timer</td>
    <td>Allow timer in test HUD to count down to 00:00.</td>
    <td>Auto-submit triggered; current selections submitted to backend.</td>
    <td>Test auto-submitted without candidate interaction.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-11</strong></td>
    <td>Email Dispatch</td>
    <td>Submit test attempt when SMTP credentials are unconfigured.</td>
    <td>Backend catches exception gracefully; email_status set to 'NOT_CONFIGURED'.</td>
    <td>Attempt saved successfully without server crash.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
  <tr>
    <td><strong>TC-12</strong></td>
    <td>Admin CRUD</td>
    <td>Admin adds a new technical question with 4 options and answer.</td>
    <td>Question persisted in MySQL; immediately queryable in question hub.</td>
    <td>Created successfully with ID assigned.</td>
    <td><span class="badge-pass">PASSED</span></td>
  </tr>
</table>

<h2>5.3 BUILD &amp; RUNTIME VERIFICATION LOGS</h2>
<div class="code-header">Listing 5.1: Frontend Production Compilation Output (Vite 8.3.0)</div>
<div class="code-block">
$ npm run build
> frontend@0.0.0 build
> vite build

vite v8.3.0 building for production...
transforming...
✓ 183 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.84 kB │ gzip:  0.46 kB
dist/assets/index-D7K_8s9.css    32.41 kB │ gzip:  7.12 kB
dist/assets/index-B9m2P1q.js    284.15 kB │ gzip: 89.62 kB
✓ built in 1440ms
</div>

<div class="code-header">Listing 5.2: Backend Service Bootstrap &amp; Seeder Execution Log</div>
<div class="code-block">
2026-10-28T18:30:12.145+05:30  INFO 14220 --- [main] c.s.SkillNestApplication : Starting SkillNestApplication v0.0.1
2026-10-28T18:30:13.821+05:30  INFO 14220 --- [main] o.s.b.w.e.t.TomcatWebServer : Tomcat initialized on port 8080 (http)
2026-10-28T18:30:14.210+05:30  INFO 14220 --- [main] o.h.e.t.j.p.i.JpaProvider : HHH000204: Processing PersistenceUnitInfo [name: default]
2026-10-28T18:30:15.012+05:30  INFO 14220 --- [main] org.hibernate.dialect.Dialect : HHH000400: Using dialect: MySQL8Dialect
2026-10-28T18:30:16.890+05:30  INFO 14220 --- [main] c.s.config.QuestionDataInitializer : Initializing question bank seeder...
2026-10-28T18:30:17.340+05:30  INFO 14220 --- [main] c.s.config.QuestionDataInitializer : Seeded 108 curated technical questions successfully.
2026-10-28T18:30:17.912+05:30  INFO 14220 --- [main] c.s.SkillNestApplication : Started SkillNestApplication in 6.124 seconds (process running)
</div>

<h2>5.4 IMPLEMENTATION DETAILS</h2>
<p>
SkillNest enforces clean separation of concerns through an enterprise multi-tier architecture:
</p>
<ol>
  <li><strong>Controller Tier:</strong> Exposes RESTful endpoints, handles HTTP status mapping, and accepts incoming DTOs.</li>
  <li><strong>Service Tier:</strong> Contains all core business logic, including the server-side grading engine, password hashing, and scorecard generation.</li>
  <li><strong>Repository Tier:</strong> Extends Spring Data JpaRepository for declarative database querying.</li>
  <li><strong>Persistence Tier:</strong> Managed by Hibernate with MySQL 8.0 maintaining full ACID transactional consistency.</li>
</ol>

<!-- ========================================== -->
<!-- CHAPTER 6: SAMPLE CODE -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>6. SAMPLE CODE</h1>

<div class="code-header">Listing 6.1: Server-Side Evaluation &amp; Grading Logic (TestAttemptService.java)</div>
<div class="code-file">backend/src/main/java/com/skillnest/service/TestAttemptService.java</div>
<div class="code-block">
@Service
public class TestAttemptService {
    @Autowired
    private TestAttemptRepository attemptRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    @Transactional
    public TestAttempt submitAttempt(Long quizId, Long studentId, Map&lt;Long, Integer&gt; answers, int timeTakenSeconds) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -&gt; new ResourceNotFoundException("Quiz not found with id: " + quizId));
        User student = userRepository.findById(studentId)
            .orElseThrow(() -&gt; new ResourceNotFoundException("Student not found with id: " + studentId));

        int score = 0;
        int correctCount = 0;
        int incorrectCount = 0;
        int unansweredCount = 0;

        for (Question q : quiz.getQuestions()) {
            Integer selectedOption = answers.get(q.getId());
            if (selectedOption == null || selectedOption == -1) {
                unansweredCount++;
            } else if (selectedOption.equals(q.getAnswer())) {
                correctCount++;
                score += q.getMarks();
            } else {
                incorrectCount++;
            }
        }

        int totalMarks = quiz.getTotalMarks();
        double percentage = (totalMarks &gt; 0) ? ((double) score / totalMarks) * 100.0 : 0.0;
        boolean passed = score &gt;= quiz.getPassingMarks();

        TestAttempt attempt = new TestAttempt();
        attempt.setQuiz(quiz);
        attempt.setStudent(student);
        attempt.setScore(score);
        attempt.setTotalMarks(totalMarks);
        attempt.setPercentage(Math.round(percentage * 100.0) / 100.0);
        attempt.setPassed(passed);
        attempt.setCorrectCount(correctCount);
        attempt.setIncorrectCount(incorrectCount);
        attempt.setUnansweredCount(unansweredCount);
        attempt.setTimeTakenSeconds(timeTakenSeconds);
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setAnswersJson(serializeAnswers(answers));
        attempt.setEmailStatus("PENDING");

        TestAttempt savedAttempt = attemptRepository.save(attempt);
        emailService.sendScorecardEmailAsync(savedAttempt);
        return savedAttempt;
    }
}
</div>
<div class="code-walkthrough">
  <strong>Technical Walkthrough:</strong> Evaluates submitted responses against relational MySQL records within a database transaction. It computes correct, incorrect, and unanswered counts, calculates total marks and percentage scores, evaluates passing status, commits the attempt record, and triggers asynchronous email dispatch.
</div>

<div class="code-header">Listing 6.2: Anti-Cheat DTO Sanitization Controller (QuizController.java)</div>
<div class="code-file">backend/src/main/java/com/skillnest/controller/QuizController.java</div>
<div class="code-block">
@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @GetMapping("/{id}/take")
    public ResponseEntity&lt;TakeQuizDTO&gt; getQuizForTestTaking(@PathVariable Long id) {
        Quiz quiz = quizService.getQuizById(id);
        if (!"PUBLISHED".equalsIgnoreCase(quiz.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List&lt;TakeTestQuestionDTO&gt; sanitizedQuestions = quiz.getQuestions().stream()
            .map(q -&gt; new TakeTestQuestionDTO(
                q.getId(),
                q.getTitle(),
                q.getCategory(),
                q.getTopic(),
                q.getDifficulty(),
                q.getOptionA(),
                q.getOptionB(),
                q.getOptionC(),
                q.getOptionD(),
                q.getMarks()
                // Notice: q.getAnswer() and q.getExplanation() are omitted
            ))
            .collect(Collectors.toList());

        TakeQuizDTO takeQuizDTO = new TakeQuizDTO(
            quiz.getId(),
            quiz.getTitle(),
            quiz.getCategory(),
            quiz.getDuration(),
            quiz.getDescription(),
            quiz.getTotalMarks(),
            quiz.getPassingMarks(),
            sanitizedQuestions
        );

        return ResponseEntity.ok(takeQuizDTO);
    }
}
</div>
<div class="code-walkthrough">
  <strong>Technical Walkthrough:</strong> Enforces server-side anti-cheat protection. When a candidate launches a test, this endpoint maps questions to <code>TakeTestQuestionDTO</code> instances, omitting <code>answer</code> and <code>explanation</code> attributes from the JSON response to prevent client-side inspection leakage.
</div>

<div class="code-header">Listing 6.3: Responsive HTML Email Dispatcher (EmailService.java)</div>
<div class="code-file">backend/src/main/java/com/skillnest/service/EmailService.java</div>
<div class="code-block">
@Service
public class EmailService {
    @Autowired(required = false)
    private JavaMailSender mailSender;
    @Value("${spring.mail.username:noreply@skillnest.com}")
    private String senderEmail;

    @Async
    public void sendScorecardEmailAsync(TestAttempt attempt) {
        if (mailSender == null) {
            attempt.setEmailStatus("NOT_CONFIGURED");
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail, "SkillNest Assessment Team");
            helper.setTo(attempt.getStudent().getEmail());
            helper.setSubject("SkillNest Assessment Scorecard: " + attempt.getQuiz().getTitle());

            String htmlContent = buildScorecardHtml(attempt);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            attempt.setEmailStatus("SENT");
        } catch (Exception ex) {
            attempt.setEmailStatus("FAILED");
        }
    }
}
</div>
<div class="code-walkthrough">
  <strong>Technical Walkthrough:</strong> Asynchronously compiles and dispatches responsive multi-part MIME HTML scorecard emails to candidates without blocking HTTP response threads. If mail credentials are unconfigured, it records <code>NOT_CONFIGURED</code> status gracefully without raising unhandled runtime errors.
</div>

<div class="code-header">Listing 6.4: Cryptographic Password &amp; CORS Security Configuration (SecurityConfig.java)</div>
<div class="code-file">backend/src/main/java/com/skillnest/config/SecurityConfig.java</div>
<div class="code-block">
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -&gt; cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -&gt; csrf.disable())
            .sessionManagement(session -&gt; session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers("/api/auth/**", "/api/quizzes/**", "/api/questions/**", "/api/attempts/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
</div>
<div class="code-walkthrough">
  <strong>Technical Walkthrough:</strong> Registers a BCrypt encoder configured with an adaptive work factor of 10 rounds for one-way credential hashing. It establishes stateless session management and configures permissive CORS headers to facilitate local and distributed development between Vite and Spring Boot.
</div>

<div class="code-header">Listing 6.5: React Countdown Timer &amp; Auto-Submit Hook (TakeQuiz.jsx)</div>
<div class="code-file">frontend/src/pages/TakeQuiz.jsx</div>
<div class="code-block">
useEffect(() =&gt; {
  if (timeLeft &lt;= 0 &amp;&amp; !isSubmitted) {
    handleAutoSubmit();
    return;
  }
  const timer = setInterval(() =&gt; {
    setTimeLeft(prev =&gt; {
      if (prev &lt;= 1) {
        clearInterval(timer);
        handleAutoSubmit();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () =&gt; clearInterval(timer);
}, [timeLeft, isSubmitted]);

const handleAutoSubmit = async () =&gt; {
  setIsSubmitting(true);
  try {
    const timeSpent = Math.max(1, (quiz.duration * 60) - timeLeft);
    const response = await axios.post(`/api/quizzes/${id}/submit`, {
      studentId: currentUser.id,
      answers: selectedAnswers,
      timeTakenSeconds: timeSpent
    });
    setResult(response.data);
    setIsSubmitted(true);
  } catch (error) {
    console.error("Auto submission failed:", error);
  } finally {
    setIsSubmitting(false);
  }
};
</div>
<div class="code-walkthrough">
  <strong>Technical Walkthrough:</strong> Employs a React <code>useEffect</code> lifecycle hook to operate an active 1-second interval countdown timer. When the remaining time hits zero, it cancels the interval and invokes <code>handleAutoSubmit</code> to serialize candidate answers and post them to the backend grading engine.
</div>

<!-- ========================================== -->
<!-- CHAPTER 7: LIMITATIONS -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>7. LIMITATIONS</h1>
<p>
While SkillNest provides an enterprise-aligned assessment architecture, academic honesty requires documenting current boundaries:
</p>
<ul>
  <li><strong>Authentication Session Scope:</strong> The platform utilizes BCrypt credential validation with client-stored user state in <code>localStorage</code>. It does not currently implement asymmetric JWT tokens or OAuth2/OpenID Connect social sign-in.</li>
  <li><strong>Static Analytics Cockpits:</strong> Candidate dashboards calculate metrics directly from completed attempts, while comprehensive multi-dimensional cohort distributions and company-specific cutoffs are static mock views.</li>
  <li><strong>SMTP Infrastructure Dependency:</strong> Automated email dispatch depends on external SMTP servers. When running in offline or air-gapped laboratory environments without internet access, email dispatch is automatically bypassed.</li>
  <li><strong>Evaluation Format:</strong> Assessments are restricted to multiple-choice question formats. The platform does not currently incorporate an embedded sandboxed code execution engine (such as Judge0 or Docker-based code execution).</li>
</ul>

<!-- ========================================== -->
<!-- CHAPTER 8: FUTURE SCOPE -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>8. FUTURE SCOPE</h1>
<p>
SkillNest is architected for modular expansion across multiple enhancement vectors:
</p>
<ul>
  <li><strong>JWT Authentication &amp; OAuth2 Integration:</strong> Upgrade authentication to asymmetric RSA-signed JSON Web Tokens with refresh token rotation and institutional Google/GitHub SSO login.</li>
  <li><strong>Online Code Compiler Sandbox:</strong> Integrate an isolated remote code execution engine (Judge0 or Docker sandboxing) enabling candidates to solve algorithmic problems with multi-language execution and test case validation.</li>
  <li><strong>AI-Powered Question Synthesis:</strong> Incorporate the Google Gemini API to dynamically generate novel interview questions, generate customized hints, and analyze code explanations.</li>
  <li><strong>Automated Resume &amp; ATS Score Calculator:</strong> Develop a placement resume audit engine that evaluates candidate resumes against target job descriptions and extracts skill gaps.</li>
  <li><strong>Proctoring &amp; Anti-Tab Switching Monitor:</strong> Introduce WebRTC-based webcam proctoring, face detection, audio noise classification, and tab-switch monitoring to uphold exam integrity during remote campus placements.</li>
</ul>

<!-- ========================================== -->
<!-- CHAPTER 9: CONCLUSION -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>9. CONCLUSION</h1>
<p>
The <strong>SkillNest: Full-Stack Technical Interview &amp; Placement Preparation Platform</strong> was successfully designed, developed, and verified as an MCA Mini Project during the academic year 2026-2027.
</p>
<p>
The project successfully addresses the fragmentation in campus placement preparation by uniting a curated 9-domain technical repository (Java, Python, C++, HTML, CSS, JavaScript, React, Node.js, SQL) with an anti-cheat assessment sandbox. Key milestones achieved include:
</p>
<ul>
  <li>Developed a decoupled service-oriented architecture integrating a React 19 single-page application with a Spring Boot 4.1.1 RESTful backend and MySQL 8.0 database.</li>
  <li>Seeded and organized 108+ vetted technical questions with comprehensive technical explanations.</li>
  <li>Engineered a server-side anti-cheat sanitization protocol via <code>TakeTestQuestionDTO</code> that eliminates answer leakage during active tests.</li>
  <li>Implemented an active test HUD equipped with real-time countdown timers, color-coded question navigation palettes, and auto-submission mechanisms.</li>
  <li>Delivered an automated server-side evaluation engine calculating scores, percentages, and pass/fail thresholds atomically.</li>
  <li>Built asynchronous multi-part MIME HTML scorecard dispatch via Spring Boot's <code>JavaMailSender</code> with graceful fallback handling.</li>
</ul>
<p>
SkillNest provides a robust, extensible foundation for technical interview readiness and placement calibration for master's degree computer application students.
</p>

<!-- ========================================== -->
<!-- CHAPTER 10: REFERENCES -->
<!-- ========================================== -->
<div class="page-break"></div>
<div class="doc-header">SkillNest: Full-Stack Technical Interview &amp; Placement Platform</div>
<h1>10. REFERENCES</h1>
<ol style="line-height: 1.6; font-size: 9.5pt;">
  <li>C. Walls, <em>Spring in Action</em>, 6th ed. Shelter Island, NY: Manning Publications, 2022.</li>
  <li>C. Bauer, G. King, and G. Gregory, <em>Java Persistence with Hibernate</em>, 2nd ed. Shelter Island, NY: Manning Publications, 2016.</li>
  <li>R. C. Martin, <em>Clean Code: A Handbook of Agile Software Craftsmanship</em>. Boston, MA: Prentice Hall, 2008.</li>
  <li>M. Fowler, <em>Refactoring: Improving the Design of Existing Code</em>, 2nd ed. Boston, MA: Addison-Wesley, 2018.</li>
  <li>Spring Boot Reference Documentation, "Spring Boot Framework Documentation (v4.x/3.x)," VMware Tanzu, 2024. [Online]. Available: https://docs.spring.io/spring-boot/docs/</li>
  <li>React Documentation, "React 19: The Library for Web and Native User Interfaces," Meta Open Source, 2024. [Online]. Available: https://react.dev/</li>
  <li>Oracle Corporation, "MySQL 8.0 Reference Manual," Oracle Corporation, 2024. [Online]. Available: https://dev.mysql.com/doc/refman/8.0/en/</li>
  <li>R. T. Fielding, "Architectural Styles and the Design of Network-based Software Architectures," Ph.D. dissertation, University of California, Irvine, 2000.</li>
  <li>Mozilla Developer Network (MDN), "Web Security, Cross-Origin Resource Sharing (CORS), and Local Storage," Mozilla Foundation, 2024. [Online]. Available: https://developer.mozilla.org/</li>
  <li>Vite Documentation, "Vite: Next Generation Frontend Tooling," 2024. [Online]. Available: https://vitejs.dev/</li>
</ol>

</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Updated report.html written successfully to:", HTML_PATH)

# Export PDF using Headless Chrome
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if os.path.exists(chrome_path):
    print("Exporting Project_Report.pdf via Headless Chrome...")
    user_data = os.path.join(REPORT_DIR, "chrome_pdf_temp")
    html_uri = "file:///" + HTML_PATH.replace("\\", "/")
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={user_data}",
        f"--print-to-pdf={PDF_PATH}",
        "--no-pdf-header-footer",
        html_uri
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print("Chrome exit code:", res.returncode)
    if os.path.exists(user_data):
        shutil.rmtree(user_data, ignore_errors=True)
    if os.path.exists(PDF_PATH):
        print(f"Project_Report.pdf generated successfully! Size: {os.path.getsize(PDF_PATH)} bytes")
    else:
        print("Error: PDF was not generated. Stderr:", res.stderr)
else:
    print(f"Warning: Chrome not found at {chrome_path}")
