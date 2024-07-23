export default function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center pt-14'>
      <div
        className='text-surface inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-accent motion-reduce:animate-[spin_1.5s_linear_infinite]'
        role='status'
      ></div>
      <span className='ms-3 text-lg text-accent'>Carregando...</span>
    </div>
  );
}
