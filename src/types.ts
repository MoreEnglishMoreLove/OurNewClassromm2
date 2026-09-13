export interface StudentActivation {
  studentName: string;
  normalizedName: string;
  code: string;
  activatedAt: number;
  expiresAt: number;
  deviceId: string;
}

export interface GeneratedCodeRecord {
  id: string;
  studentName: string;
  normalizedName: string;
  code: string;
  createdAt: number;
  notes?: string;
}

export interface VocabularyWord {
  id: string;
  english: string;
  arabic: string;
  phonetic?: string;
  category: 'classroom' | 'preposition' | 'phonics_b' | 'general';
  exampleEn: string;
  exampleAr: string;
  iconName: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerAr: string;
  avatar: string;
  english: string;
  arabic: string;
  highlightWords?: string[];
}

export interface WorksheetExercise {
  id: string;
  number: number;
  titleEn: string;
  titleAr: string;
  instructionEn: string;
  instructionAr: string;
  type: 'read_and_circle' | 'listen_and_tick' | 'match' | 'draw_and_write' | 'trace_and_copy' | 'multiple_choice';
  items: any[];
  modelAnswerExplanationAr: string;
}

export interface Worksheet {
  id: string;
  number: number;
  titleEn: string;
  titleAr: string;
  unit: string;
  unitAr: string;
  description: string;
  exercises: WorksheetExercise[];
  notesTeacher?: string;
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionAr: string;
  audioText?: string;
  options: {
    id: string;
    textEn: string;
    textAr: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  category: string;
}
