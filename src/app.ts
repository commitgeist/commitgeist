import * as fs from "fs/promises"; // Usando fs/promises para suporte a async/await
import markdownIt from "markdown-it";
import { fetchGitHubData } from "./fetchGithubData";
import { fetchRssData } from "./fetchRssData";

// Configuração inicial do markdown-it
const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

// URLs e informações de usuário
const twitterUsername = '@engineer_yaml'
const twitterUrl = `https://twitter.com/${twitterUsername}`;
const linkedinUrl = "https://www.linkedin.com/in/vinicius-p-538340ba/";
const githubUsername = "commitgeist"; // ajustado: era "KubeNerd", agora aponta pro perfil real
const githubSponsorsUrl = `https://github.com/sponsors/${githubUsername}`;

/// Atualize os URLs conforme necessário
const hackerNewssRSS = "https://www.tabnews.com.br/recentes/rss";

// Repositórios relevantes para suas áreas de foco
const myBestRepos = ["aluratube", "nlw-ia", "nlw-journey-ia"];

async function generateMarkdown() {
  // Gerando a seção de estatísticas do GitHub opcionalmente
  const githubStatsCard = `[![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true)](https://github.com/${githubUsername})`;
  const jokesCard = `![Jokes Card](https://readme-jokes.vercel.app/api)`;
  const twitterBadge = `[![Twitter Badge](https://img.shields.io/badge/-${twitterUsername}-3B7EBF?style=for-the-badge&logo=x&logoColor=white)](${twitterUrl})`;
  const linkedinBadge = `[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-3B7EBF?style=for-the-badge&logo=Linkedin&logoColor=white)](${linkedinUrl})`;
  const githubSponsorsBadge = `[![GitHub Sponsors Badge](https://img.shields.io/badge/-github%20sponsors-3B7EBF?style=for-the-badge&logo=github&logoColor=white)](${githubSponsorsUrl})`;
  const githubStatsCardDark = `[![GitHub-Stats-Card-Dark](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&hide_border=true&include_all_commits=true&card_width=600&custom_title=GitHub%20Open%20Source%20Stats&title_color=3B7EBF&text_color=FFF&icon_color=3B7EBF&hide=contribs&show=reviews,prs_merged,prs_merged_percentage&theme=transparent#gh-dark-mode-only)](https://github.com/${githubUsername}/${githubUsername}#gh-dark-mode-only)`;
  const profileCountBadge = `![Profile Views Count Badge](https://komarev.com/ghpvc/?username=${githubUsername}&style=for-the-badge)`;

  // Estrutura básica do README.md
  const markdownText = `<div align="center">\n
  ---\n
  Olá 👋🏾! Sou um profissional de tecnologia focado em análise de sistemas, sustentação de sistemas, DevOps, e CI/CD. Tenho experiência em criar e manter infraestruturas automatizadas, implementar pipelines de integração e entrega contínua, e garantir a alta disponibilidade e performance dos sistemas.\n
  <img src="https://media.giphy.com/media/yAGIvCiwPJn5C/giphy.gif">

  ${linkedinBadge} ${twitterBadge} ${githubSponsorsBadge}\n

  ${profileCountBadge}\n

  ---\n

  ${githubStatsCard}\n

  ${githubStatsCardDark}\n

  ${jokesCard}\n

  ---\n

  <details>\n
  <summary>Meus repositórios preferidos</summary>\n
  <br />
  Alguns dos meus melhores repositórios:\n
  <br />\n<br />
  ${await fetchGitHubData(myBestRepos)}\n
  </details>\n
  <hr/>
  <details>\n
  <summary>Recent Newsletters</summary>\n
  <br />
    ${await fetchRssData(hackerNewssRSS)}\n
  </details>\n
\n`;

  // Processando e salvando o markdown
  const result = md.render(markdownText);
  try {
    await fs.writeFile("README.md", result);
    console.log("✅ README.md file was successfully generated.");
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
}

generateMarkdown();
