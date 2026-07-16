export function OutOfOrder({ message }: { message: string }) {
  return (
    <div className="out-of-order mx-auto mt-14 max-w-md rounded-md border-2 border-dashed border-bone-dim/60 bg-curtain px-8 py-10 text-center">
      <p className="font-display text-3xl uppercase leading-tight text-bone">
        Sorry!
        <br />
        Out of order
      </p>
      <p className="mt-4 font-mono text-xs leading-relaxed text-bone-dim">{message}</p>
    </div>
  );
}
