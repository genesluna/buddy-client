import ContactForm from '@/components/forms/contact-form';
import HorizontalLayout from '@/components/layouts/horizontal-layout';

export default function ContactPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-4xl font-bold text-accent'>Contato</h1>
      <p className='mt-2 text-lg text-content-300'>Escreva sua mensagem</p>
      <ContactForm />
    </HorizontalLayout>
  );
}
