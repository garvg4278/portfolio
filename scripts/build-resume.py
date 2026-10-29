"""Generates public/resume/Garv_Gupta_Resume.pdf from facts already on the site.
This is a starter resume. Replace the PDF with your own if you keep a different master copy.
Run: python3 scripts/build-resume.py
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle

AUB = colors.HexColor('#502F4C'); INK = colors.HexColor('#1a1218'); DIM = colors.HexColor('#5a4d58')
base = ParagraphStyle('b', fontName='Helvetica', fontSize=8.5, leading=10.7, textColor=INK)
dim = ParagraphStyle('d', parent=base, textColor=DIM)
name = ParagraphStyle('n', parent=base, fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=INK)
sub = ParagraphStyle('s', parent=base, fontSize=10.2, leading=14, textColor=AUB, fontName='Helvetica-Bold')
h = ParagraphStyle('h', parent=base, fontName='Helvetica-Bold', fontSize=10.4, leading=13, textColor=AUB, spaceBefore=6, spaceAfter=1)
b = ParagraphStyle('bl', parent=base, leftIndent=9, bulletIndent=0, spaceAfter=1.2)
bold = lambda t: f'<b>{t}</b>'

def rule(): return HRFlowable(width='100%', thickness=0.6, color=colors.HexColor('#cfc3d3'), spaceBefore=1, spaceAfter=4)
def sec(t): return [Paragraph(t, h), rule()]
def row(left, right):
    t = Table([[Paragraph(left, base), Paragraph(right, ParagraphStyle('r', parent=dim, alignment=2))]], colWidths=[None, 42*mm])
    t.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),1)]))
    return t
def bl(t): return Paragraph(t, b, bulletText='\u2022')

s = []
s += [Paragraph('Garv Gupta', name), Paragraph('DevOps Engineer | Cloud &amp; Automation | CI/CD | Docker', sub), Spacer(1, 3)]
s += [Paragraph('Agra, Uttar Pradesh &nbsp;|&nbsp; garvg4278@gmail.com &nbsp;|&nbsp; +91 93190 09805 &nbsp;|&nbsp; linkedin.com/in/garv-gupta &nbsp;|&nbsp; github.com/garvg4278 &nbsp;|&nbsp; garv-gupta-portfolio.bytexl.live', dim)]

s += sec('Summary')
s += [Paragraph('Computer Science Engineering graduate (2026) with hands-on project experience in DevOps workflows, CI/CD automation, containerization, deployment environments, Linux fundamentals and Git-based development. Built Dockerized applications with Jenkins and GitHub Actions pipelines, plus database integration, troubleshooting and workflow validation. Foundation in Python, Bash scripting, networking fundamentals, monitoring and logging concepts. Certified in IBM Introduction to DevOps and the AWS Cloud Solutions Architect professional certificate, with a strong interest in cloud infrastructure and infrastructure automation.', base)]

s += sec('Skills')
s += [Paragraph(bold('DevOps and CI/CD: ') + 'Docker, Docker Compose, Jenkins, GitHub Actions, container registries (GHCR, Docker Hub), deployment automation, build validation, health checks.', base),
      Paragraph(bold('Cloud and infrastructure: ') + 'Cloud computing fundamentals, AWS (coursework), deployment environments; learning Kubernetes and Terraform.', base),
      Paragraph(bold('Linux and systems: ') + 'Linux commands, file systems, permissions, process monitoring, log analysis, system troubleshooting, Bash scripting.', base),
      Paragraph(bold('Programming and databases: ') + 'Python, TypeScript, JavaScript, SQL; PostgreSQL, MySQL, SQLite, Prisma; data validation.', base),
      Paragraph(bold('Security: ') + 'JWT authentication and access control, least privilege and secrets management concepts, gitleaks, SBOM and Grype scanning.', base),
      Paragraph(bold('Core CS and tools: ') + 'Operating systems, computer networks, DBMS, OOP, data structures and algorithms; Git, GitHub, VS Code, Postman, Docker Desktop.', base)]

s += sec('Projects')
s += [row(bold('ShipForge') + ' - Dockerized logistics and shipment management system (github.com/garvg4278/shipforge)', 'Completed'),
      Paragraph('<i>Docker, Docker Compose, Jenkins, PostgreSQL, Node.js, Next.js, Python</i>', dim),
      bl('Containerized the application with multi-stage, non-root Docker images and a Compose stack whose backend waits for the PostgreSQL health check.'),
      bl('Built a Jenkins pipeline (lint, build, Docker Hub push, integration health check) and a Python health-check script; moved CI from GitHub Actions to Jenkins.'),
      bl('Configured PostgreSQL integration with Prisma, debugged deployment issues through log analysis and structured validation.')]
s += [row(bold('Sweet Shop Management System') + ' - Dockerized inventory and workflow system (github.com/garvg4278/Sweet-Shop-Management-System)', 'Completed'),
      Paragraph('<i>Docker, Node.js, TypeScript, Prisma, SQLite, React, Jest, Jenkins</i>', dim),
      bl('Containerized backend and frontend, with dev and prod Compose files and a Jenkins pipeline that pushes versioned images to Docker Hub.'),
      bl('Implemented JWT role-based access and request-approval workflows; wrote 24 Jest tests; validated APIs and debugged integration issues.')]
s += [row(bold('Market Data Validation and Reconciliation System (asset management)'), 'Completed'),
      Paragraph('<i>Python, SQL, PostgreSQL</i>', dim),
      bl('Automated validation, processing and reconciliation of structured financial datasets; analysed inconsistencies with SQL and root-cause analysis.')]
s += [row(bold('SSCPrep Platform') + ' - mock-test platform for students (github.com/garvg4278/SSCPrep-Platform)', 'Ongoing'),
      Paragraph('<i>Next.js, Prisma, PostgreSQL, GitHub Actions, Docker, Grype, GHCR</i>', dim),
      bl('Built for students and improved continuously. CI/CD with tests, npm audit, gitleaks, SBOM, Grype, GHCR publishing and Vercel deployment.')]

s += sec('Certifications')
certs = [
 ('AWS Cloud Solutions Architect (Professional Certificate, Coursera)', 'Feb 2026'),
 ('Introduction to DevOps (IBM, Coursera)', 'Sep 2025'),
 ('SQL (Intermediate), Python (Basic), Problem Solving (Basic) (HackerRank)', '2025'),
 ('Google Cybersecurity Professional Certificate (Coursera)', 'Apr 2025'),
 ('Databases and SQL for Data Science with Python (IBM, Coursera)', 'Mar 2024'),
]
for l, r in certs: s.append(row(l, r))

s += sec('Education')
s += [row(bold('B.E. in Computer Science and Engineering') + ', Chandigarh University, Mohali. CGPA 7.68/10', '2022 - 2026')]

s += sec('Additional information')
s += [bl('Comfortable in Linux-based environments and troubleshooting deployment issues. Currently expanding knowledge of AWS, Kubernetes and Terraform.'),
      bl('Willing to work from the office in Gurgaon.')]

doc = SimpleDocTemplate('public/resume/Garv_Gupta_Resume.pdf', pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=9*mm, bottomMargin=8*mm,
                        title='Garv Gupta - Resume', author='Garv Gupta')
doc.build(s)
from pypdf import PdfReader
print('pages:', len(PdfReader('public/resume/Garv_Gupta_Resume.pdf').pages))
