import React from "react";

/**
 * A section component that displays a question and its answer.
 * 
 * @param {Object} props - The props object.
 * @param {string|React.ReactNode} [props.name] - Optional name or React Node for the section.
 * @param {string|React.ReactNode} props.question - The question to be displayed.
 * @param {string|React.ReactNode} [props.answer="..."] - The answer to be displayed (default is "...").
 * @param {string} [props.className] - Optional additional class names for styling.
 * @returns {React.ReactElement} A question-answer section.
 */
const QuestionAnswerSection = ({ name, question, answer = "...", className }) => {
    return (
        <nav className={`flex flex-col gap-4 ${className}`}>
            <nav className="text-sm text-gray-800 font-medium">
                {question}
            </nav>
            <span className="text-zinc-600 font-normal text-sm">
                {answer}
            </span>
        </nav>
    );
};

export default QuestionAnswerSection;
