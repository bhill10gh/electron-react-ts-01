import { PokerAction } from "../models/pokerTypes";

type Props = {
  onAction: (action: PokerAction) => void;
  disabled?: boolean;
};

export default function PokerControls({ onAction, disabled = false }: Props) {
  const buttons: {
    label: string;
    action: PokerAction;
    style: string;
  }[] = [
    {
      label: "Fold",
      action: "fold",
      style: "bg-red-600 hover:bg-red-700",
    },
    {
      label: "Check",
      action: "check",
      style: "bg-gray-600 hover:bg-gray-700",
    },
    {
      label: "Call",
      action: "call",
      style: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Raise $30",
      action: "raise",
      style: "bg-yellow-600 hover:bg-yellow-700",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {buttons.map((button) => (
        <button
          key={button.action}
          disabled={disabled}
          onClick={() => onAction(button.action)}
          className={`${button.style} text-white
            px-6 py-3 rounded-lg font-bold
            disabled:opacity-40`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
