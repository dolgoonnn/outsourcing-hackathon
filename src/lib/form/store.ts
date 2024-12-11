import { create } from "zustand";
import { type Message } from "ai";

type Answers = {
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
  question5?: string;
  question6?: string;
  question7?: string;
  question8?: string;
  question9?: string[];
};

type State = {
  step: number;
  answers: Answers;
  formattedAnswer: Answers;
  setAnswers: (answers: Answers) => void;
  setFormattedAnswers: (answers: Answers) => void;
  nextStep: () => void;
  prevStep: () => void;
  storyChat: Message[];
  setStoryChat: (storyChat: Message[]) => void;
  baChat: Message[];
  setBaChat: (baChat: Message[]) => void;
  saChat: Message[];
  setSaChat: (saChat: Message[]) => void;
  poChat: Message[];
  setPoChat: (poChat: Message[]) => void;
};

export const useStore = create<State>((set) => ({
  step: 1,
  answers: {
    question9: [],
  },
  formattedAnswer: {},
  setAnswers: (answers) => set((state) => ({ ...state, answers })),
  setFormattedAnswers: (formattedAnswer) =>
    set((state) => ({ ...state, formattedAnswer })),
  nextStep: () => set((state) => ({ ...state, step: state.step + 1 })),
  prevStep: () => set((state) => ({ ...state, step: state.step - 1 })),
  storyChat: [],
  setStoryChat: (storyChat) => set((state) => ({ ...state, storyChat })),
  baChat: [],
  setBaChat: (baChat) => set((state) => ({ ...state, baChat })),
  saChat: [],
  setSaChat: (saChat) => set((state) => ({ ...state, saChat })),
  poChat: [],
  setPoChat: (poChat) => set((state) => ({ ...state, poChat })),
}));
