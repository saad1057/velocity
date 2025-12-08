import base64
import tempfile
import re
import os
from flask import Flask, request, jsonify
from unstructured.partition.pdf import partition_pdf
from unstructured.partition.docx import partition_docx

app = Flask(__name__)


def extract_fields(text: str):
    """Extract structured fields from resume text using regex and heuristics."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    
    # Extract name (first line, usually the name)
    name = lines[0] if lines and len(lines[0]) < 50 else None
    
    # Extract contact information
    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    email = email_match.group() if email_match else None
    
    phone_match = re.search(r"\+?\d[\d\s\-()]{7,}\d", text)
    phone = phone_match.group() if phone_match else None
    
    linkedin_match = re.search(r"(?:linkedin\.com/in/|linkedin\.com/in/)([\w\-]+)", text, re.IGNORECASE)
    linkedin = f"linkedin.com/in/{linkedin_match.group(1)}" if linkedin_match else None
    
    github_match = re.search(r"(?:github\.com/)([\w\-]+)", text, re.IGNORECASE)
    github = f"github.com/{github_match.group(1)}" if github_match else None
    
    contact = {
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github
    }
    
    # Extract education
    education = []
    education_section = False
    education_start_idx = -1
    
    # Find education section
    for i, line in enumerate(lines):
        if "EDUCATION" in line.upper():
            education_section = True
            education_start_idx = i
            break
    
    if education_section:
        # Process the line with "EDUCATION" - it might contain the institution
        edu_line = lines[education_start_idx] if education_start_idx < len(lines) else ""
        
        # Remove "EDUCATION" keyword and clean up
        edu_content = re.sub(r"EDUCATION\s*", "", edu_line, flags=re.IGNORECASE).strip()
        
        # Look for education entries starting from the EDUCATION line
        current_edu = {"institution": None, "degree": None, "years": None}
        edu_text_parts = []
        
        # Collect all lines in education section
        for i in range(education_start_idx, len(lines)):
            line = lines[i]
            
            # Stop if we hit another major section
            if i > education_start_idx and any(keyword in line.upper() for keyword in ["EXPERIENCE", "PROJECTS", "SKILLS", "TECHNICAL"]):
                break
            
            # Skip the "EDUCATION" header line itself
            if "EDUCATION" in line.upper() and i == education_start_idx:
                # Extract content after "EDUCATION"
                edu_content = re.sub(r"EDUCATION\s*", "", line, flags=re.IGNORECASE).strip()
                if edu_content:
                    edu_text_parts.append(edu_content)
            elif i > education_start_idx:
                edu_text_parts.append(line)
        
        # Combine all education text
        edu_text = " ".join(edu_text_parts)
        
        # Extract institution (usually comes first, before degree keywords)
        # Pattern: Institution name, then "Bachelor/Master/PhD", then "in/of", then field name
        degree_match = re.search(r"(Bachelor|Master|PhD|Ph\.D\.|B\.S\.|B\.A\.|M\.S\.|M\.A\.)\s+(?:of|in)\s+([^0-9]+)", edu_text, re.IGNORECASE)
        if degree_match:
            degree_type = degree_match.group(1)
            field = degree_match.group(2).strip()
            degree = f"{degree_type} of {field}"
            
            # Extract institution (text before the degree)
            institution_part = edu_text[:degree_match.start()].strip()
            # Remove common words and clean up
            institution = re.sub(r"^\s*(at|in|from)\s+", "", institution_part, flags=re.IGNORECASE).strip()
            # If institution contains commas, take the first part
            if "," in institution:
                institution = institution.split(",")[0].strip()
        else:
            # Fallback: try to find institution and degree separately
            # Look for common patterns
            parts = re.split(r"\s+(Bachelor|Master|PhD|Ph\.D\.|B\.S\.|B\.A\.|M\.S\.|M\.A\.)", edu_text, flags=re.IGNORECASE, maxsplit=1)
            if len(parts) >= 2:
                institution = parts[0].strip()
                degree = parts[1].strip() if len(parts) > 1 else None
            else:
                institution = edu_text.split(",")[0].strip() if "," in edu_text else edu_text.split()[0] if edu_text else None
                degree = None
        
        # Extract years (look for pattern like "2022 – 2026" or "2022-2026")
        years_match = re.search(r"(\d{4})\s*[–-]\s*(\d{4})", edu_text)
        years = years_match.group(0) if years_match else None
        
        # If years not found in combined text, check next line after education
        if not years and education_start_idx + 1 < len(lines):
            next_line = lines[education_start_idx + 1]
            years_match = re.search(r"(\d{4})\s*[–-]\s*(\d{4})", next_line)
            if years_match:
                years = years_match.group(0)
                # If we found years on next line, make sure we didn't include it in institution
                if institution and years in institution:
                    institution = institution.replace(years, "").strip()
        
        if institution or degree:
            education.append({
                "institution": institution,
                "degree": degree,
                "years": years
            })
    
    # Extract experience
    experience = []
    experience_section = False
    current_exp = None
    
    for i, line in enumerate(lines):
        if "EXPERIENCE" in line.upper():
            experience_section = True
            continue
        if experience_section:
            if any(keyword in line.upper() for keyword in ["PROJECTS", "SKILLS", "TECHNICAL", "EDUCATION"]):
                if current_exp:
                    experience.append(current_exp)
                break
            
            # Check if this is a new experience entry (contains "Intern", "Developer", "Engineer", etc.)
            if re.search(r"(Intern|Developer|Engineer|Analyst|Manager|Specialist|Consultant|Lead|Senior|Junior)", line, re.IGNORECASE):
                if current_exp:
                    experience.append(current_exp)
                
                # Extract role and company
                role_match = re.search(r"(Intern|Developer|Engineer|Analyst|Manager|Specialist|Consultant|Lead|Senior|Junior)[^a-z]*at\s+([^•\n]+)", line, re.IGNORECASE)
                if role_match:
                    role = role_match.group(1).strip()
                    company = role_match.group(2).strip() if len(role_match.groups()) > 1 else None
                else:
                    # Try alternative pattern
                    parts = re.split(r"\s+at\s+", line, flags=re.IGNORECASE)
                    if len(parts) >= 2:
                        role = parts[0].strip()
                        company = parts[1].strip()
                    else:
                        role = line.strip()
                        company = None
                
                # Extract duration and location from next lines
                duration = None
                location = None
                if i + 1 < len(lines):
                    next_line = lines[i + 1]
                    # Look for date pattern (e.g., "July 2025 - Sep 2025")
                    duration_match = re.search(r"([A-Za-z]+\s+\d{4})\s*[-–]\s*([A-Za-z]+\s+\d{4})", next_line)
                    if duration_match:
                        duration = duration_match.group(0)
                    # Look for location (usually after duration)
                    location_match = re.search(r"([A-Za-z]+,\s*[A-Za-z]+)", next_line)
                    if location_match:
                        location = location_match.group(0)
                
                current_exp = {
                    "company": company,
                    "role": role,
                    "duration": duration,
                    "location": location,
                    "responsibilities": []
                }
            elif current_exp and line.strip().startswith("•"):
                # This is a responsibility bullet point
                responsibility = line.strip().lstrip("•").strip()
                if responsibility:
                    current_exp["responsibilities"].append(responsibility)
            elif current_exp and line.strip() and not re.search(r"^\d{4}", line):
                # Might be a continuation of responsibilities
                if len(current_exp["responsibilities"]) > 0:
                    current_exp["responsibilities"][-1] += " " + line.strip()
    
    if current_exp:
        experience.append(current_exp)
    
    # Extract projects
    projects = []
    projects_section = False
    current_project = None
    
    for i, line in enumerate(lines):
        if "PROJECTS" in line.upper():
            projects_section = True
            continue
        if projects_section:
            if any(keyword in line.upper() for keyword in ["SKILLS", "TECHNICAL", "EXPERIENCE", "EDUCATION"]):
                if current_project:
                    projects.append(current_project)
                break
            
            # Check if this is a project name (usually has | separator or technologies listed)
            if "|" in line or any(tech in line for tech in ["Python", "React", "JavaScript", "C#", "SQL"]):
                if current_project:
                    projects.append(current_project)
                
                # Extract project name and technologies
                if "|" in line:
                    parts = line.split("|")
                    project_name = parts[0].strip()
                    technologies = [t.strip() for t in parts[1].split(",")] if len(parts) > 1 else []
                else:
                    project_name = line.strip()
                    technologies = []
                
                # Look for duration in next line
                duration = None
                if i + 1 < len(lines):
                    duration_match = re.search(r"([A-Za-z]+\s+\d{4})", lines[i + 1])
                    if duration_match:
                        duration = duration_match.group(0)
                
                current_project = {
                    "name": project_name,
                    "technologies": technologies,
                    "duration": duration,
                    "achievements": []
                }
            elif current_project and line.strip().startswith("•"):
                # Achievement bullet point
                achievement = line.strip().lstrip("•").strip()
                if achievement:
                    current_project["achievements"].append(achievement)
            elif current_project and line.strip() and not re.search(r"^\d{4}", line):
                # Continuation of achievement
                if len(current_project["achievements"]) > 0:
                    current_project["achievements"][-1] += " " + line.strip()
    
    if current_project:
        projects.append(current_project)
    
    # Extract skills
    skills = []
    skills_section = False
    skills_keywords = [
        "python", "javascript", "java", "react", "node", "sql", "mongodb",
        "aws", "docker", "kubernetes", "git", "html", "css", "typescript",
        "angular", "vue", "django", "flask", "express", "spring", "c++", "c#",
        "machine learning", "ai", "data science", "tensorflow", "pytorch",
        "opencv", "ocr", "php", "mysql", "mssql", ".net", "streamlit"
    ]
    text_lower = text.lower()
    
    for skill in skills_keywords:
        if skill in text_lower:
            # Capitalize properly
            if skill == "c++":
                skills.append("C++")
            elif skill == "c#":
                skills.append("C#")
            elif skill == "ai":
                skills.append("AI")
            elif " " in skill:
                skills.append(" ".join(word.capitalize() for word in skill.split()))
            else:
                skills.append(skill.capitalize())
    
    # Remove duplicates while preserving order
    seen = set()
    unique_skills = []
    for skill in skills:
        if skill.lower() not in seen:
            seen.add(skill.lower())
            unique_skills.append(skill)
    
    # Remove duplicate experiences
    seen_experiences = set()
    unique_experiences = []
    for exp in experience:
        # Create a unique key based on company, role, and duration
        exp_key = f"{exp.get('company', '')}|{exp.get('role', '')}|{exp.get('duration', '')}"
        if exp_key not in seen_experiences:
            seen_experiences.add(exp_key)
            unique_experiences.append(exp)
    
    # Remove duplicate projects
    seen_projects = set()
    unique_projects = []
    for proj in projects:
        # Create a unique key based on name and duration
        proj_key = f"{proj.get('name', '')}|{proj.get('duration', '')}"
        if proj_key not in seen_projects:
            seen_projects.add(proj_key)
            unique_projects.append(proj)
    
    return {
        "name": name,
        "contact": contact,
        "education": education,
        "experience": unique_experiences,
        "projects": unique_projects,
        "skills": unique_skills
    }


def read_file_from_request():
    """Read file from either multipart/form-data or JSON base64."""
    if request.content_type and "multipart/form-data" in request.content_type:
        f = request.files.get("resume") or request.files.get("file")
        if not f:
            return None, None
        return f.read(), f.filename or "resume.pdf"
    
    # JSON with base64
    data = request.get_json(force=True, silent=True) or {}
    b64 = data.get("documentBase64")
    filename = data.get("fileName", "resume.pdf")
    if not b64:
        return None, None
    return base64.b64decode(b64), filename


@app.route("/parse", methods=["POST"])
def parse_single():
    """Parse a single resume file."""
    file_bytes, filename = read_file_from_request()
    
    if not file_bytes:
        return jsonify({"success": False, "message": "No file provided"}), 400

    try:
        # Determine file type
        is_pdf = filename.lower().endswith(".pdf")
        suffix = ".pdf" if is_pdf else ".docx"
        
        # Write to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            # Extract text using unstructured
            if is_pdf:
                elements = partition_pdf(tmp_path)
            else:
                elements = partition_docx(tmp_path)
            
            # Combine text from all elements
            text = "\n".join([str(e) for e in elements if hasattr(e, "text")])
            
            # Extract structured fields
            parsed = extract_fields(text)
            
            return jsonify({"success": True, "data": parsed})
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@app.route("/parse-batch", methods=["POST"])
def parse_batch():
    """Parse multiple resume files (batch processing)."""
    # For now, return not implemented
    return jsonify({"success": False, "message": "Batch parsing not yet implemented"}), 501


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001)