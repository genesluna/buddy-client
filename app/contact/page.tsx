import HorizontalLayout from '@/app/_components/horizontal-layout';
import ContactForm from './_components/contact-form';

export default function ContactPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-4xl font-bold text-accent'>Contato</h1>
      <p className='mt-2 text-lg text-content-300'>Escreva sua mensagem</p>
      <ContactForm />
    </HorizontalLayout>
  );
}
