interface Props {
  moves: number;
  completed: number;
}

export default function GameInfo({ moves, completed }: Props) {
  return (
    <div className="flex gap-6 mb-6 text-sm">
      <div>
        Moves: <strong>{moves}</strong>
      </div>

      <div>
        Cards completed: <strong>{completed}/52</strong>
      </div>
    </div>
  );
}
