import { MODES, type ModeId } from "@/lib/modes/modes";
import { ModeCard } from "./ModeCard";

interface Props {
  current?: ModeId;
  onSelect: (id: ModeId) => void;
}

export function ModeSelector({ current, onSelect }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {MODES.map((m, i) => (
        <div key={m.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
          <ModeCard mode={m} active={current === m.id} onSelect={() => onSelect(m.id)} />
        </div>
      ))}
    </div>
  );
}
