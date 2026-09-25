interface ExampleButtonProps {
  label?: string;
  onClick?: () => void;
}

export default function ExampleButton({ label = 'Example button', onClick }: ExampleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-gray-400 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
    >
      {label}
    </button>
  );
}
