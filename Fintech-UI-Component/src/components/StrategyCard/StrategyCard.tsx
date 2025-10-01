import React, { forwardRef } from "react";
import styles from "./StrategyCardGroup.module.css";

export interface StrategyCardProps {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (id: string) => void;

  /** Managed by the parent Group for roving tabindex */
  tabIndex?: number;
  /** Parent may handle keydown centrally, but we expose it for flexibility */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  /** Optional className passthrough */
  className?: string;
  /** Optional aria-label override (otherwise title is announced) */
  ariaLabel?: string;
}

const StrategyCard = forwardRef<HTMLDivElement, StrategyCardProps>(
  (
    {
      id,
      title,
      description,
      badge,
      selected,
      disabled = false,
      onSelect,
      tabIndex = -1,
      onKeyDown,
      className,
      ariaLabel,
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled) onSelect(id);
    };

    const cls = [
      styles.card,
      selected && styles.selected,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="radio"
        aria-checked={selected}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel || undefined}
        tabIndex={tabIndex}
        className={cls}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        data-selected={selected || undefined}
        data-disabled={disabled || undefined}
      >
        <div className={styles.headerRow}>
          {badge && <span className={styles.badge}>{badge}</span>}
          {selected && (
            <span className={styles.check} aria-hidden="true">
              ✓
            </span>
          )}
          {/* Announce “Selected” textually too (not just color/icon) */}
          <span className={styles.srOnly}>
            {selected ? "Selected" : "Not selected"}
          </span>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
      </div>
    );
  }
);

StrategyCard.displayName = "StrategyCard";
export default StrategyCard;
