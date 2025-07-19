
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import type { CreateNewsletterSubscriptionInput, CreateEnrollmentInterestInput } from '../../server/src/schema';

function App() {
  const [newsletterData, setNewsletterData] = useState<CreateNewsletterSubscriptionInput>({
    name: '',
    email: ''
  });
  
  const [enrollmentData, setEnrollmentData] = useState<CreateEnrollmentInterestInput>({
    name: '',
    email: '',
    phone: ''
  });
  
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [isEnrollmentLoading, setIsEnrollmentLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterLoading(true);
    try {
      await trpc.createNewsletterSubscription.mutate(newsletterData);
      setNewsletterSuccess(true);
      setNewsletterData({ name: '', email: '' });
    } catch (error) {
      console.error('Failed to subscribe to newsletter:', error);
    } finally {
      setIsNewsletterLoading(false);
    }
  };

  const handleEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnrollmentLoading(true);
    try {
      await trpc.createEnrollmentInterest.mutate({
        name: enrollmentData.name,
        email: enrollmentData.email,
        phone: enrollmentData.phone || undefined
      });
      setEnrollmentSuccess(true);
      setEnrollmentData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Failed to register interest:', error);
    } finally {
      setIsEnrollmentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-6 text-lg px-6 py-2 bg-amber-100 text-amber-800 border-amber-200">
              ✨ Transforme-se no Homem que Sempre Sonhou Ser
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-slate-900 leading-tight">
            Desvende o 
            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent"> Homem Clássico</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Descubra os pilares atemporais da masculinidade clássica e desenvolva as virtudes, 
            habilidades e mentalidade que definem um verdadeiro cavalheiro moderno.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🎯 Inscreva-se Agora
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-300 text-slate-700 px-12 py-6 text-xl rounded-xl hover:bg-slate-50 transition-all"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              📚 Saiba Mais
            </Button>
          </div>
          
          {/* Hero Image Placeholder */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-amber-900 rounded-2xl h-96 flex items-center justify-center shadow-2xl relative overflow-hidden">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12"></div>
            </div>
            
            <div className="text-slate-100 text-center relative z-10 max-w-2xl mx-auto px-6">
              <div className="flex justify-center mb-4 space-x-3">
                <span className="text-4xl">👔</span>
                <span className="text-4xl">🎯</span>
                <span className="text-4xl">⚡</span>
              </div>
              <p className="text-xl font-semibold mb-2 text-amber-200">
                Aqui será um vídeo ou imagem impactante do homem clássico
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Imagine um homem elegante e confiante, cercado por elementos que remetem à sabedoria e tradição, 
                ou um vídeo inspirador de 30 segundos que introduza o conceito transformador do curso
              </p>
              
              {/* Decorative elements */}
              <div className="flex justify-center mt-6 space-x-8 text-2xl opacity-60">
                <span>📚</span>
                <span>🏛️</span>
                <span>👑</span>
                <span>⚔️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section id="overview" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
              O Problema que Resolvemos
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Em um mundo em constante mudança, muitos homens se sentem perdidos, sem direção clara 
              sobre como desenvolver suas virtudes, liderança e caráter autêntico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow border-0 bg-red-50">
              <CardHeader>
                <div className="text-4xl mb-4">⚠️</div>
                <CardTitle className="text-xl text-red-800">O Problema</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  Falta de modelos masculinos sólidos, confusão sobre identidade e 
                  ausência de orientação para desenvolver virtudes clássicas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow border-0 bg-amber-50">
              <CardHeader>
                <div className="text-4xl mb-4">💡</div>
                <CardTitle className="text-xl text-amber-800">A Solução</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700">
                  Um curso estruturado que combina sabedoria atemporal com aplicação prática, 
                  guiando você na jornada de autotransformação.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow border-0 bg-green-50">
              <CardHeader>
                <div className="text-4xl mb-4">🎯</div>
                <CardTitle className="text-xl text-green-800">O Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Transformação em um homem de caráter sólido, liderança natural e 
                  virtudes que inspiram respeito e admiração.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
              Módulos do Curso
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Uma jornada completa dividida em módulos práticos e transformadores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🏛️",
                title: "Fundamentos Clássicos",
                description: "História e filosofia da masculinidade clássica, valores atemporais e princípios fundamentais."
              },
              {
                icon: "💪",
                title: "Desenvolvimento Pessoal",
                description: "Disciplina, autocontrole, definição de objetivos e construção de hábitos vencedores."
              },
              {
                icon: "👔",
                title: "Presença e Etiqueta",
                description: "Comunicação eficaz, linguagem corporal, etiqueta social e presença magnética."
              },
              {
                icon: "👑",
                title: "Liderança Natural",
                description: "Princípios de liderança, tomada de decisão e como inspirar e influenciar positivamente."
              },
              {
                icon: "💼",
                title: "Sucesso Profissional",
                description: "Estratégias de carreira, networking eficaz e construção de reputação profissional sólida."
              },
              {
                icon: "❤️",
                title: "Relacionamentos",
                description: "Relacionamentos saudáveis, comunicação emocional e construção de conexões autênticas."
              }
            ].map((module, index) => (
              <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-all border-0 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-3">{module.icon}</div>
                  <CardTitle className="text-xl text-slate-800">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Instructor */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
                Conheça Seu Mentor
              </h2>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                Com mais de uma década de experiência em desenvolvimento masculino e coaching de vida, 
                nosso instrutor combina conhecimento acadêmico com sabedoria prática.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <Badge className="bg-amber-100 text-amber-800">✨ Especialização</Badge>
                  <span className="text-slate-700">Psicologia Masculina e Desenvolvimento Pessoal</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-amber-100 text-amber-800">📚 Experiência</Badge>
                  <span className="text-slate-700">10+ anos transformando vidas masculinas</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-amber-100 text-amber-800">🎯 Resultados</Badge>
                  <span className="text-slate-700">1000+ homens transformados</span>
                </div>
              </div>
              <p className="text-lg text-slate-600 italic">
                "Acredito que todo homem possui o potencial para a grandeza. 
                Minha missão é ajudá-lo a descobrir e desenvolver esse potencial."
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl h-96 flex items-center justify-center shadow-lg">
                <div className="text-slate-500 text-center">
                  <div className="text-6xl mb-4">👨‍🏫</div>
                  <p className="text-xl">Foto do Instrutor</p>
                  <p className="text-sm text-slate-400">Em breve...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
            O Que Nossos Alunos Dizem
          </h2>
          <p className="text-xl text-slate-600 mb-16">
            Depoimentos reais de homens que transformaram suas vidas
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-8 shadow-lg border-0 bg-white">
                <CardContent className="text-center">
                  <div className="text-4xl mb-6">💭</div>
                  <p className="text-slate-600 mb-6 italic">
                    "Depoimento inspirador sobre a transformação pessoal e os resultados obtidos com o curso..."
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-slate-800">Aluno {i}</p>
                      <p className="text-sm text-slate-500">Em breve...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Enrollment */}
      <section id="enrollment" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
              Invista em Sua Transformação
            </h2>
            <p className="text-xl text-slate-600">
              Uma oportunidade única de descobrir seu potencial máximo
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardHeader className="text-center pb-8">
                <div className="text-5xl mb-4">🏆</div>
                <CardTitle className="text-2xl text-slate-800 mb-4">Curso Completo</CardTitle>
                <div className="text-4xl font-bold text-amber-700 mb-2">R$ XXX</div>
                <p className="text-slate-600">Valor em breve</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Acesso completo aos 6 módulos</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Material complementar exclusivo</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Suporte direto do instrutor</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Garantia de 30 dias</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900">
                  📝 Manifestar Interesse
                </h3>
                <p className="text-slate-600 mb-6">
                  Seja o primeiro a saber quando as inscrições abrirem e garanta condições especiais.
                </p>
                
                {enrollmentSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <p className="text-green-800 font-semibold">Interesse registrado com sucesso!</p>
                    <p className="text-green-600 text-sm mt-2">Entraremos em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
                    <Input
                      placeholder="Seu nome completo"
                      value={enrollmentData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEnrollmentData((prev: CreateEnrollmentInterestInput) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      className="h-12"
                    />
                    <Input
                      type="email"
                      placeholder="Seu melhor email"
                      value={enrollmentData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEnrollmentData((prev: CreateEnrollmentInterestInput) => ({ ...prev, email: e.target.value }))
                      }
                      required
                      className="h-12"
                    />
                    <Input
                      type="tel"
                      placeholder="Telefone (opcional)"
                      value={enrollmentData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEnrollmentData((prev: CreateEnrollmentInterestInput) => ({ ...prev, phone: e.target.value }))
                      }
                      className="h-12"
                    />
                    <Button 
                      type="submit" 
                      disabled={isEnrollmentLoading}
                      className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white text-lg"
                    >
                      {isEnrollmentLoading ? '🔄 Registrando...' : '🎯 Quero Ser Notificado'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-slate-600">
              Esclarecemos suas principais dúvidas
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Para quem é este curso?",
                a: "Para homens que buscam desenvolver sua masculinidade de forma equilibrada e autêntica, independente da idade ou situação atual."
              },
              {
                q: "Quanto tempo dura o curso?",
                a: "O curso tem duração flexível, permitindo que você avance no seu próprio ritmo. Conteúdo completo disponível por 12 meses."
              },
              {
                q: "Há garantia?",
                a: "Sim, oferecemos garantia incondicional de 30 dias. Se não ficar satisfeito, devolvemos 100% do valor investido."
              },
              {
                q: "Como funciona o suporte?",
                a: "Você terá acesso a um canal exclusivo de suporte com o instrutor e uma comunidade ativa de alunos."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 shadow-md border-0 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-3">
                    <span className="text-amber-600">❓</span>
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 pl-8">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter/Contact */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Mantenha-se Atualizado
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Receba conteúdos exclusivos, dicas e novidades sobre desenvolvimento masculino
          </p>

          {newsletterSuccess ? (
            <div className="bg-green-600 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-green-100 font-semibold text-lg">Inscrição realizada com sucesso!</p>
              <p className="text-green-200 text-sm mt-2">Você receberá nossos conteúdos exclusivos em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="space-y-4">
                <Input
                  placeholder="Seu nome"
                  value={newsletterData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewsletterData((prev: CreateNewsletterSubscriptionInput) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  value={newsletterData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewsletterData((prev: CreateNewsletterSubscriptionInput) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Button 
                  type="submit" 
                  disabled={isNewsletterLoading}
                  className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white text-lg"
                >
                  {isNewsletterLoading ? '📤 Inscrevendo...' : '📬 Quero Receber Conteúdos'}
                </Button>
              </div>
            </form>
          )}

          <Separator className="my-12 bg-slate-700" />
          
          <div className="text-center text-slate-400">
            <p className="mb-4">© 2024 Classic Man Course. Transformando homens, construindo legados.</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="hover:text-amber-400 transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
