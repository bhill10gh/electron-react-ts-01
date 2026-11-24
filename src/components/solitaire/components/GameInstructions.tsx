export default function GameInstructions() {
  return (
    <div className="mt-10 p-4 bg-emerald-900/60 rounded-lg">
      <h2 className="font-bold mb-2">How to play</h2>

      <ul className="text-sm text-emerald-100 space-y-1">
        <li>• Click the stock to draw three cards.</li>
        <li>• Click a face-up card to select it.</li>
        <li>• Click another column to move selected cards.</li>
        <li>• Alternate red and black cards.</li>
        <li>• Only Kings can be placed in empty columns.</li>
        <li>• Build foundations from Ace to King by suit.</li>
      </ul>
    </div>
  );
}
