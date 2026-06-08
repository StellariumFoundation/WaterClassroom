/**
 * Comprehensive curriculum programs and grade/level data for onboarding.
 * Covers K-12 and undergraduate programs worldwide.
 */

export interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface GradeLevel {
  id: string;
  name: string;
  stage: "early" | "elementary" | "middle" | "high" | "undergraduate";
  order: number;
}

// ─── Extensive list of curriculum programs ───

export const PROGRAMS: Program[] = [
  // US Standards
  { id: "us-common-core", name: "US Common Core State Standards", category: "US National", description: "ELA & Mathematics standards adopted by 41+ states" },
  { id: "us-teks-texas", name: "Texas Essential Knowledge & Skills (TEKS)", category: "US State", description: "Texas state-specific standards" },
  { id: "us-sol-virginia", name: "Virginia Standards of Learning (SOL)", category: "US State", description: "Virginia state-specific standards" },
  { id: "us-california", name: "California State Standards", category: "US State", description: "California's adapted Common Core standards" },
  { id: "us-florida-beste", name: "Florida B.E.S.T. Standards", category: "US State", description: "Florida's Benchmarks for Excellent Student Thinking" },
  { id: "us-new-york", name: "New York State P-12 Learning Standards", category: "US State", description: "New York state standards" },
  { id: "us-massachusetts", name: "Massachusetts Curriculum Frameworks", category: "US State", description: "Massachusetts state standards" },
  { id: "us-nextgen-science", name: "Next Generation Science Standards (NGSS)", category: "US National", description: "K-12 science standards" },
  { id: "us-c3-social", name: "C3 Framework for Social Studies", category: "US National", description: "College, Career & Civic Life framework" },
  { id: "us-nctm-math", name: "NCTM Mathematics Standards", category: "US National", description: "National Council of Teachers of Mathematics" },

  // Advanced Placement
  { id: "ap-program", name: "Advanced Placement (AP) Program", category: "US Advanced", description: "College Board AP courses & exams" },
  { id: "ap-capstone", name: "AP Capstone Diploma Program", category: "US Advanced", description: "AP Seminar + AP Research" },
  { id: "dual-enrollment", name: "Dual Enrollment / College Credit Plus", category: "US Advanced", description: "Simultaneous high school & college credit" },

  // UK / British
  { id: "uk-national", name: "UK National Curriculum (Key Stages 1-5)", category: "UK", description: "English national curriculum framework" },
  { id: "uk-gcse", name: "UK GCSE / IGCSE", category: "UK", description: "General Certificate of Secondary Education (ages 14-16)" },
  { id: "uk-a-level", name: "UK A-Level / AS-Level", category: "UK", description: "Advanced Level qualifications (ages 16-18)" },
  { id: "uk-btec", name: "UK BTEC Qualifications", category: "UK", description: "Applied/vocational qualifications" },
  { id: "uk-t-level", name: "UK T-Levels", category: "UK", description: "Technical qualifications equivalent to A-Levels" },
  { id: "cambridge-primary", name: "Cambridge Primary (ages 5-11)", category: "UK International", description: "Cambridge International curriculum for primary" },
  { id: "cambridge-secondary1", name: "Cambridge Lower Secondary (ages 11-14)", category: "UK International", description: "Cambridge International for lower secondary" },
  { id: "cambridge-igcse", name: "Cambridge IGCSE (ages 14-16)", category: "UK International", description: "International alternative to GCSE" },
  { id: "cambridge-alevel", name: "Cambridge International A-Level (ages 16-19)", category: "UK International", description: "Pre-university qualifications" },

  // International Baccalaureate
  { id: "ib-pyp", name: "IB Primary Years Programme (PYP)", category: "IB", description: "Ages 3-12, transdisciplinary framework" },
  { id: "ib-myp", name: "IB Middle Years Programme (MYP)", category: "IB", description: "Ages 11-16, broad academic framework" },
  { id: "ib-dp", name: "IB Diploma Programme (DP)", category: "IB", description: "Ages 16-19, pre-university diploma" },
  { id: "ib-cp", name: "IB Career-related Programme (CP)", category: "IB", description: "Ages 16-19, career-focused pathway" },

  // European
  { id: "euro-baccalaureate", name: "European Baccalaureate", category: "European", description: "European Schools bilingual diploma" },
  { id: "swiss-maturite", name: "Swiss Maturité / Matura", category: "European", description: "Swiss federal baccalaureate" },
  { id: "french-bac", name: "French Baccalaureate", category: "European", description: "French national diploma" },
  { id: "german-abitur", name: "German Abitur", category: "European", description: "German university entrance qualification" },
  { id: "dutch-vwo", name: "Dutch VWO / HAVO", category: "European", description: "Netherlands pre-university education" },

  // Canadian
  { id: "ca-ontario", name: "Ontario Curriculum", category: "Canadian", description: "Ontario provincial curriculum (K-12)" },
  { id: "ca-british-columbia", name: "British Columbia Curriculum", category: "Canadian", description: "BC redesigned curriculum with core competencies" },
  { id: "ca-alberta", name: "Alberta Program of Studies", category: "Canadian", description: "Alberta provincial curriculum" },
  { id: "ca-quebec", name: "Quebec Education Program (QEP)", category: "Canadian", description: "Quebec's DCS/DEC system" },
  { id: "ca-manitoba", name: "Manitoba Curriculum", category: "Canadian", description: "Manitoba provincial framework" },

  // Australian / NZ
  { id: "au-curriculum", name: "Australian Curriculum (v9.0)", category: "Australia / NZ", description: "ACARA national curriculum (F-12)" },
  { id: "au-nsw", name: "NSW Education Standards (NESA)", category: "Australia / NZ", description: "New South Wales syllabus" },
  { id: "au-victoria", name: "Victorian Curriculum F-10", category: "Australia / NZ", description: "Victoria state curriculum" },
  { id: "nz-curriculum", name: "New Zealand Curriculum", category: "Australia / NZ", description: "NZ national curriculum framework" },

  // Asian / Singapore
  { id: "sg-moe", name: "Singapore Ministry of Education (MOE) Curriculum", category: "Asian", description: "Singapore's world-renowned math & science framework" },
  { id: "sg-math", name: "Singapore Math Method", category: "Asian", description: "Singapore's mastery-based math pedagogy" },
  { id: "jp-mext", name: "Japanese MEXT Curriculum", category: "Asian", description: "Japan's national course of study" },
  { id: "kr-korean", name: "Korean National Curriculum", category: "Asian", description: "South Korea's national education framework" },
  { id: "cn-chinese", name: "Chinese National Curriculum", category: "Asian", description: "China's national compulsory education standards" },
  { id: "in-cbse", name: "India CBSE Curriculum", category: "Asian", description: "Central Board of Secondary Education" },
  { id: "in-icse", name: "India ICSE Curriculum (CISCE)", category: "Asian", description: "Indian Certificate of Secondary Education" },
  { id: "in-state-board", name: "India State Board Curriculum", category: "Asian", description: "Various Indian state education boards" },

  // Middle East / Africa
  { id: "uae-moe", name: "UAE Ministry of Education (MOE) Curriculum", category: "Middle East / Africa", description: "UAE national standards" },
  { id: "saudi-national", name: "Saudi Arabian National Curriculum", category: "Middle East / Africa", description: "Saudi general education curriculum" },
  { id: "za-caps", name: "South African CAPS Curriculum", category: "Middle East / Africa", description: "Curriculum and Assessment Policy Statement" },

  // Pedagogical / Alternative
  { id: "montessori", name: "Montessori Method", category: "Alternative Pedagogy", description: "Child-led, multi-age, hands-on learning" },
  { id: "waldorf-steiner", name: "Waldorf / Steiner Education", category: "Alternative Pedagogy", description: "Imagination, arts, developmental stages" },
  { id: "reggio-emilia", name: "Reggio Emilia Approach", category: "Alternative Pedagogy", description: "Project-based, community-focused, inquiry-driven" },
  { id: "classical-education", name: "Classical Education (Trivium)", category: "Alternative Pedagogy", description: "Grammar, Logic, Rhetoric framework" },
  { id: "charlotte-mason", name: "Charlotte Mason Method", category: "Alternative Pedagogy", description: "Living books, narration, nature study" },
  { id: "unschooling", name: "Unschooling / Self-Directed Learning", category: "Alternative Pedagogy", description: "Student-led, interest-driven, no fixed curriculum" },
  { id: "project-based", name: "Project-Based Learning (PBL)", category: "Alternative Pedagogy", description: "Hands-on projects driving core learning" },
  { id: "steam", name: "STEAM Education", category: "Alternative Pedagogy", description: "Science, Tech, Engineering, Arts, Math integrated" },
  { id: "stem-focused", name: "STEM-Focused Program", category: "Alternative Pedagogy", description: "Emphasis on science, technology, engineering, math" },
  { id: "homeschool-custom", name: "Custom Homeschool Curriculum", category: "Alternative Pedagogy", description: "Parent-designed mixed resources" },

  // Virtual / Online
  { id: "k12-inc", name: "K12 Inc. / Stride Learning", category: "Virtual / Online", description: "Managed online public & private school" },
  { id: "connections-academy", name: "Connections Academy (Pearson)", category: "Virtual / Online", description: "Tuition-free online public school" },
  { id: "khan-academy", name: "Khan Academy Districts", category: "Virtual / Online", description: "Free mastery-based learning platform" },
  { id: "outschool", name: "Outschool Marketplace", category: "Virtual / Online", description: "Live online small-group classes" },
  { id: "acellus", name: "Acellus / Power Homeschool", category: "Virtual / Online", description: "Accredited online curriculum for homeschool" },
  { id: "time4learning", name: "Time4Learning", category: "Virtual / Online", description: "Online homeschool curriculum (PreK-12)" },
  { id: "abeka-academy", name: "Abeka Academy", category: "Virtual / Online", description: "Christian-based online & video homeschool" },
  { id: "bju-homeschool", name: "BJU Press Homeschool", category: "Virtual / Online", description: "Christian-based distance learning" },
  { id: "byu-independent", name: "BYU Independent Study", category: "Virtual / Online", description: "Self-paced accredited courses" },
  { id: "cambrilearn", name: "CambriLearn", category: "Virtual / Online", description: "Cambridge & US curriculum online" },

  // Water Classroom Specific
  { id: "water-creed", name: "Water First-Principles Creed", category: "Water Classroom", description: "Proprietary systems-thinking & first-principles track" },
  { id: "water-robotics", name: "Water Robotics Engineering Track", category: "Water Classroom", description: "Robotics simulation & teleoperation mechanics" },
  { id: "water-ai", name: "Water AI & Systems Design Track", category: "Water Classroom", description: "AI literacy, incentive engineering, systems thinking" },
  { id: "water-methodology", name: "🌊 Water School Methodology — World-Class Education", category: "Water Classroom", description: "Water's proprietary world-class homeschool methodology — integrates first-principles thinking, Socratic dialogue, project-based learning, and verified credentialing. Available globally to all students." },

  // General / Other
  { id: "general-k12", name: "General K-12 Standards", category: "General", description: "Standard K-12 without specific program alignment" },
  { id: "general-undergrad", name: "General Undergraduate Preparation", category: "General", description: "General college-prep pathway" },
  { id: "life-skills", name: "Life Skills & Practical Education", category: "General", description: "Financial literacy, civics, health, critical thinking" },
  { id: "special-needs", name: "Special Education / IEP-Aligned", category: "General", description: "Individualized Education Program aligned" },
  { id: "gifted-talented", name: "Gifted & Talented Program", category: "General", description: "Accelerated learning for advanced students" },
];

// ─── Extensive list of grade / student stages ───

export const GRADE_LEVELS: GradeLevel[] = [
  // Early Childhood
  { id: "pre-k", name: "Pre-Kindergarten (Pre-K)", stage: "early", order: 1 },
  { id: "transitional-k", name: "Transitional Kindergarten (TK)", stage: "early", order: 2 },
  { id: "kindergarten", name: "Kindergarten (K)", stage: "early", order: 3 },

  // Elementary
  { id: "grade-1", name: "1st Grade", stage: "elementary", order: 4 },
  { id: "grade-2", name: "2nd Grade", stage: "elementary", order: 5 },
  { id: "grade-3", name: "3rd Grade", stage: "elementary", order: 6 },
  { id: "grade-4", name: "4th Grade", stage: "elementary", order: 7 },
  { id: "grade-5", name: "5th Grade", stage: "elementary", order: 8 },

  // Middle School
  { id: "grade-6", name: "6th Grade", stage: "middle", order: 9 },
  { id: "grade-7", name: "7th Grade", stage: "middle", order: 10 },
  { id: "grade-8", name: "8th Grade", stage: "middle", order: 11 },

  // High School
  { id: "grade-9", name: "9th Grade / Freshman", stage: "high", order: 12 },
  { id: "grade-10", name: "10th Grade / Sophomore", stage: "high", order: 13 },
  { id: "grade-11", name: "11th Grade / Junior", stage: "high", order: 14 },
  { id: "grade-12", name: "12th Grade / Senior", stage: "high", order: 15 },

  // Undergraduate
  { id: "undergrad-1", name: "1st Year / Freshman (Undergraduate)", stage: "undergraduate", order: 16 },
  { id: "undergrad-2", name: "2nd Year / Sophomore (Undergraduate)", stage: "undergraduate", order: 17 },
  { id: "undergrad-3", name: "3rd Year / Junior (Undergraduate)", stage: "undergraduate", order: 18 },
  { id: "undergrad-4", name: "4th Year / Senior (Undergraduate)", stage: "undergraduate", order: 19 },

  // Foundation / Bridge
  { id: "foundation-year", name: "Foundation Year / Pre-University", stage: "undergraduate", order: 15.5 },
  { id: "gap-year", name: "Gap Year / Bridge Program", stage: "undergraduate", order: 15.6 },
];

// ─── Country-Specific Grade Level Systems ───
// Different countries use different naming conventions for grades.
// Each system maps to the canonical stages (early, elementary, middle, high, undergraduate).

export interface CountryGradeSystem {
  stages: Array<{
    key: string;
    label: string;
    description: string;
    gradeLevels: Array<{ id: string; name: string; order: number }>;
  }>;
}

export const COUNTRY_GRADE_SYSTEMS: Record<string, CountryGradeSystem> = {
  // ─── United States ───
  US: {
    stages: [
      {
        key: "early", label: "Early Childhood", description: "Pre-K through Kindergarten",
        gradeLevels: [
          { id: "pre-k", name: "Pre-Kindergarten (Pre-K)", order: 1 },
          { id: "transitional-k", name: "Transitional Kindergarten (TK)", order: 2 },
          { id: "kindergarten", name: "Kindergarten (K)", order: 3 },
        ]
      },
      {
        key: "elementary", label: "Elementary School", description: "1st through 5th Grade",
        gradeLevels: [
          { id: "grade-1", name: "1st Grade", order: 4 },
          { id: "grade-2", name: "2nd Grade", order: 5 },
          { id: "grade-3", name: "3rd Grade", order: 6 },
          { id: "grade-4", name: "4th Grade", order: 7 },
          { id: "grade-5", name: "5th Grade", order: 8 },
        ]
      },
      {
        key: "middle", label: "Middle School", description: "6th through 8th Grade",
        gradeLevels: [
          { id: "grade-6", name: "6th Grade", order: 9 },
          { id: "grade-7", name: "7th Grade", order: 10 },
          { id: "grade-8", name: "8th Grade", order: 11 },
        ]
      },
      {
        key: "high", label: "High School", description: "9th through 12th Grade",
        gradeLevels: [
          { id: "grade-9", name: "9th Grade / Freshman", order: 12 },
          { id: "grade-10", name: "10th Grade / Sophomore", order: 13 },
          { id: "grade-11", name: "11th Grade / Junior", order: 14 },
          { id: "grade-12", name: "12th Grade / Senior", order: 15 },
        ]
      },
      {
        key: "undergraduate", label: "Undergraduate / College", description: "College years",
        gradeLevels: [
          { id: "undergrad-1", name: "1st Year / Freshman", order: 16 },
          { id: "undergrad-2", name: "2nd Year / Sophomore", order: 17 },
          { id: "undergrad-3", name: "3rd Year / Junior", order: 18 },
          { id: "undergrad-4", name: "4th Year / Senior", order: 19 },
        ]
      },
    ]
  },

  // ─── United Kingdom ───
  UK: {
    stages: [
      {
        key: "early", label: "Early Years Foundation Stage", description: "Ages 3-5",
        gradeLevels: [
          { id: "pre-k", name: "Nursery (ages 3-4)", order: 1 },
          { id: "transitional-k", name: "Reception (ages 4-5)", order: 2 },
        ]
      },
      {
        key: "elementary", label: "Key Stage 1 & 2 (Primary School)", description: "Years 1-6, ages 5-11",
        gradeLevels: [
          { id: "grade-1", name: "Year 1 (ages 5-6)", order: 3 },
          { id: "grade-2", name: "Year 2 (ages 6-7) — SATs", order: 4 },
          { id: "grade-3", name: "Year 3 (ages 7-8)", order: 5 },
          { id: "grade-4", name: "Year 4 (ages 8-9)", order: 6 },
          { id: "grade-5", name: "Year 5 (ages 9-10)", order: 7 },
          { id: "kindergarten", name: "Year 6 (ages 10-11) — SATs", order: 8 },
        ]
      },
      {
        key: "middle", label: "Key Stage 3 (Secondary School)", description: "Years 7-9, ages 11-14",
        gradeLevels: [
          { id: "grade-6", name: "Year 7 (ages 11-12)", order: 9 },
          { id: "grade-7", name: "Year 8 (ages 12-13)", order: 10 },
          { id: "grade-8", name: "Year 9 (ages 13-14)", order: 11 },
        ]
      },
      {
        key: "high", label: "GCSE & Sixth Form", description: "Years 10-13, ages 14-18",
        gradeLevels: [
          { id: "grade-9", name: "Year 10 (GCSE start, ages 14-15)", order: 12 },
          { id: "grade-10", name: "Year 11 (GCSE exams, ages 15-16)", order: 13 },
          { id: "grade-11", name: "Year 12 (Sixth Form, AS-Level, ages 16-17)", order: 14 },
          { id: "grade-12", name: "Year 13 (A-Level exams, ages 17-18)", order: 15 },
        ]
      },
      {
        key: "undergraduate", label: "Higher Education", description: "University / College",
        gradeLevels: [
          { id: "undergrad-1", name: "1st Year / Fresher", order: 16 },
          { id: "undergrad-2", name: "2nd Year", order: 17 },
          { id: "undergrad-3", name: "3rd Year (Final Year BA/BSc)", order: 18 },
          { id: "undergrad-4", name: "4th Year (Master's/MSc)", order: 19 },
        ]
      },
    ]
  },

  // ─── Canada ───
  CA: {
    stages: [
      {
        key: "early", label: "Early Childhood", description: "Pre-K through Kindergarten",
        gradeLevels: [
          { id: "pre-k", name: "Junior Kindergarten (JK)", order: 1 },
          { id: "transitional-k", name: "Senior Kindergarten (SK)", order: 2 },
          { id: "kindergarten", name: "Grade 1", order: 3 },
        ]
      },
      {
        key: "elementary", label: "Elementary School", description: "Grades 1-6 (varies by province)",
        gradeLevels: [
          { id: "grade-1", name: "Grade 1", order: 4 },
          { id: "grade-2", name: "Grade 2", order: 5 },
          { id: "grade-3", name: "Grade 3", order: 6 },
          { id: "grade-4", name: "Grade 4", order: 7 },
          { id: "grade-5", name: "Grade 5", order: 8 },
          { id: "grade-6", name: "Grade 6", order: 9 },
        ]
      },
      {
        key: "middle", label: "Middle / Junior High", description: "Grades 7-8",
        gradeLevels: [
          { id: "grade-7", name: "Grade 7", order: 10 },
          { id: "grade-8", name: "Grade 8", order: 11 },
        ]
      },
      {
        key: "high", label: "High School", description: "Grades 9-12",
        gradeLevels: [
          { id: "grade-9", name: "Grade 9", order: 12 },
          { id: "grade-10", name: "Grade 10", order: 13 },
          { id: "grade-11", name: "Grade 11", order: 14 },
          { id: "grade-12", name: "Grade 12", order: 15 },
        ]
      },
      {
        key: "undergraduate", label: "Post-Secondary", description: "College / University",
        gradeLevels: [
          { id: "undergrad-1", name: "1st Year / Freshman", order: 16 },
          { id: "undergrad-2", name: "2nd Year / Sophomore", order: 17 },
          { id: "undergrad-3", name: "3rd Year / Junior", order: 18 },
          { id: "undergrad-4", name: "4th Year / Senior", order: 19 },
        ]
      },
    ]
  },

  // ─── Australia ───
  AU: {
    stages: [
      {
        key: "early", label: "Early Learning", description: "Foundation / Prep",
        gradeLevels: [
          { id: "pre-k", name: "Kindergarten (NSW/ACT) / Prep (Vic/Qld)", order: 1 },
          { id: "kindergarten", name: "Year 1", order: 2 },
        ]
      },
      {
        key: "elementary", label: "Primary School", description: "Years 2-6",
        gradeLevels: [
          { id: "grade-1", name: "Year 2 (ages 6-7)", order: 3 },
          { id: "grade-2", name: "Year 3 (NAPLAN)", order: 4 },
          { id: "grade-3", name: "Year 4", order: 5 },
          { id: "grade-4", name: "Year 5", order: 6 },
          { id: "grade-5", name: "Year 6", order: 7 },
        ]
      },
      {
        key: "middle", label: "Secondary School (Junior)", description: "Years 7-9",
        gradeLevels: [
          { id: "grade-6", name: "Year 7", order: 8 },
          { id: "grade-7", name: "Year 8", order: 9 },
          { id: "grade-8", name: "Year 9", order: 10 },
        ]
      },
      {
        key: "high", label: "Secondary School (Senior)", description: "Years 10-12",
        gradeLevels: [
          { id: "grade-9", name: "Year 10", order: 11 },
          { id: "grade-10", name: "Year 11", order: 12 },
          { id: "grade-11", name: "Year 12 (ATAR)", order: 13 },
        ]
      },
      {
        key: "undergraduate", label: "Tertiary Education", description: "University / TAFE",
        gradeLevels: [
          { id: "undergrad-1", name: "1st Year Undergraduate", order: 14 },
          { id: "undergrad-2", name: "2nd Year Undergraduate", order: 15 },
          { id: "undergrad-3", name: "3rd Year Undergraduate", order: 16 },
          { id: "undergrad-4", name: "Honours / 4th Year", order: 17 },
        ]
      },
    ]
  },

  // ─── Germany ───
  DE: {
    stages: [
      {
        key: "early", label: "Frühkindliche Bildung", description: "Kita / Kindergarten",
        gradeLevels: [
          { id: "pre-k", name: "Kita / Kindergarten", order: 1 },
          { id: "kindergarten", name: "Vorschule", order: 2 },
        ]
      },
      {
        key: "elementary", label: "Grundschule", description: "Classes 1-4 (ages 6-10)",
        gradeLevels: [
          { id: "grade-1", name: "1. Klasse", order: 3 },
          { id: "grade-2", name: "2. Klasse", order: 4 },
          { id: "grade-3", name: "3. Klasse", order: 5 },
          { id: "grade-4", name: "4. Klasse", order: 6 },
        ]
      },
      {
        key: "middle", label: "Sekundarstufe I", description: "Classes 5-10 (ages 10-16)",
        gradeLevels: [
          { id: "grade-5", name: "5. Klasse (Orientierungsstufe)", order: 7 },
          { id: "grade-6", name: "6. Klasse", order: 8 },
          { id: "grade-7", name: "7. Klasse", order: 9 },
          { id: "grade-8", name: "8. Klasse", order: 10 },
          { id: "grade-9", name: "9. Klasse", order: 11 },
          { id: "grade-10", name: "10. Klasse", order: 12 },
        ]
      },
      {
        key: "high", label: "Sekundarstufe II", description: "Gymnasiale Oberstufe (ages 16-19)",
        gradeLevels: [
          { id: "grade-11", name: "11. Klasse (Einführungsphase)", order: 13 },
          { id: "grade-12", name: "12. Klasse (Qualifikationsphase)", order: 14 },
          { id: "foundation-year", name: "13. Klasse (Abiturprüfung)", order: 15 },
        ]
      },
      {
        key: "undergraduate", label: "Hochschule", description: "Universität / Fachhochschule",
        gradeLevels: [
          { id: "undergrad-1", name: "1. Semester (Bachelor)", order: 16 },
          { id: "undergrad-2", name: "3. Semester (Bachelor)", order: 17 },
          { id: "undergrad-3", name: "5. Semester (Bachelor)", order: 18 },
          { id: "undergrad-4", name: "Master-Studium", order: 19 },
        ]
      },
    ]
  },

  // ─── France ───
  FR: {
    stages: [
      {
        key: "early", label: "École Maternelle", description: "Petite section to Grande section",
        gradeLevels: [
          { id: "pre-k", name: "Toute Petite Section (TPS)", order: 1 },
          { id: "transitional-k", name: "Petite Section (PS)", order: 2 },
          { id: "kindergarten", name: "Moyenne Section (MS)", order: 3 },
          { id: "grade-1", name: "Grande Section (GS)", order: 4 },
        ]
      },
      {
        key: "elementary", label: "École Élémentaire", description: "CP to CM2 (ages 6-11)",
        gradeLevels: [
          { id: "grade-2", name: "Cours Préparatoire (CP)", order: 5 },
          { id: "grade-3", name: "Cours Élémentaire 1 (CE1)", order: 6 },
          { id: "grade-4", name: "Cours Élémentaire 2 (CE2)", order: 7 },
          { id: "grade-5", name: "Cours Moyen 1 (CM1)", order: 8 },
          { id: "grade-6", name: "Cours Moyen 2 (CM2)", order: 9 },
        ]
      },
      {
        key: "middle", label: "Collège", description: "6ème to 3ème (ages 11-15)",
        gradeLevels: [
          { id: "grade-7", name: "6ème", order: 10 },
          { id: "grade-8", name: "5ème", order: 11 },
          { id: "grade-9", name: "4ème", order: 12 },
          { id: "grade-10", name: "3ème (Brevet)", order: 13 },
        ]
      },
      {
        key: "high", label: "Lycée", description: "Seconde to Terminale (ages 15-18)",
        gradeLevels: [
          { id: "grade-11", name: "Seconde", order: 14 },
          { id: "grade-12", name: "Première", order: 15 },
          { id: "foundation-year", name: "Terminale (Baccalauréat)", order: 16 },
        ]
      },
      {
        key: "undergraduate", label: "Enseignement Supérieur", description: "Université / Grandes Écoles",
        gradeLevels: [
          { id: "undergrad-1", name: "Licence 1 (L1)", order: 17 },
          { id: "undergrad-2", name: "Licence 2 (L2)", order: 18 },
          { id: "undergrad-3", name: "Licence 3 (L3)", order: 19 },
          { id: "undergrad-4", name: "Master 1 (M1)", order: 20 },
        ]
      },
    ]
  },

  // ─── Brazil ───
  BR: {
    stages: [
      {
        key: "early", label: "Educação Infantil", description: "Creche e Pré-Escola",
        gradeLevels: [
          { id: "pre-k", name: "Berçário / Creche (0-3 anos)", order: 1 },
          { id: "transitional-k", name: "Pré-Escola (Pré I)", order: 2 },
          { id: "kindergarten", name: "Pré-Escola (Pré II)", order: 3 },
        ]
      },
      {
        key: "elementary", label: "Ensino Fundamental I", description: "1º ao 5º ano (Anos Iniciais)",
        gradeLevels: [
          { id: "grade-1", name: "1º Ano", order: 4 },
          { id: "grade-2", name: "2º Ano", order: 5 },
          { id: "grade-3", name: "3º Ano", order: 6 },
          { id: "grade-4", name: "4º Ano", order: 7 },
          { id: "grade-5", name: "5º Ano", order: 8 },
        ]
      },
      {
        key: "middle", label: "Ensino Fundamental II", description: "6º ao 9º ano (Anos Finais)",
        gradeLevels: [
          { id: "grade-6", name: "6º Ano", order: 9 },
          { id: "grade-7", name: "7º Ano", order: 10 },
          { id: "grade-8", name: "8º Ano", order: 11 },
          { id: "grade-9", name: "9º Ano", order: 12 },
        ]
      },
      {
        key: "high", label: "Ensino Médio", description: "1ª à 3ª série",
        gradeLevels: [
          { id: "grade-10", name: "1ª Série (Ensino Médio)", order: 13 },
          { id: "grade-11", name: "2ª Série (Ensino Médio)", order: 14 },
          { id: "grade-12", name: "3ª Série (Ensino Médio — ENEM)", order: 15 },
        ]
      },
      {
        key: "undergraduate", label: "Ensino Superior", description: "Faculdade / Universidade",
        gradeLevels: [
          { id: "undergrad-1", name: "1º Período (Graduação)", order: 16 },
          { id: "undergrad-2", name: "3º Período (Graduação)", order: 17 },
          { id: "undergrad-3", name: "5º Período (Graduação)", order: 18 },
          { id: "undergrad-4", name: "7º Período (Graduação)", order: 19 },
        ]
      },
    ]
  },

  // ─── Japan ───
  JP: {
    stages: [
      {
        key: "early", label: "幼稚園 (Yōchien)", description: "Kindergarten",
        gradeLevels: [
          { id: "pre-k", name: "年少 (Nenshō — Age 3)", order: 1 },
          { id: "transitional-k", name: "年中 (Nenchū — Age 4)", order: 2 },
          { id: "kindergarten", name: "年長 (Nenchō — Age 5)", order: 3 },
        ]
      },
      {
        key: "elementary", label: "小学校 (Shōgakkō)", description: "Grades 1-6 (ages 6-12)",
        gradeLevels: [
          { id: "grade-1", name: "小学1年 (Shōgaku 1-nen)", order: 4 },
          { id: "grade-2", name: "小学2年 (Shōgaku 2-nen)", order: 5 },
          { id: "grade-3", name: "小学3年 (Shōgaku 3-nen)", order: 6 },
          { id: "grade-4", name: "小学4年 (Shōgaku 4-nen)", order: 7 },
          { id: "grade-5", name: "小学5年 (Shōgaku 5-nen)", order: 8 },
          { id: "grade-6", name: "小学6年 (Shōgaku 6-nen)", order: 9 },
        ]
      },
      {
        key: "middle", label: "中学校 (Chūgakkō)", description: "Grades 1-3 (ages 12-15)",
        gradeLevels: [
          { id: "grade-7", name: "中学1年 (Chūgaku 1-nen)", order: 10 },
          { id: "grade-8", name: "中学2年 (Chūgaku 2-nen)", order: 11 },
          { id: "grade-9", name: "中学3年 (Chūgaku 3-nen)", order: 12 },
        ]
      },
      {
        key: "high", label: "高等学校 (Kōkō)", description: "Grades 1-3 (ages 15-18)",
        gradeLevels: [
          { id: "grade-10", name: "高校1年 (Kōkō 1-nen)", order: 13 },
          { id: "grade-11", name: "高校2年 (Kōkō 2-nen)", order: 14 },
          { id: "grade-12", name: "高校3年 (Kōkō 3-nen)", order: 15 },
        ]
      },
      {
        key: "undergraduate", label: "大学 (Daigaku)", description: "University (4 years)",
        gradeLevels: [
          { id: "undergrad-1", name: "大学1年 (Daigaku 1-nen)", order: 16 },
          { id: "undergrad-2", name: "大学2年 (Daigaku 2-nen)", order: 17 },
          { id: "undergrad-3", name: "大学3年 (Daigaku 3-nen)", order: 18 },
          { id: "undergrad-4", name: "大学4年 (Daigaku 4-nen)", order: 19 },
        ]
      },
    ]
  },

  // ─── India ───
  IN: {
    stages: [
      {
        key: "early", label: "Pre-Primary", description: "Playgroup to Kindergarten",
        gradeLevels: [
          { id: "pre-k", name: "Playgroup / Nursery", order: 1 },
          { id: "transitional-k", name: "Lower Kindergarten (LKG)", order: 2 },
          { id: "kindergarten", name: "Upper Kindergarten (UKG)", order: 3 },
        ]
      },
      {
        key: "elementary", label: "Primary School", description: "Classes 1-5 (ages 6-11)",
        gradeLevels: [
          { id: "grade-1", name: "Class 1", order: 4 },
          { id: "grade-2", name: "Class 2", order: 5 },
          { id: "grade-3", name: "Class 3", order: 6 },
          { id: "grade-4", name: "Class 4", order: 7 },
          { id: "grade-5", name: "Class 5", order: 8 },
        ]
      },
      {
        key: "middle", label: "Middle School", description: "Classes 6-8 (ages 11-14)",
        gradeLevels: [
          { id: "grade-6", name: "Class 6", order: 9 },
          { id: "grade-7", name: "Class 7", order: 10 },
          { id: "grade-8", name: "Class 8", order: 11 },
        ]
      },
      {
        key: "high", label: "Secondary & Senior Secondary", description: "Classes 9-12 (ages 14-18)",
        gradeLevels: [
          { id: "grade-9", name: "Class 9 (Secondary)", order: 12 },
          { id: "grade-10", name: "Class 10 (Board Exams)", order: 13 },
          { id: "grade-11", name: "Class 11 (Senior Secondary)", order: 14 },
          { id: "grade-12", name: "Class 12 (Board Exams)", order: 15 },
        ]
      },
      {
        key: "undergraduate", label: "Higher Education", description: "College / University",
        gradeLevels: [
          { id: "undergrad-1", name: "1st Year (B.A./B.Sc./B.Com)", order: 16 },
          { id: "undergrad-2", name: "2nd Year", order: 17 },
          { id: "undergrad-3", name: "3rd Year (Final Year)", order: 18 },
          { id: "undergrad-4", name: "Postgraduate (M.A./M.Sc.)", order: 19 },
        ]
      },
    ]
  },
};

// ─── Default / International grade system (fallback for countries without specific data) ───
export function getCountryGradeSystem(countryCode: string): CountryGradeSystem {
  return COUNTRY_GRADE_SYSTEMS[countryCode] || COUNTRY_GRADE_SYSTEMS["US"];
}

export function getCountryGradeLevels(countryCode: string) {
  const system = getCountryGradeSystem(countryCode);
  return system.stages.flatMap(s => s.gradeLevels.map(g => ({ ...g, stage: s.key })));
}

export function getCountryStages(countryCode: string) {
  const system = getCountryGradeSystem(countryCode);
  return system.stages.map(s => ({
    key: s.key,
    label: s.label,
    description: s.description,
  }));
}

// ─── UK/International Grade Equivalents (for reference) ───
export const UK_YEAR_EQUIVALENTS: Record<string, string> = {
  "pre-k": "Nursery",
  "transitional-k": "Reception",
  "kindergarten": "Year 1",
  "grade-1": "Year 2",
  "grade-2": "Year 3",
  "grade-3": "Year 4",
  "grade-4": "Year 5",
  "grade-5": "Year 6",
  "grade-6": "Year 7",
  "grade-7": "Year 8",
  "grade-8": "Year 9",
  "grade-9": "Year 10",
  "grade-10": "Year 11 (GCSE)",
  "grade-11": "Year 12 (Sixth Form)",
  "grade-12": "Year 13 (Sixth Form)",
};

// ─── Grouped by stage for UI ───
export const STAGES = [
  { key: "early", label: "Early Childhood", description: "Pre-K through Kindergarten" },
  { key: "elementary", label: "Elementary School", description: "1st through 5th Grade" },
  { key: "middle", label: "Middle / Junior High School", description: "6th through 8th Grade" },
  { key: "high", label: "High School", description: "9th through 12th Grade" },
  { key: "undergraduate", label: "Undergraduate / College", description: "Foundation through Senior Year" },
];

// ─── Program categories for grouping ───
export const PROGRAM_CATEGORIES = [
  { key: "US National", label: "🇺🇸 US National Standards" },
  { key: "US State", label: "🏛️ US State-Specific Standards" },
  { key: "US Advanced", label: "🎓 US Advanced / College Prep" },
  { key: "UK", label: "🇬🇧 UK National Curriculum" },
  { key: "UK International", label: "🌍 UK International (Cambridge)" },
  { key: "IB", label: "📘 International Baccalaureate (IB)" },
  { key: "European", label: "🇪🇺 European Baccalaureate & National" },
  { key: "Canadian", label: "🍁 Canadian Provincial Curriculums" },
  { key: "Australia / NZ", label: "🇦🇺 Australian & New Zealand" },
  { key: "Asian", label: "🌏 Asian National Curriculums" },
  { key: "Middle East / Africa", label: "🌍 Middle East & Africa" },
  { key: "Alternative Pedagogy", label: "🧠 Alternative Pedagogical Approaches" },
  { key: "Virtual / Online", label: "💻 Virtual & Online Programs" },
  { key: "Water Classroom", label: "💧 Water Classroom Proprietary Tracks" },
  { key: "General", label: "📚 General & Other Programs" },
];

// ─── Countries with program category mappings ───
export interface Country {
  code: string;
  name: string;
  flag: string;
  categories: string[];
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", categories: ["US National", "US State", "US Advanced", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", categories: ["UK", "UK International", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "CA", name: "Canada", flag: "🍁", categories: ["Canadian", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", categories: ["Australia / NZ", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", categories: ["Australia / NZ", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "DE", name: "Germany", flag: "🇩🇪", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "FR", name: "France", flag: "🇫🇷", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "SE", name: "Sweden", flag: "🇸🇪", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "NO", name: "Norway", flag: "🇳🇴", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "DK", name: "Denmark", flag: "🇩🇰", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "FI", name: "Finland", flag: "🇫🇮", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "IE", name: "Ireland", flag: "🇮🇪", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "IT", name: "Italy", flag: "🇮🇹", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "ES", name: "Spain", flag: "🇪🇸", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "PT", name: "Portugal", flag: "🇵🇹", categories: ["European", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "BR", name: "Brazil", flag: "🇧🇷", categories: ["IB", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "JP", name: "Japan", flag: "🇯🇵", categories: ["Asian", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "KR", name: "South Korea", flag: "🇰🇷", categories: ["Asian", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "CN", name: "China", flag: "🇨🇳", categories: ["Asian", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", categories: ["Asian", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "IN", name: "India", flag: "🇮🇳", categories: ["Asian", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", categories: ["Middle East / Africa", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", categories: ["Middle East / Africa", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", categories: ["Middle East / Africa", "UK", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", categories: ["Middle East / Africa", "UK International", "Alternative Pedagogy", "Virtual / Online", "General", "Water Classroom"] },
  { code: "INTL", name: "International / Other", flag: "🌍", categories: ["US National", "US State", "US Advanced", "UK", "UK International", "IB", "European", "Canadian", "Australia / NZ", "Asian", "Middle East / Africa", "Alternative Pedagogy", "Virtual / Online", "Water Classroom", "General"] },
];

// Get programs filtered by country
function getProgramCategoriesForCountry(countryCode: string): string[] {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.categories || ["General"];
}

export function getFilteredPrograms(countryCode: string) {
  const allowedCategories = getProgramCategoriesForCountry(countryCode);
  return PROGRAMS.filter(p => allowedCategories.includes(p.category));
}

export function getFilteredCategories(countryCode: string) {
  const allowedCategories = getProgramCategoriesForCountry(countryCode);
  return PROGRAM_CATEGORIES.filter(c => allowedCategories.includes(c.key));
}

// ─── Student Track / Type options ───
export const STUDENT_TRACKS = [
  { id: "water-student", label: "🌊 Water Student", desc: "Homeschool with verified proctored exams & valid school certificate", price: "$19/mo", features: ["Verified proctored exams", "Valid school certificate / diploma", "Full curriculum & 24/7 AI tutor", "Robotics labs & progress analytics"] },
  { id: "independent-student", label: "🎓 Independent Student", desc: "Self-directed learning with full resources, no exams", price: "$15/mo", features: ["Full curriculum access", "24/7 AI tutor & homework help", "Interactive labs & games", "No proctored exams or diploma"] },
  { id: "school-student", label: "🏫 School Student", desc: "Signed up by your school. Full resources, no exams", price: "$12/mo", features: ["Full Water Classroom resources", "24/7 AI tutor & progress tracking", "Curriculum-aligned content", "No proctored exams or diploma"] },
];

// ─── Default onboarding values ───
export const DEFAULT_ONBOARDING = {
  programId: "",
  gradeLevelId: "",
  enrollmentType: "" as "school" | "homeschool" | "independent" | "",
  schoolCode: "",
  isVerifiedSchool: false,
};
