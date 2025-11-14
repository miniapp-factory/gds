"use client";
import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "orange", "lemon"] as const;
type Fruit = typeof fruits[number];

export default function SlotMachine() {
  const [columns, setColumns] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  function randomFruit(): Fruit {
    return fruits[Math.floor(Math.random() * fruits.length)];
  }

  useEffect(() => {
    // initialize columns
    setColumns([
      [randomFruit(), randomFruit(), randomFruit()],
      [randomFruit(), randomFruit(), randomFruit()],
      [randomFruit(), randomFruit(), randomFruit()],
    ]);
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinMessage(null);
    const interval = setInterval(() => {
      setColumns((prev) => {
        const newCols = prev.map((col) => [
          randomFruit(),
          ...col.slice(0, 2),
        ]);
        return newCols;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // check center row
      const centerRow = columns.map((col) => col[1]);
      if (centerRow.every((f) => f === centerRow[0])) {
        setWinMessage(`You won with ${centerRow[0]}!`);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-1">
            {col.map((fruit, rowIdx) => (
              <img
                key={rowIdx}
                src={`/${fruit}.png`}
                alt={fruit}
                width={64}
                height={64}
                className="border rounded"
              />
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {winMessage && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold">{winMessage}</span>
          <Share text={`${winMessage} ${url}`} />
        </div>
      )}
    </div>
  );
}
