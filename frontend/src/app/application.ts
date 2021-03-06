import { User } from './user';

export class Application {
	id: number;
	user_id: string;
	class_year: string;
	grad_year: string;
	major: string;
	referral: string;
	hackathon_count: number;
	dietary_restrictions: string;
	shirt_size: string;
	website: string;
	longanswer_1: string;
	longanswer_2: string;
	status: string;
	emailSent: boolean;
	created_at:Date;
	updated_at:Date;
	resume: File;
	status_internal: string;
	status_public: string;
	file: any;
	user: User;

	public static getMajors(){
		return MAJORS;
	}
}

const MAJORS: { [value: string]: any; id?: string | number; }[] = [
{ title: "Accounting", id: "Accounting"},
{ title: "Acting", id: "Acting"},
{ title: "Actuarial Science", id: "Actuarial Science"},
{ title: "Aeronautical and Astronautical Engineering", id: "Aeronautical and Astronautical Engineering"},
{ title: "Aeronautical Engineering Technology", id: "Aeronautical Engineering Technology"},
{ title: "Aerospace Financial Analysis", id: "Aerospace Financial Analysis"},
{ title: "African American Studies", id: "African American Studies"},
{ title: "Agribusiness (multiple concentrations)", id: "Agribusiness (multiple concentrations)"},
{ title: "Agricultural Communication", id: "Agricultural Communication"},
{ title: "Agricultural Economics (multiple concentrations)", id: "Agricultural Economics (multiple concentrations)"},
{ title: "Agricultural Education", id: "Agricultural Education"},
{ title: "Agricultural Engineering", id: "Agricultural Engineering"},
{ title: "Agricultural Systems Management", id: "Agricultural Systems Management"},
{ title: "Agronomy (multiple concentrations)", id: "Agronomy (multiple concentrations)"},
{ title: "Airline Management and Operations", id: "Airline Management and Operations"},
{ title: "Airport Management and Operations", id: "Airport Management and Operations"},
{ title: "American Studies", id: "American Studies"},
{ title: "Animal Sciences (multiple concentrations)", id: "Animal Sciences (multiple concentrations)"},
{ title: "Animation", id: "Animation"},
{ title: "Anthropology", id: "Anthropology"},
{ title: "Applied Exercise and Health (Pre)", id: "Applied Exercise and Health (Pre)"},
{ title: "Applied Meteorology and Climatology", id: "Applied Meteorology and Climatology"},
{ title: "Art History", id: "Art History"},
{ title: "Asian Studies", id: "Asian Studies"},
{ title: "Athletic Training (Pre)", id: "Athletic Training (Pre)"},
{ title: "Atmospheric Science/Meteorology", id: "Atmospheric Science/Meteorology"},
{ title: "Audio Engineering Technology", id: "Audio Engineering Technology"},
{ title: "Automation and Systems Integration Engineering Technology", id: "Automation and Systems Integration Engineering Technology"},
{ title: "Aviation Management", id: "Aviation Management"},
{ title: "Biochemistry", id: "Biochemistry"},
{ title: "Biochemistry (Biology)", id: "Biochemistry (Biology)"},
{ title: "Biochemistry (Chemistry)", id: "Biochemistry (Chemistry)"},
{ title: "Biological Engineering - multiple concentrations", id: "Biological Engineering - multiple concentrations"},
{ title: "Biology", id: "Biology"},
{ title: "Biomedical Engineering", id: "Biomedical Engineering"},
{ title: "Brain and Behavioral Sciences", id: "Brain and Behavioral Sciences"},
{ title: "Building Information Modeling", id: "Building Information Modeling"},
{ title: "Cell, Molecular, and Developmental Biology", id: "Cell, Molecular, and Developmental Biology"},
{ title: "Chemical Engineering", id: "Chemical Engineering"},
{ title: "Chemistry", id: "Chemistry"},
{ title: "Chemistry - American Chemical Society", id: "Chemistry - American Chemical Society"},
{ title: "Chinese Studies", id: "Chinese Studies"},
{ title: "Civil Engineering", id: "Civil Engineering"},
{ title: "Classical Studies", id: "Classical Studies"},
{ title: "Communication, General (Pre)", id: "Communication, General (Pre)"},
{ title: "Comparative Literature", id: "Comparative Literature"},
{ title: "Computer and Information Technology", id: "Computer and Information Technology"},
{ title: "Computer Engineering", id: "Computer Engineering"},
{ title: "Computer Science", id: "Computer Science"},
{ title: "Construction Engineering", id: "Construction Engineering"},
{ title: "Construction Management Technology", id: "Construction Management Technology"},
{ title: "Creative Writing", id: "Creative Writing"},
{ title: "Crop Science", id: "Crop Science"},
{ title: "Cybersecurity", id: "Cybersecurity"},
{ title: "Data Science", id: "Data Science"},
{ title: "Data Visualization", id: "Data Visualization"},
{ title: "Design and Construction Integration", id: "Design and Construction Integration"},
{ title: "Developmental and Family Science", id: "Developmental and Family Science"},
{ title: "Early Childhood Education and Exceptional Needs", id: "Early Childhood Education and Exceptional Needs"},
{ title: "Ecology, Evolution, and Environmental Sciences", id: "Ecology, Evolution, and Environmental Sciences"},
{ title: "Economics (Pre) (College of Liberal Arts)", id: "Economics (Pre) (College of Liberal Arts)"},
{ title: "Economics (School of Management)", id: "Economics (School of Management)"},
{ title: "Effects Technical Direction", id: "Effects Technical Direction"},
{ title: "Electrical Engineering", id: "Electrical Engineering"},
{ title: "Electrical Engineering Technology", id: "Electrical Engineering Technology"},
{ title: "Elementary Education", id: "Elementary Education"},
{ title: "Engineering / Technology Teacher Education", id: "Engineering / Technology Teacher Education"},
{ title: "English", id: "English"},
{ title: "Environmental and Ecological Engineering", id: "Environmental and Ecological Engineering"},
{ title: "Environmental and Natural Resources Engineering", id: "Environmental and Natural Resources Engineering"},
{ title: "Environmental Geosciences", id: "Environmental Geosciences"},
{ title: "Environmental Health Sciences", id: "Environmental Health Sciences"},
{ title: "Environmental Studies (Pre)", id: "Environmental Studies (Pre)"},
{ title: "Exploratory Studies (for undecided students)", id: "Exploratory Studies (for undecided students)"},
{ title: "Family and Consumer Sciences Education", id: "Family and Consumer Sciences Education"},
{ title: "Farm Management", id: "Farm Management"},
{ title: "Film and Theatre Production", id: "Film and Theatre Production"},
{ title: "Film and Video Studies", id: "Film and Video Studies"},
{ title: "Finance", id: "Finance"},
{ title: "Financial Counseling and Planning", id: "Financial Counseling and Planning"},
{ title: "Fisheries and Aquatic Sciences", id: "Fisheries and Aquatic Sciences"},
{ title: "Flight (Professional Flight Technology)", id: "Flight (Professional Flight Technology)"},
{ title: "Foods and Nutrition in Business", id: "Foods and Nutrition in Business"},
{ title: "Food Science", id: "Food Science"},
{ title: "Forestry", id: "Forestry"},
{ title: "French", id: "French"},
{ title: "Game Development and Design", id: "Game Development and Design"},
{ title: "General Education: Curriculum and Instruction (non-licensure)", id: "General Education: Curriculum and Instruction (non-licensure)"},
{ title: "General Education: Educational Studies (non-licensure)", id: "General Education: Educational Studies (non-licensure)"},
{ title: "Genetic Biology", id: "Genetic Biology"},
{ title: "Geology and Geophysics", id: "Geology and Geophysics"},
{ title: "German", id: "German"},
{ title: "Global Studies", id: "Global Studies"},
{ title: "Health and Disease", id: "Health and Disease"},
{ title: "Health Sciences - Preprofessional", id: "Health Sciences - Preprofessional"},
{ title: "History", id: "History"},
{ title: "Horticulture (multiple concentrations)", id: "Horticulture (multiple concentrations)"},
{ title: "Hospitality and Tourism Management", id: "Hospitality and Tourism Management"},
{ title: "Human Resource Development", id: "Human Resource Development"},
{ title: "Human Services", id: "Human Services"},
{ title: "Industrial (Consumer Product) Design", id: "Industrial (Consumer Product) Design"},
{ title: "Industrial Engineering", id: "Industrial Engineering"},
{ title: "Industrial Engineering Technology", id: "Industrial Engineering Technology"},
{ title: "Industrial Management", id: "Industrial Management"},
{ title: "Insect Biology", id: "Insect Biology"},
{ title: "Integrated Studio Arts", id: "Integrated Studio Arts"},
{ title: "Interdisciplinary Engineering Studies", id: "Interdisciplinary Engineering Studies"},
{ title: "Interior (Space Planning) Design", id: "Interior (Space Planning) Design"},
{ title: "Italian Studies", id: "Italian Studies"},
{ title: "Japanese", id: "Japanese"},
{ title: "Jewish Studies", id: "Jewish Studies"},
{ title: "Kinesiology", id: "Kinesiology"},
{ title: "Landscape Architecture (Pre)", id: "Landscape Architecture (Pre)"},
{ title: "Law and Society", id: "Law and Society"},
{ title: "Learning Sciences in Educational Studies (non licensure)", id: "Learning Sciences in Educational Studies (non licensure)"},
{ title: "Linguistics", id: "Linguistics"},
{ title: "Management (General)", id: "Management (General)"},
{ title: "Marketing", id: "Marketing"},
{ title: "Materials Engineering", id: "Materials Engineering"},
{ title: "Mathematics", id: "Mathematics"},
{ title: "Mathematics Education", id: "Mathematics Education"},
{ title: "Mechanical Engineering", id: "Mechanical Engineering"},
{ title: "Mechanical Engineering Technology", id: "Mechanical Engineering Technology"},
{ title: "Mechatronics Engineering Technology", id: "Mechatronics Engineering Technology"},
{ title: "Medical Laboratory Sciences", id: "Medical Laboratory Sciences"},
{ title: "Medieval and Renaissance Studies", id: "Medieval and Renaissance Studies"},
{ title: "Microbiology", id: "Microbiology"},
{ title: "Multidisciplinary Engineering", id: "Multidisciplinary Engineering"},
{ title: "Natural Resources and Environmental Science (multiple concentrations)", id: "Natural Resources and Environmental Science (multiple concentrations)"},
{ title: "Network Engineering Technology", id: "Network Engineering Technology"},
{ title: "Neurobiology and Physiology", id: "Neurobiology and Physiology"},
{ title: "Nuclear Engineering", id: "Nuclear Engineering"},
{ title: "Nursing", id: "Nursing"},
{ title: "Nutrition, Fitness, and Health", id: "Nutrition, Fitness, and Health"},
{ title: "Nutrition and Dietetics", id: "Nutrition and Dietetics"},
{ title: "Nutrition and Dietetics/Nutrition, Fitness and Health (dual major)", id: "Nutrition and Dietetics/Nutrition, Fitness and Health (dual major)"},
{ title: "Nutrition Science", id: "Nutrition Science"},
{ title: "Occupational Health Science", id: "Occupational Health Science"},
{ title: "Organizational Leadership", id: "Organizational Leadership"},
{ title: "Pharmacy", id: "Pharmacy"},
{ title: "Philosophy", id: "Philosophy"},
{ title: "Physics", id: "Physics"},
{ title: "Planetary Sciences", id: "Planetary Sciences"},
{ title: "Plant Genetics, Breeding, and Biotechnology", id: "Plant Genetics, Breeding, and Biotechnology"},
{ title: "Plant Science", id: "Plant Science"},
{ title: "Political Science", id: "Political Science"},
{ title: "Predentistry", id: "Predentistry"},
{ title: "Prelaw", id: "Prelaw"},
{ title: "Premedicine", id: "Premedicine"},
{ title: "Preoccupational Therapy", id: "Preoccupational Therapy"},
{ title: "Prephysical Therapy", id: "Prephysical Therapy"},
{ title: "Prephysician's Assistant", id: "Prephysician's Assistant"},
{ title: "Pre-veterinary Medicine", id: "Pre-veterinary Medicine"},
{ title: "Professional Writing", id: "Professional Writing"},
{ title: "Psychological Sciences", id: "Psychological Sciences"},
{ title: "Public Health", id: "Public Health"},
{ title: "Purdue Polytechnic Institute Statewide Programs", id: "Purdue Polytechnic Institute Statewide Programs"},
{ title: "Radiological Health Sciences - Health Physics", id: "Radiological Health Sciences - Health Physics"},
{ title: "Radiological Health Sciences - Pre-Medical Physics", id: "Radiological Health Sciences - Pre-Medical Physics"},
{ title: "Religious Studies", id: "Religious Studies"},
{ title: "Retail Management", id: "Retail Management"},
{ title: "Robotics Engineering Technology", id: "Robotics Engineering Technology"},
{ title: "Russian", id: "Russian"},
{ title: "Sales and Marketing", id: "Sales and Marketing"},
{ title: "Science Education (Biology, Chemistry, Earth/Space, Physics)", id: "Science Education (Biology, Chemistry, Earth/Space, Physics)"},
{ title: "Selling and Sales Management", id: "Selling and Sales Management"},
{ title: "Social Studies Education", id: "Social Studies Education"},
{ title: "Sociology", id: "Sociology"},
{ title: "Soil and Water Sciences", id: "Soil and Water Sciences"},
{ title: "Sound for the Performing Arts", id: "Sound for the Performing Arts"},
{ title: "Spanish", id: "Spanish"},
{ title: "Special Education: Dual Licensure in Elementary Education and Special Education - Mild Intervention", id: "Special Education: Dual Licensure in Elementary Education and Special Education - Mild Intervention"},
{ title: "Special Education: Mild and Intense Intervention P-12", id: "Special Education: Mild and Intense Intervention P-12"},
{ title: "Special Education: Mild Intervention P-12", id: "Special Education: Mild Intervention P-12"},
{ title: "Speech, Language, and Hearing Sciences", id: "Speech, Language, and Hearing Sciences"},
{ title: "Statistics - Applied Statistics", id: "Statistics - Applied Statistics"},
{ title: "Statistics with Mathematics Option", id: "Statistics with Mathematics Option"},
{ title: "Studio Arts and Technology", id: "Studio Arts and Technology"},
{ title: "Supply Chain Information and Analytics", id: "Supply Chain Information and Analytics"},
{ title: "Supply Chain Management Technology", id: "Supply Chain Management Technology"},
{ title: "Sustainable Biomaterials – Process and Product Design", id: "Sustainable Biomaterials – Process and Product Design"},
{ title: "Sustainable Food and Farming Systems", id: "Sustainable Food and Farming Systems"},
{ title: "Systems Analysis and Design", id: "Systems Analysis and Design"},
{ title: "Theatre", id: "Theatre"},
{ title: "Theatre Design and Production", id: "Theatre Design and Production"},
{ title: "Transdisciplinary Studies in Engineering Technology", id: "Transdisciplinary Studies in Engineering Technology"},
{ title: "Transdisciplinary Studies in Technology", id: "Transdisciplinary Studies in Technology"},
{ title: "Turf Management and Science", id: "Turf Management and Science"},
{ title: "Undecided Liberal Arts", id: "Undecided Liberal Arts"},
{ title: "Undecided within Engineering", id: "Undecided within Engineering"},
{ title: "Unmanned Aerial Systems", id: "Unmanned Aerial Systems"},
{ title: "UX Design", id: "UX Design"},
{ title: "Veterinary Technician or Technologist", id: "Veterinary Technician or Technologist"},
{ title: "Virtual Product Integration", id: "Virtual Product Integration"},
{ title: "Visual Arts Design Education", id: "Visual Arts Design Education"},
{ title: "Visual Arts Education", id: "Visual Arts Education"},
{ title: "Visual Communications Design", id: "Visual Communications Design"},
{ title: "Visual Effects Compositing", id: "Visual Effects Compositing"},
{ title: "Web Programming and Design", id: "Web Programming and Design"},
{ title: "Wildlife", id: "Wildlife"},
{ title: "Women’s, Gender and Sexuality Studies", id: "Women’s, Gender and Sexuality Studies"}
];
