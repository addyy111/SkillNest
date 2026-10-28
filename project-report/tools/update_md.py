import os

MD_PATH = r"D:\SkillNest\project-report\Project_Report_Source.md"

with open(MD_PATH, "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("# CHAPTER 1: INTRODUCTION")
if idx == -1:
    idx = text.find("## 1.1 Existing System")

front_matter = """# Mini Project Report
On
**“SkillNest: Full-Stack Technical Interview & Placement Preparation Platform”**

By  
**Aditya Narwade**  
**(PRN: 1272250292)**  

For  
**MCA40130 Mini Project**  
**SY MCA**  
**AY 2026-2027**  

Under The Guidance Of  
**Mrs. Sukanya Akolkar**  

Submitted To  
![MIT-WPU Logo](mit_wpu_logo.jpeg)  
In partial fulfillment of the requirement for the  
award of Degree of  
**Master of Computer Applications**  

Submitted Through  
**MIT-WPU**  
**School of Computer Science and Engineering**  
**Department of Computer Science and Applications**  

---

## Certificate

Department of Computer Science and Applications  

This is to certify that, **Aditya Narwade (PRN: 1272250292)**, student of **SY MCA, Semester III** has completed Mini Project entitled **“SkillNest: Full-Stack Technical Interview & Placement Preparation Platform”** under guidance of **Mrs. Sukanya Akolkar** in partial fulfilment of requirement for the award of **Master of Computer Applications** prescribed under **Dr. Vishwanath Karad MIT World Peace University, Pune**.  

This project is the record of authentic work carried out by him out during the academic year **2026-2027**.  

**Mrs. Sukanya Akolkar**  
Internal Guide  

**Dr. P. S. Metkewar**  
Program Head- MCA  

**Dr. Anuradha S. Kanade**  
Program Director  

---

## Acknowledgement

Date: &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;/ 2026 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ![MIT-WPU Dome](mit_wpu_dome.jpeg)

I wish to express our profound gratitude to all the individuals who supported us throughout the completion of our Mini Project III. This report is a testament to their guidance, patience, and resources.

We are deeply indebted to our esteemed project guide, **Mrs. Sukanya Akolkar**, for their invaluable mentorship, direction, and encouragement. Their advice was crucial in defining the scope and methodology of this project.

We extend our sincere thanks to the Head of the Program, **Dr. P. S. Metkewar**, and the Program Director, **Dr. Anuradha S. Kanade**, for providing the necessary facilities, academic framework, and environment conducive to advanced project work and research.

Our appreciation also goes to all the Faculty Members of the **Department of Computer Science and Applications** for their comprehensive instruction and expertise, which equipped us with the knowledge foundational to this project.

We thank our fellow Project Group Members, for their unwavering dedication, collaborative spirit, and commitment to shared goals. This project is a product of our collective effort.

Finally, we are grateful to our Classmates for their constructive feedback and discussions, which enriched our understanding and helped us refine our approach.

| Field | Details |
|---|---|
| **Signature:** | ![Signature](aditya_signature_clean.png) |
| **Name:** | **Aditya Narwade** |
| **PRN:** | 1272250292 |
| **Place:** | Pune |

---

## Declaration

Date: &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;/ 2026 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ![MIT-WPU Dome](mit_wpu_dome.jpeg)

I, **Aditya Narwade**, on behalf of my team here by declare that this Mini Project report entitled **“SkillNest: Full-Stack Technical Interview & Placement Preparation Platform”** is an authentic record of our own work carried out under the supervision of **Mrs. Sukanya Akolkar**.

I further declare that the content of this report, including all design, coding, testing, and analysis, is original and has not been submitted previously for any other degree or diploma at this or any other institution.

I take sole and full responsibility for any errors, omissions, or misrepresentations found within this report.

| Field | Details |
|---|---|
| **Signature:** | ![Signature](aditya_signature_clean.png) |
| **Name:** | **Aditya Narwade** |
| **PRN:** | 1272250292 |
| **Place:** | Pune |

---

## Project Report Index

The table provided below lists all the required sections. Your final report must follow this exact sequence and numbering.

| Index | Section Title | Page No. |
|:---:|---|:---:|
| **1** | **INTRODUCTION** | **6** |
| 1.1 | EXISTING SYSTEM, PROPOSED SYSTEM AND NEED AND OBJECTIVE OF SYSTEM | 6 |
| 1.2 | SCOPE OF WORK | 7 |
| 1.3 | OPERATING ENVIRONMENT – HARDWARE AND SOFTWARE | 7 |
| 1.4 | DESCRIPTION OF TECHNOLOGY USED | 8 |
| **2** | **PROPOSED SYSTEM** | **9** |
| 2.1 | FEASIBILITY STUDY | 9 |
| 2.2 | USER REQUIREMENTS | 9 |
| **3** | **ANALYSIS AND DESIGN (If Applicable)** | **11** |
| 3.1 | OBJECT DIAGRAM | 11 |
| 3.2 | CLASS DIAGRAM | 11 |
| 3.3 | USE CASE DIAGRAM | 12 |
| 3.4 | SEQUENCE DIAGRAM | 12 |
| 3.5 | ACTIVITY DIAGRAM | 13 |
| 3.6 | MODULE HIERARCHY DIAGRAM | 14 |
| 3.7 | USER INTERFACE DESIGN (SCREENS ETC.) | 14 |
| 3.8 | TABLE SPECIFICATIONS | 14 |
| **4** | **INPUT AND OUTPUT SCREENS** | **18** |
| **5** | **TEST PROCEDURES AND IMPLEMENTATION** | **23** |
| **6** | **SAMPLE CODE** | **26** |
| **7** | **LIMITATIONS** | **30** |
| **8** | **FUTURE SCOPE** | **31** |
| **9** | **CONCLUSION** | **32** |
| **10** | **REFERENCES** | **33** |

---

"""

body = text[idx:]

# Also ensure body headings match exact uppercase
body = body.replace(
    "## 1.1 Existing System, Proposed System, Need and Objectives of the System",
    "## 1.1 EXISTING SYSTEM, PROPOSED SYSTEM AND NEED AND OBJECTIVE OF SYSTEM"
)
body = body.replace("## 1.2 Scope of Work", "## 1.2 SCOPE OF WORK")
body = body.replace("## 1.3 Operating Environment — Hardware and Software", "## 1.3 OPERATING ENVIRONMENT – HARDWARE AND SOFTWARE")
body = body.replace("## 1.4 Description of Technology Used", "## 1.4 DESCRIPTION OF TECHNOLOGY USED")
body = body.replace("# CHAPTER 2: PROPOSED SYSTEM", "# 2 PROPOSED SYSTEM")
body = body.replace("## 2.1 Feasibility Study", "## 2.1 FEASIBILITY STUDY")
body = body.replace("## 2.2 User Requirements", "## 2.2 USER REQUIREMENTS")
body = body.replace("# CHAPTER 3: ANALYSIS AND DESIGN", "# 3 ANALYSIS AND DESIGN (If Applicable)")
body = body.replace("## 3.1 Object Diagram", "## 3.1 OBJECT DIAGRAM")
body = body.replace("## 3.2 Class Diagram", "## 3.2 CLASS DIAGRAM")
body = body.replace("## 3.3 Use Case Diagram", "## 3.3 USE CASE DIAGRAM")
body = body.replace("## 3.4 Sequence Diagram", "## 3.4 SEQUENCE DIAGRAM")
body = body.replace("## 3.5 Activity Diagram", "## 3.5 ACTIVITY DIAGRAM")
body = body.replace("## 3.6 Module Hierarchy Diagram", "## 3.6 MODULE HIERARCHY DIAGRAM")
body = body.replace("## 3.7 User Interface Design", "## 3.7 USER INTERFACE DESIGN (SCREENS ETC.)")
body = body.replace("## 3.8 Table Specifications", "## 3.8 TABLE SPECIFICATIONS")
body = body.replace("# CHAPTER 4: INPUT AND OUTPUT SCREENS", "# 4 INPUT AND OUTPUT SCREENS")
body = body.replace("# CHAPTER 5: TEST PROCEDURES AND IMPLEMENTATION", "# 5 TEST PROCEDURES AND IMPLEMENTATION")
body = body.replace("# CHAPTER 6: SAMPLE CODE", "# 6 SAMPLE CODE")
body = body.replace("# CHAPTER 7: LIMITATIONS", "# 7 LIMITATIONS")
body = body.replace("# CHAPTER 8: FUTURE SCOPE", "# 8 FUTURE SCOPE")
body = body.replace("# CHAPTER 9: CONCLUSION", "# 9 CONCLUSION")
body = body.replace("# CHAPTER 10: REFERENCES", "# 10 REFERENCES")

new_text = front_matter + body
with open(MD_PATH, "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated Project_Report_Source.md successfully!")

