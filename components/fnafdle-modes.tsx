"use client";

import { useState } from "react";
import { FnafdleClassic } from "@/components/fnafdle-classic";
import { FnafdleDialog } from "@/components/fnafdle-dialog";
import { FnafdleGames } from "@/components/fnafdle-games";
import { FnafdleImage } from "@/components/fnafdle-image";
import { FnafdleMinigames } from "@/components/fnafdle-minigames";
import { FnafdleTeasers } from "@/components/fnafdle-teasers";
import { FnafdleWorld } from "@/components/fnafdle-world";

const MODES = [
  { id: "classic", cam: "1A", label: "Classic" },
  { id: "image", cam: "1B", label: "Image" },
  { id: "games", cam: "1C", label: "Games" },
  { id: "teasers", cam: "2A", label: "Teasers" },
  { id: "minigames", cam: "2B", label: "Minigames" },
  { id: "world", cam: "2C", label: "World Attacks" },
  { id: "dialog", cam: "2D", label: "Dialog" },
] as const;

type ModeId = (typeof MODES)[number]["id"];

export function FnafdleModes(props: {
  classicPool: React.ComponentProps<typeof FnafdleClassic>["pool"];
  gamesPool: React.ComponentProps<typeof FnafdleGames>["pool"];
  imagePool: React.ComponentProps<typeof FnafdleImage>["pool"];
  teasersPool: React.ComponentProps<typeof FnafdleTeasers>["pool"];
  teasersMediaOptions: React.ComponentProps<typeof FnafdleTeasers>["mediaOptions"];
  minigamesPool: React.ComponentProps<typeof FnafdleMinigames>["pool"];
  minigamesMediaOptions: React.ComponentProps<typeof FnafdleMinigames>["mediaOptions"];
  worldPool: React.ComponentProps<typeof FnafdleWorld>["pool"];
  dialogPool: React.ComponentProps<typeof FnafdleDialog>["pool"];
}) {
  const [mode, setMode] = useState<ModeId>("classic");

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`tab-press group flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                active
                  ? "border-faz bg-faz/10 text-faz shadow-[0_0_10px_rgba(183,139,255,0.2)]"
                  : "border-seam bg-stage/60 text-bone-dim hover:border-bone-dim hover:text-bone"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-[1px] transition-colors ${
                  active ? "led-pulse bg-signal" : "bg-seam group-hover:bg-bone-dim"
                }`}
              />
              <span className="font-pixel text-[8px] text-faz-dim">{m.cam}</span>
              {m.label}
            </button>
          );
        })}
      </div>

      {mode === "classic" ? <FnafdleClassic pool={props.classicPool} /> : null}
      {mode === "image" ? <FnafdleImage pool={props.imagePool} /> : null}
      {mode === "games" ? <FnafdleGames pool={props.gamesPool} /> : null}
      {mode === "teasers" ? (
        <FnafdleTeasers pool={props.teasersPool} mediaOptions={props.teasersMediaOptions} />
      ) : null}
      {mode === "minigames" ? (
        <FnafdleMinigames pool={props.minigamesPool} mediaOptions={props.minigamesMediaOptions} />
      ) : null}
      {mode === "world" ? <FnafdleWorld pool={props.worldPool} /> : null}
      {mode === "dialog" ? <FnafdleDialog pool={props.dialogPool} /> : null}
    </div>
  );
}
