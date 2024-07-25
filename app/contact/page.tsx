import HorizontalLayout from '@/app/_components/horizontal-layout';
import ContactForm from './_components/contact-form';

export default function ContactPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>Contato</h1>
      <p className='mt-2 text-content-300 sm:text-lg'>Escreva sua mensagem</p>
      <ContactForm />
    </HorizontalLayout>
  );
}
