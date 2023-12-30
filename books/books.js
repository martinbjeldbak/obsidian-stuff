module.exports = {
  entry: entry,
  settings: {
    name: "Book Lookup using Google Books",
    author: "Martin Bjeldbak Madsen",
  }
}

const notice = msg => new Notice(msg, 5000);
const API_URL = "https://www.googleapis.com/books/v1/volumes";

async function entry(params) {
  const {
    quickAddApi: { inputPrompt, suggester },
  } = params;

  const query = await inputPrompt("📖 Book Name")

  if (!query) {
    notice("No query entered.");
    throw new Error("No query entered.");
  }

  const suggestions = await getSuggestions(query);

  const choice = await suggester(suggestions.map(formatTitleForSuggestion), suggestions)

  if (!choice) {
    notice("No book selected.");
    throw new Error("No book selected.");
  }

  params.variables = {
    ...choice.volumeInfo,
    poster: choice.volumeInfo.imageLinks.thumbnail,
    fileName: replaceIllegalFileNameCharactersInString(choice.volumeInfo.title) || "fallback",
    id: choice.id,
    authorLinks: linkifyList(choice.volumeInfo.authors),
    categoryLinks: linkifyList(choice.volumeInfo.categories),
    year: window.moment(choice.volumeInfo.publishedDate).format('YYYY'),
    averageRating: choice.volumeInfo.averageRating || "no ratings found",
    publisher: choice.volumeInfo.publisher || choice.volumeInfo.authors[0], // assume self published
    pageCount: choice.volumeInfo.pageCount.toString()
  }
}

async function getSuggestions(query) {
  let volumes = await queryApi({ 'q': `${query}`, 'maxResults': 10 })

  return volumes.items;
}

function replaceIllegalFileNameCharactersInString(string) {
  return string.replace(/[\\,#%&\{\}\/*<>$\'\":@]*/g, '');
}

function linkifyList(list) {
  if (list == undefined) return "[]";
  if (list.length === 0) return "[]";
  if (list.length === 1) return `\n  - "[[${list[0].replace(/\//, '-')}]]"`;

  return list.map(item => `\n  - "[[${item.replace(/\//, '-').trim()}]]"`).join("");
}

function formatTitleForSuggestion(result) {
  const volumeInfo = result.volumeInfo;

  const date = window.moment(volumeInfo.publishedDate);

  const subtitle = volumeInfo.Subtitle ? `: ${volumeInfo.Subtitle}` : ""

  const rating = volumeInfo.averageRating ? ` ${volumeInfo.averageRating}⭐from ${volumeInfo.ratingsCount} reviewers` : ""

  return `${volumeInfo.title}${subtitle} (${volumeInfo.language})${rating} by ${volumeInfo.authors[0]} (${date.format('YYYY')})`
}

async function queryApi(queryParams) {
  let endpoint = new URL(API_URL);

  for (const [field, value] of Object.entries(queryParams)) {
    endpoint.searchParams.append(field, value);
  }

  const response = await request({
    url: endpoint.href,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return JSON.parse(response);
}


