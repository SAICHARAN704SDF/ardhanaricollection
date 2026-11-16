"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { collections } from "@/lib/mock-data/catalog";
import { useCatalog } from "@/stores/catalog";
import { recommend, type QuizAnswers } from "@/lib/utils/commerce";
import { ProductCard } from "@/components/products/product-card";
const questions = [
  {
    key: "occasion",
    title: "What is the occasion?",
    options: ["Wedding", "Festive", "Evening", "Everyday"],
  },
  {
    key: "budget",
    title: "What feels comfortable?",
    options: [
      "Under ₹7,000",
      "Under ₹12,000",
      "Under ₹20,000",
      "Up to ₹35,000",
    ],
  },
  {
    key: "fabric",
    title: "Which fabric speaks to you?",
    options: collections.slice(0, 5).map((c) => c.name),
  },
  {
    key: "color",
    title: "Choose a colour mood.",
    options: ["Midnight blue", "Rose", "Marigold", "Plum", "Crimson"],
  },
  {
    key: "style",
    title: "Your personal expression?",
    options: ["Traditional", "Contemporary"],
  },
  {
    key: "drape",
    title: "How should it feel?",
    options: ["Lightweight", "Structured"],
  },
];
export function Quiz() {
  const products = useCatalog(s=>s.products);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const questionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step >= 0) questionHeading.current?.focus({ preventScroll: true });
  }, [step]);
  const completed = step === questions.length;
  const q = questions[step];
  const result = completed
    ? recommend(products, {
        ...answers,
        budget: (
          {
            "Under ₹7,000": 7000,
            "Under ₹12,000": 12000,
            "Under ₹20,000": 20000,
            "Up to ₹35,000": 35000,
          } as Record<string, number>
        )[answers.budget],
      } as QuizAnswers)
    : [];
  return (
    <div className={`quiz ${step >= 0 ? "quiz-active" : ""}`}>
      <div className="quiz-intro">
        <p className="eyebrow">A DRAPE AS INDIVIDUAL AS YOU</p>
        <h2>
          Your occasion.
          <br />
          Your expression.
          <br />
          <em>Your perfect drape.</em>
        </h2>
        <p>
          A few thoughtful questions.
          <br />A collection that feels like you.
        </p>
        {step < 0 && (
          <button className="button primary" onClick={() => setStep(0)}>
            Find my drape <ArrowRight size={17} />
          </button>
        )}
        <span className="tiny">
          6 questions · Less than a minute · No data collected
        </span>
      </div>
      <div className="quiz-interaction">
        {step < 0 ? (
          <div className="quiz-art" aria-hidden="true">
            <span className="quiz-petal petal-1" />
            <span className="quiz-petal petal-2" />
            <span className="quiz-petal petal-3" />
            <div className="quiz-art-caption">
              THE ART OF
              <br />
              <em>finding you.</em>
            </div>
          </div>
        ) : completed ? (
          <div>
            <p className="eyebrow">YOUR PERSONAL EDIT · DEMO RECOMMENDATIONS</p>
            <h3 ref={questionHeading} tabIndex={-1}>
              {result.length
                ? "A beautiful place to begin."
                : "A different budget, perhaps?"}
            </h3>
            <p className="tiny">
              Matches prioritize your budget, then occasion, fabric, colour and
              drape.
            </p>
            <div className="quiz-results">
              {result.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <button
              className="text-link"
              onClick={() => {
                setStep(0);
                setAnswers({});
              }}
            >
              <RotateCcw size={14} /> Begin again
            </button>
          </div>
        ) : (
          <div className="quiz-question">
            <p className="eyebrow">0{step + 1} / 06</p>
            <h3 ref={questionHeading} tabIndex={-1}>
              {q.title}
            </h3>
            <div className="quiz-options">
              {q.options.map((o) => (
                <button
                  key={o}
                  aria-pressed={answers[q.key] === o}
                  className={answers[q.key] === o ? "active" : ""}
                  onClick={() => setAnswers({ ...answers, [q.key]: o })}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="quiz-controls">
              <button className="text-link" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button
                className="button primary"
                disabled={!answers[q.key]}
                onClick={() => setStep(step + 1)}
              >
                {step === 5 ? "See my edit" : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
