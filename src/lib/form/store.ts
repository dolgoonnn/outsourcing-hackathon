import create from 'zustand';

type Answers = {
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
};
type State = {
  step: number;
  answers: Answers;
  formattedAnswer:Answers;
  setAnswers: (answers: Answers) => void;
  setFormattedAnswers: (answers: Answers) => void;
  nextStep: () => void;
  prevStep: () => void;
};

export const useStore = create<State>((set) => ({
  step: 1,
  answers: {},
  formattedAnswer:{},
  setAnswers: (answers) => set((state) => ({ ...state, answers })),
  setFormattedAnswers: (formattedAnswer) => set((state) => ({ ...state, formattedAnswer })),
  nextStep: () => set((state) => ({ ...state, step: state.step + 1 })),
  prevStep: () => set((state) => ({ ...state, step: state.step - 1 })),
}));