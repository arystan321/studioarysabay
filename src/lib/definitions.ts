export type QuizQuestion = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

export type Accessory = {
  id: string;
  name: string;
  price: number;
  slot: 'hat' | 'face';
  component: React.FC<React.SVGProps<SVGSVGElement>>;
  icon: React.FC<{ className?: string }>;
};
