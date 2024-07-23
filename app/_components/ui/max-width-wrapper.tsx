export default function MaxWidthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex w-[90%] max-w-[83.3125rem] flex-1 flex-col sm:w-[80%]'>
      {children}
    </div>
  );
}
