type TooltipProps = {
  label: string;
  content: string;
};

export function Tooltip({ label, content }: TooltipProps) {
  return (
    <span className="tooltip">
      <button
        aria-label={label}
        className="tooltip__trigger"
        type="button"
      >
        ?
      </button>
      <span className="tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  );
}
