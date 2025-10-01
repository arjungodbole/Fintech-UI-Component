import React, { useEffect, useMemo, useRef, useState } from "react";
import StrategyCard, { type StrategyCardProps } from "./StrategyCard";
import styles from "./StrategyCardGroup.module.css";

export interface StrategyOption {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface StrategyCardGroupProps {
  options: StrategyOption[];
  value: string | null; // selected id
  onChange: (id: string) => void;
  ariaLabel?: string; // accessible name for the group
  className?: string;
}

function StrategyCardGroup({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: StrategyCardGroupProps) {
  const enabledIndexes = useMemo(
    () => options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i !== -1),
    [options]
  );

  // Determine initial focused index: selected if enabled, else first enabled
  const initialIndex = useMemo(() => {
    const selIndex = options.findIndex((o) => o.id === value && !o.disabled);
    if (selIndex >= 0) return selIndex;
    return enabledIndexes.length ? enabledIndexes[0] : -1;
  }, [options, value, enabledIndexes]);

  const [focusedIndex, setFocusedIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setFocusedIndex(initialIndex);
  }, [initialIndex]);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const focusIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= options.length) return;
    if (options[nextIndex]?.disabled) return;
    setFocusedIndex(nextIndex);
    // focus after paint
    requestAnimationFrame(() => itemRefs.current[nextIndex]?.focus());
  };

  const move = (delta: number) => {
    if (!enabledIndexes.length) return;
    const current = focusedIndex < 0 ? enabledIndexes[0] : focusedIndex;
    // Find next enabled index in the given direction, wrapping
    let idx = current;
    do {
      idx = (idx + delta + options.length) % options.length;
    } while (options[idx]?.disabled);
    focusIndex(idx);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        move(+1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        e.preventDefault();
        if (enabledIndexes.length) focusIndex(enabledIndexes[0]);
        break;
      case "End":
        e.preventDefault();
        if (enabledIndexes.length)
          focusIndex(enabledIndexes[enabledIndexes.length - 1]);
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && !options[focusedIndex]?.disabled) {
          onChange(options[focusedIndex].id);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel || "Strategy selection"}
      className={[styles.group, className].filter(Boolean).join(" ")}
      onKeyDown={handleKeyDown}
    >
      {options.map((opt, i) => {
        const selected = value === opt.id;
        const tabIndex = i === focusedIndex ? 0 : -1;

        const cardProps: StrategyCardProps = {
          id: opt.id,
          title: opt.title,
          description: opt.description,
          badge: opt.badge,
          selected,
          disabled: !!opt.disabled,
          onSelect: onChange,
          tabIndex,
        };

        return (
          <StrategyCard
            key={opt.id}
            {...cardProps}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            ariaLabel={opt.title}
            className={styles.item}
          />
        );
      })}
    </div>
  );
}

export default StrategyCardGroup;
