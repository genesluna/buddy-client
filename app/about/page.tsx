import MaxWidthWrapper from '@/app/_components/ui/max-width-wrapper';
import VerticalLayout from '@/app/_components/vertical-layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buddy | Sobre',
  description: 'Sobre nós',
};

export default function About() {
  return (
    <VerticalLayout>
      <MaxWidthWrapper>
        <div className='pb-8'>
          <div className='h-50 mt-[-4.3125rem] flex flex-col items-start rounded-[1.875rem] bg-white px-[2.5rem] py-[1.875rem]'>
            <h1 className='text-2xl font-semibold text-accent md:text-3xl lg:text-4xl'>
              Sobre nós
            </h1>
            <p className='mt-4 text-content-300'>
              Buddy é uma organização não governamental de bem-estar animal como
              nenhuma outra. Ajudamos a salvar milhares de vidas todos os meses,
              olhando para o panorama geral, alterando o status quo e
              encontrando soluções tecnológicas inovadoras para os maiores
              desafios enfrentados por animais de estimação resgatados na
              Brasil.
            </p>
          </div>
          <div className='mt-10 lg:mt-20'>
            <h2 className='px-[2.5rem] text-xl font-semibold text-accent md:text-2xl lg:text-3xl'>
              Nossa visão e missão
            </h2>
            <div className='mt-8 rounded-4xl bg-white/20 px-[2.5rem] py-[1.875rem] backdrop-blur-sm transition duration-300 hover:bg-white/40 lg:mt-14'>
              <h3 className='text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Usar a tecnologia para impulsionar a mudança social.
              </h3>
              <p className='mt-4 text-content-300'>
                Somos inovadores digitais, sempre procurando maneiras de
                aproveitar os mais recentes avanços no mundo da tecnologia para
                resolver os grandes problemas e desafios que os animais de
                estimação resgatados enfrentam no Brasil.
              </p>
              <h3 className='mt-14 text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Criar uma cultura positiva e progressiva de resgate.
              </h3>
              <p className='mt-4 text-content-300'>
                Queremos melhorar a experiência de resgate e adoção para todos e
                acreditamos que a melhor maneira de conseguir isso é criando e
                nutrindo uma cultura positiva e progressiva de resgate.
              </p>

              <h3 className='mt-14 text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Impulsionar a defesa de direitos por meio da ação.
              </h3>
              <p className='mt-4 text-content-300'>
                Através de todas as campanhas, programas e serviços inovadores
                que criamos e oferecemos, defendemos ativamente o resgate de
                animais de estimação.
              </p>
              <h3 className='mt-14 text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Unir-nos para salvar vidas.
              </h3>
              <p className='mt-4 text-content-300'>
                Unimos animais de estimação a novas famílias, grupos de resgate
                com adotantes e cuidadores adotivos, parceiros corporativos com
                uma comunidade nacional de resgate e unimos todos os defensores
                apaixonados do resgate de animais de estimação para impulsionar
                mudanças positivas.
              </p>
            </div>
          </div>
          <div className='my-10 lg:mt-20'>
            <h2 className='px-[2.5rem] text-xl font-semibold text-accent md:text-2xl lg:text-3xl'>
              Perguntas frequentes
            </h2>
            <div className='mt-8 flex flex-col items-start justify-center rounded-4xl border border-accent bg-white/20 px-[2.5rem] py-[1.875rem] backdrop-blur-sm transition duration-300 hover:bg-white/40 lg:mt-14'>
              <h3 className='text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Com que frequência o site é atualizado?
              </h3>
              <p className='mt-4 text-content-300'>
                Ele extrai os dados diretamente do próprio administrador do
                abrigo para as informações que sejam atualizados em tempo real
                conforme os abrigos fazem suas alterações.
              </p>
            </div>
            <div className='mt-10 flex flex-col items-start justify-center rounded-4xl border border-accent bg-white/20 px-[2.5rem] py-[1.875rem] backdrop-blur-sm transition duration-300 hover:bg-white/40'>
              <h3 className='text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Existe algum custo?
              </h3>
              <p className='mt-4 text-content-300'>
                Não, o uso é gratuito para o público e gratuito para os abrigos
                participarem.
              </p>
            </div>
            <div className='mt-10 flex flex-col items-start justify-center rounded-4xl border border-accent bg-white/20 px-[2.5rem] py-[1.875rem] backdrop-blur-sm transition duration-300 hover:bg-white/40'>
              <h3 className='text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Como posso saber o status da minha adoção?
              </h3>
              <p className='mt-4 text-content-300'>
                Você será contatado quando selecionar um animal para adoção. O
                perfil do animal será atualizado para informar que há uma adoção
                em processamento, se foi reservado ou se foi adotado.
              </p>
            </div>
            <div className='mt-10 flex flex-col items-start justify-center rounded-4xl border border-accent bg-white/20 px-[2.5rem] py-[1.875rem] backdrop-blur-sm transition duration-300 hover:bg-white/40'>
              <h3 className='text-lg font-semibold text-accent md:text-xl lg:text-2xl'>
                Como posso fazer uma doação?
              </h3>
              <p className='mt-4 text-content-300'>
                Cada abrigo tem um botão de doação individual em seus perfis que
                você pode usar para apoiá-los.
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </VerticalLayout>
  );
}
