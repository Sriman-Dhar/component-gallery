import OtpInput from './OtpInput';

/** Gallery tile close crop: the six cells, the first one filled. Rendered inert. */
export default function OtpInputPreview() {
  return (
    <div className="w-[340px] max-w-full translate-y-3">
      <OtpInput defaultValue="2" hint="Paste the code into any box." />
    </div>
  );
}
