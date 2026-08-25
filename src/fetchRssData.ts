import Parser from "rss-parser";

const parser = new Parser();

export async function fetchRssData(url: string): Promise<string> {
  try {
    const feed = await parser.parseURL(url);

    const list = feed.items.slice(0, 5).map((item) => {
      const title = item.title ?? "Sem título";
      const link = item.link ?? url;

      let publishedDate = "data desconhecida";
      if (item.pubDate) {
        const date = new Date(item.pubDate);
        if (!Number.isNaN(date.getTime())) {
          publishedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }
      }

      return `<li><a href=${link} target="_blank" rel="noopener noreferrer">${title}</a> (${publishedDate}).</li>`;
    });

    const sourceUrl = url.endsWith("rss.xml")
      ? url.replace(/\/rss\.xml$/, "")
      : url.replace(/\/feed$/, "").replace(/\/rss$/, "");

    return `
  <ul>
    ${list.join("")}
  </ul>\n
  Read more: <a href=${sourceUrl} target="_blank" rel="noopener noreferrer">${sourceUrl}</a>.
  `;
  } catch (error) {
    console.warn(`⚠️  Falha ao buscar RSS de "${url}": ${error}. Pulando esta seção.`);
    return `<ul><li>Não foi possível carregar as novidades no momento.</li></ul>`;
  }
}
