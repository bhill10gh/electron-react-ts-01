import type { ReactNode } from "react";
import {
  TailwindButton,
  tailwindButtonShowcase,
} from "../components/TailwindButton";

function ButtonSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

export function TailwindButtons() {
  return (
    <section className="space-y-8 py-4">
      <h1 className="text-2xl font-semibold">Tailwind Buttons</h1>
      <p className="max-w-2xl text-sm text-gray-600">
        Use{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
          {"<TailwindButton variant=\"…\">"}
        </code>{" "}
        anywhere. Variants match the styles below (
        {tailwindButtonShowcase.reduce((n, s) => n + s.buttons.length, 0)} total).
      </p>

      {tailwindButtonShowcase.map((section) => (
        <ButtonSection key={section.title} title={section.title}>
          {section.buttons.map(({ variant, label }) => (
            <TailwindButton key={variant} variant={variant}>
              {label}
            </TailwindButton>
          ))}
        </ButtonSection>
      ))}
    </section>
  );
}