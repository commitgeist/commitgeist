export async function fetchGitHubData(repos: Array<string>): Promise<string> {
  const owner = "commitgeist";

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  // Usa o token do Actions se disponível, pra evitar rate limit (60 req/h sem auth vs 5000 req/h com auth)
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const list = await Promise.all(
    repos.map(async (repo) => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!response.ok) {
          console.warn(`⚠️  "${owner}/${repo}" não encontrado (status ${response.status}). Pulando este repositório.`);
          return null;
        }
        const data = await response.json();

        const {
          html_url: url,
          full_name: name,
          stargazers_count: stars,
          forks_count: forks,
          description: desc,
        } = data;

        return `<li><a href=${url} target="_blank" rel="noopener noreferrer">${name}</a> (<b>${stars}</b> ✨ and <b>${forks}</b> 🍴): ${desc ?? "Sem descrição."}</li>`;
      } catch (error) {
        console.warn(`⚠️  Falha ao buscar "${owner}/${repo}": ${error}. Pulando este repositório.`);
        return null;
      }
    })
  );

  const items = list.filter((item): item is string => item !== null);

  return `<ul>${items.join("")}</ul>`;
}
