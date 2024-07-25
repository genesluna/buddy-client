'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Envelope,
  PaperPlaneRight,
  User,
} from '@phosphor-icons/react/dist/ssr';
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import { useForm } from 'react-hook-form';
import { string, z } from 'zod';

const contactSchema = z.object({
  name: string().min(4, 'O nome deve ter pelo menos 4 caracteres'),
  email: string().email('Insira um email válido'),
  message: string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
});

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isValid },
  } = useForm<ContactData>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(contactSchema),
  });

  type ContactData = z.infer<typeof contactSchema>;

  function handleLogin(data: ContactData) {
    console.log(data);
  }
  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className='mt-8 flex w-full max-w-[467px] flex-col gap-4 lg:gap-8'
    >
      <Input
        id='name'
        placeholder='Nome'
        type='text'
        className='w-full max-w-[467px]'
        icon={<User size={28} className='text-content-200/75' />}
        errorMessage={errors.name?.message}
        {...register('name')}
      />

      <Input
        id='email'
        placeholder='Email'
        type='email'
        className='w-full max-w-[467px]'
        icon={<Envelope size={28} className='text-content-200/75' />}
        errorMessage={errors.email?.message}
        {...register('email')}
      />
      <div>
        <textarea
          id='message'
          placeholder='Mensagem'
          className={`h-36 w-full resize-none rounded-2xl border py-3 pl-4 pr-4 text-lg text-content-200 ${
            errors.message?.message
              ? 'border-error'
              : 'border-content-600 hover:border-accent focus:border-accent'
          } bg-content-600 focus:outline-none`}
          {...register('message')}
        ></textarea>
        <p className='ms-3 mt-2 text-error'>{errors.message?.message}</p>
      </div>

      <Button
        type='submit'
        aria-label='Enviar mensagem'
        label='Enviar mensagem'
        className='w-full lg:w-72'
        icon={<PaperPlaneRight size={28} />}
        isLoading={isLoading}
        disabled={!isValid}
      />
    </form>
  );
}
