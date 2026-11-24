import { Card } from "../models/pokerTypes";
import PlayingCard from "./PlayingCard";

type Props = {
  cards: Card[];
};

export default function CommunityCards({ cards }: Props) {
  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3, 4].map((index) => (
        <PlayingCard key={index} card={cards[index]} hidden={!cards[index]} />
      ))}
    </div>
  );
}
