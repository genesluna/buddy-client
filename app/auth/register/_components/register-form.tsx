'use client';

import {
  BuildingOffice,
  Envelope,
  FilePlus,
  IdentificationCard,
  LockSimple,
  User,
} from '@phosphor-icons/react/dist/ssr';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import { useForm } from 'react-hook-form';
import { string, z } from 'zod';

const registerSchema = z
  .object({
    shelterName: string().min(4, 'O nome deve ter pelo menos 4 caracteres'),
    responsibleName: string().min(4, 'O nome deve ter pelo menos 4 caracteres'),
    responsibleCPF: string().min(11, 'O CPF deve ter pelo menos 11 digitos'),
    email: string().email('Insira um email válido'),
    password: string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  });

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isValid },
  } = useForm<registerData>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(registerSchema),
  });

  type registerData = z.infer<typeof registerSchema>;

  function handleRegister(data: registerData) {
    console.log(data);
  }
  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className='mt-8 flex w-full max-w-[467px] flex-col gap-4 lg:gap-8'
    >
      <Input
        id='shelter-name'
        placeholder='Nome do abrigo'
        type='text'
        className='w-full max-w-[467px]'
        icon={<BuildingOffice size={28} className='text-content-200/75' />}
        errorMessage={errors.shelterName?.message}
        {...register('shelterName')}
      />
      <Input
        id='responsible-name'
        placeholder='Nome do responsável'
        type='text'
        className='w-full max-w-[467px]'
        icon={<User size={28} className='text-content-200/75' />}
        errorMessage={errors.responsibleName?.message}
        {...register('responsibleName')}
      />
      <Input
        id='responsible-cpf'
        placeholder='CPF do responsável'
        type='text'
        className='w-full max-w-[467px]'
        icon={<IdentificationCard size={28} className='text-content-200/75' />}
        errorMessage={errors.responsibleCPF?.message}
        {...register('responsibleCPF')}
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
      <Input
        id='password'
        placeholder='Senha'
        type='password'
        className='w-full max-w-[467px]'
        icon={<LockSimple size={28} className='text-content-200/75' />}
        errorMessage={errors.password?.message}
        {...register('password')}
      />
      <Input
        id='confirm-password'
        placeholder='Confirme a senha'
        type='password'
        className='w-full max-w-[467px]'
        icon={<LockSimple size={28} className='text-content-200/75' />}
        errorMessage={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button
        type='submit'
        label='Cadastrar novo abrigo'
        className='mb-10 w-full lg:mb-auto xl:w-72'
        icon={<FilePlus size={28} />}
        isLoading={isLoading}
        disabled={!isValid}
      />
    </form>
  );
}
