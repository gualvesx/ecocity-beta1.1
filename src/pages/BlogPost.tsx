
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Bookmark, Share2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

interface ArtigoProps {
  id: string;
  titulo: string;
  resumo: string;
  autor: string;
  data: string;
  imagem: string;
  categoria: string;
  tempoDeLeitura: string;
  conteudo?: string;
}

// Conteúdo detalhado para cada artigo (simulado)
const conteudoArtigos: Record<string, string> = {
  "1": `
    <h2>Introdução à Horta Urbana</h2>
    <p>Cultivar uma horta em ambientes urbanos pode parecer desafiador, mas é uma prática cada vez mais popular e acessível. Mesmo com espaço limitado, é possível produzir alimentos frescos e orgânicos em casa.</p>
    
    <h2>Escolhendo o Local Ideal</h2>
    <p>A luz solar é essencial para a maioria das plantas. Para iniciar sua horta, identifique áreas que recebam pelo menos 6 horas de sol direto por dia. Varandas, peitoris de janelas e até mesmo paredes verticais podem ser aproveitados.</p>
    
    <h2>Escolha de Recipientes</h2>
    <p>Em apartamentos, o cultivo em vasos é a opção mais viável. Utilize recipientes de diferentes profundidades dependendo do que deseja plantar:</p>
    <ul>
      <li>Ervas aromáticas: vasos de 15-20 cm de profundidade</li>
      <li>Folhosas: recipientes de 20-25 cm</li>
      <li>Tomates e pimentões: vasos mais profundos de 30-40 cm</li>
    </ul>
    
    <h2>Escolha das Plantas</h2>
    <p>Para iniciantes, recomendo começar com plantas mais resistentes e de fácil cultivo:</p>
    <ul>
      <li>Ervas: manjericão, cebolinha, salsa, hortelã</li>
      <li>Folhosas: alface, rúcula, espinafre</li>
      <li>Legumes: tomate-cereja, pimentão, pepino</li>
    </ul>
    
    <h2>Cuidados Essenciais</h2>
    <p>A rega regular é fundamental, principalmente em ambientes fechados. Evite encharcar o solo e certifique-se de que os recipientes tenham drenagem adequada. Em relação à adubação, prefira compostos orgânicos, que podem ser produzidos em casa através da compostagem doméstica.</p>
    
    <h2>Compostagem em Apartamento</h2>
    <p>A compostagem não exige muito espaço e pode ser feita em baldes pequenos ou composteiras específicas para apartamentos. Restos de frutas, legumes e borra de café são ótimos materiais para iniciar o processo.</p>
    
    <h2>Manutenção e Colheita</h2>
    <p>Dedique alguns minutos por dia para observar suas plantas, remover folhas secas e verificar a presença de pragas. Colha apenas o necessário para cada refeição, garantindo assim o máximo de frescor e nutrientes.</p>
    
    <h2>Conclusão</h2>
    <p>Iniciar uma horta orgânica urbana vai além da produção de alimentos - é uma prática terapêutica que reconecta as pessoas com a natureza e promove hábitos alimentares mais saudáveis e sustentáveis. Comece com poucos vasos, aprenda com suas experiências e gradualmente expanda sua produção.</p>
  `,
  "2": `
    <h2>A Importância da Reciclagem</h2>
    <p>A reciclagem é um processo fundamental para a saúde do nosso planeta. Ao separar corretamente os resíduos, contribuímos para a redução da extração de matérias-primas, economia de energia e diminuição da poluição ambiental.</p>
    
    <h2>Como Funciona o Ciclo da Reciclagem</h2>
    <p>O processo de reciclagem envolve várias etapas, desde a separação doméstica até o processamento industrial:</p>
    <ol>
      <li>Separação na fonte (nossa casa ou trabalho)</li>
      <li>Coleta seletiva</li>
      <li>Triagem em centrais de reciclagem</li>
      <li>Processamento dos materiais</li>
      <li>Transformação em novos produtos</li>
    </ol>
    
    <h2>Separação Correta dos Resíduos</h2>
    <p>Muitas pessoas ainda têm dúvidas sobre como separar corretamente os materiais recicláveis. Aqui está um guia básico:</p>
    
    <h3>Plásticos</h3>
    <p>Garrafas PET, embalagens de produtos de limpeza, sacos plásticos, etc. Lembre-se de enxaguar para remover resíduos.</p>
    
    <h3>Papéis</h3>
    <p>Jornais, revistas, caixas de papelão, folhas de caderno. Evite papéis engordurados ou muito sujos.</p>
    
    <h3>Vidros</h3>
    <p>Garrafas, potes, frascos. Remova as tampas e, se possível, enxágue.</p>
    
    <h3>Metais</h3>
    <p>Latas de alumínio, embalagens de aço, tampas metálicas.</p>
    
    <h2>O que NÃO é Reciclável</h2>
    <p>Alguns itens comumente enviados para reciclagem, mas que não deveriam ser:</p>
    <ul>
      <li>Papel higiênico e guardanapos usados</li>
      <li>Isopor (em algumas cidades)</li>
      <li>Espelhos e vidros de janela</li>
      <li>Cerâmicas e porcelanas</li>
      <li>Embalagens metalizadas (como de salgadinhos)</li>
    </ul>
    
    <h2>Impacto da Reciclagem na Redução da Poluição</h2>
    <p>Estudos mostram que a reciclagem adequada pode reduzir significativamente a poluição:</p>
    <ul>
      <li>A reciclagem de uma tonelada de papel salva aproximadamente 17 árvores</li>
      <li>Reciclar alumínio usa 95% menos energia do que produzi-lo a partir de matéria-prima</li>
      <li>Uma tonelada de plástico reciclado economiza cerca de 5.774 kWh de energia</li>
      <li>A reciclagem de vidro reduz a poluição do ar em 20% e a poluição da água em 50%</li>
    </ul>
    
    <h2>Iniciativas de Reciclagem em Presidente Prudente</h2>
    <p>Nossa cidade tem desenvolvido várias iniciativas para facilitar a reciclagem:</p>
    <ul>
      <li>Pontos de coleta seletiva espalhados pela cidade</li>
      <li>Cooperativas de catadores que geram renda a partir da reciclagem</li>
      <li>Programas educacionais nas escolas</li>
      <li>Parcerias com empresas para gestão de resíduos específicos</li>
    </ul>
    
    <h2>Conclusão</h2>
    <p>A reciclagem correta é um pequeno gesto individual que, quando somado a milhões de outros gestos similares, produz um impacto significativo na redução da poluição e na preservação dos recursos naturais. Comece hoje mesmo a revisar suas práticas de descarte e compartilhe esse conhecimento com familiares e amigos.</p>
  `,
  "3": `
    <h2>Reflorestamento: Uma Necessidade Urgente</h2>
    <p>O reflorestamento tem se tornado cada vez mais essencial para a recuperação de áreas degradadas e o combate às mudanças climáticas. Em Presidente Prudente, diversas iniciativas têm trabalhado para reverter o histórico de desmatamento da região.</p>
    
    <h2>O Cenário Atual em Presidente Prudente</h2>
    <p>Nossa região, originalmente coberta pela Mata Atlântica, sofreu intenso desmatamento ao longo das décadas devido à expansão agrícola e urbana. Hoje, restam apenas fragmentos da vegetação original, tornando urgentes as ações de reflorestamento.</p>
    
    <h2>Principais Projetos de Reflorestamento</h2>
    
    <h3>Projeto Nascentes Vivas</h3>
    <p>Iniciado em 2018, este projeto já recuperou mais de 15 nascentes na região, com o plantio de espécies nativas em áreas de preservação permanente. As ações envolvem:</p>
    <ul>
      <li>Identificação de nascentes degradadas</li>
      <li>Cercamento das áreas para evitar danos por gado</li>
      <li>Plantio de mudas nativas adaptadas a áreas úmidas</li>
      <li>Monitoramento do desenvolvimento das plantas</li>
    </ul>
    
    <h3>Corredor Ecológico do Rio Santo Anastácio</h3>
    <p>Este ambicioso projeto visa conectar fragmentos florestais isolados, criando um corredor ecológico ao longo do Rio Santo Anastácio. Até o momento, foram plantadas mais de 30.000 mudas numa extensão de 15 km.</p>
    
    <h3>Programa Urbano de Arborização</h3>
    <p>Focado no ambiente urbano, este programa já plantou cerca de 5.000 árvores nativas em praças, canteiros e calçadas da cidade, melhorando o conforto térmico urbano e a qualidade do ar.</p>
    
    <h2>Espécies Utilizadas nos Reflorestamentos</h2>
    <p>Os projetos de reflorestamento priorizam espécies nativas da região, incluindo:</p>
    <ul>
      <li>Ipê-amarelo e Ipê-roxo: árvores símbolo do Brasil, com floração exuberante</li>
      <li>Jatobá: espécie de crescimento lento e grande porte</li>
      <li>Cedro: madeira nobre em risco de extinção</li>
      <li>Aroeira: resistente e de rápida adaptação</li>
      <li>Jequitibá: uma das maiores árvores da Mata Atlântica</li>
    </ul>
    
    <h2>Benefícios do Reflorestamento</h2>
    <p>Os projetos já implementados têm gerado diversos benefícios para o ecossistema local:</p>
    <ul>
      <li>Aumento da biodiversidade, com retorno de espécies de aves e pequenos mamíferos</li>
      <li>Melhoria da qualidade e quantidade de água nas nascentes recuperadas</li>
      <li>Redução da erosão do solo e assoreamento dos rios</li>
      <li>Sequestro de carbono, contribuindo para a mitigação das mudanças climáticas</li>
      <li>Criação de áreas de lazer e educação ambiental para a população</li>
    </ul>
    
    <h2>Como Participar</h2>
    <p>Existem diversas formas de contribuir com os projetos de reflorestamento em nossa cidade:</p>
    <ul>
      <li>Voluntariado em dias de plantio comunitário</li>
      <li>Adoção de mudas através de programas específicos</li>
      <li>Doações para ONGs e projetos de reflorestamento</li>
      <li>Plantio de árvores nativas em sua propriedade</li>
      <li>Educação ambiental, compartilhando conhecimento sobre a importância das florestas</li>
    </ul>
    
    <h2>Desafios e Perspectivas Futuras</h2>
    <p>Apesar dos avanços, os projetos enfrentam desafios significativos, como a escassez de recursos financeiros, a pressão por novas áreas para expansão urbana e agrícola, e os impactos das mudanças climáticas. No entanto, a mobilização crescente da sociedade e o desenvolvimento de novas técnicas de reflorestamento trazem perspectivas positivas para os próximos anos.</p>
    
    <h2>Conclusão</h2>
    <p>Os projetos de reflorestamento em Presidente Prudente demonstram que é possível reverter parte dos danos causados ao meio ambiente através de ações coordenadas entre poder público, iniciativa privada e sociedade civil. Cada árvore plantada representa um passo em direção a um futuro mais sustentável para nossa região.</p>
  `,
  "4": `
    <h2>A Crise do Plástico</h2>
    <p>O plástico se tornou um dos maiores desafios ambientais da atualidade. Estima-se que 8 milhões de toneladas de plástico acabem nos oceanos anualmente, prejudicando a vida marinha e entrando na cadeia alimentar.</p>
    
    <h2>Por Que Reduzir o Uso de Plástico?</h2>
    <p>Além da poluição visível, o plástico:</p>
    <ul>
      <li>Leva centenas de anos para se decompor</li>
      <li>Se fragmenta em microplásticos que contaminam água, solo e alimentos</li>
      <li>Consome recursos não-renováveis em sua produção</li>
      <li>Libera substâncias tóxicas durante sua degradação</li>
    </ul>
    
    <h2>Alternativas Práticas para o Dia a Dia</h2>
    
    <h3>Na Cozinha</h3>
    <ul>
      <li><strong>Use potes de vidro ou inox</strong> para armazenar alimentos, em vez de recipientes plásticos</li>
      <li><strong>Substitua filmes plásticos</strong> por tampas de silicone reutilizáveis ou embalagens de cera de abelha</li>
      <li><strong>Compre a granel</strong> usando sacolas de tecido reutilizáveis para cereais, grãos e frutas</li>
      <li><strong>Prefira palhas de inox, bambu ou vidro</strong> em vez das descartáveis de plástico</li>
    </ul>
    
    <h3>Nas Compras</h3>
    <ul>
      <li><strong>Leve sempre sacolas reutilizáveis</strong> para evitar sacolas plásticas</li>
      <li><strong>Escolha produtos com menos embalagem</strong> ou com embalagens recicláveis/biodegradáveis</li>
      <li><strong>Compre frutas e verduras soltas</strong>, sem embalagens plásticas</li>
      <li><strong>Prefira lojas que permitem o uso de recipientes próprios</strong> para produtos como carnes, queijos e frios</li>
    </ul>
    
    <h3>Na Higiene Pessoal</h3>
    <ul>
      <li><strong>Use sabonetes em barra</strong> em vez de líquidos em frascos plásticos</li>
      <li><strong>Experimente shampoos e condicionadores sólidos</strong>, que duram mais e não geram embalagens</li>
      <li><strong>Substitua escovas de dente de plástico</strong> por opções de bambu biodegradável</li>
      <li><strong>Para mulheres, considere coletores menstruais ou absorventes de pano</strong> em vez de produtos descartáveis</li>
    </ul>
    
    <h3>No Escritório</h3>
    <ul>
      <li><strong>Use canetas recarregáveis</strong> em vez de descartáveis</li>
      <li><strong>Substitua post-its</strong> por aplicativos de notas ou quadros reutilizáveis</li>
      <li><strong>Evite copos descartáveis</strong> levando sua própria caneca ou garrafa</li>
    </ul>
    
    <h2>Projetos Criativos com Plástico Já Existente</h2>
    <p>Uma forma de lidar com o plástico que já temos é reutilizá-lo de maneira criativa:</p>
    <ul>
      <li><strong>Transforme garrafas PET</strong> em vasos para plantas, comedouros para pássaros ou organizadores</li>
      <li><strong>Use sacolas plásticas</strong> para criar tapetes, bolsas ou almofadas através da técnica de crochê</li>
      <li><strong>Reutilize potes de sorvete e margarina</strong> para armazenar pequenos objetos ou como vasos para mudas</li>
      <li><strong>Crie brinquedos educativos</strong> com embalagens plásticas limpas</li>
    </ul>
    
    <h2>Iniciativas Comunitárias</h2>
    <p>Em Presidente Prudente, diversas iniciativas estão ajudando a reduzir o uso de plástico:</p>
    <ul>
      <li>Feiras livres onde produtores aceitam que os clientes levem seus próprios recipientes</li>
      <li>Lojas a granel que incentivam o uso de embalagens reutilizáveis</li>
      <li>Grupos de trocas que promovem a reutilização de objetos</li>
      <li>Workshops sobre como viver com menos plástico</li>
    </ul>
    
    <h2>Resultados Possíveis</h2>
    <p>Estudos mostram que pequenas mudanças, quando adotadas por muitas pessoas, podem ter um impacto significativo:</p>
    <ul>
      <li>Uma pessoa que usa garrafa reutilizável evita o descarte de aproximadamente 156 garrafas plásticas por ano</li>
      <li>O uso de sacolas reutilizáveis pode eliminar o consumo de 300 a 500 sacolas plásticas por pessoa anualmente</li>
      <li>A substituição de canudos descartáveis pode evitar o descarte de mais de 500 canudos por pessoa ao ano</li>
    </ul>
    
    <h2>Conclusão</h2>
    <p>Reduzir o consumo de plástico não significa tornar a vida mais difícil, mas sim mais consciente e criativa. Cada pequena mudança conta e, ao compartilhar essas práticas, criamos um efeito multiplicador que pode transformar nossa relação com os recursos do planeta.</p>
  `,
  "5": `
    <h2>Arquitetura Sustentável: Mais que uma Tendência</h2>
    <p>A arquitetura sustentável deixou de ser apenas uma tendência para se tornar uma necessidade premente no contexto das mudanças climáticas e da crescente preocupação com a pegada ecológica de nossas construções.</p>
    
    <h2>Os Princípios da Arquitetura Sustentável</h2>
    <p>Antes de explorarmos as tendências para 2025, é importante entender os princípios que fundamentam a arquitetura sustentável:</p>
    <ul>
      <li>Eficiência energética e redução do consumo de recursos naturais</li>
      <li>Utilização de materiais eco-friendly e locais</li>
      <li>Redução da geração de resíduos e emissões de carbono</li>
      <li>Integração com o ambiente natural e respeito ao entorno</li>
      <li>Promoção de ambientes saudáveis para os ocupantes</li>
    </ul>
    
    <h2>Tendências para 2025</h2>
    
    <h3>1. Materiais Regenerativos e Circulares</h3>
    <p>O futuro da arquitetura sustentável está nos materiais que vão além de não prejudicar o meio ambiente – eles efetivamente o regeneram. Exemplos incluem:</p>
    <ul>
      <li>Concretos que absorvem CO² da atmosfera</li>
      <li>Tijolos cultivados a partir de bactérias e fungos</li>
      <li>Materiais feitos de resíduos agrícolas e plásticos reciclados</li>
      <li>Madeiras certificadas de manejo sustentável ou de demolição</li>
    </ul>
    <p>A economia circular também está se tornando central, com edifícios projetados para que seus componentes possam ser facilmente desmontados e reutilizados no futuro.</p>
    
    <h3>2. Edifícios Energeticamente Positivos</h3>
    <p>Ultrapassando o conceito de edifícios de energia zero, os projetos mais avançados de 2025 serão aqueles que produzem mais energia do que consomem, através de:</p>
    <ul>
      <li>Integração avançada de painéis solares na estrutura (telhados, fachadas, janelas)</li>
      <li>Sistemas de armazenamento de energia de alta performance</li>
      <li>Aproveitamento de outras fontes renováveis como energia eólica e geotérmica</li>
      <li>Compartilhamento de energia excedente com a comunidade ou devolução à rede</li>
    </ul>
    
    <h3>3. Biofilia Avançada e Arquitetura Regenerativa</h3>
    <p>A conexão com a natureza vai além da estética, tornando-se funcional e regenerativa:</p>
    <ul>
      <li>Fachadas e telhados verdes que filtram poluentes e reduzem ilhas de calor</li>
      <li>Sistemas integrados de agricultura urbana nos próprios edifícios</li>
      <li>Materiais e formas inspirados em processos naturais (biomimética)</li>
      <li>Edifícios que ativamente purificam o ar e a água ao seu redor</li>
    </ul>
    
    <h3>4. Tecnologia Smart e Internet das Coisas (IoT)</h3>
    <p>A tecnologia inteligente permitirá otimização contínua do desempenho dos edifícios:</p>
    <ul>
      <li>Sistemas preditivos que adaptam o consumo energético com base em padrões de uso e previsões climáticas</li>
      <li>Monitoramento em tempo real da qualidade do ar interno e ajustes automáticos</li>
      <li>Gestão inteligente de água, com captação de chuva e reutilização de águas cinzas</li>
      <li>Manutenção preventiva baseada em análise de dados para evitar desperdícios</li>
    </ul>
    
    <h3>5. Resiliência Climática</h3>
    <p>Com eventos climáticos extremos se tornando mais frequentes, os edifícios de 2025 serão projetados para resistir e adaptar-se a:</p>
    <ul>
      <li>Inundações, com estruturas elevadas e sistemas de drenagem sustentável</li>
      <li>Ondas de calor, com isolamento térmico avançado e sistemas passivos de refrigeração</li>
      <li>Escassez de água, com sistemas abrangentes de captação, purificação e reutilização</li>
      <li>Cortes de energia, com microgrids e sistemas de energia de emergência renovável</li>
    </ul>
    
    <h2>Exemplos Inspiradores em Desenvolvimento</h2>
    <p>Vários projetos emergentes já apontam o caminho para estas tendências:</p>
    <ul>
      <li>The Line (NEOM, Arábia Saudita): cidade linear sem carros, movida 100% a energia renovável</li>
      <li>Thammasat University Rooftop Farm (Bangkok, Tailândia): maior fazenda urbana sobre telhado do mundo</li>
      <li>Valle Wood (Oslo, Noruega): maior edifício comercial de madeira da Noruega, com pegada de carbono negativa</li>
      <li>Powerhouse Brattørkaia (Trondheim, Noruega): edifício de escritórios que produz mais energia do que consome ao longo de seu ciclo de vida</li>
    </ul>
    
    <h2>Iniciativas no Brasil</h2>
    <p>No contexto brasileiro, várias iniciativas estão abrindo caminho para a arquitetura sustentável:</p>
    <ul>
      <li>Crescente adoção de certificações como LEED, AQUA e Selo Casa Azul</li>
      <li>Desenvolvimento de materiais sustentáveis adaptados ao clima tropical</li>
      <li>Projetos de habitação social com soluções bioclimáticas</li>
      <li>Incentivos governamentais para construções sustentáveis em algumas cidades</li>
    </ul>
    
    <h2>Desafios a Superar</h2>
    <p>Apesar do progresso, existem desafios significativos:</p>
    <ul>
      <li>Custo inicial mais elevado de algumas soluções sustentáveis</li>
      <li>Falta de conhecimento técnico entre profissionais do setor</li>
      <li>Ausência de regulamentação específica em muitas localidades</li>
      <li>Resistência à mudança em setores tradicionais da construção</li>
    </ul>
    
    <h2>Conclusão</h2>
    <p>O ano de 2025 representa um ponto de inflexão para a arquitetura sustentável, com tecnologias emergentes atingindo maturidade e urgência climática impulsionando mudanças regulatórias. Os projetos mais bem-sucedidos serão aqueles que integram múltiplas estratégias sustentáveis de forma holística, considerando todo o ciclo de vida dos edifícios e seu impacto nas pessoas e no planeta.</p>
  `,
};

// Lista de artigos relacionados (simulada)
const artigosRelacionados = [
  {
    id: "6",
    titulo: "Compostagem Doméstica: Transforme seu Lixo em Adubo",
    resumo: "Aprenda técnicas simples para compostar resíduos orgânicos em casa.",
    imagem: "https://images.unsplash.com/photo-1526570207772-784d36084510",
    categoria: "Resíduos",
    tempoDeLeitura: "5 min"
  },
  {
    id: "7",
    titulo: "Energia Solar Residencial: Vale a Pena?",
    resumo: "Análise de custos e benefícios da instalação de painéis solares em residências.",
    imagem: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    categoria: "Energia",
    tempoDeLeitura: "7 min"
  },
  {
    id: "8",
    titulo: "Consumo Consciente: Guia para Compras Sustentáveis",
    resumo: "Dicas para fazer escolhas mais ecológicas em suas compras diárias.",
    imagem: "https://images.unsplash.com/photo-1563452965110-8e07f39699fc",
    categoria: "Consumo",
    tempoDeLeitura: "6 min"
  }
];

const artigos: ArtigoProps[] = [
  {
    id: "1",
    titulo: "Como iniciar sua própria horta orgânica urbana",
    resumo: "Dicas práticas para começar a cultivar alimentos orgânicos em espaços pequenos, mesmo em apartamentos.",
    autor: "Ana Silva",
    data: "12 de Março, 2025",
    imagem: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    categoria: "Jardinagem Urbana",
    tempoDeLeitura: "8 min",
    conteudo: conteudoArtigos["1"]
  },
  {
    id: "2",
    titulo: "O impacto da reciclagem correta na redução da poluição",
    resumo: "Entenda como separar corretamente seus resíduos pode fazer uma grande diferença para o meio ambiente.",
    autor: "Carlos Mendes",
    data: "05 de Março, 2025",
    imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    categoria: "Reciclagem",
    tempoDeLeitura: "6 min",
    conteudo: conteudoArtigos["2"]
  },
  {
    id: "3",
    titulo: "Projetos de reflorestamento em Presidente Prudente",
    resumo: "Conheça as iniciativas locais que estão ajudando a restaurar áreas degradadas e promover a biodiversidade.",
    autor: "Marina Costa",
    data: "28 de Fevereiro, 2025",
    imagem: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    categoria: "Reflorestamento",
    tempoDeLeitura: "10 min",
    conteudo: conteudoArtigos["3"]
  },
  {
    id: "4",
    titulo: "Maneiras criativas de reduzir o consumo de plástico",
    resumo: "Alternativas simples e acessíveis para diminuir seu uso de plásticos descartáveis no dia a dia.",
    autor: "Pedro Alves",
    data: "15 de Fevereiro, 2025",
    imagem: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3",
    categoria: "Consumo Consciente",
    tempoDeLeitura: "7 min",
    conteudo: conteudoArtigos["4"]
  },
  {
    id: "5",
    titulo: "Arquitetura sustentável: tendências para 2025",
    resumo: "Como os novos projetos arquitetônicos estão incorporando princípios de sustentabilidade e eficiência energética.",
    autor: "Juliana Rocha",
    data: "02 de Fevereiro, 2025",
    imagem: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
    categoria: "Arquitetura Verde",
    tempoDeLeitura: "9 min",
    conteudo: conteudoArtigos["5"]
  }
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [artigo, setArtigo] = useState<ArtigoProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Simula uma chamada de API
    const loadPost = async () => {
      setIsLoading(true);
      
      // Simular um pequeno delay para dar realismo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const found = artigos.find(a => a.id === id);
      setArtigo(found || null);
      setIsLoading(false);
      
      // Rolar para o topo quando mudar de artigo
      window.scrollTo(0, 0);
    };
    
    loadPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4">Carregando artigo...</p>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="container px-4 py-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o Blog</span>
          </Link>
          
          <Alert variant="destructive" className="mt-8">
            <AlertTitle>Artigo não encontrado</AlertTitle>
            <AlertDescription>
              O artigo que você está procurando não existe ou foi removido.
            </AlertDescription>
          </Alert>
          
          <Button variant="default" className="mt-6 bg-eco-green hover:bg-eco-green-dark" asChild>
            <Link to="/blog">Voltar para o Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para o Blog</span>
        </Link>
        
        {/* Hero do artigo */}
        <div className="relative h-64 md:h-[400px] rounded-xl overflow-hidden mb-8">
          <img 
            src={artigo.imagem} 
            alt={artigo.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="inline-block bg-eco-green text-white text-sm font-medium px-3 py-1 rounded mb-4">
              {artigo.categoria}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{artigo.titulo}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{artigo.data}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{artigo.autor}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                {artigo.tempoDeLeitura} {t('min-read')}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Coluna de compartilhamento (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <h3 className="font-medium mb-4">Compartilhar</h3>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    <span>Copiar link</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start bg-[#3b5998]/10 hover:bg-[#3b5998]/20 text-[#3b5998] dark:text-blue-400">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                    <span>Facebook</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 text-[#1da1f2] dark:text-blue-400">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    <span>Twitter</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start bg-green-600/10 hover:bg-green-600/20 text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M21.547 7.601A3.118 3.118 0 0 0 18.967 5.5c-2.205-.334-10.973-.334-10.973-.334s-8.769 0-10.974.334a3.118 3.118 0 0 0-2.58 2.101A29.304 29.304 0 0 0 3.946 12a29.306 29.306 0 0 0 .494 4.399 3.118 3.118 0 0 0 2.58 2.101c2.205.334 10.974.334 10.974.334s8.768 0 10.973-.334a3.118 3.118 0 0 0 2.58-2.101c.336-1.387.5-2.9.494-4.399a29.306 29.306 0 0 0-.494-4.4ZM9.725 15.217V8.783l7.324 3.217-7.324 3.217Z" clipRule="evenodd" />
                    </svg>
                    <span>WhatsApp</span>
                  </Button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="font-medium mb-4">Ações</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Bookmark className="h-4 w-4 mr-2" />
                    <span>Salvar artigo</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Deixar comentário</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conteúdo do artigo */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
              <div className="prose dark:prose-invert prose-headings:text-eco-green-dark dark:prose-headings:text-eco-green-light prose-a:text-eco-green hover:prose-a:text-eco-green-dark max-w-none mb-8">
                <p className="text-xl text-muted-foreground mb-6 font-medium">
                  {artigo.resumo}
                </p>
                
                <div dangerouslySetInnerHTML={{ __html: artigo.conteudo || '' }}></div>
              </div>
              
              {/* Autor e tags (mobile) */}
              <div className="flex flex-wrap lg:hidden gap-2 mt-6">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>Compartilhar</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-1" />
                  <span>Salvar</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>Comentar</span>
                </Button>
              </div>
            </div>
            
            {/* Artigos relacionados */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-eco-green-dark dark:text-eco-green-light mb-4">Artigos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {artigosRelacionados.slice(0, 2).map((artigo) => (
                  <div key={artigo.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={artigo.imagem} 
                        alt={artigo.titulo} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-eco-green text-white text-xs font-medium px-2 py-1 rounded">
                        {artigo.categoria}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-eco-green-dark dark:text-eco-green-light">
                        {artigo.titulo}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {artigo.resumo}
                      </p>
                      
                      <button
                        onClick={() => alert('Artigo relacionado - funcionalidade a ser implementada')}
                        className="inline-flex items-center gap-1 text-sm text-eco-green font-medium hover:text-eco-green-dark transition-colors"
                      >
                        <span>{t('read-more')}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
