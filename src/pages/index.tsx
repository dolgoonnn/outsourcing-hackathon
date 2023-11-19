import MainNavigation from '@/components/main-navigation';
import { useState } from 'react';

type Answers = {
  question1?: string;
  question2?: string;
};



export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({});

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  return (
    <MainNavigation>


      <div className="tabs">
        <button onClick={() => setStep(1)}>Step 1</button>
        <button onClick={() => setStep(2)}>Step 2</button>
        <button onClick={() => setStep(3)}>Step 3</button>
      </div>

      {step === 1 && (
        <div>
          <h2>Step 1</h2>
          <label>
            Question 1
            <input type="text" name="question1" onChange={handleChange} />
          </label>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Step 2</h2>
          <label>
            Question 2
            <input type="text" name="question2" onChange={handleChange} />
          </label>
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Step 3</h2>
          <p>Your answers:</p>
          <p>Question 1: {answers.question1}</p>
          <p>Question 2: {answers.question2}</p>
          <button onClick={prevStep}>Back</button>
        </div>
      )}
    </MainNavigation>
  );
}
