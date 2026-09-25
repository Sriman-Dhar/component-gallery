import CopyButton from './CopyButton';

export default function PromptPanel({ prompt }: { prompt: string }) {
  return (
    <div className="rounded border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <span className="text-xs text-gray-700">Final prompt</span>
        <CopyButton text={prompt} label="Copy prompt" />
      </div>
      <pre className="whitespace-pre-wrap p-3 text-sm">{prompt}</pre>
    </div>
  );
}
