export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer?: string;
  explanation?: string;
}

export interface ExamConfig {
  difficulty: 'easy' | 'moderate' | 'difficult';
  questionCount: number;
}

export interface UserAnswer {
  question_id: number;
  answer: string;
}

export interface ExamResponse {
  exam_id: number;
  questions: Question[];
}

export interface ExamResult {
  score: number;
  total: number;
}

export interface ExamError {
  error: string;
}
