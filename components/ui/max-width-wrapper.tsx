export default function MaxWidthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-[90%] max-w-[83.3125rem] flex-1 sm:w-[80%]'>
      {children}
    </div>
  );
}
