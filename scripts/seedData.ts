import { CourseService } from "../services/course.service";

const seedCourses = async () => {
  console.log("Starting to seed courses...");

  try {
    // Course 1: TOEIC Vocabulary
    console.log("📚 Creating TOEIC Vocabulary course...");
    const toeicCourse = await CourseService.createCourse({
      title: "TOEIC Vocabulary",
      subtitle: "Business English Essentials",
      description:
        "Essential business vocabulary for TOEIC preparation with real-world examples",
      level: "Intermediate",
      category: "Business",
      color_start: "#FF6B9D",
      color_end: "#FF8C42",
      icon: "💼",
      estimated_time: 45,
      total_words: 20,
    });

    const toeicWords = [
      {
        course_id: toeicCourse.id,
        word: "Collaborate",
        pronunciation: "/kəˈlæbəreɪt/",
        definition:
          "To work jointly with others or together especially in an intellectual endeavor",
        example:
          "We need to collaborate with the marketing team on this project.",
        difficulty: "Intermediate",
        synonyms: ["cooperate", "work together", "partner"],
        antonyms: ["compete", "oppose"],
        order_index: 1,
      },
      {
        course_id: toeicCourse.id,
        word: "Comprehensive",
        pronunciation: "/ˌkɒmprɪˈhensɪv/",
        definition: "Complete and including everything that is necessary",
        example:
          "The report provides a comprehensive analysis of market trends.",
        difficulty: "Advanced",
        synonyms: ["complete", "thorough", "extensive"],
        antonyms: ["incomplete", "partial"],
        order_index: 2,
      },
      {
        course_id: toeicCourse.id,
        word: "Implement",
        pronunciation: "/ˈɪmplɪment/",
        definition: "To put a decision or plan into effect",
        example: "The company will implement new safety procedures next month.",
        difficulty: "Intermediate",
        synonyms: ["execute", "carry out", "apply"],
        antonyms: ["abandon", "ignore"],
        order_index: 3,
      },
      {
        course_id: toeicCourse.id,
        word: "Efficiency",
        pronunciation: "/ɪˈfɪʃənsi/",
        definition: "The state or quality of being efficient",
        example: "The new system improved workplace efficiency by 30%.",
        difficulty: "Intermediate",
        synonyms: ["effectiveness", "productivity", "competence"],
        antonyms: ["inefficiency", "waste"],
        order_index: 4,
      },
      {
        course_id: toeicCourse.id,
        word: "Prioritize",
        pronunciation: "/praɪˈɒrɪtaɪz/",
        definition:
          "To designate or treat something as more important than other things",
        example: "We need to prioritize customer satisfaction above all else.",
        difficulty: "Intermediate",
        synonyms: ["rank", "order", "emphasize"],
        antonyms: ["neglect", "ignore"],
        order_index: 5,
      },
      {
        course_id: toeicCourse.id,
        word: "Revenue",
        pronunciation: "/ˈrevənjuː/",
        definition: "Income, especially when of a company or organization",
        example: "The company's revenue increased by 15% this quarter.",
        difficulty: "Intermediate",
        synonyms: ["income", "earnings", "profit"],
        antonyms: ["loss", "expenditure"],
        order_index: 6,
      },
      {
        course_id: toeicCourse.id,
        word: "Negotiate",
        pronunciation: "/nɪˈɡəʊʃieɪt/",
        definition:
          "To discuss something with someone in order to reach an agreement",
        example:
          "We are trying to negotiate a better contract with our suppliers.",
        difficulty: "Intermediate",
        synonyms: ["discuss", "bargain", "settle"],
        antonyms: ["refuse", "reject"],
        order_index: 7,
      },
      {
        course_id: toeicCourse.id,
        word: "Deadline",
        pronunciation: "/ˈdedlaɪn/",
        definition: "A time or date by which something must be finished",
        example: "The deadline for submitting the proposal is next Friday.",
        difficulty: "Beginner",
        synonyms: ["due date", "time limit", "cutoff"],
        antonyms: ["extension", "flexibility"],
        order_index: 8,
      },
      {
        course_id: toeicCourse.id,
        word: "Initiative",
        pronunciation: "/ɪˈnɪʃətɪv/",
        definition: "The ability to assess and initiate things independently",
        example:
          "She showed great initiative in solving the customer's problem.",
        difficulty: "Advanced",
        synonyms: ["enterprise", "drive", "ambition"],
        antonyms: ["passivity", "inaction"],
        order_index: 9,
      },
      {
        course_id: toeicCourse.id,
        word: "Strategy",
        pronunciation: "/ˈstrætədʒi/",
        definition: "A plan of action designed to achieve a long-term goal",
        example: "Our marketing strategy focuses on digital platforms.",
        difficulty: "Intermediate",
        synonyms: ["plan", "approach", "method"],
        antonyms: ["improvisation", "chaos"],
        order_index: 10,
      },
      {
        course_id: toeicCourse.id,
        word: "Analysis",
        pronunciation: "/əˈnæləsɪs/",
        definition:
          "Detailed examination of the elements or structure of something",
        example:
          "The financial analysis revealed several areas for improvement.",
        difficulty: "Intermediate",
        synonyms: ["examination", "study", "evaluation"],
        antonyms: ["synthesis", "overview"],
        order_index: 11,
      },
      {
        course_id: toeicCourse.id,
        word: "Budget",
        pronunciation: "/ˈbʌdʒɪt/",
        definition:
          "An estimate of income and expenditure for a set period of time",
        example:
          "We need to stay within the allocated budget for this project.",
        difficulty: "Beginner",
        synonyms: ["allocation", "allowance", "funds"],
        antonyms: ["overspending", "excess"],
        order_index: 12,
      },
      {
        course_id: toeicCourse.id,
        word: "Conference",
        pronunciation: "/ˈkɒnfərəns/",
        definition:
          "A formal meeting for discussion, especially a regular one held by an organization",
        example: "The annual conference will be held in Singapore this year.",
        difficulty: "Beginner",
        synonyms: ["meeting", "convention", "summit"],
        antonyms: ["individual meeting", "private discussion"],
        order_index: 13,
      },
      {
        course_id: toeicCourse.id,
        word: "Professional",
        pronunciation: "/prəˈfeʃənəl/",
        definition: "Relating to or connected with a profession",
        example:
          "She maintained a professional attitude throughout the meeting.",
        difficulty: "Intermediate",
        synonyms: ["expert", "skilled", "competent"],
        antonyms: ["amateur", "unprofessional"],
        order_index: 14,
      },
      {
        course_id: toeicCourse.id,
        word: "Investment",
        pronunciation: "/ɪnˈvestmənt/",
        definition: "The action or process of investing money for profit",
        example: "The company made a significant investment in new technology.",
        difficulty: "Intermediate",
        synonyms: ["funding", "capital", "stake"],
        antonyms: ["withdrawal", "divestment"],
        order_index: 15,
      },
      {
        course_id: toeicCourse.id,
        word: "Achievement",
        pronunciation: "/əˈtʃiːvmənt/",
        definition: "A thing done successfully with effort, skill, or courage",
        example: "Completing the project on time was a great achievement.",
        difficulty: "Intermediate",
        synonyms: ["accomplishment", "success", "attainment"],
        antonyms: ["failure", "disappointment"],
        order_index: 16,
      },
      {
        course_id: toeicCourse.id,
        word: "Schedule",
        pronunciation: "/ˈʃedjuːl/",
        definition: "A plan for carrying out a process or procedure",
        example: "Please check your schedule for available meeting times.",
        difficulty: "Beginner",
        synonyms: ["timetable", "agenda", "plan"],
        antonyms: ["spontaneity", "improvisation"],
        order_index: 17,
      },
      {
        course_id: toeicCourse.id,
        word: "Presentation",
        pronunciation: "/ˌprezənˈteɪʃən/",
        definition:
          "The action of showing or explaining something to a group of people",
        example:
          "I have to give a presentation to the board of directors tomorrow.",
        difficulty: "Intermediate",
        synonyms: ["demonstration", "display", "exhibition"],
        antonyms: ["concealment", "hiding"],
        order_index: 18,
      },
      {
        course_id: toeicCourse.id,
        word: "Requirement",
        pronunciation: "/rɪˈkwaɪəmənt/",
        definition: "A thing that is needed or wanted",
        example: "Meeting the client's requirements is our top priority.",
        difficulty: "Intermediate",
        synonyms: ["necessity", "need", "demand"],
        antonyms: ["option", "luxury"],
        order_index: 19,
      },
      {
        course_id: toeicCourse.id,
        word: "Opportunity",
        pronunciation: "/ˌɒpəˈtjuːnəti/",
        definition:
          "A set of circumstances that makes it possible to do something",
        example:
          "This job offers excellent opportunities for career advancement.",
        difficulty: "Intermediate",
        synonyms: ["chance", "possibility", "opening"],
        antonyms: ["obstacle", "barrier"],
        order_index: 20,
      },
    ];

    console.log("📝 Adding TOEIC words...");
    for (const word of toeicWords) {
      await CourseService.createWord(word);
    }

    // Course 2: IELTS Academic
    console.log("📚 Creating IELTS Academic course...");
    const ieltsCourse = await CourseService.createCourse({
      title: "IELTS Academic",
      subtitle: "Academic Writing & Speaking",
      description: "Advanced vocabulary for IELTS Academic test preparation",
      level: "Advanced",
      category: "Academic",
      color_start: "#9B59B6",
      color_end: "#8E44AD",
      icon: "🎓",
      estimated_time: 60,
      total_words: 15,
    });

    const ieltsWords = [
      {
        course_id: ieltsCourse.id,
        word: "Hypothesis",
        pronunciation: "/haɪˈpɒθəsɪs/",
        definition:
          "A supposition or proposed explanation made on the basis of limited evidence",
        example:
          "The scientist's hypothesis was proven correct after extensive testing.",
        difficulty: "Advanced",
        synonyms: ["theory", "assumption", "proposition"],
        antonyms: ["fact", "certainty"],
        order_index: 1,
      },
      {
        course_id: ieltsCourse.id,
        word: "Methodology",
        pronunciation: "/ˌmeθəˈdɒlədʒi/",
        definition:
          "A system of methods used in a particular area of study or activity",
        example:
          "The research methodology was carefully designed to ensure accurate results.",
        difficulty: "Advanced",
        synonyms: ["approach", "system", "procedure"],
        antonyms: ["randomness", "chaos"],
        order_index: 2,
      },
      {
        course_id: ieltsCourse.id,
        word: "Significant",
        pronunciation: "/sɪɡˈnɪfɪkənt/",
        definition: "Sufficiently great or important to be worthy of attention",
        example: "There was a significant improvement in student performance.",
        difficulty: "Intermediate",
        synonyms: ["important", "notable", "considerable"],
        antonyms: ["insignificant", "trivial"],
        order_index: 3,
      },
      {
        course_id: ieltsCourse.id,
        word: "Phenomenon",
        pronunciation: "/fəˈnɒmɪnən/",
        definition: "A fact or situation that is observed to exist or happen",
        example: "Climate change is a global phenomenon that affects everyone.",
        difficulty: "Advanced",
        synonyms: ["occurrence", "event", "manifestation"],
        antonyms: ["normalcy", "regularity"],
        order_index: 4,
      },
      {
        course_id: ieltsCourse.id,
        word: "Contemporary",
        pronunciation: "/kənˈtempərəri/",
        definition: "Belonging to or occurring in the present time",
        example:
          "Contemporary art often challenges traditional artistic conventions.",
        difficulty: "Advanced",
        synonyms: ["modern", "current", "present-day"],
        antonyms: ["ancient", "historical"],
        order_index: 5,
      },
      {
        course_id: ieltsCourse.id,
        word: "Perspective",
        pronunciation: "/pəˈspektɪv/",
        definition:
          "A particular attitude toward or way of regarding something",
        example:
          "From a historical perspective, this event was quite significant.",
        difficulty: "Intermediate",
        synonyms: ["viewpoint", "outlook", "standpoint"],
        antonyms: ["narrow-mindedness", "bias"],
        order_index: 6,
      },
      {
        course_id: ieltsCourse.id,
        word: "Subsequently",
        pronunciation: "/ˈsʌbsɪkwəntli/",
        definition: "After a particular thing has happened; afterwards",
        example:
          "The experiment failed, and subsequently, the project was cancelled.",
        difficulty: "Advanced",
        synonyms: ["afterwards", "later", "then"],
        antonyms: ["previously", "beforehand"],
        order_index: 7,
      },
      {
        course_id: ieltsCourse.id,
        word: "Nevertheless",
        pronunciation: "/ˌnevəðəˈles/",
        definition: "In spite of that; notwithstanding; all the same",
        example:
          "The task was difficult; nevertheless, she completed it successfully.",
        difficulty: "Advanced",
        synonyms: ["however", "nonetheless", "still"],
        antonyms: ["therefore", "consequently"],
        order_index: 8,
      },
      {
        course_id: ieltsCourse.id,
        word: "Fundamental",
        pronunciation: "/ˌfʌndəˈmentəl/",
        definition: "Forming a necessary base or core; of central importance",
        example:
          "Understanding basic mathematics is fundamental to learning physics.",
        difficulty: "Intermediate",
        synonyms: ["basic", "essential", "crucial"],
        antonyms: ["superficial", "secondary"],
        order_index: 9,
      },
      {
        course_id: ieltsCourse.id,
        word: "Constitute",
        pronunciation: "/ˈkɒnstɪtjuːt/",
        definition: "To be a part of a whole; to form or make up",
        example: "These factors constitute the main reasons for the decline.",
        difficulty: "Advanced",
        synonyms: ["comprise", "form", "make up"],
        antonyms: ["exclude", "omit"],
        order_index: 10,
      },
      {
        course_id: ieltsCourse.id,
        word: "Furthermore",
        pronunciation: "/ˈfɜːðəmɔː/",
        definition: "In addition; besides; moreover",
        example:
          "The plan is cost-effective; furthermore, it's environmentally friendly.",
        difficulty: "Intermediate",
        synonyms: ["moreover", "additionally", "besides"],
        antonyms: ["however", "conversely"],
        order_index: 11,
      },
      {
        course_id: ieltsCourse.id,
        word: "Demonstrate",
        pronunciation: "/ˈdemənstreɪt/",
        definition: "To clearly show the existence or truth of something",
        example:
          "The research demonstrates the effectiveness of the new treatment.",
        difficulty: "Intermediate",
        synonyms: ["show", "prove", "illustrate"],
        antonyms: ["conceal", "hide"],
        order_index: 12,
      },
      {
        course_id: ieltsCourse.id,
        word: "Substantial",
        pronunciation: "/səbˈstænʃəl/",
        definition: "Of considerable importance, size, or worth",
        example:
          "There has been substantial progress in renewable energy technology.",
        difficulty: "Advanced",
        synonyms: ["considerable", "significant", "large"],
        antonyms: ["minimal", "negligible"],
        order_index: 13,
      },
      {
        course_id: ieltsCourse.id,
        word: "Implication",
        pronunciation: "/ˌɪmplɪˈkeɪʃən/",
        definition: "A possible result or consequence of an action or decision",
        example:
          "The implications of this policy change need to be carefully considered.",
        difficulty: "Advanced",
        synonyms: ["consequence", "result", "outcome"],
        antonyms: ["cause", "origin"],
        order_index: 14,
      },
      {
        course_id: ieltsCourse.id,
        word: "Inevitable",
        pronunciation: "/ɪnˈevɪtəbəl/",
        definition: "Certain to happen; unavoidable",
        example: "With climate change, rising sea levels seem inevitable.",
        difficulty: "Advanced",
        synonyms: ["unavoidable", "certain", "inescapable"],
        antonyms: ["avoidable", "preventable"],
        order_index: 15,
      },
    ];

    console.log("📝 Adding IELTS words...");
    for (const word of ieltsWords) {
      await CourseService.createWord(word);
    }

    // Course 3: Daily Conversation
    console.log("📚 Creating Daily Conversation course...");
    const dailyCourse = await CourseService.createCourse({
      title: "Daily Conversation",
      subtitle: "Everyday English",
      description:
        "Essential vocabulary for daily conversations and interactions",
      level: "Beginner",
      category: "General",
      color_start: "#F39C12",
      color_end: "#E67E22",
      icon: "💬",
      estimated_time: 25,
      total_words: 10,
    });

    const dailyWords = [
      {
        course_id: dailyCourse.id,
        word: "Appreciate",
        pronunciation: "/əˈpriːʃieɪt/",
        definition:
          "To recognize the full worth of something; to be grateful for",
        example: "I really appreciate your help with this project.",
        difficulty: "Beginner",
        synonyms: ["value", "treasure", "be grateful for"],
        antonyms: ["depreciate", "undervalue"],
        order_index: 1,
      },
      {
        course_id: dailyCourse.id,
        word: "Convenient",
        pronunciation: "/kənˈviːniənt/",
        definition:
          "Fitting in well with a person's needs, activities, and plans",
        example: "This location is very convenient for shopping and dining.",
        difficulty: "Beginner",
        synonyms: ["suitable", "handy", "accessible"],
        antonyms: ["inconvenient", "awkward"],
        order_index: 2,
      },
      {
        course_id: dailyCourse.id,
        word: "Exciting",
        pronunciation: "/ɪkˈsaɪtɪŋ/",
        definition: "Causing great enthusiasm and eagerness",
        example: "The concert was really exciting and energetic.",
        difficulty: "Beginner",
        synonyms: ["thrilling", "stimulating", "exhilarating"],
        antonyms: ["boring", "dull"],
        order_index: 3,
      },
      {
        course_id: dailyCourse.id,
        word: "Comfortable",
        pronunciation: "/ˈkʌmftəbəl/",
        definition: "Giving a feeling of ease or relaxation",
        example: "This chair is very comfortable for reading.",
        difficulty: "Beginner",
        synonyms: ["cozy", "relaxed", "at ease"],
        antonyms: ["uncomfortable", "awkward"],
        order_index: 4,
      },
      {
        course_id: dailyCourse.id,
        word: "Delicious",
        pronunciation: "/dɪˈlɪʃəs/",
        definition: "Having a very pleasant taste or smell",
        example: "The pasta at this restaurant is absolutely delicious.",
        difficulty: "Beginner",
        synonyms: ["tasty", "flavorful", "appetizing"],
        antonyms: ["disgusting", "bland"],
        order_index: 5,
      },
      {
        course_id: dailyCourse.id,
        word: "Recommend",
        pronunciation: "/ˌrekəˈmend/",
        definition:
          "To suggest that someone or something would be good or suitable",
        example: "I would recommend this book to anyone interested in history.",
        difficulty: "Beginner",
        synonyms: ["suggest", "advise", "propose"],
        antonyms: ["discourage", "advise against"],
        order_index: 6,
      },
      {
        course_id: dailyCourse.id,
        word: "Available",
        pronunciation: "/əˈveɪləbəl/",
        definition: "Able to be used or obtained; at someone's disposal",
        example: "Is this table available for tonight's dinner?",
        difficulty: "Beginner",
        synonyms: ["accessible", "obtainable", "free"],
        antonyms: ["unavailable", "occupied"],
        order_index: 7,
      },
      {
        course_id: dailyCourse.id,
        word: "Wonderful",
        pronunciation: "/ˈwʌndəfəl/",
        definition:
          "Inspiring delight, pleasure, or admiration; extremely good",
        example: "We had a wonderful time at the beach yesterday.",
        difficulty: "Beginner",
        synonyms: ["amazing", "fantastic", "marvelous"],
        antonyms: ["terrible", "awful"],
        order_index: 8,
      },
      {
        course_id: dailyCourse.id,
        word: "Familiar",
        pronunciation: "/fəˈmɪliə/",
        definition: "Well known from long or close association",
        example: "This place looks familiar - I think I've been here before.",
        difficulty: "Beginner",
        synonyms: ["recognizable", "known", "acquainted"],
        antonyms: ["unfamiliar", "strange"],
        order_index: 9,
      },
      {
        course_id: dailyCourse.id,
        word: "Surprised",
        pronunciation: "/səˈpraɪzd/",
        definition:
          "Feeling or showing surprise because something unexpected happened",
        example: "I was surprised to see you at the party last night.",
        difficulty: "Beginner",
        synonyms: ["amazed", "astonished", "shocked"],
        antonyms: ["expected", "unsurprised"],
        order_index: 10,
      },
    ];

    console.log("📝 Adding Daily Conversation words...");
    for (const word of dailyWords) {
      await CourseService.createWord(word);
    }

    console.log("✅ Seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - ${toeicCourse.title}: ${toeicWords.length} words`);
    console.log(`   - ${ieltsCourse.title}: ${ieltsWords.length} words`);
    console.log(`   - ${dailyCourse.title}: ${dailyWords.length} words`);
    console.log(
      `   Total: ${
        toeicWords.length + ieltsWords.length + dailyWords.length
      } words across 3 courses`
    );
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await seedCourses();
    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
};

// Run the script if this file is executed directly
if (require.main === module) {
  main();
}

export default seedCourses;
